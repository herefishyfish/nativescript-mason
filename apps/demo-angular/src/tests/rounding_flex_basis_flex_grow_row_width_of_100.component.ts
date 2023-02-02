import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="rounding_flex_basis_flex_grow_row_width_of_100"></ActionBar>
    <TSCView id="test-root" style="width: 100dip; height: 100dip; flex-direction: row;" testID="test-root" backgroundColor="red">
      <TSCView style="flex-grow: 1;" backgroundColor="green"></TSCView>
      <TSCView style="flex-grow: 1;" backgroundColor="blue"></TSCView>
      <TSCView style="flex-grow: 1;" backgroundColor="yellow"></TSCView>
    </TSCView>
  `,
})
export class RoundingFlexBasisFlexGrowRowWidthOf_100Component {}
