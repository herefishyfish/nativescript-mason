import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="size_defined_by_child"></ActionBar>
    <TSCView id="test-root" testID="test-root" backgroundColor="red">
      <TSCView style="width: 100dip; height: 100dip;" backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class SizeDefinedByChildComponent {}
