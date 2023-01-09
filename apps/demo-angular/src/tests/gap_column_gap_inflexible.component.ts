
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="gap_column_gap_inflexible"></ActionBar>
  <TSCView id="test-root" style="flex-direction: row; width: 80dip; height: 100dip; column-gap: 10dip;" backgroundColor="red">
  <TSCView style="width: 20dip;" backgroundColor="green"></TSCView>
  <TSCView style="width: 20dip;" backgroundColor="blue"></TSCView>
  <TSCView style="width: 20dip;" backgroundColor="yellow"></TSCView>
</TSCView>
  `,
})
export class GapColumnGapInflexibleComponent {}
