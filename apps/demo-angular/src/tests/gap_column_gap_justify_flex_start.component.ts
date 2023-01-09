
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="gap_column_gap_justify_flex_start"></ActionBar>
  <TSCView id="test-root" style="flex-direction: row; justify-content: flex-start; width: 100dip; height: 100dip; column-gap: 10dip;" backgroundColor="red">
  <TSCView style="width: 20dip;" backgroundColor="green"></TSCView>
  <TSCView style="width: 20dip;" backgroundColor="blue"></TSCView>
  <TSCView style="width: 20dip;" backgroundColor="yellow"></TSCView>
</TSCView>
  `,
})
export class GapColumnGapJustifyFlexStartComponent {}
