
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="gap_percentage_row_gap_wrapping"></ActionBar>
  <TSCView id="test-root" style="flex-direction: row; flex-wrap: wrap; width: 80dip; column-gap: 10dip; row-gap: 10%;" backgroundColor="red">
  <TSCView style="width: 20dip; height: 20dip" backgroundColor="green"></TSCView>
  <TSCView style="width: 20dip; height: 20dip" backgroundColor="blue"></TSCView>
  <TSCView style="width: 20dip; height: 20dip" backgroundColor="yellow"></TSCView>
  <TSCView style="width: 20dip; height: 20dip" backgroundColor="purple"></TSCView>
  <TSCView style="width: 20dip; height: 20dip" backgroundColor="cyan"></TSCView>
  <TSCView style="width: 20dip; height: 20dip" backgroundColor="gray"></TSCView>
  <TSCView style="width: 20dip; height: 20dip" backgroundColor="darkGray"></TSCView>
  <TSCView style="width: 20dip; height: 20dip" backgroundColor="lightGray"></TSCView>
  <TSCView style="width: 20dip; height: 20dip" backgroundColor="lightBlue"></TSCView>
</TSCView>
  `,
})
export class GapPercentageRowGapWrappingComponent {}
