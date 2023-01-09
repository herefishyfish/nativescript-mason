
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="measure_height_overrides_measure"></ActionBar>
  <TSCView id="test-root" backgroundColor="red">
  <Label style="height:5dip" backgroundColor="green">H</Label>
</TSCView>
  `,
})
export class MeasureHeightOverridesMeasureComponent {}
