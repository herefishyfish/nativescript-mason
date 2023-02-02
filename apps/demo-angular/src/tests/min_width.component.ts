import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="min_width"></ActionBar>
    <TSCView id="test-root" style="width: 100dip; height: 100dip; flex-direction: row" testID="test-root" backgroundColor="red">
      <TSCView style="flex-grow: 1; min-width: 60dip;" backgroundColor="green"></TSCView>
      <TSCView style="flex-grow: 1;" backgroundColor="blue"></TSCView>
    </TSCView>
  `,
})
export class MinWidthComponent {}
