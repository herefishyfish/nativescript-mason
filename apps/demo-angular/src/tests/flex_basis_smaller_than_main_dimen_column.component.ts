
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="flex_basis_smaller_than_main_dimen_column"></ActionBar>
  <TSCView id="test-root" style="height: 100dip; flex-direction: column;" backgroundColor="red">
  <TSCView style="flex-basis: 10dip; width: 50dip; height: 50dip;" backgroundColor="green"></TSCView>
</TSCView>
  `,
})
export class FlexBasisSmallerThanMainDimenColumnComponent {}
