import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="grid_auto_columns_fixed_width"></ActionBar>
    <TSCView id="test-root" style="width: 200dip;height:200dip;display: grid; grid-template-columns: 40dip auto 40dip auto;grid-template-rows: 40dip auto 40dip auto;" testID="test-root" backgroundColor="red">
      <TSCView backgroundColor="green"></TSCView>
      <TSCView backgroundColor="blue"></TSCView>
      <TSCView backgroundColor="yellow"></TSCView>
      <TSCView backgroundColor="purple"></TSCView>
      <TSCView backgroundColor="cyan"></TSCView>
      <TSCView backgroundColor="gray"></TSCView>
      <TSCView backgroundColor="darkGray"></TSCView>
      <TSCView backgroundColor="lightGray"></TSCView>
      <TSCView backgroundColor="lightBlue"></TSCView>
      <TSCView backgroundColor="lightGreen"></TSCView>
      <TSCView backgroundColor="lightRed"></TSCView>
      <TSCView backgroundColor="lightYellow"></TSCView>
      <TSCView backgroundColor="lightPurple"></TSCView>
      <TSCView backgroundColor="lightCyan"></TSCView>
      <TSCView backgroundColor="red"></TSCView>
      <TSCView backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class GridAutoColumnsFixedWidthComponent {}
