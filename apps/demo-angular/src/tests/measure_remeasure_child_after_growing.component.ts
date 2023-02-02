import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="measure_remeasure_child_after_growing"></ActionBar>
    <TSCView id="test-root" style="width:100dip; height: auto;align-items: start;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 50dip;height: 50dip" backgroundColor="green"></TSCView>
      <Label backgroundColor="blue">HH</Label>
    </TSCView>
  `,
})
export class MeasureRemeasureChildAfterGrowingComponent {}
