import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="align_flex_start_with_shrinking_children"></ActionBar>
    <TSCView id="test-root" style="height: 500dip; width: 500dip;" testID="test-root" backgroundColor="red">
      <TSCView style="align-items: flex-start;" backgroundColor="green">
        <TSCView style="flex-grow: 1; flex-shrink: 1;" backgroundColor="blue">
          <TSCView style="flex-grow: 1; flex-shrink: 1;" backgroundColor="yellow"></TSCView>
        </TSCView>
      </TSCView>
    </TSCView>
  `,
})
export class AlignFlexStartWithShrinkingChildrenComponent {}
