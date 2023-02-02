import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="percentage_size_of_flex_basis"></ActionBar>
    <TSCView id="test-root" style="flex-direction: row; width: 100dip;" testID="test-root" backgroundColor="red">
      <TSCView style="flex-basis: 50dip;" backgroundColor="green">
        <TSCView style="width: 100%; height: 100dip;" backgroundColor="blue"></TSCView>
      </TSCView>
    </TSCView>
  `,
})
export class PercentageSizeOfFlexBasisComponent {}
