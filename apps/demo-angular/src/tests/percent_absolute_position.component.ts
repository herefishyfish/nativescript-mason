
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="percent_absolute_position"></ActionBar>
  <TSCView id="test-root" style="width: 60dip; height: 50dip; flex-direction: column;" backgroundColor="red">
  <TSCView style="height: 50dip; width: 100%; left: 50%; position: absolute; flex-direction: row;" backgroundColor="green">
    <TSCView style="width: 100%;" backgroundColor="blue"></TSCView>
    <TSCView style="width: 100%;" backgroundColor="yellow"></TSCView>
  </TSCView>
</TSCView>
  `,
})
export class PercentAbsolutePositionComponent {}
