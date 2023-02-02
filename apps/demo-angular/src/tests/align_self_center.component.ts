import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="align_self_center"></ActionBar>
    <TSCView id="test-root" style="width:100dip; height: 100dip;" testID="test-root" backgroundColor="red">
      <TSCView style="height: 10dip; width: 10dip; align-self: center;" backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class AlignSelfCenterComponent {}
