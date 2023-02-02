import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="flex_basis_and_main_dimen_set_when_flexing"></ActionBar>
    <TSCView id="test-root" style="flex-direction: row; width: 100dip;" testID="test-root" backgroundColor="red">
      <TSCView style="flex-basis: 10dip; width: 50dip; height: 50dip; flex-grow: 1;" backgroundColor="green"></TSCView>
      <TSCView style="flex-basis: 10dip; width: 0dip; height: 50dip; flex-grow: 1;" backgroundColor="blue"></TSCView>
    </TSCView>
  `,
})
export class FlexBasisAndMainDimenSetWhenFlexingComponent {}
