# Android Fixes — nativescript-masonkit

Todo list from the Android implementation audit (TS layer, Kotlin native layer, Rust JNI/core, Angular integration, CSS coverage). Every item is verifiable in source; locations use `file:line` against the current working tree.

**Severity legend**

- 🔴 Critical — crash, memory-unsafe, or breaks consuming apps
- 🟠 High — wrong behavior users will hit in normal use
- 🟡 Medium — edge-case bug, latent risk, or notable perf issue
- 🔵 Low — hygiene, dead code, minor inconsistency

**Suggested fix order**: §1 (memory safety + crashes) → §2 (user-visible wrong behavior) → §4 P1–P5 (perf) → §5 quick wins → everything else.

**Verification caveat**: audit was static analysis only — no device/instrumented runs. The prebuilt `platforms/android/masonkit-release.aar` may lag current sources; rebuild after native fixes.

---

## 1. Critical bugs 🔴

### 1.1 Use-after-free: node state buffer dangles when the tree grows ✅ FIXED

- **Location**: `crates/mason-core/src/tree.rs:53`, `crates/mason-core/src/node.rs:518`, `crates/mason-core/src/lib.rs:516-523`, consumer `crates/mason-android/src/node.rs:1582`
- **Fix applied**: `Node.state` is now `Box<[u8; NODE_STATE_BUFFER_SIZE]>` (`crates/mason-core/src/node.rs`), so the pointee address stays stable when the SlotMap reallocates (the Box pointer moves, the 5-byte heap array doesn't). Benefits all platforms (Android ByteBuffer, iOS/Windows via mason-c). Regression test `node_state_buffer_stable_across_tree_growth` in `crates/mason-core/src/lib.rs` — verified to fail on the old inline array and pass on the fix; all previously-green tests still pass.
- **Original notes**: `Node.state: [u8;5]` was stored inline in the `SlotMap<Id, Node>` and `node_state_data_raw_mut` handed `state.as_mut_ptr()` to Java as a direct `ByteBuffer`. The SlotMap starts at capacity 128 (`Mason::new` → `with_capacity(128)`); past that, insertion reallocates and every `Node` moves — Kotlin's cached `stateBuffer` then pointed at freed heap. Style buffers avoided this via the boxed arena (`style/arena.rs`); the state buffer did not.

### 1.2 Use-after-free: stale style ByteBuffers across arena copy-on-write

- **Location**: `crates/mason-core/src/style/arena.rs:716-743` (free/recycle at `:366`), Kotlin cache `packages/nativescript-masonkit/src-native/mason-android/masonkit/src/main/java/org/nativescript/mason/masonkit/Style.kt` (`mValues`/`mWritableValue`, never invalidated)
- **Notes**: `Style::prepare_mut` frees/recycles the old 596-byte buffer on copy-on-write while Kotlin caches the `ByteBuffer` indefinitely — a later Java write can land in a slot since reused by another node. `restore_default` (`arena.rs:276-283`) exists precisely to undo such leaked JS writes, corroborating the hazard.
- **Fix**: never recycle a buffer while a Java mapping exists (refcount in ObjectManager), or version buffers and force Kotlin to re-fetch on generation change.

### 1.3 Panic across FFI on Java-writable bytes; `panic = "abort"` makes it fatal

- **Location**: ~13 decode `unwrap`/`expect` sites in `crates/mason-core/src/style/mod.rs` (`:1361, :1369, :1520, :1533, :1566, :1579-80, :1599, :1612, :1634, :2334, :2352, :2365, :2412`); `unreachable!`/`panic!` in `crates/mason-core/src/style/utils.rs:26-165`; profile in root `Cargo.toml` (`panic = "abort"`, zero `catch_unwind` anywhere)
- **Notes**: the style buffer is a Java-writable `DirectByteBuffer`; `dimension_with_auto`/`dimension` decode unconditionally per `update_from_ffi`. One corrupt byte → panic → process abort.
- **Fix**: fallible decode with safe defaults at the FFI boundary (or `catch_unwind` in every JNI export); keep `panic = "abort"` only after the boundary is panic-free.

### 1.4 `get_style_data_i8_raw` returns the pointer address, not the byte

- **Location**: `crates/mason-core/src/style/utils.rs:601-603`
- **Notes**: `style.as_ptr().add(position) as i8` — missing deref (setter at `:596-598` and non-raw getter at `:591-593` are correct). `Node::is_virtual()/is_mutable()/get_is_virtual()` (`crates/mason-core/src/node.rs:644,649,684`) return garbage (almost always true), so virtual list-item suppression in inline layout (`tree_inline.rs:2018,2411,2468-73,2689,2727-32`) keys off an address low-byte; the IS_VIRTUAL byte Java writes is never honored.
- **Fix**: one-line deref: `*style.as_ptr().add(position)`.

### 1.5 `flex` shorthand throws TypeError on common CSS

- **Location**: `packages/nativescript-masonkit/properties.ts:1211-1213` (+ typo `case 'inital':` at `:1185`)
- **Notes**: `value.length >= 3` tests the raw CSS *string* length and pushes `{ property, value }` (a non-tuple) into the result; core destructures `for (const [p, v] of converter(value))` (`node_modules/@nativescript/core/ui/styling/properties/index.js:1017`) → plain object is not iterable → TypeError during CSS application. `flex: 1 0`, `flex: 1 0 auto`, `flex: initial` all crash. `'inital'` typo separately routes `initial` to the wrong branch (flexGrow = NaN) once the crash is fixed.
- **Fix**: parse the shorthand into tokens, push `[prop, value]` tuples, fix the typo.

### 1.6 `textShadowProperty.overrideHandlers` breaks text-shadow app-wide

- **Location**: `packages/nativescript-masonkit/properties.ts:1274-1290`
- **Notes**: installs an *identity* valueConverter for ALL views plus a `valueChanged` that reverts (`target.textShadow = oldValue`) when no mason `_styleHelper` exists. Core Android's setNative needs the parsed object (`value.blurRadius`, `value.color.android` — `node_modules/@nativescript/core/ui/text-base/index.android.js:394-397`), so on any non-mason text view, `text-shadow` either receives an unparsed string or is reverted. Merely loading the plugin disables text-shadow in the whole app.
- **Fix**: only override parsing for mason views; pass through to core's original converter/setter otherwise.

### 1.7 Consumers' apps crash on launch: `__WINDOWS__` is not defined

- **Location**: references in built output `dist/packages/nativescript-masonkit/**/*.js` (~17× in `style.js`, ~16× in `common.js`); workaround lives only in `apps/demo-angular/webpack.config.js`
- **Notes**: `@nativescript/webpack` defines only `__ANDROID__/__IOS__/__VISIONOS__/__APPLE__` (`node_modules/@nativescript/webpack/dist/configuration/base.js:563-566`). First style write in a consuming app throws `ReferenceError: __WINDOWS__ is not defined`. The plugin also can't ship a `nativescript.webpack.js` hook because the built package is `"type": "module"` (CJS hook parsed as ESM, silently no-ops).
- **Fix**: replace bare `__WINDOWS__` references with a guarded check (e.g. `globalThis.__WINDOWS__` / `typeof __WINDOWS__ !== 'undefined'`) so no DefinePlugin is required.

## 2. High-severity bugs 🟠

### 2.1 Pseudo-class styling (`:hover`/`:active`/`:focus`) is dead end-to-end on Android

- **Location**: TS `packages/nativescript-masonkit/common.ts:547-573`, Rust `crates/mason-core/src/node.rs:710-1069`
- **Notes**: confirmed from both ends. TS pseudo buffers populate only via core's `PseudoClassHandler`, which never fires 'highlighted'/'focus' for mason views (only core Button drives it natively). Rust `Node::compute_style` — the code that would merge pseudo styles into layout — is dead code with no callers, and its hardcoded byte-range copies read garbage type bytes anyway (see 1.4). Only `:disabled` works (via core `isEnabled`). `pseudo.ts` also never invalidates on stylesheet change.
- **Fix**: wire a pseudo-state trigger (native state-change → TS buffer population or a Rust-side merge call), revive/replace `compute_style`, invalidate selector matches on stylesheet updates.

### 2.2 Event listener unregistration condition inverted (listener leak)

- **Location**: `packages/nativescript-masonkit/common.ts:445-450` (iOS twin at `:453-458`; Windows at `:461` is correct)
- **Notes**: Android branch is `if (!id) { removeEventListener(arg, id) … }` — calls remove only when the id is *absent* (passing `undefined`). Native listeners are never removed → leaks and duplicate callbacks across re-registrations.
- **Fix**: `if (id) { … }`.

### 2.3 `Input`/`TextArea` emit no events — no `ngModel`, no forms on Android

- **Location**: `packages/nativescript-masonkit/input/index.android.ts` (no `notify`/event code), `input/common.ts` (`value` is a plain accessor, not a `{N} Property`); no `ControlValueAccessor` in `packages/nativescript-masonkit/angular/`
- **Notes**: `[(ngModel)]`, `(input)`, `(change)` are all dead; only one-way `[value]` works.
- **Fix**: raise `input`/`change` events from native text watchers; add a `ControlValueAccessor` to the angular package.

### 2.4 Inset `auto` reset never syncs to native

- **Location**: `packages/nativescript-masonkit/style.ts:2133-2139, 2176-2181, 2218-2223, 2260-2265`
- **Notes**: each inset setter's `'auto'` branch writes the buffer then returns *before* `commitState(StateKeys.INSET)` → no `syncStyle()` → native keeps the old offset. Any `left/top/right/bottom → auto` transition is silently dropped.
- **Fix**: commit before returning in the auto branches.

### 2.5 `textWrap` string path inverts the native enum

- **Location**: `packages/nativescript-masonkit/style.ts:1470-1486`; enum `masonkit/.../Styles.kt:115-119` (Wrap=0, NoWrap=1, Balance=2)
- **Notes**: the string path maps nowrap→0 / wrap→1 — the opposite of the native enum — so `white-space: nowrap` on a plain mason view wraps. The TextBase path (`common.ts:2367-2387`, compiled numerics) is correct; the two entry paths disagree.
- **Fix**: swap the mapping in the string path.

### 2.6 Removed children stay in the native tree (TS + Kotlin mirror bug)

- **Location**: TS stub `packages/nativescript-masonkit/text/index.android.ts:170-175` ("todo: remove from native view", never calls super; duplicate `Br` at `:217-221`); Kotlin `masonkit/.../View.kt:48,539-572`
- **Notes**: TS: spans removed from a `Text` remain in the native visual tree and keep rendering; `Text`/`Button._addViewToNativeVisualTree` always return false → re-setup can trigger duplicate native adds. Kotlin: `View.nodes` is **never populated** (no `put` anywhere) so `removeViewFromMasonTree` is a permanent no-op and `removeViews(InLayout)`/`removeAllViewsInLayout` detach Android views but never Rust children — the "stale slots / ghost backgrounds" bug their own comment warns about (`View.kt:492-493`).
- **Fix**: implement real removal on both sides (call through to native detach + Rust `remove_child`); populate or delete `View.nodes`.

### 2.7 Angular: removed text nodes leave stale native runs; text change re-syncs all siblings

- **Location**: `packages/nativescript-masonkit/angular/src/mason-meta.ts:81` (no `removeInvisibleNode`), `packages/nativescript-masonkit/common.ts:1102-1137, 1200-1236`
- **Notes**: (a) `ViewUtil.removeChild` routes `TextNode` to `removeInvisibleNode`, whose default only unregisters the change callback → the plugin's real removal path (`common.ts:844-857`) is unreachable; `@if`-toggled interpolated text stays on screen. (b) Any single `{{ }}` update sets `parent.text`, which walks ALL text children calling `setData` + `replaceChildAt` per node — O(siblings) native calls per keystroke. (c) The sibling index includes `CommentNode` anchors that `_children` never contains → wrong-slot overwrite risk when anchors interleave text.
- **Fix**: implement `insertInvisibleNode`/`removeInvisibleNode` in `masonMeta`; diff text runs instead of re-syncing all; map indices through `_nativeIndexFor`.

---

## 3. Medium / low bugs 🟡🔵

### 3.1 `overflow` shorthand reads wrong regex slots 🟡

- **Location**: `packages/nativescript-masonkit/properties.ts:163-197`
- **Notes**: `String.match` returns `[full, g1, g2?]`; the converter uses `values[0]` (full match) as x and `values[1]` as y, and `length === 1` is never true. `overflow: hidden scroll` → overflowY='hidden', overflowX='hidden scroll' (fails conversion → undefined). Single-value works only by accident (full match equals group1).

### 3.2 `overflow: auto` rejected by the TS converter despite native support 🟡

- **Location**: `packages/nativescript-masonkit/properties.ts:138-161` (converter) vs regex at `:163` and native enum `masonkit/.../enums/Overflow.kt:4` (Auto=4), `style.ts:3587-3654`
- **Notes**: shorthand regex admits `auto` but `overflowConverter` rejects it → `overflow-x/y: auto` reverts to the old value. Core maps auto→Scroll. Also getter inconsistency: `overflowX` getter lacks the `clip`/`auto` cases `overflowY` has (`style.ts:3612-3621` vs `3632-3644`).

### 3.3 `img` `~/` resource path joins without separator 🟡

- **Location**: `packages/nativescript-masonkit/img/index.android.ts:46-47`
- **Notes**: `value.replace('~/', knownFolders.currentApp().path)` → `…/appimg.png` — every `src="~/…"` image fails to resolve on Android.

### 3.4 `input multipleProperty.setNative` corrupts input type 🟡

- **Location**: `packages/nativescript-masonkit/input/index.android.ts:53-59`
- **Notes**: `this._type = value` assigns the *boolean* `multiple` flag over the type string → `getType()` falls through to `Type.Text`; email/number inputs silently become text inputs.

### 3.5 `getViewStyle` unguarded WeakRef deref 🟡

- **Location**: `packages/nativescript-masonkit/properties.ts:8-11`
- **Notes**: `view.get()` may return undefined during teardown → `ret._styleHelper` throws. Core's own accessors guard (`node_modules/@nativescript/core/ui/styling/properties/index.js:1011-1015`). Late CSS writes (animations, stylesheet reload during navigation) can crash.

### 3.6 Grid `justify-content` ignored; `align_content` enum order disagreement 🟡

- **Location**: `crates/mason-core/src/style/style_guard.rs:313-320` (uses `align_content` for the inline axis; `Style`'s own impl at `style/mod.rs:3166-3171` correctly uses `justify_content`; tree goes through `StyleGuard` at `tree.rs:1780`); enum mismatch `crates/mason-core/src/utils/mod.rs:92-104` vs `:77-90`
- **Notes**: two separate bugs. (a) grid justify-content never applied. (b) `align_content_to_enum`/`from_enum` disagree on `SpaceAround`/`SpaceEvenly` ordering — round-trip through the buffer corrupts those values if Kotlin uses the documented order (verify Kotlin constant order when fixing).

### 3.7 JNI critical-native registration inverted for API < 26; errors swallowed 🟡

- **Location**: `crates/mason-android/src/lib.rs:129-153, 311-405` (registration), `let _ =` at `:164, :419, :524`
- **Notes**: `"!"` critical-native signatures are used on the `< ANDROID_O` branch for functions that take `JNIEnv` — looks backwards (critical natives belong on ≥ 26). Registration errors are discarded. On API 21–25 (minSdk 21) these either silently fail to register or crash on call. Verify on an API 24/25 emulator.

### 3.8 Java exceptions never checked on JVM upcalls 🟡

- **Location**: `call_static_method_unchecked` at `crates/mason-android/src/node.rs:149-160, 297-320, 68-79`, `style.rs:378,435`, `node.rs:1588,1656,1740`, `lib.rs:662`
- **Notes**: per jni 0.21 these don't detect pending exceptions. A throwing Kotlin `measure` leaves a pending exception → ART fatals on the next JNI call.
- **Fix**: check `env.exception_check()` after upcalls (or use the checked variants) and fail gracefully.

### 3.9 `ObjectManager` leaks ids by design 🟡

- **Location**: `masonkit/.../ObjectManager.kt:13-23`, `MeasureFunc.kt:28-34`, no `object_manager_remove` call anywhere in `crates/mason-android`
- **Notes**: (a) `MeasureFuncImpl` registers itself *strongly* and relies on `finalize()` to remove its id — the strong map reference means it's never GC'd, so `finalize()` never runs; every measure-func node lives forever. (b) Rust-registered style/pseudo/state buffer ids are never removed; node churn grows the map unboundedly (slow-burn). Corroborated by demo-angular's global handler swallowing `FinalizerWatchdogDaemon` timeouts (`apps/demo-angular/src/main.ts:26-38`).
- **Fix**: weak registration or explicit removal on node destroy; delete the finalize-based cleanup.

### 3.10 GC drain thread can never exit; `Mason.finalize()` 🟡/🔵

- **Location**: `masonkit/.../GC.kt:27` (blocking `ReferenceQueue.remove()`), `GC.kt:128-131` (`shutdown()` doesn't interrupt), `Mason.kt:472-479` (deprecated `@Synchronized finalize()`)
- **Notes**: one parked thread per Mason instance pre-API-33; no caller of `shutdown()` found. Secondary `Mason()` instances depend on finalizer-thread timing for native destruction.
- **Fix**: poll with timeout + flag, or use Cleaner unconditionally; replace finalizer with explicit `close()`.

### 3.11 `ListView.onMeasure` padding bug 🟡

- **Location**: `masonkit/.../ListView.kt:150-164`
- **Notes**: `val pr = paddingLeft` reads the view's *own* paddingLeft where the sibling branch uses `node.computedPaddingRight`; recycler child measured with `(width - pr) - pl` where `width` = `View.getWidth()` (0 before first layout). Wrong inner measurement with asymmetric padding and on first pass.

### 3.12 Per-node `set_computed_size` JNI callbacks fired under the tree write lock 🟡

- **Location**: `crates/mason-core/src/tree_inline.rs:1395,1509,1718,1791,1893,1989,2161,2594,2846`
- **Notes**: parking_lot locks are non-reentrant; a callback re-entering the tree deadlocks (Kotlin already works around a related deadlock at `Style.kt:955`). Latent deadlock for any future re-entrant callback.
- **Fix**: collect writebacks and dispatch after releasing the lock (the same pattern as `copy_measure` at `tree.rs:43-51`).

### 3.13 `inCompute` unsynchronized; placeholder-buffer reads during compute 🟡

- **Location**: `masonkit/.../Mason.kt:38-39` (plain `Boolean`), `Style.kt:897-942, 991-994` (`mPlaceholder`)
- **Notes**: correct only because all layout is UI-thread today — any future background compute has no mutual exclusion. Worse, reading style values during compute returns fabricated defaults (14/4/7 font metrics, `Display.Block`, REF_COUNT=1) — a silent-wrong-answer design.
- **Fix**: document/enforce UI-thread confinement; make reads during compute fail loudly or block.

### 3.14 Lazy `_view` creation is context-unsafe and never disposed 🟡

- **Location**: `packages/nativescript-masonkit/view/index.android.ts:16-24`
- **Notes**: native view created with `getCurrentActivity() || getApplicationContext()` — created before an activity exists → holds application context (theming/window-token issues). `[native_]` symbol never cleared, no `disposeNativeView` → detached views can leak / stale views re-attached after activity recreation.

### 3.15 `_setGridAutoRows/Columns` read the wrong variable 🟡

- **Location**: `packages/nativescript-masonkit/utils/index.android.ts:750-804`
- **Notes**: both parse into `values` but loop over `value[i]`/`value.length` (the raw string) → garbage MinMax entries. Dormant because grid setters use `NodeHelper.getShared()` directly (`style.ts:3163-3576`) — but any caller of these helpers gets corrupt tracks. Related dead/broken TS grid parser: `_parseGridTemplates` (`utils/index.android.ts:653-724`, `minmax()` returns undefined, expects non-standard `repeat-fill`) — imported but never called in `style.ts:4`; dangerous if revived.

### 3.16 `line-height` unit heuristic misclassifies values 🟡

- **Location**: `packages/nativescript-masonkit/style.ts:3740`
- **Notes**: `value >= 4 ? px : multiplier` treats `line-height: 3px` as 3× and unitless `4` as 4px. CSS says unitless is always a multiplier. Documented hack, wrong at the boundaries. Needs real unit parsing.

### 3.17 `DISPLAY.and(DISPLAY_MODE)` zero-mask commit 🔵

- **Location**: `packages/nativescript-masonkit/style.ts:1573`; twin in Kotlin `Style.kt:2156`
- **Notes**: AND-ing two distinct bit flags yields `0n` → commit is a no-op. Currently benign (granular consumers don't check DISPLAY bits) but any future consumer keyed on those bits never fires.

### 3.18 Small TS converter bugs 🔵

- `properties.ts:636` — `insetProperty` getter fallback returns *padding* values (copy-paste).
- `properties.ts:1154` — `flexFlow` uses string-length `value.length >= 2` → `flex-flow: row` pushes `flexWrap: undefined`.
- `properties.ts:138-161` — numeric overflow map (1→clip, 2→hidden) inconsistent with buffer map {hidden:1, scroll:2, clip:3} (numeric→CSS round-trips only).
- `input/common.ts:25-32` — `value` getter uses `!== undefined || !== null` (always true) and tests the function object instead of calling it; benign only because `defaultValue()` returns `''`.

### 3.19 Test rot 🟡

- **Writeback detector**: `app/src/androidTest/.../WritebackDetectorInstrumentedTest.kt:22-42` implements the old `measure(Size, Size)` signature; interface is now `measure(Float, Float, Float, Float): Long` (`MeasureFunc.kt:12-16`) → doesn't compile. This detector guards a *live* mechanism (Rust calls back `Node.setComputedSize` during compute, `Node.kt:698-706`) — repair, don't delete.
- **Rust WPT suite**: `cargo test -p mason-core --lib` 15/15 ✅; integration files: 28 pass, **1 fails** (`wpt_css_display_batch1::display_contents_text_only_smoke`), **2 fail to compile** (`wpt_css_align_batch1` uses nonexistent `taffy::Overflow::Auto`; `wpt_css_display_flow_root_batch1` E0308 at `:70`).

### 3.20 Small Rust correctness items 🔵

- `nativeIsChildrenSame` inverted early return — returns TRUE when counts differ (`crates/mason-android/src/node.rs:907-909`); no Kotlin caller, latent.
- `NativeNodeGetFloatRectWithIds` returns an int array in its null-guard vs declared `(JJ)[J` (`node.rs:363-365`).
- Panic on stale ids reachable from Java jlongs: `unwrap`s at `crates/mason-core/src/tree.rs:1250,1268,1357,1372,1404`, `node_from_id` panic `:243`, `mark_dirty_inner` indexes `tree.nodes[id]` `:1452` — ids go stale because GC-thread `NodeRef::drop` removes nodes (`node.rs:1129-1167`).
- `insert_before`/`insert_after` guard compares against `reference` instead of `node` (`tree.rs:1349,1393` — dead checks); the two differ on missing-reference behavior (silent no-op vs append).

### 3.21 Angular component-host lifecycle items 🔵

- `angular/src/component-host.ts:125` — `elementsCreated` never resets: a second in-process bootstrap (HMR) won't get `rootAsPassthrough` → root loses `AppHostView` full-screen wrapping.
- `component-host.ts:167-185` — `applyClassicParentFill` applies once per host (WeakSet); a host re-parented from classic into mason keeps forced `100%×100%`.
- `component-host.ts:279-286` — `applyOptions` appends duplicate passthrough matchers on repeated calls; stale doc reference to nonexistent `MasonKitModule.forRoot()` at `:107`.
- `element-registry.ts:64` — comment claims `/web` exports `Ol` (it doesn't; behavior fine, comment wrong).
- `angular/package.json` — `"sideEffects": true` defeats tree-shaking; all behavior is call-driven, `false` is safe.

### 3.22 Hygiene 🔵

- `src-native/mason-android/jstack.txt` — empty 0-byte checked-in file (leftover from a deadlock investigation).
- `Log.d` on hot event paths (`Mason.kt:157,172,190`) per listener registration/dispatch.
- Large commented-out blocks: `Element.kt:609-750`, `Button.kt:100-112`, `View.kt:291-297`.
- Duplicate class registrations: `web.ts @CSSType('ul') Ul` vs `list/index.android.ts @CSSType('ul') UnorderedList`; unused second `Br` at `text/index.android.ts:178-222` whose constructor calls `Tree.instance.createBr()` with no context.
- Dead stubs: `_inBatch` declared on every view class, never read; `_forceStyleUpdate` no-op on all platforms (`utils/index.android.ts:264-274`) making public `forceStyleUpdate()` (`common.ts:575-577`) a stub.
- `MasonNodeView.order`/`childNodeCount` mix `Int?` with `0f` default → inferred `Any` (`Layout.kt:219,223`).

---

## 4. Performance gaps 🟡

### P1. Text measure path: `setText()` inside every Rust measure callback + StaticLayout rebuild churn — **biggest win**

- **Location**: `masonkit/.../TextEngine.kt:305-312, 421-446, 541-576`; cache cleared via `TextView.kt:234-239`
- **Notes**: `setText()` on the platform TextView runs the full widget text pipeline (watchers, `checkForRelayout`, `requestLayout`/`invalidate`) inside the JNI measure callback, possibly several times per compute per text node. Taffy probes measure funcs multiple times per compute (min-content `-1f`, max-content `-2f`, definite) → one text node builds 2+ `StaticLayout`s per compute with no cache keyed on (text version, constraint width). Secondary: segment push allocates `InlineSegment` objects then *also* packs primitive arrays (`TextEngine.kt:904-1118`), allocates `TextPaint(textPaint)` per run (line 1046, contradicting its own comment), leftover `System.nanoTime()` instrumentation.
- **Fix**: remove per-measure `setText`; cache `StaticLayout` by (text version, constraint width); drop object allocation in the packed path.

### P2. Per-compute `float[]` layout readback over JNI

- **Location**: `masonkit/.../Element.kt:221-230`, `NativeHelpers.java:122-126`; Rust side allocates a fresh `Vec<f32>` per readback (`crates/mason-android/src/lib.rs:611-615`)
- **Notes**: 22 floats/node allocated in native and copied across JNI on every cache-missing root compute. The zero-copy style-buffer pattern (direct ByteBuffer) should be reused here; Kotlin-side parse into reused arrays is already allocation-free.

### P3. `applyLayoutFlat` allocates a filtered child list per node per pass

- **Location**: `masonkit/.../Element.kt:965` (`node.children.filter { it.nativePtr != 0L }`), contradicting the zero-allocation comment at `:752`
- **Notes**: runs for every node with children on every layout pass. Pre-filter on mutation or iterate with a skip check.

### P4. ~40 CSS-string setters bypass the microtask batch; grid slow path ships 96 args + 13 Strings

- **Location**: TS `packages/nativescript-masonkit/style.ts:3920-4670` (grid `:3147-3576`), `common.ts:1452-1497`; Kotlin `Style.kt:4126-4247` → `nativeNonBufferData`/`nativeUpdateWithValues` (`:5226-5242, 5306-5404`, no `@FastNative`); `isSlowDirty` immediate flush at `Style.kt:1010-1016`
- **Notes**: buffer-backed setters batch into one `syncStyle()` per microtask; these string setters each cost a JNI round-trip + full `updateNativeStyle` per property per view. The grid path also re-transmits ~60 scalars already in the shared buffer (dirty-mask could gate), and each `JString` is re-parsed by cssparser in Rust (`crates/mason-android/src/style.rs:236-251`). `NodeHelper.getShared()` is re-invoked per call instead of cached (`NodeHelper.kt:26-29`).
- **Fix**: route string setters through the microtask batch; gate the slow path on grid-only dirt; cache the shared helper reference.

### P5. Border drawing: `saveLayer` + CLEAR every frame, per-draw allocations

- **Location**: `masonkit/.../Border.kt:902-920` (saveLayer+CLEAR ring punch), `:904,909` (Paint×2), `:1286,1340` (Path×2), `:1209-1242,1372-1375` (RectF/Path per side)
- **Notes**: the *most common decorated-element path* allocates an offscreen buffer per bordered view per frame. Replace with a single even-odd `Path` fill. Related: outset shadows force the legacy RenderScript bitmap path even on API 31+ (`ViewUtils.kt:42,64` → `BoxShadowRenderer.kt:206-210`; RenderScript created/destroyed per call at `BoxShadowRenderer.kt:122`, `CSSFilters.kt:177,243`).

### P6. Full-tree re-layout; no scroll virtualization; per-item Rust computes in lists

- **Location**: `masonkit/.../Element.kt:903-955` (re-measure + re-position every view on any invalidation), `Li.kt:140-165,188` (each item is its own Rust layout root), `ListView.kt:308-317` (`reload()` always `notifyDataSetChanged()`)
- **Notes**: architectural ceiling. `Scroll` lays out every descendant regardless of viewport — long scrolls pay full-tree cost on any change; `ListView` recycles but pays N Rust computes per scroll pass. Reasonable design (compute cache is load-bearing), but dirty-rect/viewport culling is the future win.

### P7. Rust-side hot paths

- **Lock churn**: per-call RwLock traffic during taffy layout (`crates/mason-core/src/tree.rs:254,249,1723-37,1691`).
- **O(n²) inline layout**: `update_available_for_current_line` + `current_y_offset` rescan per segment (`tree_inline.rs:445-473,501-546`); per-compute O(n) passes (`collect_floats :306-351`, sanitize `:858-868`, `fix_scroll_container_sizes` clones `children` per node `:906-1022`, `final_layout` copy `:882-886`); zero-height fallback re-layouts `:1924-1932`.
- **Buffer ids not persisted** → repeated `DirectByteBuffer` + ObjectManager allocation on re-call (`crates/mason-android/src/style.rs:347-456`, `node.rs:1556-1609`; `state_buffer` field never written).
- **Per-segment object API is wired** while the packed-segments API exists (`crates/mason-android/src/node.rs:1129-1239` vs packed at `:1264`).

### P8. Per-frame costs in custom rendering

- `background-image: url()` starts a new Glide `CustomTarget` request on *every draw frame* until the bitmap lands (`Background.kt:177-195`) — also causes the blank-flash.
- Z-order drawing O(n²)/frame: `getChildDrawingOrder` → `indexOfChild` per child, always enabled (`View.kt:73,116-119`); touch dispatch also probes z-sorted children linearly (`View.kt:122-148`).
- `ViewSpan.draw` measures/lays out the child view during `StaticLayout.draw` (`TextEngine.kt:1367-1396`); `TextView.onDraw` can lazily build StaticLayout then `post { layout(...) }` to grow itself and ancestors (`TextView.kt:135-194`) — draw-driven layout is a classic jank/loop source.
- `BackdropHelper` re-records the entire root hierarchy into a RenderNode every frame while any backdrop-filter is active (`BackdropHelper.kt:60-63`) — heaviest per-frame feature, by design.
- List-marker `Paint` copy + marker `String` alloc per `<li>` marker per `dispatchDraw` (`View.kt:210,258`).

### P9. TS-layer perf

- `pseudo.ts:10-65` — `compile()` runs `styleScope.matchSelectors(view)` (private API behind `@ts-ignore`) on *every* pseudo state change for *every* view; results never invalidated on stylesheet change.
- `common.ts:1153-1244` — `textProperty.setNative` re-detects framework, dedups via Set, walks all childNodes on every text assignment; O(children) per change (see 2.7).
- `style.ts` syncStyle signed-decimal string encoding — state sent as decimal strings, parsed natively with `parseUnsignedLong`/BigInteger fallback (`Element.kt:44`); minor per-sync cost, deliberate for 64-bit safety.
- `TextEngine.kt:81-87` — `textContent` getter is O(n²) (`+=` over children); `processText` compiles `Regex(...)` per call (`TextNode.kt:324,358`).

---

## 5. CSS feature gaps

### 5A. Quick wins — native support exists, only the binding/converter is missing or broken

- [ ] **Register `object-fit` TS property** — full Kotlin impl (`Img.kt:183`, `Style.kt:1174-1185`, buffer `OBJECT_FIT=276`); no `objectFitProperty` in `properties.ts`; today reachable only via HTML attr (`HTMLParser.kt:670-674`). One-liner-class fix.
- [ ] **Register `direction` TS/CSS property** — buffer `DIRECTION=2` → `androidView.layoutDirection` (`Style.kt:4090-4098`) + taffy wiring done; only native `NodeHelper.setDirection` (`NodeHelper.kt:103-107`) and HTML attr entry points exist.
- [ ] **`overflow: auto`** — fix `overflowConverter` to accept it (see 3.2); native fully supports it.
- [ ] **Accept standard `flex-wrap: nowrap`** — TS only maps non-standard `'no-wrap'` (`style.ts:1650-1668`); `flexWrapProperty.overrideHandlers` passes values unconverted (`properties.ts:275-293`) → spec-compliant `nowrap` silently dropped.
- [ ] **`aspect-ratio: 16/9` ratio syntax** — no valueConverter (`properties.ts:954-964`); setter does raw `setFloat32(value)` (`style.ts:2764-2767`) → `'16/9'` → NaN. Only plain numbers work.
- [ ] **Parse `text-decoration` style/color/thickness into buffer keys** — Kotlin render path exists (`TextDefaultAttributes.kt:23-29`, `Style.kt:2025-2050`) but the CSS string keeps only the line keyword (`NodeHelper.kt:1433-1444`); today style tokens only work via HTML attrs. `wavy` and underline-offset need render work after.
- [ ] **`skew()` transform branch** — parsed into ops (`Style.kt:1350-1358`) but `applyTransformToView`'s compose loop has no skew branch (`Style.kt:1558-1572`); silently dropped (or approximated as rotate+scale on the >8-op flatten path — wrong).
- [ ] **`transform-origin`** — no property parsed; hardcoded to view center (`Style.kt:1541-1543,1574-1576`).
- [ ] **`%` in `translate()`** — parsed but `%` stripped and applied as raw px (`Style.kt:1491-1499`); silently mis-renders.
- [ ] **Wire `white-space`, `text-indent`, `font-variant-numeric`, `text-justify` TS setters** — buffer keys exist (`style.ts:148,194-195` etc.), Kotlin consumers exist for white-space platform-side (`Style.kt:1919-1929`); no TS properties.
- [ ] **Activate `hyphens`** — stored (`HYPHENS=575`, `style.ts:4940-4974`, `Style.kt:492-493`) but no `Hyphenator` call in `TextEngine.kt`; flagged layout-affecting at `TextEngine.kt:260`.
- [ ] **`line-height` real units** — replace the `<4 multiplier / ≥4 px` heuristic (see 3.16); support `%`/`em`.
- [ ] **`text-overflow: ellipsis` / `line-clamp` on Android** — buffer round-trips, no consumer (`TextEngine.kt:256`); iOS has both.
- [ ] **`word-break` / `overflow-wrap`** — not implemented on Android.
- [ ] **`gap: normal` keyword** — `CoreLength.parse('normal')` fails (`style.ts:2663-2685`).
- [ ] **`border-radius` elliptical shorthand** — TS parser drops the `/ <vertical>` part (`style.ts:600-615`); elliptical only reachable via native string setter.
- [ ] **Register `background-origin`** — only `backgroundClipProperty` exists (`properties.ts:133-136`).
- [ ] **Resolve `vertical-align` cssName collision** — both mason `verticalAlignProperty` and NS-core `verticalAlignmentProperty` register cssName `vertical-align` (`properties.ts:1233-1272`).
- [ ] **Exotic `list-style-type` (roman/alpha/greek…) + `list-style-image` on Android** — only 5-value `NodeHelper.setListStyleType` (`NodeHelper.kt:1456-1470`); iOS has both.

### 5B. Structural — need engine work (future roadmap)

- [ ] **Transitions / animations** — no CSS animation driver on any platform. (NS-core keyframe animations still work on mason views for NS props like opacity/translate since `ViewBase extends CustomLayoutView`, `common.ts:268` — but nothing animates mason's CSS/buffer props.)
- [ ] **`calc()` / `min()` / `max()` / `clamp()`** — `resolve_calc_value` hard-stubbed to `0.0` (`crates/mason-core/src/tree.rs:1687-1689`); `style/utils.rs:89` "todo handle calc". Live landmine: any calc() silently becomes 0.
- [ ] **CSS custom properties / `var()`** — zero implementation in Rust or TS.
- [ ] **Relative units** — no `em/rem/vw/vh/vmin/vmax/ch/ex` anywhere; no container-query units (`cqw`); no container queries.
- [ ] **`position: fixed` / `sticky`** — unrepresentable in the taffy fork's 2-value `Position` enum (`crates/mason-core/src/utils/mod.rs:276-282`); inset IS wired.
- [ ] **Grid: `subgrid` / `masonry` / `place-*` shorthands** — `GridTemplateComponent` only `Single|Repeat`; no place-items/self/content anywhere.
- [ ] **Flexbox: `order` (missing at every layer — no StyleKeys byte, no TS property, no Kotlin var) and `flex-basis: content`** (taffy `FlexBasis` has no content variant).
- [ ] **`display: contents`** — unrepresentable (taffy fork enum has 4 variants).
- [ ] **Core inline engine ignores `white-space`** — zero consumption in mason-core (only platform-side text layout honors it); no word-boundary line breaking — runs split at arbitrary width (`tree_inline.rs:507-546`); `text-wrap: balance/pretty` accepted but no balancer.
- [ ] **RTL in the custom inline-formatting context** — `direction` reaches taffy via `StyleGuard` but the custom IFC ignores it (`tree_inline.rs`); scrollbar-side TODO at `:1596`.
- [ ] **Pseudo-elements `::before`/`::after`/`content`/CSS counters** — universal absence; `pseudo.ts` only resolves pseudo-classes.
- [ ] **`::first-line` / `::first-letter` / `::marker` styling.**
- [ ] **`mix-blend-mode` / `clip-path` / `outline`** — not registered in TS at all.
- [ ] **`conic-gradient` on Android** — no SweepGradient code; color hints / double-position stops also unhandled (`style.ts:527-560`).
- [ ] **Standalone mason `opacity`** — no buffer property; NS-core `opacityProperty` covers the basic case via `View.alpha` but bypasses pseudo/buffer state (no `:hover { opacity }`).
- [ ] **Selector/cascade limits inherited from NS core** — no `:nth-child`/structural pseudo-classes, no `!important`, `@supports` parses but unevaluated.
- [ ] **3D transforms** — stored as 4×4 + IS_3D but applied as 2D only (`Style.kt:1415-1426,1525-1545`).
- [ ] **Variable fonts / `font-feature-settings`** — Android has variant-numeric path only.
- [ ] **z-index stacking contexts** — Android now sorts draw+touch per sibling (✅ basic), but no stacking-context model and no Rust accessor; iOS/Windows still gaps.
- [ ] **Floats are approximate** — narrow inline lines only; block children ignore them.

---

## 6. Verification checklist (run after fixes land)

- [ ] `cargo check -p mason-core && cargo test -p mason-core` — all green incl. currently-failing/non-compiling WPT files (see 3.19).
- [ ] Gradle build of `src-native/mason-android` incl. androidTest compile (WritebackDetector repair, 3.19).
- [ ] Rebuild `platforms/android/masonkit-release.aar` from current sources.
- [ ] Device/emulator pass on `apps/demo` + `apps/demo-angular`: text-heavy screen (P1), grid demo (P4), border/shadow-heavy screen (P5), long Scroll vs ListView (P6), RTL screen, image `src="~/…"` (3.3), `flex: 1 0 auto` CSS (1.5), `text-shadow` on a *core* Label (1.6).
- [ ] Consume the packed plugin from a *fresh* {N} app without webpack edits — verifies 1.7/1.8.
- [ ] API 24/25 emulator smoke test — verifies 3.7.
- [ ] Tree growth past 1000 nodes under ASan/valgrind-equivalent (or stress + buffer canary) — verifies 1.1/1.2.
