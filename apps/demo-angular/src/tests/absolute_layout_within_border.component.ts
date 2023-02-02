import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="absolute_layout_within_border"></ActionBar>
    <TSCView id="test-root" style="height: 100dip; width: 100dip; border-width: 10dip; padding: 10dip;" testID="test-root" backgroundColor="red">
      <TSCView style="position: absolute; width: 50dip; height: 50dip; left: 0dip; top: 0dip;" backgroundColor="green"></TSCView>
      <TSCView style="position: absolute; width: 50dip; height: 50dip; right: 0dip; bottom: 0dip;" backgroundColor="blue"></TSCView>
      <TSCView style="position: absolute; width: 50dip; height: 50dip; left: 0dip; top: 0dip; margin: 10dip;" backgroundColor="yellow"></TSCView>
      <TSCView style="position: absolute; width: 50dip; height: 50dip; right: 0dip; bottom: 0dip; margin: 10dip;" backgroundColor="purple"></TSCView>
    </TSCView>
  `,
})
export class AbsoluteLayoutWithinBorderComponent {}
