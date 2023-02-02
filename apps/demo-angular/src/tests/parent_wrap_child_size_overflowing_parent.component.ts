import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="parent_wrap_child_size_overflowing_parent"></ActionBar>
    <TSCView id="test-root" style="width: 100dip; height: 100dip;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 100dip;" backgroundColor="green">
        <TSCView style="width: 100dip; height: 200dip;" backgroundColor="blue"></TSCView>
      </TSCView>
    </TSCView>
  `,
})
export class ParentWrapChildSizeOverflowingParentComponent {}
