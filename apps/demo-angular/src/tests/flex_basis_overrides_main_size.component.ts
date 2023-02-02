import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="flex_basis_overrides_main_size"></ActionBar>
    <TSCView id="test-root" style="height: 100dip; width: 100dip;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 20dip; flex-grow:1; flex-basis:50dip;" backgroundColor="green"></TSCView>
      <TSCView style="width: 10dip; flex-grow:1;" backgroundColor="blue"></TSCView>
      <TSCView style="width: 10dip; flex-grow:1;" backgroundColor="yellow"></TSCView>
    </TSCView>
  `,
})
export class FlexBasisOverridesMainSizeComponent {}
