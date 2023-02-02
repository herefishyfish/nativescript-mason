import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="justify_content_row_center"></ActionBar>
    <TSCView id="test-root" style="width: 100dip; height: 100dip; flex-direction: row; justify-content: center;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 10dip;" backgroundColor="green"></TSCView>
      <TSCView style="width: 10dip;" backgroundColor="blue"></TSCView>
      <TSCView style="width: 10dip;" backgroundColor="yellow"></TSCView>
    </TSCView>
  `,
})
export class JustifyContentRowCenterComponent {}
