
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="flex_grow_within_constrained_max_column"></ActionBar>
  <TSCView id="test-root" style="max-height: 100dip; width: 100dip; flex-direction: column;" backgroundColor="red">
  <TSCView style="flex-shrink: 1; flex-basis:100dip" backgroundColor="green"></TSCView>
  <TSCView style="height: 50dip;" backgroundColor="blue"></TSCView>
</TSCView>
  `,
})
export class FlexGrowWithinConstrainedMaxColumnComponent {}
