
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="measure_root"></ActionBar>
  <Label id="test-root" backgroundColor="red">HHHHHH</Label>
  `,
})
export class MeasureRootComponent {}
