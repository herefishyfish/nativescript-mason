import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="wrap_row"></ActionBar>
    <TSCView id="test-root" style="width: 100dip; flex-direction: row; flex-wrap: wrap" testID="test-root" backgroundColor="red">
      <TSCView style="height: 30dip; width: 31dip;" backgroundColor="green"></TSCView>
      <TSCView style="height: 30dip; width: 32dip;" backgroundColor="blue"></TSCView>
      <TSCView style="height: 30dip; width: 33dip;" backgroundColor="yellow"></TSCView>
      <TSCView style="height: 30dip; width: 34dip;" backgroundColor="purple"></TSCView>
    </TSCView>
  `,
})
export class WrapRowComponent {}
