
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="align_baseline_child_multiline"></ActionBar>
  <TSCView id="test-root" style="width: 100dip; align-items: baseline;" backgroundColor="red">
  <TSCView style="width: 50dip; height: 60dip;" backgroundColor="green"></TSCView>
  <TSCView style="width: 50dip; flex-wrap: wrap;" backgroundColor="blue">
    <TSCView style="width: 25dip; height: 20dip;" backgroundColor="yellow"></TSCView>
    <TSCView style="width: 25dip; height: 10dip;" backgroundColor="purple"></TSCView>
    <TSCView style="width: 25dip; height: 20dip;" backgroundColor="cyan"></TSCView>
    <TSCView style="width: 25dip; height: 10dip;" backgroundColor="gray"></TSCView>
  </TSCView>
</TSCView>
  `,
})
export class AlignBaselineChildMultilineComponent {}
