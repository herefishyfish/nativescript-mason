import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="grid_margins_fixed_center"></ActionBar>
    <TSCView id="test-root" style="display: grid; grid-template-columns: 40dip 40dip 40dip;grid-template-rows: 40dip 40dip 40dip;padding: 10dip 20dip 30dip 40dip" testID="test-root" backgroundColor="red">
      <TSCView style="height:20dip;width:20dip;margin: 2dip 4dip 6dip 8dip;align-self:center;justify-self:center;" backgroundColor="green"></TSCView>
      <TSCView backgroundColor="blue"></TSCView>
      <TSCView backgroundColor="yellow"></TSCView>
      <TSCView backgroundColor="purple"></TSCView>
      <TSCView backgroundColor="cyan"></TSCView>
      <TSCView backgroundColor="gray"></TSCView>
    </TSCView>
  `,
})
export class GridMarginsFixedCenterComponent {}
