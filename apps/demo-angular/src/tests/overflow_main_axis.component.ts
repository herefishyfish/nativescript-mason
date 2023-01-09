
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="overflow_main_axis"></ActionBar>
  <TSCView id="test-root" style="width:100dip; height: 100dip;" backgroundColor="red">
  <TSCView style="width: 200dip; flex-shrink: 0;" backgroundColor="green"></TSCView>
</TSCView>
  `,
})
export class OverflowMainAxisComponent {}
