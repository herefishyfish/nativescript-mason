import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="gap_column_gap_percentage_cyclic_shrinkable"></ActionBar>
    <TSCView id="test-root" style="flex-direction: row; column-gap: 20%;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 20dip;height: 40dip;" backgroundColor="green"></TSCView>
      <TSCView style="width: 20dip;height: 40dip;" backgroundColor="blue"></TSCView>
      <TSCView style="width: 20dip;height: 40dip;" backgroundColor="yellow"></TSCView>
    </TSCView>
  `,
})
export class GapColumnGapPercentageCyclicShrinkableComponent {}
