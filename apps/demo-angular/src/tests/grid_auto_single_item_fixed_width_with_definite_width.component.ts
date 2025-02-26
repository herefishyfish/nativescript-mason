import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="grid_auto_single_item_fixed_width_with_definite_width"></ActionBar>
    <TSCView id="test-root" style="width: 200dip;display: grid; grid-template-columns: 40dip auto auto;grid-template-rows: 40dip 40dip 40dip" testID="test-root" backgroundColor="red">
      <TSCView backgroundColor="green"></TSCView>
      <TSCView style="width: 100dip" backgroundColor="blue"></TSCView>
      <TSCView backgroundColor="yellow"></TSCView>
      <TSCView backgroundColor="purple"></TSCView>
      <TSCView backgroundColor="cyan"></TSCView>
      <TSCView backgroundColor="gray"></TSCView>
      <TSCView backgroundColor="darkGray"></TSCView>
      <TSCView backgroundColor="lightGray"></TSCView>
      <TSCView backgroundColor="lightBlue"></TSCView>
    </TSCView>
  `,
})
export class GridAutoSingleItemFixedWidthWithDefiniteWidthComponent {}
