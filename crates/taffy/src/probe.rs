//! Opt-in probe attribution for child layout requests.
//!
//! `compute_cached_layout` is the single choke point every flex, grid,
//! block, and leaf pass funnels through before touching the tree's layout
//! cache. Recording the caller's source location here attributes cache
//! hits and misses to the algorithmic pass that issued the probe, with no
//! changes at any call site.
//!
//! Gated by the same switches as mason-core's MASON_TIMING: the
//! `MASON_TIMING` env var or the `debug.mason.timing` system property on
//! Android. When both are unset the probe is one atomic load per layout
//! call and records nothing.
//!
//! Upstream taffy denies `unsafe_code` crate-wide; this vendored fork's
//! instrumentation needs one libc property call on Android, so the module
//! relaxes the deny locally.
#![allow(unsafe_code)]

use std::cell::RefCell;
use std::collections::HashMap;
use std::sync::OnceLock;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
struct Site {
    file: &'static str,
    line: u32,
}

/// Per-site tallies: calls, hits, misses, then misses split by requested
/// axis (horizontal, vertical, both).
type Tallies = [u32; 6];

thread_local! {
    static SITES: RefCell<HashMap<Site, Tallies>> = RefCell::new(HashMap::new());
}

static PROBE_ENABLED: OnceLock<bool> = OnceLock::new();

#[cfg(target_os = "android")]
fn android_debug_prop(name: &str) -> Option<String> {
    extern "C" {
        fn __system_property_get(
            name: *const std::os::raw::c_char,
            value: *mut std::os::raw::c_char,
        ) -> i32;
    }
    let c_name = std::ffi::CString::new(name).ok()?;
    let mut buf = vec![0u8; 92]; // PROP_VALUE_MAX
    let len = unsafe {
        __system_property_get(c_name.as_ptr(), buf.as_mut_ptr() as *mut std::os::raw::c_char)
    };
    if len <= 0 {
        None
    } else {
        Some(String::from_utf8_lossy(&buf[..len as usize]).into_owned())
    }
}

#[cfg(not(target_os = "android"))]
fn android_debug_prop(_name: &str) -> Option<String> {
    None
}

#[inline(always)]
fn probe_enabled() -> bool {
    *PROBE_ENABLED.get_or_init(|| {
        std::env::var("MASON_TIMING").as_deref() == Ok("1")
            || android_debug_prop("debug.mason.timing").as_deref() == Some("1")
    })
}

/// Record one probe attempt. `axis` is 0 = horizontal, 1 = vertical,
/// 2 = both; ignored for hits.
#[inline(always)]
pub fn record(site: &'static std::panic::Location, hit: bool, axis: u8) {
    if !probe_enabled() {
        return;
    }
    let key = Site {
        file: site.file(),
        line: site.line(),
    };
    SITES.with(|sites| {
        let mut sites = sites.borrow_mut();
        let tallies = sites.entry(key).or_default();
        tallies[0] += 1;
        if hit {
            tallies[1] += 1;
        } else {
            tallies[2] += 1;
            tallies[3 + axis.min(2) as usize] += 1;
        }
    });
}

/// Drain the accumulated per-site tallies. Called by the embedder at its
/// own reporting boundary; returns lines in `file:line` sorted order.
pub fn take_sites() -> Vec<String> {
    SITES.with(|sites| {
        let mut rows: Vec<(Site, Tallies)> = sites.borrow_mut().drain().collect();
        rows.sort_by_key(|(site, _)| (site.file, site.line));
        rows.iter()
            .map(|(site, t)| {
                format!(
                    "{}:{} calls={} hit={} miss={} miss_h={} miss_v={} miss_both={}",
                    site.file, site.line, t[0], t[1], t[2], t[3], t[4], t[5]
                )
            })
            .collect()
    })
}
