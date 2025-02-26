import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="wrapped_row_within_align_items_flex_end"></ActionBar>
    <TSCView id="test-root" style="width: 200dip; height: 200dip; align-items: flex-end; flex-direction: column;" testID="test-root" backgroundColor="red">
      <TSCView style="flex-direction:row; flex-wrap: wrap;" backgroundColor="green">
        <TSCView style="width: 150dip; height: 80dip;" backgroundColor="blue"></TSCView>
        <TSCView style="width: 80dip; height: 80dip;" backgroundColor="yellow"></TSCView>
      </TSCView>
    </TSCView>
  `,
})
export class WrappedRowWithinAlignItemsFlexEndComponent {}
