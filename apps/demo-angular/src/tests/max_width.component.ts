import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="max_width"></ActionBar>
    <TSCView id="test-root" style="width: 100dip; height: 100dip; flex-direction: column;" testID="test-root" backgroundColor="red">
      <TSCView style="height: 10dip; max-width: 50dip;" backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class MaxWidthComponent {}
