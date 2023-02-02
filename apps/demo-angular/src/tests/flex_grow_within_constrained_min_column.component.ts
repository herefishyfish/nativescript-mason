import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="flex_grow_within_constrained_min_column"></ActionBar>
    <TSCView id="test-root" style="min-height: 100dip; flex-direction: column;" testID="test-root" backgroundColor="red">
      <TSCView style="flex-grow: 1;" backgroundColor="green"></TSCView>
      <TSCView style="height: 50dip;" backgroundColor="blue"></TSCView>
    </TSCView>
  `,
})
export class FlexGrowWithinConstrainedMinColumnComponent {}
