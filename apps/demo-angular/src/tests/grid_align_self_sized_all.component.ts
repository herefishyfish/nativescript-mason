import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="grid_align_self_sized_all"></ActionBar>
    <TSCView id="test-root" style="height: 120dip; width: 120dip; display: grid; grid-template-columns: 40dip 40dip 40dip;grid-template-rows: 40dip 40dip 40dip;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 20dip;height: 20dip;align-self: start;" backgroundColor="green"></TSCView>
      <TSCView style="width: 60dip;height: 60dip;align-self: start;" backgroundColor="blue"></TSCView>
      <TSCView style="width: 20dip;height: 20dip;align-self: end;" backgroundColor="yellow"></TSCView>
      <TSCView style="width: 60dip;height: 60dip;align-self: end;" backgroundColor="purple"></TSCView>
      <TSCView style="width: 20dip;height: 20dip;align-self: center;" backgroundColor="cyan"></TSCView>
      <TSCView style="width: 60dip;height: 60dip;align-self: center;" backgroundColor="gray"></TSCView>
      <TSCView style="width: 20dip;height: 20dip;align-self: stretch;" backgroundColor="darkGray"></TSCView>
      <TSCView style="width: 60dip;height: 60dip;align-self: stretch;" backgroundColor="lightGray"></TSCView>
    </TSCView>
  `,
})
export class GridAlignSelfSizedAllComponent {}
