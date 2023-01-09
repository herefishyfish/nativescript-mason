
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="measure_child_absolute"></ActionBar>
  <TSCView id="test-root" style="width: 100dip;height: 100dip" backgroundColor="red">
  <Label style="position: absolute;" backgroundColor="green">HHHHHH</Label>
</TSCView>
  `,
})
export class MeasureChildAbsoluteComponent {}
