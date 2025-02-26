import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="width_smaller_then_content_with_flex_grow_small_size"></ActionBar>
    <TSCView id="test-root" style="flex-direction: row; width: 10dip;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 0dip; flex-grow: 1; flex-direction: column;" backgroundColor="green">
        <TSCView style="width: 70dip; height: 100dip;" backgroundColor="blue"></TSCView>
      </TSCView>
      <TSCView style="width: 0dip; flex-grow: 1; flex-direction: column;" backgroundColor="yellow">
        <TSCView style="width: 20dip; height: 100dip;" backgroundColor="purple"></TSCView>
      </TSCView>
    </TSCView>
  `,
})
export class WidthSmallerThenContentWithFlexGrowSmallSizeComponent {}
