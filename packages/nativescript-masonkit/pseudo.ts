import { View } from '@nativescript/core';

type PseudoStyleMap = Record<string, Record<string, any>>;

/**
 * Safely extract all pseudo styles for a view without touching live UI.
 * Leverages the internal matching engine to handle hierarchy,
 * specificity sorting, and media queries automatically.
 */
export function compile(view: View): PseudoStyleMap {
  const pseudos: PseudoStyleMap = {};

  const styleScope = view._styleScope;
  if (!styleScope) return pseudos;

  // `matchSelectors` filters out selectors that don't match the view statically.
  // Dynamic parts (like :hover, :active) always return true for `mayMatch`,
  // so they are safely returned here without needing the live UI to be in that state!
  //@ts-ignore
  const match = styleScope.matchSelectors(view);
  if (!match || !match.selectors) return pseudos;

  // Helper to extract pseudo-classes recursively.
  // NativeScript stores them in `PseudoClassSelector` or nested in `ComplexSelector` / `SimpleSelectorSequence`
  const getPseudoClasses = (sel: any): string[] => {
    const classes: string[] = [];
    // Base case: it's a PseudoClassSelector
    if (sel.cssPseudoClass) {
      classes.push(sel.cssPseudoClass);
    }
    // Recursive case: it's a ComplexSelector or SimpleSelectorSequence
    if (Array.isArray(sel.selectors)) {
      for (const s of sel.selectors) {
        classes.push(...getPseudoClasses(s));
      }
    }
    return classes;
  };

  // Note: match.selectors is already sorted by CSS specificity internally!
  // So as we build our `pseudos` object, heavier overrides are correctly applied last.
  for (const selector of match.selectors) {
    // Optimization: skip strictly static selectors (like standard `.btn` or `#myId`)
    if (!selector.dynamic) continue;

    const ruleset = selector.ruleset;
    if (!ruleset || !ruleset.declarations) continue;

    const states = getPseudoClasses(selector);
    if (states.length === 0) continue;

    // Apply declarations for every pseudo-state found on this selector
    for (const state of states) {
      if (!pseudos[state]) {
        pseudos[state] = {};
      }

      for (const decl of ruleset.declarations) {
        pseudos[state][decl.property] = decl.value;
      }
    }
  }

  return pseudos;
}
