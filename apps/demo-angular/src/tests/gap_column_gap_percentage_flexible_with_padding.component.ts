
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="gap_column_gap_percentage_flexible_with_padding"></ActionBar>
  <TSCView id="test-root" style="flex-direction: row; width: 100dip; height: 100dip; column-gap: 10%; row-gap: 20dip;padding: 10dip" backgroundColor="red">
  <TSCView style="flex: 1;" backgroundColor="green"></TSCView>
  <TSCView style="flex: 1;" backgroundColor="blue"></TSCView>
  <TSCView style="flex: 1;" backgroundColor="yellow"></TSCView>
</TSCView>
  `,
})
export class GapColumnGapPercentageFlexibleWithPaddingComponent {}
