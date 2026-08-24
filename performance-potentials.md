# Mason Layout Engine — Performance Potentials

Audit date: 2026-08-03. Based on MasonPerf report #8 (253ms window, Hacker News-style feed, cold tree build, 287 nodes, mostly text).

## How to read the baseline numbers

- `perf.selfCost` = 26.39ms ≈ **10% of the window is the instrumentation itself**. Every span is inflated, including the 59ms compute. Re-baseline with probes off (or detail mode off) before comparing.
- `lifecycle.nodeCreated: 287` in the window ⇒ this was a **cold tree build**. Most `text.miss.newKey: 343` are one-time bootstrap costs (~100 text nodes × ~3.4 probe keys), not key thrash. Steady-state wins come from the cache-survival items (P1–P3, P6).
- Timed style spans nest (`syncStyle ⊃ updateNativeStyle ⊃ updateTextStyle ⊃ onTextStyleChanged`); the 16–20ms figures overlap — do not sum them.
- `apply.childFilterAlloc: 122` is stale — already fixed in-tree via `nativeChildScratch` (`Element.kt:765`).
- The 59ms `nodeComputeWithSizeAndLayout` is dominated by **text measurement volume** (814 JNI callbacks → 371 real measures → ~331 StaticLayout builds ≈ 41.5ms), not by taffy itself, JNI hop overhead (~1ms total), or marshalling.

## Status legend

- `pending` — not started
- `in-progress` — being worked on
- `fixed` — landed and verified (see **Fixed** entry for details + measured gain)
- `deferred` — deliberately postponed (reason in notes)
- `wontfix` — evaluated and rejected (reason in notes)

## Measurement protocol

- Rust: `cargo test -p mason-core` must pass; run the core benchmark before/after where applicable.
- Android: `./gradlew :masonkit:assembleDebug` (or `compileDebugKotlin`) must pass in `packages/nativescript-masonkit/src-native/mason-android`.
- Device gains are measured with the MasonPerf harness (same HN feed scenario, same window size), probes taxed as noted above.
- **Harness removed (2026-08-03):** `MasonPerf.kt` and all of its call sites (root `onMeasure`/`onLayout`, native compute+layout, total text measurement, compute/text cache-hit counters) were deleted once the P1–P21 work landed, so the numbers below cannot be re-collected without reinstating it. The history is kept for context.
- **Harness verification (2026-08-03):** the `MasonPerf.kt` reporter was present but its call sites had been removed, so `adb logcat -s MasonPerf` stayed silent even with `log.tag.MasonPerf=DEBUG`. Summary probes are now connected to root `onMeasure`/`onLayout`, native compute+layout, total text measurement, and compute/text cache hits. The final rebuilt release AAR was consumed by the demo and verified on-device: cold feed launch report #1 emitted a 168ms window, 1 compute+layout call (100.24ms), 30 `onMeasure` calls (100.48ms aggregate), 29 `onLayout` calls (8.51ms), 351 text probes (96.95ms), and 0.57ms measured instrumentation cost. Navigating to the recursive comment tree emitted report #2 (132ms window, 57.98ms compute+layout, 765 text probes/49.42ms). Feed cards/tags and recursive comment/story surfaces were visually checked after fixing the first-sync background regression. These are harness/integration smoke tests, not like-for-like per-item gain claims against report #8.

---

## High impact

### P1 — Route inline/text measure paths through the Rust layout cache

- **Status:** fixed
- **Impact:** high · **Effort:** medium · **Risk:** medium
- **Location:** `crates/mason-core/src/tree_inline.rs:1459, 1670, 2332, 2620`
- **Notes:** `measure_inline_child` and the text-container branch of `compute_inline_or_mixed_layout` call `compute_leaf_layout` directly, bypassing `node.cache` (`LayoutCache`). Nested text spans re-fire their JNI measure on every probe of the parent — within *and* across passes. Route them through `LayoutCache::get`/`store` (RunMode::ComputeSize semantics) or add a dedicated `(known, available) → Size` cache on the node. Invalidation is already covered by the dirty cascade (see P2). This is also why `compute.cacheHit` was 4: within one pass, repeat-identical probes are rare by design; the cache pays off *across* passes once P2 stops nuking it.
- **Fixed:** All four inline/text `compute_leaf_layout` paths now use the node `LayoutCache` with `RunMode::ComputeSize`; cached hits bypass native measurement and misses store the resulting size. Core check, 38 unit tests, and the HN measure-volume test pass. Device integration is verified by the report #1 smoke test above; no isolated P1 gain is claimed.

### P2 — Stop dirty-marking from nuking caches (value-equality + layout-vs-visual split)

- **Status:** fixed
- **Impact:** high (steady-state) · **Effort:** medium · **Risk:** medium-high
- **Location:** Rust: `crates/mason-core/src/tree.rs:1627` (`with_style_mut`, unconditional dirty), `node.rs:659`, `tree.rs:1449-1458` (full-cache clear + ancestor cascade). Kotlin: `Style.kt:4362-4371` (`updateNativeStyleImpl` calls `invalidateLayout()` for *any* write), also `4250, 4358` for grid paths; `TextEngine.kt:304-311` (visual branch still clears `measureCache`).
- **Notes:** Two parts. (a) Rust: compare before/after (596-byte memcmp) in `with_style_mut` and skip dirtying on no-op writes — Angular/CD-style frameworks re-set identical values per frame on recycled lists. (b) Kotlin: introduce a `LAYOUT_MASK` (taffy-affecting flags + text-layout flags from `TextEngine.hasTextLayoutFlags`); visual-only writes (colors, decorations, shadows, border-color, `list-style-type`) should only `view.invalidate()`, not `node.dirty()` + whole-tree recompute + apply pass. Note FONT_SIZE/FONT_FAMILY etc. *do* affect layout via the measure callback. A color change must also not clear the text measure cache. This is what produced `dirty.invalidateLayoutCalls: 818` in a 253ms window. Risk: an incomplete mask ⇒ stale layout; this codebase has stale-cache scar tissue, so test visually.
- **Fixed:** Rust style mutation now compares the 596-byte raw style before dirty propagation, and Android keeps a reusable 596-byte shadow of the shared direct buffer so identical JS/framework writes return before epoch, dispatch, or native dirty work. The shadow is deliberately initialized only after the first style batch is processed: taking its baseline while first fetching the already-written JS buffer caused selective loss of initial styles. Background helper creation also checks the authoritative buffer state rather than relying only on a possibly coalesced visual dirty bit, preventing valid card/tag backgrounds from remaining undrawn. Kotlin classifies drawing-only flags separately, invalidates the view without scheduling layout, and preserves the text measure cache for visual changes. Core tests and Android compilation pass; these first-sync/render regressions are included in the device visual verification.

### P3 — Lazy epoch advance (stop per-write memo thrash)

- **Status:** fixed
- **Impact:** high · **Effort:** low-medium · **Risk:** medium
- **Location:** `Style.kt:5359-5367` (`textStyleEpoch`) + bump sites `Style.kt:1068, 1086, 1143, 4156`, `Node.kt:547`, font invalidation `Style.kt:782`
- **Notes:** `textStyleEpoch` bumps on every resolve-invalidating write (245 in the window), discarding all 27 memo slots (`resolvedCached`, `Style.kt:4568-4584`) on all 287 nodes *and* every TextEngine alignment/direction cache. Writes stream continuously while reads cluster in dispatch/measure phases, so each bump is immediately followed by a refill-and-discard cycle — that's `style.parentLookup.calls: 19264` / `stepsClimbed: 71478` (~3.7 ancestors per miss). Replace bump-per-write with an `epochDirty` flag: writes set it; the first resolved read after a write advances the counter once. 245 bumps collapse to ~one per read phase. Risk: every write path must set the flag (they're centralized: `setOrAppendState`×2, `setStateFromHalves`, `updateNativeStyle`, `setPseudo`, `invalidateResolvedFontFace`); a missed path = stale inherited values.
- **Fixed:** Writers now set a volatile `textStyleEpochDirty` flag and the first resolved read advances the global epoch once; all centralized Kotlin/JS/pseudo/font invalidation sites route through that lazy bump. Android compilation and the device report smoke test pass; no isolated P3 gain is claimed.

### P4 — StaticLayout build diet (TextEngine)

- **Status:** fixed
- **Impact:** high (aggregate ~13–15ms of the window) · **Effort:** medium · **Risk:** medium
- **Location:** `TextEngine.kt`, `TextNode.kt`
- **Notes:** Five sub-items:
  - **P4a — max-content fast path:** for text with no `'\n'`, no `LineHeightSpan`, no `ReplacementSpan`, return `Layout.getDesiredWidth` + font-metrics height without building a StaticLayout (`TextEngine.kt:414-427, 438-468`). 121 max builds × ~57µs ≈ **~7ms**. Height must match line-box semantics — gate conservatively.
  - **P4b — stop min/max probes clobbering the draw layout:** only definite probes (or width matching the view's content width) should write `container.cachedStaticLayout` (`TextEngine.kt:522-525`, hit-restore `756-759`). Min/max probes leave intrinsic-width layouts there, forcing the 66 draw-time rebuilds (`draw.text.rebuildStaticLayout`, 3.64ms) plus `onSizeChanged` invalidation cascades (`TextView.kt:124-128`). Keep `rebuildCachedStaticLayout` as the rotation fallback.
  - **P4c — skip `lineWidthLoop` re-shaping when unwrapped:** cache the unwrapped width per (attributedStringVersion, font epoch) — already computed at `TextEngine.kt:418` on the max probe — and when `widthConstraint >= unwrappedWidth` use it directly instead of looping `StaticLayout.getLineWidth` (each call re-measures the line via `TextLine.set`). `text.lineWidthLoop`: 191 calls, 6.21ms; expect to recover ~half.
  - **P4d — hoist regexes in `TextNode.processText`:** `Regex("[ \t\u000B\u000C\n]+")` is compiled fresh per call (`TextNode.kt:324, 358`); the `Capitalize` split/join also allocates per word (`311-313`). Plausibly most of `text.buildAttributedString`'s 5.19ms. A cached pattern already exists at `TextView.kt:24` — reuse or hoist to companion.
  - **P4e — dedupe `resolveWidthConstraint` + make it allocation-free:** called 1185× vs 814 measures — the miss path re-resolves inside `measureLayout` (`TextEngine.kt:402`) instead of taking the pre-check's value (`752`); ~1.1ms of duplicate work. Also read the raw max-width type byte first and only touch `style.maxSize` (allocates `Size` + up to two `Dimension` objects, `Style.kt:3707-3731`) when it's `Points`.
- **Fixed:** Added a conservative single-line `BoringLayout` metrics fast path; intrinsic-width caching skips line-width re-shaping; only definite probes retain draw layouts; whitespace regexes and capitalization scans are allocation-light; width constraints are resolved once per probe with raw max-width type checks. Pure/rich-text fallbacks retain StaticLayout semantics. Android compilation passes; device gain pending.

### P5 — Skip the second apply pass over an unchanged tree

- **Status:** fixed
- **Impact:** high (~4.1ms/pass wasted) · **Effort:** low · **Risk:** low
- **Location:** `View.kt:307-320`, `Element.kt:786-1000` (`applyLayoutFlat`), `Element.kt:455-482` (posted requestLayout)
- **Notes:** The posted `requestLayout` produces a second onMeasure (cache hit, no native call) → second onLayout → second full `applyLayoutFlat` over an unchanged tree. That is `apply.pass: 2 × 4.097ms` — one pass is pure waste. Add a monotonically increasing version to `MasonLayoutTree.fromFloatArray` (`Layout.kt:46-149`) and skip `applyLayoutFlat` in `onLayout` when the tree version equals the last-applied one. Safe: Android's own `layout()` short-circuit means the second pass already mostly no-ops at the framework level.
- **Fixed:** Added a monotonically increasing `MasonLayoutTree.version` and a per-root `lastAppliedLayoutVersion`; repeated `onLayout`/nested callers now return before walking an unchanged snapshot. Android compilation and the device report smoke test pass; no isolated P5 gain is claimed.
- **Regression + follow-up fix (2026-08-03):** the version alone was not a sufficient skip condition. A platform subtree can be attached under a Mason container without touching the Mason node tree (NativeScript swapping a Page into a Frame), so nothing dirties a node, the compute cache legitimately stays clean, the snapshot version is unchanged — and the apply pass, which is the only thing that calls `measure()`/`layout()` on those platform children, was skipped. Repro: launch → back → relaunch → open an article ⇒ white screen, with the Page's `GridLayout` sitting at `0,0-0,0` with `FORCE_LAYOUT` still set while its ancestors were laid out. Fix: `Mason.platformLayoutEpoch` is bumped by `View.requestLayout`/`Scroll.requestLayout` (every pending layout below a Mason container propagates through one of them) and `applyLayoutFlat` skips only when *both* the snapshot version and the epoch are unchanged, snapshotting the epoch before the walk so requests raised by its own `measure`/`layout`/`setPadding` calls arm the next pass instead of being swallowed. Verified on-device: 4 back-relaunch-open cycles render fully, comment show/hide toggle and scrolling unaffected, compute count per navigation unchanged (1 × `nodeComputeWithSizeAndLayout`), no crashes in logcat.

---

## Medium impact

### P6 — Make text-style dispatch lazy instead of eager per write

- **Status:** fixed
- **Impact:** high (bulk of 16ms `onTextStyleChanged` + much of the 818 invalidations) · **Effort:** medium · **Risk:** medium (behavioral)
- **Location:** `Style.kt:1104-1134` → `View.kt:283-287` → `Node.kt:726-742` (`invalidateDescendantTextViews`) → `TextEngine.kt:221-319` (`onTextStyleChanged`), `TextEngine.kt:2131-2183` (`invalidateInlineSegments`)
- **Notes:** Per dispatch: recursive subtree walk, ~20 inherited-property re-resolves per descendant TextView, attribute copies per TextNode, eager clears of measure/segment/attributed-string caches, 1–2 `invalidateLayout` per view, plus upward recursion through TextContainer parents (`TextEngine.kt:2151-2152`). Everything is version-guarded at read time already (`segmentsInvalidateVersion`, `attributedStringVersion`, epoch) — the write path could just bump versions + set dirty bits and let the next measure/draw rebuild once. Also dedupe the 2–3 `invalidateLayout` calls issued per view per batch. The upward recursion exists because parent composed text depends on children — must stay correct. Defer to wave 2 (spans Style/View/Node/TextEngine files owned by other waves).
- **Fixed:** Inherited subtree propagation is now queued and coalesced per source node for the current looper turn; dirty masks are unioned and one descendant walk runs before the already-queued layout pass. Direct TextContainer changes remain synchronous, while batched Kotlin writes already dispatch once via P12. Android compilation passes; device gain pending.

### P7 — Per-frame dedup of `node.dirty()` JNI calls

- **Status:** fixed
- **Impact:** medium (~800 JNI crossings + native ancestor-mark walks per window) · **Effort:** low · **Risk:** low-medium
- **Location:** `Element.kt:409-483` (`invalidateLayout`), `Node.kt:1322-1330` (`nativeNodeMarkDirty`), `Node.kt:419-427` (`getRootNode` walk)
- **Notes:** `computeScheduled` already coalesces `requestLayout` (818 → 85), but every one of the 818 still pays a JNI `nativeNodeMarkDirty` + root walk. Add a per-node "already dirtied this frame" bit (skip when `computeCacheDirty` already set; cleared on compute). Risk: paths that clear the bit without computing must re-dirty.
- **Fixed:** `Node.dirty()` now returns when `computeCacheDirty` is already set; every native compute path clears that bit, so one JNI dirty call is made per node between computes. Android compilation and the device report smoke test pass; no isolated P7 gain is claimed.
- **Follow-up (2026-08-03):** the dedup makes write order significant — any site that raises `computeCacheDirty` by hand *before* calling `dirty()` swallows the native mark and leaves Rust serving a cached layout. Two such inversions were reordered: `TextEngine.kt` (ancestor-element root on a non-Element text view) and `Element.invalidateLayout`'s `invalidateRoot` branch. Remaining hand-set sites (`Node.appendChild`, `TextEngine` parent/root marks) are preceded by a native mark on the same node or by `nativeNodeAddChild`, which dirties in Rust.

### P8 — Fold `setComputedSize` writebacks into the layout readback

- **Status:** fixed
- **Impact:** medium (~0.5–2ms + GC per compute) · **Effort:** medium · **Risk:** medium (ordering)
- **Location:** `crates/mason-core/src/tree_inline.rs:1384-1399, 1501-1513` (+ ~12 more sites), Kotlin `Node.kt:701-709` (`Node.setComputedSize`, allocates `SizeF` via `Node.kt:215`)
- **Notes:** Rust→Java static call per android-backed inline node per compute, each with `ObjectManager` lookup + WeakReference deref + `SizeF` alloc — potentially 100–300 extra callbacks per compute on top of the 814 measures. The readback float stream already carries each node's final w/h; `applyLayoutFlat` could set `cachedWidth/cachedHeight/computeCache` from the tree cursor instead. Keep the callback for compute-without-readback paths (intrinsic probes). Defer to wave 2 (ordering-sensitive).
- **Fixed:** Compute+layout suppresses intermediate Rust→Java computed-size callbacks and populates every node's cached width/height while consuming the flat layout stream. Compute-only/intrinsic paths retain callbacks because no readback follows and inline ordering can depend on them. This also removes the per-callback `SizeF` allocation from the normal Android layout path. Rust/Android compilation, launch, rendering, and MasonPerf reporting pass on-device.

### P9 — Shape-once text measurement via `MeasuredText` + `LineBreaker` (API 29+)

- **Status:** fixed
- **Impact:** highest ceiling (>15ms potential) · **Effort:** high · **Risk:** high
- **Location:** `TextEngine.kt` measure path
- **Notes:** Currently the same text is shaped ~3× per pass (min-content `maxWordWidth`, max-content `getDesiredWidth`, definite StaticLayout build) plus re-shaped per `getLineWidth`/`getPrimaryHorizontal` call. `MeasuredText` + `android.graphics.text.LineBreaker` would shape once per (text, font) and line-break at any width with precomputed per-line widths. Caveats: `ReplacementSpan` (inline views), `FixedLineHeightSpan`, leading-margin spans and bidi are handled by StaticLayout's `MeasuredParagraph` path, not equivalently by hand-rolled LineBreaker; draw still needs a real StaticLayout. Treat as a spike behind a flag; span-equivalence is the unknown.
- **Fixed:** API 29+ caches `MeasuredText` per attributed-string/font epoch and uses it for min/max intrinsic widths plus `LineBreaker` definite-width probes. The fast path is deliberately restricted to `BoringLayout`-validated, single-style text with synchronized segments; bidi, metric spans, line-height spans, replacements, and older APIs retain StaticLayout. Drawing still uses a real cached StaticLayout. Android compilation passes; device gain pending.

### P10 — Rust-side diet bundle

- **Status:** fixed
- **Impact:** low-medium aggregate · **Effort:** low · **Risk:** low
- **Location:** `crates/mason-core/src/`
- **Notes:**
  - **P10a — gate `collect_floats`:** full-tree scan every compute even when the tree has zero floats (`tree.rs:306-351`, called at `tree.rs:851`). Add a tree-level has-floats flag.
  - **P10b — rewrite `fix_scroll_container_sizes`:** full-tree recursion with a `children.clone()` + lock acquisition per node (`tree.rs:906-1022`, clone at `923`). Collect under one read lock, then apply.
  - **P10c — IFC O(lines²):** `update_available_for_current_line` → `current_y_offset()` re-sums all completed line heights on every item add even when `float_rects` is empty (`tree_inline.rs:445-473`, called from `503, 560`). Skip when empty / track y incrementally.
  - **P10d — duplicate `analyze_subtree`:** called twice back-to-back in the `DisplayMode::ListItem` branch (`tree.rs:2283, 2285`); the call itself walks all children (`tree.rs:778-825`).
  - **P10e — `Style::clone()` per leaf per probe:** `tree.rs:2028` (every leaf every compute), double clone in the `adjusted_style` pattern (`tree_inline.rs:1444-1447, 1554-1558, 2193/2320`). `Style::clone` (`style/mod.rs:854-882`) is an arena retain + ~14 field clones incl. Vecs. Clone once / snapshot only the fields the dispatch needs.
- **Fixed:** Added a conservative tree-level float-presence cache, changed scroll-size repair to one iterative write-locked traversal, tracks completed IFC line height and skips float availability work when empty, deduplicated ListItem subtree analysis, removed double style clones, and introduced a leaf-only style snapshot that retains raw layout data without cloning grid Vecs. Core tests and HN volume test pass.

### P11 — De-box the resolved-style memo

- **Status:** fixed
- **Impact:** medium-low · **Effort:** low-medium · **Risk:** low
- **Location:** `Style.kt:4537-4584`
- **Notes:** The memo is `arrayOfNulls<Any>(27)` per Style — every miss boxes Int/Float/Byte, and with 245 epoch bumps/window virtually every read re-boxes (device profile shows 36% in libart). Pack the 24 primitive slots into a `LongArray` + presence bitmask; keep objects only for reference-typed slots (`FontWeight`, enums, shadow list). Also cache `resolvedTextShadow`'s list and rebuild only on `TEXT_SHADOWS` writes (`Style.kt:5185+`). Synergizes with P3 (memo survives longer ⇒ boxing cost concentrates).
- **Fixed:** Primitive resolved values now use a `LongArray` and presence bitmask (`Float` raw bits, `Int`, and `Byte`) with no boxing. Reference-typed enum/font/shadow values remain in the object cache; the already-parsed text-shadow list is reused. Android compilation passes; device gain pending.

### P12 — Double text dispatch when a Kotlin-side batch ends

- **Status:** fixed
- **Impact:** low-medium (2× subtree walks/dispatches on that path) · **Effort:** trivial · **Risk:** low
- **Location:** `Style.kt:1173-1181` (`inBatch` setter calls `updateTextStyle()` then `updateNativeStyle()`, whose impl calls `updateTextStyle()` again at `Style.kt:4191`)
- **Notes:** Every `configure{}` / shorthand (`Style.kt:2995, 3001` → `parsePaddingShorthand`/`parseMarginShorthand` manually toggle `inBatch`, `Style.kt:67-69`) dispatches the text change twice: two subtree walks, two `invalidateInlineSegments`, two `invalidateLayout`. Did not fire in the baseline window (406/406 counter equality proves it), but a real 2× on the Kotlin-API batch path. Drop the explicit call in the `inBatch` setter.
- **Fixed:** Removed the explicit `updateTextStyle()` call from the `inBatch` transition; `updateNativeStyleImpl()` remains the single dispatch point. Android `compileDebugKotlin` passes.

### P13 — `syncStyle` u64 halves sent as decimal strings

- **Status:** fixed
- **Impact:** low · **Effort:** low · **Risk:** low
- **Location:** `style.ts:437-449, 1115-1132` → `Element.kt:44-64`
- **Notes:** Both u64 dirty-mask halves cross JNI as decimal strings, re-parsed with `Long.parseUnsignedLong` + exception-driven `BigInteger` fallback. 129 calls/window × (2 jstring crossings + parse + try/catch). Pass four Ints (low32/high32 × 2) or use the existing `(Long, Long)` overload if the runtime bridges BigInt.
- **Fixed:** Android now sends four signed 32-bit numbers and reconstructs the two bit-exact `Long` masks in Kotlin. Apple/Windows retain their existing string ABI. Android compilation and the device report smoke test pass; no isolated P13 gain is claimed.

### P14 — Rect-equality guard before `measure()`/`layout()` in applyLayoutFlat

- **Status:** fixed
- **Impact:** low-medium (~0.3–0.6ms/pass + avoids spurious `onSizeChanged` → border/shader invalidation) · **Effort:** low · **Risk:** low
- **Location:** `Element.kt:931-957`
- **Notes:** No change check before `view.measure(EXACTLY, EXACTLY)` + `view.layout(...)` for every non-root view. Android internally short-circuits unchanged specs/frames (why 282 `apply.view.measure` → 121 `onMeasure`), but each call still costs the Kotlin→framework transition, and real frame changes fire `TextView.onSizeChanged` which nulls background shaders + invalidates the border renderer (`TextView.kt:105-111`). `setPadding` is already equality-guarded (`Element.kt:823-825, 898-900` — hence only 16 calls). Keep the `view !is Element` measuredWidth read (`Element.kt:849-852`) coherent.
- **Fixed:** All three non-root apply branches compare measured size and frame before calling Android `measure()`/`layout()`, while still honoring `View.isLayoutRequested` so a pending Android layout is never suppressed merely because the old rectangle matches. Android compilation and device lifecycle tests pass; no isolated P14 gain is claimed.

### P15 — Kill per-compute layout-readback allocation

- **Status:** fixed
- **Impact:** low-medium (~25KB JNI alloc + Rust Vec + memcpy per compute) · **Effort:** low-medium · **Risk:** low
- **Location:** `crates/mason-android/src/node.rs:560-588` + `crates/mason-core/src/lib.rs:130-188, 664-668` (`copy_output`), Java side `Layout.kt:46-149` (already reuses SoA arrays — good)
- **Notes:** Every compute builds a fresh `Vec<f32>` (22 floats/node) + `new_float_array` + `set_float_array_region`; the Java `float[]` is immediate garbage. Pass a reusable `float[]` (grown like `MasonLayoutTree`) or a persistent direct ByteBuffer Rust fills. Same pattern in `nativeLayout` (`node.rs:271-293`), `nativeGetFloatRects` (`296-318`), `NativeNodeGetFloatRectWithIds` (`357-388`, extra `Vec<jlong>` of 3N). `nativeGetChildren` heap-`Box`es every child NodeRef (`1016-1040`) — mutation-time only, lower priority.
- **Fixed:** `nativeNodeComputeWithSizeAndLayout` and `nativeNodeLayout` now fill a retained, geometrically-grown JVM `float[]` and return the valid count. Rust writes directly into that caller-owned slice and reports required capacity without allocating/copying a `Vec`; a too-small first call grows once and retries serialization without recomputing. Lower-frequency public float-rect/children APIs retain ownership-returning arrays. Rust/Android compilation, launch, rendering, and MasonPerf reporting pass on-device.

### P16 — Primitive object table for `ObjectManager`

- **Status:** fixed
- **Impact:** low (~1ms ceiling) · **Effort:** low · **Risk:** medium blast radius (shared registry), low technical risk
- **Location:** `ObjectManager.kt:10, 31-33`, used per JNI call at `Node.kt:655`
- **Notes:** `ConcurrentHashMap<Int, Any>` boxes the Int key to Integer on every lookup (ids > 127 miss the cache) — 814 measure callbacks + every other JNI callback. A growable array + free-list indexed by id removes boxing + hashing.
- **Fixed:** Replaced the boxed-key `ConcurrentHashMap` with a growable `AtomicReferenceArray`; hot reads are lock-free primitive-index lookups, while rare mutations remain synchronized and reuse IDs. Android compilation and the device report smoke test pass; no isolated P16 gain is claimed.

### P17 — Cheaper segment widths + reusable push arrays

- **Status:** fixed
- **Impact:** low-medium (~1–1.5ms of the 2.84ms `collectAndCacheSegments`) · **Effort:** low-medium · **Risk:** medium (bidi)
- **Location:** `TextEngine.kt:1175-1181` (two `getPrimaryHorizontal` calls per run — each re-measures the containing line), arrays at `1225-1227`
- **Notes:** Replace with per-run `Layout.getDesiredWidth` for LTR/single-line runs (already the catch-fallback) or reuse the line-loop result for single-run leaves; gate on direction for bidi. Reuse the `IntArray/FloatArray/LongArray` push buffers instead of allocating per push (101×/window).
- **Fixed:** Single-line LTR text runs use `Layout.getDesiredWidth` directly; bidi or multi-line runs retain primary-horizontal measurement. Packed segment Int/Float/Long arrays are retained and geometrically grown, with an explicit count added to JNI so unused capacity is ignored. Rust/Android compilation, launch, rendering, and MasonPerf reporting pass on-device.

### P18 — Measure pre-check micro-costs

- **Status:** fixed
- **Impact:** low-medium (part of 7.06ms `measurePreCheck`; ~2–4ms recoverable with P4e) · **Effort:** low · **Risk:** low
- **Location:** `TextEngine.kt:746-761`
- **Notes:** `children.all { it is TextNode }` allocates an iterator per call (814×); `style.display` getter → `readDisplayFrom` + `resolvePseudo` per call. Index-loop the type check; consider memoizing "has max-width / floated parent" per `textStyleEpoch` so the pre-check can skip `resolveWidthConstraint`'s style reads. The measured 9µs/call exceeds what the code visibly does — some is instrumentation tax; measure before/after.
- **Fixed:** Replaced the per-probe `children.all` iterator with an indexed loop, resolves the effective width only once for cache lookup and measurement, and checks the raw max-width type before allocating style wrapper objects. Android compilation passes; device gain pending.

### P19 — Cache the bootstrap measure for pure-text leaves

- **Status:** fixed
- **Impact:** low (few same-key re-probes post-bootstrap) · **Effort:** trivial · **Risk:** medium (unverified invariant)
- **Location:** `TextEngine.kt:749-750, 814-820`
- **Notes:** `segmentsReady` is evaluated at measure *entry*, before this measure created the attributed string — so every node's **first** measure skips the cache store (`text.storeSkipped.segments: 100` ≈ node count). For pure-text leaves the bootstrap result looks storable (segments don't change a text leaf's own size), but the "bootstrap" comment implies a deliberate Rust-side ordering invariant — verify before removing.
- **Fixed:** Cache-store eligibility is evaluated after measurement/segment creation. Pure-text first measures are stored immediately once the native peer received segments; inline-child and pending-font cases remain excluded. Android compilation passes.

### P20 — Draw-path micro: scratch FontMetrics + float-scan retry

- **Status:** fixed
- **Impact:** low · **Effort:** trivial · **Risk:** low
- **Location:** `TextView.kt:214` (`paint.fontMetricsInt` allocates per text view per frame), `TextEngine.kt:912` (`paint.fontMetrics` per float-check; scratch objects already exist at `TextEngine.kt:135-142`), `TextView.kt:147-149` + `TextEngine.kt:845-893` (`buildFloatAwareStaticLayout` retried every frame for text with no floats — walks all siblings + try/catch per draw)
- **Notes:** Use scratch FontMetrics objects; cache the "no floats among siblings" result until sibling set/style changes instead of retrying per frame.
- **Fixed:** Text draw and float-aware measurement now reuse `FontMetricsInt`/`FontMetrics` scratch objects. A no-float sibling scan is cached against the root layout snapshot version, so ordinary text does not repeat the scan/exception path every frame; any new compute invalidates the answer. Android compilation passes.

### P21 — Audit the zero-height double-layout fallback

- **Status:** fixed
- **Impact:** medium (unverified) · **Effort:** low to instrument · **Risk:** medium
- **Location:** `crates/mason-core/src/tree.rs:1924-1932`
- **Notes:** Re-lays-out an entire subtree (including its uncached inline measures) when block layout returns height ≤ 1e-6 with children. Add a counter; if it fires on the HN feed, gate it to cases that actually change the algorithm choice.
- **Fixed:** Added a diagnostic fallback counter and restricted the retry to the pure block branch where switching to mixed layout changes the selected algorithm. Already-inline and already-mixed subtrees can no longer be laid out twice. Core and HN volume tests pass.

---

## Correctness landmines (fix regardless of perf)

### C1 — Re-entrant `applyLayoutFlat` corrupts shared state

- **Status:** fixed
- **Location:** `Li.kt:181-188`, `Scroll.kt:237-260` call `applyLayoutFlat` from `onLayout`; shared `layoutStack`/`nativeChildScratch` at `Element.kt:761-765`
- **Notes:** `view.layout()` inside the parent's DFS invokes child `onLayout` synchronously; the nested apply resets `layoutStackTop = -1` and clobbers `nativeChildScratch`, corrupting the parent's in-flight iteration. Masked today when child trees are empty. Save/restore `layoutStackTop` around `view.layout()`, or give nested applies their own stack.
- **Fixed:** Each re-entrancy depth now acquires its own reusable stack and native-child scratch buffer from a thread-local pool; `try/finally` releases depth safely. Android `compileDebugKotlin` passes.

### C2 — `@CriticalNative`/`@FastNative` on natives that call back into Java

- **Status:** fixed
- **Location:** `NativeHelpers.java:65-78, 122-147`; Rust registration `crates/mason-android/src/lib.rs:129-133, 215-262, 441-475`
- **Notes:** `@CriticalNative` on `nativeNodeCompute*` and `@FastNative` on `nativeNodeComputeWithSizeAndLayout`/`nativeNodeLayout` while the implementations call back into Java (measure callbacks, `new_float_array`) violates the fast-native contract. Works on current ART; explicitly unsupported — a runtime update could turn this into a GC deadlock or crash. Also: the `"!"`-prefixed signature selection appears inverted across API levels (`lib.rs:129-133` registers plain for SDK ≥ 26, `"!"` for < 26) — probably intentional (annotations handle ≥ 26) but worth a second look. Action: document, or downgrade to plain JNI.
- **Fixed:** Downgraded all compute/layout entry points that can call Java or allocate Java arrays to plain JNI, including registration of the compute functions through their normal `(JNIEnv, class, ...)` wrappers on API 26+. Android `compileDebugKotlin` passes. A device launch exposed and then fixed the initially missed API 26+ registration mismatch, which otherwise crashed at first layout with `JNI Exception occurred (SIGSEGV)`.

### C3 — Dead `NodeData::measure` clones a `GlobalRef` per call

- **Status:** fixed
- **Location:** `crates/mason-core/src/node.rs:282-343` (clone at `296`)
- **Notes:** No callers (all sites go through `copy_measure()` → `NodeMeasure`), but the `cache.node_clazz.clone()` = NewGlobalRef + DeleteGlobalRef per call would be a real cost if ever wired in. Delete it.
- **Fixed:** Deleted the unused Android `NodeData::measure` implementation. Rust unit and inline-layout tests pass; the full suite retains the unrelated pre-existing `display_contents_text_only_smoke` failure.

---

## Evaluated — no action

- **Cargo release profile** (`Cargo.toml:5-14`): already `opt-level=3`, `lto=true`, `codegen-units=1`, `panic=abort`, `debug-assertions=false`, `strip=true`. Workspace profile covers the git-dep taffy. No free win.
- **JNI measure-call marshalling**: already two packed longs in / one packed long out, cached `JStaticMethodID`, `call_static_method_unchecked`, permanent thread attach. Fixed overhead ≈ 0.5–1.5µs/call (~1ms/window). True batching conflicts with taffy's lazy depth-first probing — not feasible; reduce call volume via P1/P2 instead.
- **Batched style buffers**: TS already writes property bytes directly into a shared direct ByteBuffer; `syncStyle` ships only the 128-bit dirty mask; `jni.style.getBuffer` is memoized per Style. Already good.

---

## Fixed log

_(Chronological record of landed fixes and their current verification state.)_

| Date | Item | Change | Verification/result |
|------|------|--------|---------------|
| 2026-08-03 | P5 | Versioned layout snapshots; skip unchanged apply | Device integration verified; isolated gain not measured |
| 2026-08-03 | P7 | Coalesce native dirty marking until compute | Device integration verified; isolated gain not measured |
| 2026-08-03 | P12 | Single text dispatch at batch end | Android compilation and device integration verified |
| 2026-08-03 | P13 | Four-`Int` Android dirty-mask bridge | Device launch/style sync verified |
| 2026-08-03 | P14 | Size/frame guards around Android measure/layout | Device integration verified; isolated gain not measured |
| 2026-08-03 | P16 | Primitive-index object registry | Device integration verified; isolated gain not measured |
| 2026-08-03 | C1 | Re-entrant per-depth apply scratch | Correctness fix |
| 2026-08-03 | C2 | Plain JNI for callback/allocation entry points | Correctness fix |
| 2026-08-03 | C3 | Remove dead GlobalRef-cloning measure path | Dead-code removal |
| 2026-08-03 | P1 | Cache inline/text leaf probes in `LayoutCache` | Core/HN tests and device integration verified |
| 2026-08-03 | P3 | Lazy resolved-text epoch advancement | Device integration verified; isolated gain not measured |
| 2026-08-03 | P2 | No-op raw-style equality and visual/layout invalidation split | First-sync/background regressions fixed; device visuals verified |
| 2026-08-03 | P4 | StaticLayout fast paths and probe/draw cache separation | Device text rendering verified; isolated gain not measured |
| 2026-08-03 | P6 | Coalesced deferred inherited-text dispatch | Recursive comment rendering verified |
| 2026-08-03 | P8 | Final-size writeback during flat layout apply | Device layout/readback verified |
| 2026-08-03 | P9 | Guarded API 29 MeasuredText/LineBreaker cache | API 35 device text rendering verified |
| 2026-08-03 | P10 | Rust float/scroll/IFC/analysis/style-clone diet | HN volume test passes |
| 2026-08-03 | P11 | Unboxed primitive resolved-style memo | Device style/text rendering verified |
| 2026-08-03 | P15 | Reusable direct JNI layout readback | Device layout/readback verified |
| 2026-08-03 | P17 | LTR desired-width path and reusable segment arrays | Device text rendering verified |
| 2026-08-03 | P18 | Allocation-light measure pre-check | Device MasonPerf text probe verified |
| 2026-08-03 | P19 | Store first pure-text bootstrap result | Core/HN tests and device text rendering verified |
| 2026-08-03 | P20 | Draw metrics scratch and no-float scan cache | Feed/comment drawing verified |
| 2026-08-03 | P21 | Guarded/instrumented zero-height fallback | HN volume test passes |
| 2026-08-03 | P5 regression | Platform-layout epoch gates the apply-skip | Back→relaunch→open-article white screen fixed; 4 cycles verified on-device |
| 2026-08-03 | P7 follow-up | Reordered two hand-set `computeCacheDirty` writes ahead of `dirty()` | Same device run; no behavioural change observed |
| 2026-08-03 | Android lifecycle | Honor root `MeasureSpec` constraints and premeasure a single NativeScript Frame/Page child before Mason compute | 16/16 Back-to-launch cycles rendered the complete styled feed and toolbar in one process; no runtime errors |

## Final verification

- All P1–P21 and C1–C3 entries are `fixed`; there are no pending/deferred items.
- `cargo test -p mason-core --lib`: 38 passed. `cargo test -p mason-core --test hn_comment_measure_volume`: passed.
- The full `cargo test -p mason-core` run passes every suite reached except the documented pre-existing `display_contents_text_only_smoke` assertion; C3 above records that unrelated baseline failure.
- `:masonkit:assembleRelease -Prust.targets=all` and the demo `assembleDebug --rerun-tasks` pass against the exact packaged AAR.
- Android Activity recreation was reproduced deterministically before the fix: the Mason host accepted an `EXACTLY 1080x2400` spec but returned an intrinsic `1080x346`, clipping the correctly measured scroll content. Root measurement now honors `EXACTLY`, caps `AT_MOST`, and premeasures a sole non-Mason child at the platform boundary. Sixteen consecutive Back-to-launch cycles retained the same PID, rendered the full styled feed plus ActionBar title, and produced no `TNS.Native` or `AndroidRuntime` errors.
- The final APK installs and remains alive on-device; feed and recursive-comment styles render, reports #1/#2 emit under `MasonPerf`, and logcat contains no `SIGSEGV`, `TNS.Native`, or `AndroidRuntime` failure.
