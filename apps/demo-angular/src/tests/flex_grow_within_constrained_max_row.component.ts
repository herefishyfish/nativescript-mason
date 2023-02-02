import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="flex_grow_within_constrained_max_row"></ActionBar>
    <TSCView id="test-root" style="width: 200dip; flex-direction: column;" testID="test-root" backgroundColor="red">
      <TSCView style="height: 100dip; max-width: 100dip; flex-direction: row;" backgroundColor="green">
        <TSCView style="flex-shrink: 1; flex-basis:100dip" backgroundColor="blue"></TSCView>
        <TSCView style="width: 50dip;" backgroundColor="yellow"></TSCView>
      </TSCView>
    </TSCView>
  `,
})
export class FlexGrowWithinConstrainedMaxRowComponent {}
