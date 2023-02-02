import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="margin_auto_mutiple_children_row"></ActionBar>
    <TSCView id="test-root" style="width: 200dip; height: 200dip; flex-direction:row; align-items: center;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 50dip; height: 50dip; margin-right:auto;" backgroundColor="green"></TSCView>
      <TSCView style="width: 50dip; height: 50dip; margin-right:auto;" backgroundColor="blue"></TSCView>
      <TSCView style="width: 50dip; height: 50dip;" backgroundColor="yellow"></TSCView>
    </TSCView>
  `,
})
export class MarginAutoMutipleChildrenRowComponent {}
