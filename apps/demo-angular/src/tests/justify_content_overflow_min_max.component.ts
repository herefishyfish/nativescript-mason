import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="justify_content_overflow_min_max"></ActionBar>
    <TSCView id="test-root" style="min-height: 100dip; max-height: 110dip; justify-content: center; flex-direction: column;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 50dip; height: 50dip; flex-shrink: 0;" backgroundColor="green"></TSCView>
      <TSCView style="width: 50dip; height: 50dip; flex-shrink: 0;" backgroundColor="blue"></TSCView>
      <TSCView style="width: 50dip; height: 50dip; flex-shrink: 0;" backgroundColor="yellow"></TSCView>
    </TSCView>
  `,
})
export class JustifyContentOverflowMinMaxComponent {}
