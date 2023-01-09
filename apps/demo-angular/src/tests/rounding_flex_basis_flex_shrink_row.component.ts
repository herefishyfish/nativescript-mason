
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="rounding_flex_basis_flex_shrink_row"></ActionBar>
  <TSCView id="test-root" style="width: 101dip; height: 100dip; flex-direction: row;" backgroundColor="red">
 <TSCView style="flex-basis: 100dip; flex-shrink: 1;" backgroundColor="green"></TSCView>
 <TSCView style="flex-basis: 25dip;" backgroundColor="blue"></TSCView>
 <TSCView style="flex-basis: 25dip;" backgroundColor="yellow"></TSCView>
</TSCView>
  `,
})
export class RoundingFlexBasisFlexShrinkRowComponent {}
