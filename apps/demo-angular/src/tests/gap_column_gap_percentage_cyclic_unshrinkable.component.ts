
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="gap_column_gap_percentage_cyclic_unshrinkable"></ActionBar>
  <TSCView id="test-root" style="flex-direction: row; column-gap: 20%;" backgroundColor="red">
  <TSCView style="width: 20dip;height: 40dip;flex-shrink: 0;" backgroundColor="green"></TSCView>
  <TSCView style="width: 20dip;height: 40dip;flex-shrink: 0;" backgroundColor="blue"></TSCView>
  <TSCView style="width: 20dip;height: 40dip;flex-shrink: 0;" backgroundColor="yellow"></TSCView>
</TSCView>
  `,
})
export class GapColumnGapPercentageCyclicUnshrinkableComponent {}
