
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="border_no_child"></ActionBar>
  <TSCView id="test-root" style="border-width: 10dip;" backgroundColor="red"></TSCView>
  `,
})
export class BorderNoChildComponent {}
