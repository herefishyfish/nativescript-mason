
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="gap_row_gap_align_items_stretch"></ActionBar>
  <TSCView id="test-root" style="flex-direction: row; flex-wrap: wrap; width: 100dip; height: 200dip; column-gap: 10dip; row-gap: 20dip; align-items:stretch; align-content: stretch" backgroundColor="red">
  <TSCView style="width: 20dip; " backgroundColor="green"></TSCView>
  <TSCView style="width: 20dip;" backgroundColor="blue"></TSCView>
  <TSCView style="width: 20dip;" backgroundColor="yellow"></TSCView>
  <TSCView style="width: 20dip;" backgroundColor="purple"></TSCView>
  <TSCView style="width: 20dip;" backgroundColor="cyan"></TSCView>
  <TSCView style="width: 20dip;" backgroundColor="gray"></TSCView>
</TSCView>
  `,
})
export class GapRowGapAlignItemsStretchComponent {}
