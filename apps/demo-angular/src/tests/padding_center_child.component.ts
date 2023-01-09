
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="padding_center_child"></ActionBar>
  <TSCView id="test-root" style="width: 100dip; height: 100dip; padding-left: 10dip; padding-top: 10dip; padding-right: 20dip; padding-bottom: 20dip; align-items: center; justify-content: center;" backgroundColor="red">
  <TSCView style="height: 10dip; width: 10dip;" backgroundColor="green"></TSCView>
</TSCView>
  `,
})
export class PaddingCenterChildComponent {}
