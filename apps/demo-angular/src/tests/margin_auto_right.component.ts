
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="margin_auto_right"></ActionBar>
  <TSCView id="test-root" style="width: 200dip; height: 200dip; align-items: center;" backgroundColor="red">
  <TSCView style="width: 50dip; height: 50dip; margin-right:auto;" backgroundColor="green"></TSCView>
  <TSCView style="width: 50dip; height: 50dip;" backgroundColor="blue"></TSCView>
</TSCView>
  `,
})
export class MarginAutoRightComponent {}
