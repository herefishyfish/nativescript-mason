import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="flex_basis_flex_shrink_column"></ActionBar>
    <TSCView id="test-root" style="width: 100dip; height: 100dip; flex-direction: column;" testID="test-root" backgroundColor="red">
      <TSCView style="flex-basis: 100dip;" backgroundColor="green"></TSCView>
      <TSCView style="flex-basis: 50dip;" backgroundColor="blue"></TSCView>
    </TSCView>
  `,
})
export class FlexBasisFlexShrinkColumnComponent {}
