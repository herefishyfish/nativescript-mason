
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="rounding_fractial_input_2"></ActionBar>
  <TSCView id="test-root" style="height: 113.6dip; width: 100dip; flex-direction: column;" backgroundColor="red">
  <TSCView style="height: 20dip; flex-grow:1; flex-basis:50dip;" backgroundColor="green"></TSCView>
  <TSCView style="height: 10dip; flex-grow:1;" backgroundColor="blue"></TSCView>
  <TSCView style="height: 10dip; flex-grow:1;" backgroundColor="yellow"></TSCView>
</TSCView>
  `,
})
export class RoundingFractialInput_2Component {}
