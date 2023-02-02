import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="grid_placement_definite_in_secondary_axis_with_fully_definite_negative"></ActionBar>
    <TSCView id="test-root" style="height: 120dip; width: 120dip; display: grid; grid-template-columns: 40dip 40dip;grid-template-rows: 40dip 40dip;" testID="test-root" backgroundColor="red">
      <TSCView style="grid-row: 2" backgroundColor="green"></TSCView>
      <TSCView style="grid-row: 2;grid-column: -4;" backgroundColor="blue"></TSCView>
      <TSCView style="grid-row: 1;" backgroundColor="yellow"></TSCView>
    </TSCView>
  `,
})
export class GridPlacementDefiniteInSecondaryAxisWithFullyDefiniteNegativeComponent {}
