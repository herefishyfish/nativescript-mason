
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="flex_grow_within_constrained_min_row"></ActionBar>
  <TSCView id="test-root" style="min-width: 100dip; height:100dip; flex-direction: row;" backgroundColor="red">
  <TSCView style="flex-grow: 1;" backgroundColor="green"></TSCView>
  <TSCView style="width: 50dip;" backgroundColor="blue"></TSCView>
</TSCView>
  `,
})
export class FlexGrowWithinConstrainedMinRowComponent {}
