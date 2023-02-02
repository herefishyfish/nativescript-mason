import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="gap_row_gap_determines_parent_height"></ActionBar>
    <TSCView id="test-root" style="flex-direction: column; width: 100dip; align-items: stretch; row-gap: 10dip;" testID="test-root" backgroundColor="red">
      <TSCView style="height: 10dip;" backgroundColor="green"></TSCView>
      <TSCView style="height: 20dip" backgroundColor="blue"></TSCView>
      <TSCView style="height: 30dip" backgroundColor="yellow"></TSCView>
    </TSCView>
  `,
})
export class GapRowGapDeterminesParentHeightComponent {}
