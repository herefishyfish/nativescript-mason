import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="margin_right"></ActionBar>
    <TSCView id="test-root" style="width: 100dip; height: 100dip; flex-direction: row; justify-content: flex-end;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 10dip; margin-right: 10dip;" backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class MarginRightComponent {}
