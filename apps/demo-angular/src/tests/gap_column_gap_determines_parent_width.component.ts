import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="gap_column_gap_determines_parent_width"></ActionBar>
    <TSCView id="test-root" style="flex-direction: row; height: 100dip; align-items: stretch; column-gap: 10dip;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 10dip;" backgroundColor="green"></TSCView>
      <TSCView style="width: 20dip;" backgroundColor="blue"></TSCView>
      <TSCView style="width: 30dip;" backgroundColor="yellow"></TSCView>
    </TSCView>
  `,
})
export class GapColumnGapDeterminesParentWidthComponent {}
