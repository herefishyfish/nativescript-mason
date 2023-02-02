import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="percentage_absolute_position"></ActionBar>
    <TSCView id="test-root" style="width: 200dip; height: 100dip; flex-direction: column;" testID="test-root" backgroundColor="red">
      <TSCView style="position: absolute; top: 10%; left: 30%; width: 10dip; height: 10dip;" backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class PercentageAbsolutePositionComponent {}
