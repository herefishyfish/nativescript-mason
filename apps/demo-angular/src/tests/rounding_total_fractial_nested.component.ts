
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="rounding_total_fractial_nested"></ActionBar>
  <TSCView id="test-root" style="height: 113.4dip; width: 87.4dip; flex-direction: column;" backgroundColor="red">
 <TSCView style="height: 20.3dip; flex-grow:0.7; flex-basis:50.3dip; flex-direction: column;" backgroundColor="green">
   <TSCView style="bottom: 13.3dip; height: 9.9dip; flex-grow:1; flex-basis:0.3dip;" backgroundColor="blue"></TSCView>
   <TSCView style="top: 13.3dip; height: 1.1dip; flex-grow:4; flex-basis:0.3dip;" backgroundColor="yellow"></TSCView>
 </TSCView>
 <TSCView style="height: 10dip; flex-grow:1.6;" backgroundColor="purple"></TSCView>
 <TSCView style="height: 10.7dip; flex-grow:1.1;" backgroundColor="cyan"></TSCView>
</TSCView>
  `,
})
export class RoundingTotalFractialNestedComponent {}
