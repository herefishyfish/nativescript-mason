
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="flex_basis_unconstraint_row"></ActionBar>
  <TSCView id="test-root" style="flex-direction: row;" backgroundColor="red">
  <TSCView style="flex-basis: 50dip; height: 100dip;" backgroundColor="green"></TSCView>
</TSCView>
  `,
})
export class FlexBasisUnconstraintRowComponent {}
