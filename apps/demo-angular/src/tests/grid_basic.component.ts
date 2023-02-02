import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="grid_basic"></ActionBar>
    <TSCView id="test-root" style="height: 120dip; width: 120dip; display: grid; grid-template-columns: 40dip 40dip 40dip;grid-template-rows: 40dip 40dip 40dip;" testID="test-root" backgroundColor="red">
      <TSCView backgroundColor="green"></TSCView>
      <TSCView backgroundColor="blue"></TSCView>
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
export class GridBasicComponent {}
