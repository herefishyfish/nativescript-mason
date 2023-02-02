import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="grid_absolute_container_negative_position"></ActionBar>
    <TSCView id="test-root" style="display: grid; grid-template-columns: 40dip 40dip 40dip;grid-template-rows: 40dip 40dip 40dip;padding: 10dip 20dip 30dip 40dip" testID="test-root" backgroundColor="red">
      <TSCView
        style="
    position: absolute;
    z-index: 2;
    background-color: red;
    right: -15dip;
    top: -5dip;
  "
        backgroundColor="green"
      ></TSCView>
      <TSCView
        style="
    position: absolute;
    z-index: 2;
    background-color: red;
    bottom: -25dip;
    left: -35dip;
  "
        backgroundColor="blue"
      ></TSCView>
      <TSCView backgroundColor="yellow"></TSCView>
      <TSCView backgroundColor="purple"></TSCView>
      <TSCView backgroundColor="cyan"></TSCView>
      <TSCView backgroundColor="gray"></TSCView>
      <TSCView backgroundColor="darkGray"></TSCView>
      <TSCView backgroundColor="lightGray"></TSCView>
      <TSCView backgroundColor="lightBlue"></TSCView>
    </TSCView>
  `,
})
export class GridAbsoluteContainerNegativePositionComponent {}
