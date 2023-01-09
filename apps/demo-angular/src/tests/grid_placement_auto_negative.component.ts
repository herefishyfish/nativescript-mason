
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="grid_placement_auto_negative"></ActionBar>
  <TSCView id="test-root" style="height: 120dip; width: 120dip; display: grid; grid-template-columns: 40dip 40dip;grid-template-rows: 40dip 40dip;" backgroundColor="red">
  <TSCView style="grid-row: 1;grid-column: -5;" backgroundColor="green"></TSCView>
  <TSCView backgroundColor="blue"></TSCView>
  <TSCView style="grid-row: 2" backgroundColor="yellow"></TSCView>
</TSCView>
  `,
})
export class GridPlacementAutoNegativeComponent {}
