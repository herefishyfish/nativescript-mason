import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="size_defined_by_child_with_padding"></ActionBar>
    <TSCView id="test-root" style="padding: 10dip;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 10dip; height: 10dip;" backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class SizeDefinedByChildWithPaddingComponent {}
