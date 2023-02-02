import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="absolute_layout_child_order"></ActionBar>
    <TSCView id="test-root" style="height: 100dip; width: 110dip; align-items: center; justify-content: center;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 60dip; height: 40dip;" backgroundColor="green"></TSCView>
      <TSCView style="position: absolute; width: 60dip; height: 40dip;" backgroundColor="blue"></TSCView>
      <TSCView style="width: 60dip; height: 40dip;" backgroundColor="yellow"></TSCView>
    </TSCView>
  `,
})
export class AbsoluteLayoutChildOrderComponent {}
