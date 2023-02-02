import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="percentage_width_height"></ActionBar>
    <TSCView id="test-root" style="width: 200dip; height: 400dip; flex-direction: row;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 30%; height: 30%;" backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class PercentageWidthHeightComponent {}
