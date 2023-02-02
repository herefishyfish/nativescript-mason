import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="margin_auto_left_stretching_child"></ActionBar>
    <TSCView id="test-root" style="width: 200dip; height: 200dip; align-items: center;" testID="test-root" backgroundColor="red">
      <TSCView style="flex: 1; margin-left:auto;" backgroundColor="green"></TSCView>
      <TSCView style="width: 50dip; height: 50dip;" backgroundColor="blue"></TSCView>
    </TSCView>
  `,
})
export class MarginAutoLeftStretchingChildComponent {}
