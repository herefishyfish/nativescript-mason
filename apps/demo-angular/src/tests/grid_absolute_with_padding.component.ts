
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="grid_absolute_with_padding"></ActionBar>
  <TSCView id="test-root" style="display: grid; grid-template-columns: 40dip 40dip 40dip;grid-template-rows: 40dip 40dip 40dip;padding: 10dip 20dip 30dip 40dip" backgroundColor="red">
  <TSCView style="
    position: absolute;
    z-index: 2;
    background-color: red;
    right: 0;
    top: 0;
  " backgroundColor="green"></TSCView>
  <TSCView style="
    position: absolute;
    z-index: 2;
    background-color: red;
    bottom: 10dip;
    left: 10dip;
  " backgroundColor="blue"></TSCView>
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
export class GridAbsoluteWithPaddingComponent {}
