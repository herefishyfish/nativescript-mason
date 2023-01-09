
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="measure_flex_basis_overrides_measure"></ActionBar>
  <TSCView id="test-root" style="width: 50dip;height: 50dip;" backgroundColor="red">
  <Label backgroundColor="green">H</Label>
</TSCView>
  `,
})
export class MeasureFlexBasisOverridesMeasureComponent {}
