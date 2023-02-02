import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="gap_column_gap_child_margins"></ActionBar>
    <TSCView id="test-root" style="flex-direction: row; width: 80dip; height: 100dip; column-gap: 10dip;" testID="test-root" backgroundColor="red">
      <TSCView style="flex: 1; margin-left: 2dip;margin-right: 2dip;" backgroundColor="green"></TSCView>
      <TSCView style="flex: 1; margin-left: 10dip;margin-right: 10dip;" backgroundColor="blue"></TSCView>
      <TSCView style="flex: 1; margin-left: 15dip;margin-right: 15dip;" backgroundColor="yellow"></TSCView>
    </TSCView>
  `,
})
export class GapColumnGapChildMarginsComponent {}
