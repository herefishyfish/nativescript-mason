import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="gap_column_gap_wrap_align_center"></ActionBar>
    <TSCView id="test-root" style="flex-direction: row; flex-wrap: wrap; align-content: center; width: 100dip; height: 100dip; column-gap: 10dip; row-gap: 20dip;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 20dip; height: 20dip" backgroundColor="green"></TSCView>
      <TSCView style="width: 20dip; height: 20dip" backgroundColor="blue"></TSCView>
      <TSCView style="width: 20dip; height: 20dip" backgroundColor="yellow"></TSCView>
      <TSCView style="width: 20dip; height: 20dip" backgroundColor="purple"></TSCView>
      <TSCView style="width: 20dip; height: 20dip" backgroundColor="cyan"></TSCView>
      <TSCView style="width: 20dip; height: 20dip" backgroundColor="gray"></TSCView>
    </TSCView>
  `,
})
export class GapColumnGapWrapAlignCenterComponent {}
