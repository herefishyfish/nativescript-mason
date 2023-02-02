import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="flex_basis_larger_than_content_row"></ActionBar>
    <TSCView id="test-root" style="flex-direction: row; width: 100dip;" testID="test-root" backgroundColor="red">
      <TSCView style="flex-basis: 50dip; flex-direction: column;" backgroundColor="green">
        <TSCView style="width: 10dip; height: 100dip;" backgroundColor="blue"></TSCView>
      </TSCView>
    </TSCView>
  `,
})
export class FlexBasisLargerThanContentRowComponent {}
