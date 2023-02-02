import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="measure_width_overrides_measure"></ActionBar>
    <TSCView id="test-root" testID="test-root" backgroundColor="red">
      <Label style="width:50dip" backgroundColor="green">HHHHHHHHHH</Label>
    </TSCView>
  `,
})
export class MeasureWidthOverridesMeasureComponent {}
