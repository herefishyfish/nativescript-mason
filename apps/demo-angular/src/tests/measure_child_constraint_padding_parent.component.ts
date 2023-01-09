
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="measure_child_constraint_padding_parent"></ActionBar>
  <TSCView id="test-root" style="width:50dip; height: auto;padding: 10dip" backgroundColor="red">
  <Label backgroundColor="green">HHHHHHHHHH​HHHHHHHHHH​HHHHHHHHHH​HHHHHHHHHH​HHHHHHHHHH​HHHHHHHHHH​HHHHHHHHHH​HHHHHHHHHH​HHHHHHHHHH​HHHHHHHHHH</Label>
</TSCView>
  `,
})
export class MeasureChildConstraintPaddingParentComponent {}
