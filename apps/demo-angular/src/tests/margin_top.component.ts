import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="margin_top"></ActionBar>
    <TSCView id="test-root" style="width: 100dip; height: 100dip; flex-direction: column;" testID="test-root" backgroundColor="red">
      <TSCView style="height: 10dip; margin-top: 10dip;" backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class MarginTopComponent {}
