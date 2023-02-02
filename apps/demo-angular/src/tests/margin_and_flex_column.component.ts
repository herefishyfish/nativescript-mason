import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="margin_and_flex_column"></ActionBar>
    <TSCView id="test-root" style="width: 100dip; height: 100dip; flex-direction: column;" testID="test-root" backgroundColor="red">
      <TSCView style="margin-top: 10dip; margin-bottom: 10dip; flex-grow: 1;" backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class MarginAndFlexColumnComponent {}
