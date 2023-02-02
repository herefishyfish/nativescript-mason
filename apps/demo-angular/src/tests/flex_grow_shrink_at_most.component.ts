import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="flex_grow_shrink_at_most"></ActionBar>
    <TSCView id="test-root" style="height: 100dip; width: 100dip;" testID="test-root" backgroundColor="red">
      <TSCView backgroundColor="green">
        <TSCView style="flex-grow:1; flex-shrink:1;" backgroundColor="blue"></TSCView>
      </TSCView>
    </TSCView>
  `,
})
export class FlexGrowShrinkAtMostComponent {}
