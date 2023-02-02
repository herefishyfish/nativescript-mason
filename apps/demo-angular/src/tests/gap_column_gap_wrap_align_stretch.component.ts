import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="gap_column_gap_wrap_align_stretch"></ActionBar>
    <TSCView id="test-root" style="flex-direction: row; flex-wrap: wrap; width: 300dip; height: 300dip; column-gap: 5dip; align-content: stretch;" testID="test-root" backgroundColor="red">
      <TSCView style="min-width: 60dip; flex-grow: 1;" backgroundColor="green"></TSCView>
      <TSCView style="min-width: 60dip; flex-grow: 1;" backgroundColor="blue"></TSCView>
      <TSCView style="min-width: 60dip; flex-grow: 1;" backgroundColor="yellow"></TSCView>
      <TSCView style="min-width: 60dip; flex-grow: 1;" backgroundColor="purple"></TSCView>
      <TSCView style="min-width: 60dip; flex-grow: 1;" backgroundColor="cyan"></TSCView>
    </TSCView>
  `,
})
export class GapColumnGapWrapAlignStretchComponent {}
