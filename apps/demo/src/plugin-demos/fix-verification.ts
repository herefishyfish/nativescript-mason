import { EventData, Observable, Page, View } from '@nativescript/core';

const TAG = 'FIXCHECK';
const results: string[] = [];
let page: Page;

function log(line: string) {
  console.log(`${TAG} ${line}`);
  results.push(line);
  const label = page?.getViewById('results') as View & { text: string };
  if (label) {
    label.text = results.join('\n');
  }
}

function size(view: View): { w: number; h: number } {
  const s = view.getActualSize();
  return { w: Math.round(s.width * 100) / 100, h: Math.round(s.height * 100) / 100 };
}

function check(name: string, actual: number, expected: number, tolerance = 1.5) {
  const pass = Math.abs(actual - expected) <= tolerance;
  log(`${pass ? 'PASS' : 'FAIL'} ${name}: got ${actual}, want ~${expected}`);
}

// Layout is async; give the tree a beat to settle before measuring.
function afterLayout(view: View, fn: () => void) {
  setTimeout(() => {
    try {
      fn();
    } catch (e) {
      log(`ERROR ${view.id}: ${e}`);
    }
  }, 1200);
}

export function navigatingTo(args: EventData) {
  page = <Page>args.object;
  page.bindingContext = new Observable();
  results.length = 0;
  log('--- start ---');
}

// 1.6 — the plugin must not break text-shadow on a core (non-mason) view.
export function onCoreLabel(args: EventData) {
  const label = args.object as View & { style: any };
  afterLayout(label, () => {
    const shadow = label.style.textShadow;
    // Core's setNative needs a parsed object, not the raw CSS string.
    const parsed = shadow && typeof shadow === 'object' && 'blurRadius' in shadow;
    log(`${parsed ? 'PASS' : 'FAIL'} 1.6 core Label text-shadow parsed: ${JSON.stringify(shadow)}`);
  });
}

// 1.5 — these shorthands used to throw during CSS application.
export function onFlexCrash(args: EventData) {
  const row = args.object as View;
  afterLayout(row, () => {
    const a = size(page.getViewById('fc1') as View);
    const b = size(page.getViewById('fc2') as View);
    const c = size(page.getViewById('fc3') as View);
    log(`1.5 flex shorthand widths: 'flex:1 0 auto'=${a.w} 'flex:1 0'=${b.w} 'flex:initial'=${c.w}`);
    // Reaching here at all means no TypeError was thrown.
    check('1.5 flex:initial keeps its 40 width', c.w, 40);
    check('1.5 the two flexible items split the remaining 260', a.w, 130);
    check('1.5 the two flexible items split the remaining 260', b.w, 130);
  });
}

// F5 — `flex: 1` is `1 1 0%`, so widths are exact thirds regardless of content.
export function onFlexThirds(args: EventData) {
  const row = args.object as View;
  afterLayout(row, () => {
    const w1 = size(page.getViewById('ft1') as View).w;
    const w2 = size(page.getViewById('ft2') as View).w;
    const w3 = size(page.getViewById('ft3') as View).w;
    log(`F5 flex:1 thirds: ${w1} / ${w2} / ${w3}`);
    check('F5 flex:1 first third', w1, 100);
    check('F5 flex:1 second third', w2, 100);
    check('F5 flex:1 third third', w3, 100);
  });
}

// F6 — flex-basis: 50% of 300 must be 150, not 50.
export function onBasisPct(args: EventData) {
  const row = args.object as View;
  afterLayout(row, () => {
    const w = size(page.getViewById('bp1') as View).w;
    check('F6 flex-basis:50% of 300', w, 150);
    // Diagnostic: a mason View placed directly in a core StackLayout has its
    // *native* view stretched to the parent's width, even with `width` set.
    // Mason still lays its children out against the declared width, which is
    // why the coloured bars are right while the grey reference bars are not.
    const container = size(row).w;
    const ref = size(page.getViewById('ref150') as View).w;
    log(`F6 diag: container declared 300 -> native ${container}; ref bar declared 150 -> native ${ref}`);
  });
}

// F6 — max-width: 50% of 300 must be 150, not 50.
export function onMaxPct(args: EventData) {
  const box = args.object as View;
  afterLayout(box, () => {
    const w = size(page.getViewById('mp1') as View).w;
    check('F6 max-width:50% of 300', w, 150);
  });
}

// F6 — gap: 10% of 300 must be 30, not 10.
export function onGapPct(args: EventData) {
  const row = args.object as View;
  afterLayout(row, () => {
    const first = page.getViewById('gp1') as View;
    const second = page.getViewById('gp2') as View;
    const p1 = first.getLocationRelativeTo(row);
    const p2 = second.getLocationRelativeTo(row);
    const gap = Math.round((p2.x - p1.x - size(first).w) * 100) / 100;
    log(`F6 gap positions: first.x=${p1.x} second.x=${p2.x}`);
    check('F6 gap:10% of 300', gap, 30);
  });
}

// 1.4 / F3 — list-items must contribute their height to the container.
// Assert the container is at least the sum of its items rather than a fixed
// number: `height` is not currently honoured on Li (items lay out at natural
// text height), and that is a separate concern from the height-zeroing bug
// this checks. Before the fix the contribution was suppressed entirely.
export function onLiBox(args: EventData) {
  const box = args.object as View;
  afterLayout(box, () => {
    const container = size(page.getViewById('ul') as View).h;
    const a = size(page.getViewById('li1') as View).h;
    const b = size(page.getViewById('li2') as View).h;
    log(`1.4 container=${container} li1=${a} li2=${b}`);
    const pass = a > 0 && b > 0 && container >= (a + b) * 0.95;
    log(`${pass ? 'PASS' : 'FAIL'} 1.4 list-items contribute height (container ${container} >= ${a}+${b})`);
    log('--- done ---');
  });
}
