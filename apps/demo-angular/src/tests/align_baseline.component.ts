
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="align_baseline"></ActionBar>
  <TSCView id="test-root" style="width: 100dip; height: 100dip; align-items: baseline;" backgroundColor="red">
  <TSCView style="width: 50dip; height: 50dip;" backgroundColor="green"></TSCView>
  <TSCView style="width: 50dip; height: 20dip;" backgroundColor="blue"></TSCView>
</TSCView>
  `,
})
export class AlignBaselineComponent {}
