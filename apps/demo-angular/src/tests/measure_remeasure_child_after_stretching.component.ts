import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="measure_remeasure_child_after_stretching"></ActionBar>
    <TSCView id="test-root" style="width:100dip; height: 100dip;" testID="test-root" backgroundColor="red">
      <Label backgroundColor="green">HH</Label>
    </TSCView>
  `,
})
export class MeasureRemeasureChildAfterStretchingComponent {}
