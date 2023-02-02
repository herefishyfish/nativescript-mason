import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="flex_basis_larger_than_content_column"></ActionBar>
    <TSCView id="test-root" style="height: 100dip; flex-direction: column;" testID="test-root" backgroundColor="red">
      <TSCView style="flex-basis: 50dip; flex-direction: column;" backgroundColor="green">
        <TSCView style="width: 100dip; height: 10dip;" backgroundColor="blue"></TSCView>
      </TSCView>
    </TSCView>
  `,
})
export class FlexBasisLargerThanContentColumnComponent {}
