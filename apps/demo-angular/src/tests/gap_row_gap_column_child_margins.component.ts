
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="gap_row_gap_column_child_margins"></ActionBar>
  <TSCView id="test-root" style="flex-direction: column; width: 100dip; height: 200dip; row-gap: 10dip;" backgroundColor="red">
  <TSCView style="flex: 1; margin-top: 2dip;margin-bottom: 2dip;" backgroundColor="green"></TSCView>
  <TSCView style="flex: 1; margin-top: 10dip;margin-bottom: 10dip;" backgroundColor="blue"></TSCView>
  <TSCView style="flex: 1; margin-top: 15dip;margin-bottom: 15dip;" backgroundColor="yellow"></TSCView>
</TSCView>
  `,
})
export class GapRowGapColumnChildMarginsComponent {}
