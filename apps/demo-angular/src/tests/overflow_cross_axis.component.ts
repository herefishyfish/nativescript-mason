
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="overflow_cross_axis"></ActionBar>
  <TSCView id="test-root" style="width:100dip; height: 100dip;" backgroundColor="red">
  <TSCView style="height: 200dip; width: 100dip;" backgroundColor="green"></TSCView>
</TSCView>
  `,
})
export class OverflowCrossAxisComponent {}
