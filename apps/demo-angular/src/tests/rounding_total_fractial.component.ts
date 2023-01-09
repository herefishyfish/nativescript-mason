
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="rounding_total_fractial"></ActionBar>
  <TSCView id="test-root" style="height: 113.4dip; width: 87.4dip; flex-direction: column;" backgroundColor="red">
 <TSCView style="height: 20.3dip; flex-grow:0.7; flex-basis:50.3dip;" backgroundColor="green"></TSCView>
 <TSCView style="height: 10dip; flex-grow:1.6;" backgroundColor="blue"></TSCView>
 <TSCView style="height: 10.7dip; flex-grow:1.1;" backgroundColor="yellow"></TSCView>
</TSCView>
  `,
})
export class RoundingTotalFractialComponent {}
