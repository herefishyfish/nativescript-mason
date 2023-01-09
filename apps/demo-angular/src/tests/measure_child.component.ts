
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="measure_child"></ActionBar>
  <TSCView id="test-root" backgroundColor="red">
  <Label backgroundColor="green">HHHHHH</Label>
</TSCView>
  `,
})
export class MeasureChildComponent {}
