import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="nested_overflowing_child"></ActionBar>
    <TSCView id="test-root" style="height: 100dip; width: 100dip;" testID="test-root" backgroundColor="red">
      <TSCView backgroundColor="green">
        <TSCView style="height: 200dip; width: 200dip;" backgroundColor="blue"></TSCView>
      </TSCView>
    </TSCView>
  `,
})
export class NestedOverflowingChildComponent {}
