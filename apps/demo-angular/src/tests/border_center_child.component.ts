
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="border_center_child"></ActionBar>
  <TSCView id="test-root" style="width: 100dip; height: 100dip; border-start-width: 10dip; border-top-width: 10dip; border-end-width: 20dip; border-bottom-width: 20dip; align-items: center; justify-content: center;" backgroundColor="red">
  <TSCView style="height: 10dip; width: 10dip;" backgroundColor="green"></TSCView>
</TSCView>
  `,
})
export class BorderCenterChildComponent {}
