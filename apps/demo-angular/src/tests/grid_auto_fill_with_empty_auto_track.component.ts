import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="grid_auto_fill_with_empty_auto_track"></ActionBar>
    <TSCView id="test-root" style="height: 120dip; width: 120dip; display: grid; grid-template-columns: repeat(auto-fill, 40dip);grid-template-rows: 40dip 40dip 40dip;justify-content: space-evenly;" testID="test-root" backgroundColor="red">
      <TSCView backgroundColor="green"></TSCView>
      <TSCView backgroundColor="blue"></TSCView>
    </TSCView>
  `,
})
export class GridAutoFillWithEmptyAutoTrackComponent {}
