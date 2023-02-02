import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="grid_justify_items_sized_center"></ActionBar>
    <TSCView id="test-root" style="height: 120dip; width: 120dip; display: grid; grid-template-columns: 40dip 40dip 40dip;grid-template-rows: 40dip 40dip 40dip;justify-items: center;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 20dip;height: 20dip;grid-row: 1;grid-column: 1;" backgroundColor="green"></TSCView>
      <TSCView style="width: 60dip;height: 60dip;grid-row: 3;grid-column: 3;" backgroundColor="blue"></TSCView>
    </TSCView>
  `,
})
export class GridJustifyItemsSizedCenterComponent {}
