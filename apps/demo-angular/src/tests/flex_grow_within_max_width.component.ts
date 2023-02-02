import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="flex_grow_within_max_width"></ActionBar>
    <TSCView id="test-root" style="width: 200dip; height: 100dip; flex-direction: column;" testID="test-root" backgroundColor="red">
      <TSCView style="flex-direction: row; max-width: 100dip;" backgroundColor="green">
        <TSCView style="height: 20dip; flex-grow: 1;" backgroundColor="blue"></TSCView>
      </TSCView>
    </TSCView>
  `,
})
export class FlexGrowWithinMaxWidthComponent {}
