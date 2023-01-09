
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="size_defined_by_grand_child"></ActionBar>
  <TSCView id="test-root" backgroundColor="red">
  <TSCView backgroundColor="green">
    <TSCView style="width: 100dip; height: 100dip;" backgroundColor="blue"></TSCView>
  </TSCView>
</TSCView>
  `,
})
export class SizeDefinedByGrandChildComponent {}
