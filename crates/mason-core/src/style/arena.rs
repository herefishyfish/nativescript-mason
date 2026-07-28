use crate::style::utils::{set_style_data_i32, set_style_data_u32};
use crate::style::{DisplayMode, StyleKeys};
use crate::utils::{display_mode_to_enum, display_to_enum};
use crate::Style;
use crate::PREFLIGHT_ENABLED;
#[cfg(target_vendor = "apple")]
use objc2_foundation::NSMutableData;
use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};
use std::sync::atomic::Ordering;
use taffy::Display;

// always keep aligned 4
pub const STYLE_BUFFER_SIZE: usize = 596;

#[repr(u32)]
#[derive(Copy, Clone, Debug, PartialEq)]
pub enum Handle {
    Default = 0,
    Inline,
    Img,
    Flex,
    Grid,
    List,
    ListItem,
    Button,
}

#[derive(Copy, Clone, Debug, PartialEq, Eq, Hash)]
pub struct StyleHandle(u32);
impl StyleHandle {
    pub const fn new(handle: Handle) -> Self {
        Self(handle as u32)
    }

    pub const fn from_raw(id: u32) -> Self {
        Self(id)
    }
}

impl StyleHandle {
    pub const DEFAULT: Self = StyleHandle::new(Handle::Default);
    pub const DEFAULT_INLINE: Self = StyleHandle::new(Handle::Inline);
    pub const DEFAULT_IMG: Self = StyleHandle::new(Handle::Img);
    pub const DEFAULT_FLEX: Self = StyleHandle::new(Handle::Flex);
    pub const DEFAULT_GRID: Self = StyleHandle::new(Handle::Grid);
    pub const DEFAULT_LIST: Self = StyleHandle::new(Handle::List);
    pub const DEFAULT_LIST_ITEM: Self = StyleHandle::new(Handle::ListItem);
    pub const DEFAULT_BUTTON: Self = StyleHandle::new(Handle::Button);

    #[inline]
    pub fn index(self) -> usize {
        self.0 as usize
    }
}

#[derive(Debug)]
struct StyleBuffer {
    #[cfg(target_vendor = "apple")]
    buffer: objc2::rc::Retained<NSMutableData>,
    #[cfg(target_os = "android")]
    buffer: jni::sys::jint,
    #[cfg(not(target_vendor = "apple"))]
    data: Box<[u8; STYLE_BUFFER_SIZE]>,
    /// True once this slot has been handed to platform code, on any platform:
    /// the `NSMutableData` object or a raw pointer into it on Apple, a cached
    /// direct ByteBuffer on Android, a raw pointer on Windows. Exposed slots
    /// are retired, never recycled, so stale platform writes can't corrupt a
    /// new node's style. Set only via [`StyleArena::mark_exposed`].
    exposed: bool,
    pub(crate) ref_count: u32,
}

impl StyleBuffer {
    #[cfg(target_vendor = "apple")]
    pub fn new(data: &[u8; STYLE_BUFFER_SIZE]) -> Self {
        let buffer = NSMutableData::from_vec(data.to_vec());
        StyleBuffer {
            ref_count: 0,
            buffer,
            exposed: false,
        }
    }

    #[cfg(target_vendor = "apple")]
    pub fn bytes(&self) -> &[u8] {
        unsafe { self.buffer.as_bytes_unchecked() }
    }

    #[cfg(not(target_vendor = "apple"))]
    pub fn bytes(&self) -> &[u8] {
        self.data.as_slice()
    }

    #[cfg(target_vendor = "apple")]
    pub fn mut_bytes(&mut self) -> &mut [u8] {
        unsafe { self.buffer.as_mut_bytes_unchecked() }
    }

    #[cfg(not(target_vendor = "apple"))]
    pub fn mut_bytes(&mut self) -> &mut [u8] {
        self.data.as_mut_slice()
    }

    #[cfg(target_os = "android")]
    pub fn new(data: &[u8; STYLE_BUFFER_SIZE]) -> Self {
        let data = Box::new(*data);
        StyleBuffer {
            data,
            ref_count: 0,
            buffer: -1,
            exposed: false,
        }
    }

    #[cfg(not(any(target_vendor = "apple", target_os = "android")))]
    pub fn new(data: &[u8; STYLE_BUFFER_SIZE]) -> Self {
        let data = Box::new(*data);
        StyleBuffer {
            data,
            ref_count: 0,
            exposed: false,
        }
    }

    #[cfg(target_vendor = "apple")]
    #[track_caller]
    pub fn buffer(&self) -> objc2::rc::Retained<NSMutableData> {
        self.buffer.clone()
    }

    #[cfg(target_os = "android")]
    #[track_caller]
    pub fn buffer(&self) -> jni::sys::jint {
        self.buffer
    }
}

/// Number of built-in default handles (Default, Inline, Img, Flex, Grid, List, ListItem, Button).
const NUM_DEFAULTS: usize = 8;

#[derive(Debug)]
pub struct StyleArena {
    buffers: Vec<StyleBuffer>,
    free_list: Vec<u32>,
    /// Hash index from buffer content hash → buffer indices for O(1) intern lookup
    hash_index: std::collections::HashMap<u64, Vec<u32>>,
    /// Pristine copies of each default buffer, used to restore them after COW
    /// when JS writes may have corrupted the shared buffer before prepare_mut.
    default_snapshots: [[u8; STYLE_BUFFER_SIZE]; NUM_DEFAULTS],
}

impl Default for StyleArena {
    fn default() -> Self {
        Self::new(&[0u8; STYLE_BUFFER_SIZE])
    }
}

impl StyleArena {
    pub fn new(default_data: &[u8; STYLE_BUFFER_SIZE]) -> Self {
        let mut default_buffer = StyleBuffer::new(default_data);
        {
            let data = default_buffer.mut_bytes();
            Style::init_default_data(data);
            set_style_data_i32(data, StyleKeys::REF_COUNT, 1);
        }
        default_buffer.ref_count = 1;

        let mut inline = StyleBuffer::new(default_data);
        {
            let data = inline.mut_bytes();
            Style::init_default_data(data);
            crate::style::utils::set_style_data_i8(data, StyleKeys::DISPLAY_MODE, 1);
            set_style_data_i32(data, StyleKeys::REF_COUNT, 1);
        }
        inline.ref_count = 1;

        let mut img = StyleBuffer::new(default_data);
        {
            let data = img.mut_bytes();
            Style::init_default_data(data);
            crate::style::utils::set_style_data_i8(data, StyleKeys::ITEM_IS_REPLACED, 1);
            crate::style::utils::set_style_data_i8(
                data,
                StyleKeys::DISPLAY_MODE,
                display_mode_to_enum(DisplayMode::Inline),
            );
            set_style_data_i32(data, StyleKeys::REF_COUNT, 1);
        }
        img.ref_count = 1;

        let mut flex = StyleBuffer::new(default_data);
        {
            let data = flex.mut_bytes();
            Style::init_default_data(data);
            crate::style::utils::set_style_data_i8(
                data,
                StyleKeys::DISPLAY,
                display_to_enum(Display::Flex),
            );
            set_style_data_i32(data, StyleKeys::REF_COUNT, 1);
        }
        flex.ref_count = 1;

        let mut grid = StyleBuffer::new(default_data);
        {
            let data = grid.mut_bytes();
            Style::init_default_data(data);
            crate::style::utils::set_style_data_i8(
                data,
                StyleKeys::DISPLAY,
                display_to_enum(Display::Grid),
            );
            set_style_data_i32(data, StyleKeys::REF_COUNT, 1);
        }
        grid.ref_count = 1;

        let mut list = StyleBuffer::new(default_data);
        {
            let data = list.mut_bytes();
            Style::init_default_data(data);
            crate::style::utils::set_style_data_i8(data, StyleKeys::ITEM_IS_LIST, 1);
            set_style_data_i32(data, StyleKeys::REF_COUNT, 1);
        }
        list.ref_count = 1;

        let mut list_item = StyleBuffer::new(default_data);
        {
            let data = list_item.mut_bytes();
            Style::init_default_data(data);
            crate::style::utils::set_style_data_i8(
                data,
                StyleKeys::DISPLAY_MODE,
                display_mode_to_enum(DisplayMode::ListItem),
            );
            crate::style::utils::set_style_data_i8(data, StyleKeys::ITEM_IS_LIST_ITEM, 1);
            set_style_data_i32(data, StyleKeys::REF_COUNT, 1);
        }
        list_item.ref_count = 1;

        let mut button = StyleBuffer::new(default_data);
        {
            let data = button.mut_bytes();
            Style::init_default_data(data);
            // CSS spec: button { display: inline-block; text-align: center; box-sizing: border-box }
            crate::style::utils::set_style_data_i8(data, StyleKeys::TEXT_ALIGN, 3);
            crate::style::utils::set_style_data_i8(data, StyleKeys::TEXT_ALIGN_STATE, 1);
            crate::style::utils::set_style_data_i8(
                data,
                StyleKeys::DISPLAY_MODE,
                display_mode_to_enum(DisplayMode::Box),
            );
            set_style_data_i32(data, StyleKeys::REF_COUNT, 1);
        }
        button.ref_count = 1;

        // Capture pristine snapshots of each default buffer before any JS writes
        let mut default_snapshots = [[0u8; STYLE_BUFFER_SIZE]; NUM_DEFAULTS];
        default_snapshots[Handle::Default as usize].copy_from_slice(default_buffer.bytes());
        default_snapshots[Handle::Inline as usize].copy_from_slice(inline.bytes());
        default_snapshots[Handle::Img as usize].copy_from_slice(img.bytes());
        default_snapshots[Handle::Flex as usize].copy_from_slice(flex.bytes());
        default_snapshots[Handle::Grid as usize].copy_from_slice(grid.bytes());
        default_snapshots[Handle::List as usize].copy_from_slice(list.bytes());
        default_snapshots[Handle::ListItem as usize].copy_from_slice(list_item.bytes());
        default_snapshots[Handle::Button as usize].copy_from_slice(button.bytes());

        let mut arena = Self {
            buffers: vec![default_buffer, inline, img, flex, grid, list, list_item, button],
            free_list: Vec::new(),
            hash_index: std::collections::HashMap::new(),
            default_snapshots,
        };

        if PREFLIGHT_ENABLED.load(Ordering::Relaxed) {
            arena.reset_defaults(true);
        }

        arena
    }
    #[inline]
    fn is_default_index(idx: usize) -> bool {
        idx < NUM_DEFAULTS
    }

    /// Restore a default buffer to its pristine state.
    /// Called after COW to undo any JS writes that leaked into the shared buffer.
    fn restore_default(&mut self, idx: usize) {
        let snapshot = &self.default_snapshots[idx];
        let buf = &mut self.buffers[idx];
        let ref_count = buf.ref_count;
        buf.mut_bytes().copy_from_slice(snapshot);
        // Re-stamp the current (decremented) ref_count
        set_style_data_u32(buf.mut_bytes(), StyleKeys::REF_COUNT, ref_count);
    }

    /// Get a handle to the default style (shared by all unstyled nodes)
    pub fn get_default(&mut self) -> StyleHandle {
        let buffer = &mut self.buffers[Handle::Default as usize];
        buffer.ref_count += 1;
        let ref_count = buffer.ref_count;
        set_style_data_u32(buffer.mut_bytes(), StyleKeys::REF_COUNT, ref_count);
        StyleHandle::DEFAULT
    }

    pub fn get_handle(&mut self, handle: Handle) -> StyleHandle {
        let buffer = &mut self.buffers[handle as usize];
        buffer.ref_count += 1;
        let ref_count = buffer.ref_count;
        set_style_data_u32(buffer.mut_bytes(), StyleKeys::REF_COUNT, ref_count);
        match handle {
            Handle::Default => StyleHandle::DEFAULT,
            Handle::Inline => StyleHandle::DEFAULT_INLINE,
            Handle::Img => StyleHandle::DEFAULT_IMG,
            Handle::Flex => StyleHandle::DEFAULT_FLEX,
            Handle::Grid => StyleHandle::DEFAULT_GRID,
            Handle::List => StyleHandle::DEFAULT_LIST,
            Handle::ListItem => StyleHandle::DEFAULT_LIST_ITEM,
            Handle::Button => StyleHandle::DEFAULT_BUTTON,
        }
    }

    /// Get the reference count for a handle
    pub fn ref_count(&self, handle: StyleHandle) -> u32 {
        self.buffers[handle.index()].ref_count
    }

    /// Increment reference count (for when a node copies another's handle)
    pub fn retain(&mut self, handle: StyleHandle) {
        let buffer = &mut self.buffers[handle.index()];
        buffer.ref_count += 1;
        let ref_count = buffer.ref_count;
        set_style_data_u32(buffer.mut_bytes(), StyleKeys::REF_COUNT, ref_count);
    }

    /// Release a handle (decrement ref count, free if zero)
    pub fn release(&mut self, handle: StyleHandle) {
        if matches!(
            handle,
            StyleHandle::DEFAULT
                | StyleHandle::DEFAULT_INLINE
                | StyleHandle::DEFAULT_IMG
                | StyleHandle::DEFAULT_FLEX
                | StyleHandle::DEFAULT_GRID
                | StyleHandle::DEFAULT_LIST
                | StyleHandle::DEFAULT_LIST_ITEM
        ) {
            let idx = handle.index();
            let buf = &mut self.buffers[idx];
            if buf.ref_count > 1 {
                buf.ref_count = buf.ref_count.saturating_sub(1);
                let ref_count = buf.ref_count;
                set_style_data_u32(buf.mut_bytes(), StyleKeys::REF_COUNT, ref_count);
            }
            return; // defaults are immortal
        }
        let idx = handle.index();
        let buf = &mut self.buffers[idx];
        if buf.ref_count == 0 {
            // Already freed — guard against double-release
            return;
        }
        buf.ref_count -= 1;
        let ref_count = buf.ref_count;

        set_style_data_u32(buf.mut_bytes(), StyleKeys::REF_COUNT, ref_count);

        if buf.ref_count == 0 {
            // Remove from hash index before clearing buffer data
            let hash = Self::hash_buffer(<&[u8; STYLE_BUFFER_SIZE]>::try_from(buf.bytes()).unwrap());
            if let Some(indices) = self.hash_index.get_mut(&hash) {
                indices.retain(|&i| i != idx as u32);
                if indices.is_empty() {
                    self.hash_index.remove(&hash);
                }
            }
            // Clear stale data from the freed buffer
            buf.mut_bytes().fill(0);
            #[cfg(target_os = "android")]
            {
                buf.buffer = -1;
            }
            // A slot handed to platform code is retired rather than recycled:
            // stale platform mappings (a cached direct ByteBuffer, a retained
            // NSMutableData, or a raw pointer into it) may still write to it at
            // any time, and reusing the slot would let those writes corrupt an
            // unrelated node's style.
            // Stale writes now land in a zeroed, out-of-circulation buffer.
            if !buf.exposed {
                self.free_list.push(idx as u32);
            }
        }
    }

    /// Mark a slot as handed to platform code. See [`StyleBuffer::exposed`].
    pub(crate) fn mark_exposed(&mut self, handle: StyleHandle) {
        if let Some(buf) = self.buffers.get_mut(handle.index()) {
            buf.exposed = true;
        }
    }

    #[cfg(test)]
    pub(crate) fn is_exposed(&self, handle: StyleHandle) -> bool {
        self.buffers[handle.index()].exposed
    }

    #[cfg(test)]
    pub(crate) fn free_slot_count(&self) -> usize {
        self.free_list.len()
    }

    pub(crate) fn hash_buffer(data: &[u8; STYLE_BUFFER_SIZE]) -> u64 {
        let mut hasher = DefaultHasher::new();
        data.hash(&mut hasher);
        hasher.finish()
    }


    pub fn stats(&self) -> ArenaStats {
        let active = self.buffers.iter().filter(|b| b.ref_count > 0).count();
        let shared = self.buffers.iter().filter(|b| b.ref_count > 1).count();
        let total_refs: u32 = self.buffers.iter().map(|b| b.ref_count).sum();

        ArenaStats {
            total_buffers: self.buffers.len(),
            active_buffers: active,
            shared_buffers: shared,
            total_refs: total_refs as usize,
            free_slots: self.free_list.len(),
            buffer_memory: active * STYLE_BUFFER_SIZE,
        }
    }

    pub fn apply_preflight(&mut self) {
        self.reset_defaults(true);
    }

    pub fn remove_preflight(&mut self) {
        self.reset_defaults(false);
    }

    fn reset_defaults(&mut self, preflight: bool) {
        let zero = [0u8; STYLE_BUFFER_SIZE];

        let init_base: fn(&mut [u8]) = if preflight {
            Style::init_preflight_base_data
        } else {
            Style::init_default_data
        };

        {
            let ref_count = self.buffers[Handle::Default as usize].ref_count;
            let data = self.buffers[Handle::Default as usize].mut_bytes();
            data.copy_from_slice(&zero);
            init_base(data);
            set_style_data_u32(data, StyleKeys::REF_COUNT, ref_count);
            self.default_snapshots[Handle::Default as usize].copy_from_slice(data);
        }

        {
            let ref_count = self.buffers[Handle::Inline as usize].ref_count;
            let data = self.buffers[Handle::Inline as usize].mut_bytes();
            data.copy_from_slice(&zero);
            init_base(data);
            crate::style::utils::set_style_data_i8(data, StyleKeys::DISPLAY_MODE, 1);
            set_style_data_u32(data, StyleKeys::REF_COUNT, ref_count);
            self.default_snapshots[Handle::Inline as usize].copy_from_slice(data);
        }

        {
            let ref_count = self.buffers[Handle::Img as usize].ref_count;
            let data = self.buffers[Handle::Img as usize].mut_bytes();
            data.copy_from_slice(&zero);
            init_base(data);
            crate::style::utils::set_style_data_i8(data, StyleKeys::ITEM_IS_REPLACED, 1);
            if preflight {
                crate::style::utils::set_style_data_i8(
                    data,
                    StyleKeys::DISPLAY,
                    display_to_enum(Display::Block),
                );
                crate::style::utils::set_style_data_i8(data, StyleKeys::DISPLAY_MODE, 0);
            } else {
                crate::style::utils::set_style_data_i8(
                    data,
                    StyleKeys::DISPLAY_MODE,
                    display_mode_to_enum(DisplayMode::Inline),
                );
            }
            set_style_data_u32(data, StyleKeys::REF_COUNT, ref_count);
            self.default_snapshots[Handle::Img as usize].copy_from_slice(data);
        }

        {
            let ref_count = self.buffers[Handle::Flex as usize].ref_count;
            let data = self.buffers[Handle::Flex as usize].mut_bytes();
            data.copy_from_slice(&zero);
            init_base(data);
            crate::style::utils::set_style_data_i8(
                data,
                StyleKeys::DISPLAY,
                display_to_enum(Display::Flex),
            );
            set_style_data_u32(data, StyleKeys::REF_COUNT, ref_count);
            self.default_snapshots[Handle::Flex as usize].copy_from_slice(data);
        }

        {
            let ref_count = self.buffers[Handle::Grid as usize].ref_count;
            let data = self.buffers[Handle::Grid as usize].mut_bytes();
            data.copy_from_slice(&zero);
            init_base(data);
            crate::style::utils::set_style_data_i8(
                data,
                StyleKeys::DISPLAY,
                display_to_enum(Display::Grid),
            );
            set_style_data_u32(data, StyleKeys::REF_COUNT, ref_count);
            self.default_snapshots[Handle::Grid as usize].copy_from_slice(data);
        }

        {
            let ref_count = self.buffers[Handle::List as usize].ref_count;
            let data = self.buffers[Handle::List as usize].mut_bytes();
            data.copy_from_slice(&zero);
            init_base(data);
            crate::style::utils::set_style_data_i8(data, StyleKeys::ITEM_IS_LIST, 1);
            if preflight {
                crate::style::utils::set_style_data_u8(data, StyleKeys::LIST_STYLE_TYPE, 0);
            }
            set_style_data_u32(data, StyleKeys::REF_COUNT, ref_count);
            self.default_snapshots[Handle::List as usize].copy_from_slice(data);
        }

        {
            let ref_count = self.buffers[Handle::ListItem as usize].ref_count;
            let data = self.buffers[Handle::ListItem as usize].mut_bytes();
            data.copy_from_slice(&zero);
            init_base(data);
            crate::style::utils::set_style_data_i8(
                data,
                StyleKeys::DISPLAY_MODE,
                display_mode_to_enum(DisplayMode::ListItem),
            );
            crate::style::utils::set_style_data_i8(data, StyleKeys::ITEM_IS_LIST_ITEM, 1);
            set_style_data_u32(data, StyleKeys::REF_COUNT, ref_count);
            self.default_snapshots[Handle::ListItem as usize].copy_from_slice(data);
        }

        {
            let ref_count = self.buffers[Handle::Button as usize].ref_count;
            let data = self.buffers[Handle::Button as usize].mut_bytes();
            data.copy_from_slice(&zero);
            init_base(data);
            if preflight {
                crate::style::utils::set_style_data_i8(
                    data,
                    StyleKeys::DISPLAY_MODE,
                    display_mode_to_enum(DisplayMode::Box),
                );
                crate::style::utils::set_style_data_i8(data, StyleKeys::TEXT_ALIGN, 3);
                crate::style::utils::set_style_data_i8(data, StyleKeys::TEXT_ALIGN_STATE, 1);
            } else {
                crate::style::utils::set_style_data_i8(data, StyleKeys::TEXT_ALIGN, 3);
                crate::style::utils::set_style_data_i8(data, StyleKeys::TEXT_ALIGN_STATE, 1);
                crate::style::utils::set_style_data_i8(
                    data,
                    StyleKeys::DISPLAY_MODE,
                    display_mode_to_enum(DisplayMode::Box),
                );
            }
            set_style_data_u32(data, StyleKeys::REF_COUNT, ref_count);
            self.default_snapshots[Handle::Button as usize].copy_from_slice(data);
        }
    }
}

#[cfg(target_vendor = "apple")]
impl StyleArena {

    /// Hands the slot's `NSMutableData` to platform code, so the slot is marked
    /// exposed and will never be recycled.
    #[track_caller]
    pub fn buffer(&mut self, handle: StyleHandle) -> objc2::rc::Retained<NSMutableData> {
        self.mark_exposed(handle);
        self.buffers[handle.index()].buffer()
    }

    #[track_caller]
    pub fn buffer_opt(
        &mut self,
        handle: StyleHandle,
    ) -> Option<objc2::rc::Retained<NSMutableData>> {
        self.mark_exposed(handle);
        self.buffers.get(handle.index()).map(|b| b.buffer())
    }


    /// Allocate a new buffer with the given data
    pub fn alloc(&mut self, data: &[u8; STYLE_BUFFER_SIZE]) -> StyleHandle {
        let idx = if let Some(free_idx) = self.free_list.pop() {
            let buf = &mut self.buffers[free_idx as usize];
            buf.ref_count = 1;
            // Free slots only ever contain unexposed buffers (exposed ones are
            // retired in `release`); reset defensively so the invariant is local.
            buf.exposed = false;
            buf.buffer.set_bytes(data);
            set_style_data_u32(buf.mut_bytes(), StyleKeys::REF_COUNT, 1);
            free_idx
        } else {
            let idx = self.buffers.len() as u32;
            let mut buffer = StyleBuffer::new(data);
            buffer.ref_count = 1;
            set_style_data_u32(buffer.mut_bytes(), StyleKeys::REF_COUNT, 1);
            self.buffers.push(buffer);
            idx
        };

        StyleHandle(idx)
    }

    /// Intern: find an existing identical buffer or allocate a new one
    pub fn intern(&mut self, data: &[u8; STYLE_BUFFER_SIZE]) -> StyleHandle {
        let hash = Self::hash_buffer(data);

        // O(1) lookup via hash index instead of O(n) linear scan
        if let Some(indices) = self.hash_index.get(&hash) {
            for &idx in indices {
                let buf = &mut self.buffers[idx as usize];
                if buf.ref_count > 0 && buf.bytes() == data {
                    buf.ref_count += 1;
                    let ref_count = buf.ref_count;
                    set_style_data_u32(buf.mut_bytes(), StyleKeys::REF_COUNT, ref_count);
                    return StyleHandle(idx);
                }
            }
        }

        let handle = self.alloc(data);
        self.hash_index.entry(hash).or_insert_with(Vec::new).push(handle.index() as u32);
        handle
    }

    /// Prepare for mutation - COW if shared, returns (new_handle, ptr)
    pub fn prepare_mut(&mut self, handle: StyleHandle) -> (StyleHandle, *mut u8) {
        let idx = handle.index();

        if self.buffers[idx].ref_count == 1 {
            let ptr = self.buffers[idx].mut_bytes().as_mut_ptr();
            return (handle, ptr);
        }

        // COW: capture current data (may include JS writes — correct for new buffer)
        let data = self.buffers[idx].bytes().to_vec();

        {
            let current = &mut self.buffers[idx];
            current.ref_count -= 1;
            let ref_count = current.ref_count;
            set_style_data_u32(current.mut_bytes(), StyleKeys::REF_COUNT, ref_count);
        }

        // Restore the default buffer to its pristine state so future views
        // sharing this handle don't inherit stale JS writes.
        if Self::is_default_index(idx) {
            self.restore_default(idx);
        }

        let new_handle = self.alloc(<&[u8; STYLE_BUFFER_SIZE]>::try_from(data.as_slice()).unwrap());
        let ptr = self.buffers[new_handle.index()].mut_bytes().as_mut_ptr();
        (new_handle, ptr)
    }

    /// Get read-only pointer to buffer data
    pub fn get_ptr(&self, handle: StyleHandle) -> *const u8 {
        self.buffers[handle.index()].bytes().as_ptr()
    }

    pub fn get_ptr_opt(&self, handle: StyleHandle) -> Option<*const u8> {
        self.buffers.get(handle.index()).map(|b| b.bytes().as_ptr())
    }

    /// Get mutable pointer (caller must ensure exclusive via prepare_mut)
    pub fn get_ptr_mut(&mut self, handle: StyleHandle) -> *mut u8 {
        self.buffers[handle.index()].mut_bytes().as_mut_ptr()
    }


    pub fn get_ptr_mut_opt(&mut self, handle: StyleHandle) -> Option<*mut u8> {
        self.buffers
            .get_mut(handle.index())
            .map(|b| b.mut_bytes().as_mut_ptr())
    }

    /// Get read-only reference to buffer data
    pub fn get(&self, handle: StyleHandle) -> &[u8; STYLE_BUFFER_SIZE] {
        <&[u8; STYLE_BUFFER_SIZE]>::try_from(self.buffers[handle.index()].bytes()).unwrap()
    }
}


#[cfg(not(target_vendor = "apple"))]
impl StyleArena {
    #[cfg(target_os = "android")]
    #[track_caller]
    pub fn buffer(&self, handle: StyleHandle) -> jni::sys::jint {
        self.buffers[handle.index()].buffer()
    }

    #[cfg(target_os = "android")]
    #[track_caller]
    pub fn buffer_opt(&self, handle: StyleHandle) -> Option<jni::sys::jint> {
        self.buffers.get(handle.index()).and_then(|b| {
            let id = b.buffer();
            if id >= 0 { Some(id) } else { None }
        })
    }

    /// Allocate a new buffer with the given data

    pub fn alloc(&mut self, data: &[u8; STYLE_BUFFER_SIZE]) -> StyleHandle {
        let idx = if let Some(free_idx) = self.free_list.pop() {
            let buf = &mut self.buffers[free_idx as usize];
            buf.data.copy_from_slice(data);
            buf.ref_count = 1;
            // Free slots only ever contain unexposed buffers (exposed ones are
            // retired in `release`); reset defensively so the invariant is local.
            buf.exposed = false;
            set_style_data_u32(buf.data.as_mut_slice(), StyleKeys::REF_COUNT, 1);
            free_idx
        } else {
            let idx = self.buffers.len() as u32;
            let mut buffer = StyleBuffer::new(data);
            buffer.ref_count = 1;
            set_style_data_u32(buffer.data.as_mut_slice(), StyleKeys::REF_COUNT, 1);
            self.buffers.push(buffer);
            idx
        };

        StyleHandle(idx)
    }

    /// Intern: find an existing identical buffer or allocate a new one
    pub fn intern(&mut self, data: &[u8; STYLE_BUFFER_SIZE]) -> StyleHandle {
        let hash = Self::hash_buffer(data);

        // O(1) lookup via hash index instead of O(n) linear scan
        if let Some(indices) = self.hash_index.get(&hash) {
            for &idx in indices {
                let buf = &mut self.buffers[idx as usize];
                if buf.ref_count > 0 && buf.data.as_ref() == data {
                    buf.ref_count += 1;
                    set_style_data_u32(buf.data.as_mut_slice(), StyleKeys::REF_COUNT, buf.ref_count);
                    return StyleHandle(idx);
                }
            }
        }

        let handle = self.alloc(data);
        self.hash_index.entry(hash).or_insert_with(Vec::new).push(handle.index() as u32);
        handle
    }


    /// Prepare for mutation - COW if shared, returns (new_handle, ptr)
    pub fn prepare_mut(&mut self, handle: StyleHandle) -> (StyleHandle, *mut u8) {
        let idx = handle.index();

        if self.buffers[idx].ref_count == 1 {
            let ptr = self.buffers[idx].data.as_mut_ptr();
            return (handle, ptr);
        }

        // COW: capture current data (may include JS writes — correct for new buffer)
        let data = *self.buffers[idx].data;

        {
            let current = &mut self.buffers[idx];
            current.ref_count -= 1;
            let ref_count = current.ref_count;
            set_style_data_u32(current.data.as_mut_slice(), StyleKeys::REF_COUNT, ref_count);
        }

        // Restore the default buffer to its pristine state so future views
        // sharing this handle don't inherit stale JS writes.
        if Self::is_default_index(idx) {
            self.restore_default(idx);
        }

        let new_handle = self.alloc(&data);
        let ptr = self.buffers[new_handle.index()].data.as_mut_ptr();
        (new_handle, ptr)
    }

    /// Get read-only pointer to buffer data
    pub fn get_ptr(&self, handle: StyleHandle) -> *const u8 {
        self.buffers[handle.index()].data.as_ptr()
    }

    pub fn get_ptr_opt(&self, handle: StyleHandle) -> Option<*const u8> {
        self.buffers.get(handle.index()).map(|b| b.data.as_ptr())
    }

    /// Get mutable pointer (caller must ensure exclusive via prepare_mut)
    pub fn get_ptr_mut(&mut self, handle: StyleHandle) -> *mut u8 {
        self.buffers[handle.index()].data.as_mut_ptr()
    }

    pub fn get_ptr_mut_opt(&mut self, handle: StyleHandle) -> Option<*mut u8> {
        self.buffers
            .get_mut(handle.index())
            .map(|b| b.data.as_mut_ptr())
    }

    /// Get read-only reference to buffer data
    pub fn get(&self, handle: StyleHandle) -> &[u8; STYLE_BUFFER_SIZE] {
        &self.buffers[handle.index()].data
    }

    /// Persist the JNI ByteBuffer id for a slot. Android-only because the id is
    /// android-specific; the exposure it implies is not.
    #[cfg(target_os = "android")]
    pub(crate) fn set_handle_buffer(&mut self, handle: StyleHandle, buffer_id: i32) {
        if let Some(data) = self.buffers.get_mut(handle.index()) {
            if data.buffer == -1 {
                data.buffer = buffer_id;
            }
        }
        // Whether or not the id was newly persisted, this slot has now escaped
        // to platform code and must never be recycled.
        self.mark_exposed(handle);
    }
}

#[derive(Debug, Copy, Clone)]
pub struct ArenaStats {
    pub total_buffers: usize,
    pub active_buffers: usize,
    pub shared_buffers: usize,
    pub total_refs: usize,
    pub free_slots: usize,
    pub buffer_memory: usize,
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Regression test: once a
    /// buffer has been exposed to platform code (a cached direct ByteBuffer on
    /// Android, a retained NSMutableData or a raw pointer into it on Apple),
    /// releasing its handle must retire the slot rather than recycle it —
    /// otherwise stale platform writes land in a buffer reused by another node.
    #[test]
    fn exposed_style_buffer_is_retired_not_recycled() {
        let mut arena = StyleArena::new(&[0u8; STYLE_BUFFER_SIZE]);

        let a = arena.alloc(&[1u8; STYLE_BUFFER_SIZE]);
        let b = arena.alloc(&[2u8; STYLE_BUFFER_SIZE]);
        let ptr_a = arena.get_ptr(a);
        let ptr_b = arena.get_ptr(b);
        assert_ne!(ptr_a, ptr_b);

        // Simulate the platform taking a long-lived reference to A.
        arena.mark_exposed(a);
        assert!(arena.is_exposed(a));
        assert!(!arena.is_exposed(b));

        // Both handles die.
        arena.release(a);
        arena.release(b);

        // A fresh alloc must reuse B's unexposed slot but never A's retired one.
        let c = arena.alloc(&[3u8; STYLE_BUFFER_SIZE]);
        let ptr_c = arena.get_ptr(c);
        assert_eq!(ptr_c, ptr_b, "unexposed slot should be recycled");
        assert_ne!(ptr_c, ptr_a, "exposed slot must never be recycled");

        // The free list is now empty; the next alloc grows the arena and still
        // must not land on A's retired address.
        let d = arena.alloc(&[4u8; STYLE_BUFFER_SIZE]);
        assert_ne!(arena.get_ptr(d), ptr_a);
    }

    /// The recycle path still works for buffers that were never exposed —
    /// interning/dedup memory behavior must not regress.
    #[test]
    fn unexposed_style_buffer_is_recycled() {
        let mut arena = StyleArena::new(&[0u8; STYLE_BUFFER_SIZE]);

        let a = arena.alloc(&[1u8; STYLE_BUFFER_SIZE]);
        let ptr_a = arena.get_ptr(a);
        arena.release(a);
        assert_eq!(arena.free_slot_count(), 1);

        let b = arena.alloc(&[2u8; STYLE_BUFFER_SIZE]);
        assert_eq!(ptr_a, arena.get_ptr(b), "unexposed slot should be reused");
    }

    /// A recycled slot must not inherit the previous occupant's exposed flag,
    /// otherwise every slot eventually retires and the arena grows unbounded.
    #[test]
    fn recycled_slot_clears_the_exposed_flag() {
        let mut arena = StyleArena::new(&[0u8; STYLE_BUFFER_SIZE]);

        let a = arena.alloc(&[1u8; STYLE_BUFFER_SIZE]);
        arena.release(a);

        let b = arena.alloc(&[2u8; STYLE_BUFFER_SIZE]);
        assert_eq!(a.index(), b.index(), "expected the slot to be recycled");
        assert!(!arena.is_exposed(b));

        arena.mark_exposed(b);
        arena.release(b);
        assert_eq!(arena.free_slot_count(), 0, "exposed slot must be retired");
    }

    /// `mark_exposed` on a handle the arena doesn't have must not panic —
    /// handles arrive from platform code.
    #[test]
    fn mark_exposed_ignores_unknown_handles() {
        let mut arena = StyleArena::new(&[0u8; STYLE_BUFFER_SIZE]);
        arena.mark_exposed(StyleHandle::from_raw(9999));
    }
}
