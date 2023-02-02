import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="flex_shrink_to_zero"></ActionBar>
    <TSCView id="test-root" style="width: 75dip;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 50dip; height: 50dip; flex-shrink: 0;" backgroundColor="green"></TSCView>
      <TSCView style="width: 50dip; height: 50dip; flex-shrink: 1;" backgroundColor="blue"></TSCView>
      <TSCView style="width: 50dip; height: 50dip; flex-shrink: 0;" backgroundColor="yellow"></TSCView>
    </TSCView>
  `,
})
export class FlexShrinkToZeroComponent {}
