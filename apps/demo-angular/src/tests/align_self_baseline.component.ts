import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="align_self_baseline"></ActionBar>
    <TSCView id="test-root" style="width: 100dip; height: 100dip;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 50dip; height: 50dip; align-self: baseline;" backgroundColor="green"></TSCView>
      <TSCView style="width: 50dip; height: 20dip; align-self: baseline;" backgroundColor="blue">
        <TSCView style="width: 50dip; height: 10dip;" backgroundColor="yellow"></TSCView>
      </TSCView>
    </TSCView>
  `,
})
export class AlignSelfBaselineComponent {}
