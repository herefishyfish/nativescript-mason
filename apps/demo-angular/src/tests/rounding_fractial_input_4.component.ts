import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="rounding_fractial_input_4"></ActionBar>
    <TSCView id="test-root" style="height: 113.4dip; width: 100dip; flex-direction: column;" testID="test-root" backgroundColor="red">
      <TSCView style="height: 20dip; flex-grow:1; flex-basis:50dip;" backgroundColor="green"></TSCView>
      <TSCView style="height: 10dip; flex-grow:1;" backgroundColor="blue"></TSCView>
      <TSCView style="height: 10dip; flex-grow:1;" backgroundColor="yellow"></TSCView>
    </TSCView>
  `,
})
export class RoundingFractialInput_4Component {}
