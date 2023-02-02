import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="grid_absolute_column_start"></ActionBar>
    <TSCView id="test-root" style="display: grid; grid-template-columns: 40dip 40dip 40dip;grid-template-rows: 40dip 40dip 40dip;padding: 10dip 20dip 30dip 40dip" testID="test-root" backgroundColor="red">
      <TSCView
        style="
    background-color: red;
    position: absolute;
    grid-column-start: 1;
    top: 1dip;
    bottom: 2dip;
    right: 3dip;
    left: 4dip;
  "
        backgroundColor="green"
      ></TSCView>
    </TSCView>
  `,
})
export class GridAbsoluteColumnStartComponent {}
