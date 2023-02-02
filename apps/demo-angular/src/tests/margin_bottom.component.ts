import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="margin_bottom"></ActionBar>
    <TSCView id="test-root" style="width: 100dip; height: 100dip; justify-content: flex-end; flex-direction: column;" testID="test-root" backgroundColor="red">
      <TSCView style="height: 10dip; margin-bottom: 10dip;" backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class MarginBottomComponent {}
