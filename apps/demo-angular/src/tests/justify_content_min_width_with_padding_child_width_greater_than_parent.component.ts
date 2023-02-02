import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="justify_content_min_width_with_padding_child_width_greater_than_parent"></ActionBar>
    <TSCView id="test-root" style="width: 1000dip; height: 1584dip; align-content: stretch; flex-direction: column;" testID="test-root" backgroundColor="red">
      <TSCView style="flex-direction: row; align-content: stretch;" backgroundColor="green">
        <TSCView style="flex-direction: row; justify-content: center; align-content: stretch; min-width: 400dip; padding-left: 100dip; padding-right: 100dip;" backgroundColor="blue">
          <TSCView style="height: 100dip; width: 300dip; align-content: stretch; flex-direction: row;" backgroundColor="yellow"></TSCView>
        </TSCView>
      </TSCView> </TSCView
    >&gt;
  `,
})
export class JustifyContentMinWidthWithPaddingChildWidthGreaterThanParentComponent {}
