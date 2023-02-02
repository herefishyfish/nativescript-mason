import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="align_self_flex_end"></ActionBar>
    <TSCView id="test-root" style="width:100dip; height: 100dip;" testID="test-root" backgroundColor="red">
      <TSCView style="height: 10dip; width: 10dip; align-self: flex-end;" backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class AlignSelfFlexEndComponent {}
