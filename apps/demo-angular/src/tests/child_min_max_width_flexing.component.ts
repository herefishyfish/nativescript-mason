import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="child_min_max_width_flexing"></ActionBar>
    <TSCView id="test-root" style="width: 120dip; height: 50dip; flex-direction: row; align-items:stretch" testID="test-root" backgroundColor="red">
      <TSCView style="min-width: 60dip; flex-grow:1; flex-shrink:0; flex-basis: 0dip" backgroundColor="green"></TSCView>
      <TSCView style="max-width: 20dip; flex-grow:1; flex-shrink:0; flex-basis: 50%" backgroundColor="blue"></TSCView>
    </TSCView>
  `,
})
export class ChildMinMaxWidthFlexingComponent {}
