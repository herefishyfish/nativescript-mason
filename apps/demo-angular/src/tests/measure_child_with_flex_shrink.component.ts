import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="measure_child_with_flex_shrink"></ActionBar>
    <TSCView id="test-root" style="width:100dip; height: auto" testID="test-root" backgroundColor="red">
      <TSCView style="width: 50dip;height: 50dip" backgroundColor="green"></TSCView>
      <Label backgroundColor="blue">HHHHHHHHHH​HHHHHHHHHH​HHHHHHHHHH​HHHHHHHHHH​HHHHHHHHHH</Label>
    </TSCView>
  `,
})
export class MeasureChildWithFlexShrinkComponent {}
