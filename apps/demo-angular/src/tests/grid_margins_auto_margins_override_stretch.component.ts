import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="grid_margins_auto_margins_override_stretch"></ActionBar>
    <TSCView id="test-root" style="display: grid; grid-template-columns: 40dip 40dip 40dip;grid-template-rows: 40dip 40dip 40dip;padding: 10dip 20dip 30dip 40dip" testID="test-root" backgroundColor="red">
      <TSCView backgroundColor="green"></TSCView>
      <TSCView backgroundColor="blue"></TSCView>
      <TSCView backgroundColor="yellow"></TSCView>
      <TSCView backgroundColor="purple"></TSCView>
      <TSCView backgroundColor="cyan"></TSCView>
      <TSCView backgroundColor="gray"></TSCView>
      <Label style="align-self: stretch;justify-self:stretch;margin:auto;" backgroundColor="darkGray">HH​HH</Label>
      <TSCView backgroundColor="lightGray"></TSCView>
      <TSCView backgroundColor="lightBlue"></TSCView>
    </TSCView>
  `,
})
export class GridMarginsAutoMarginsOverrideStretchComponent {}
