
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="flex_grow_flex_basis_percent_min_max"></ActionBar>
  <TSCView id="test-root" style="width: 120dip; flex-direction: row;" backgroundColor="red">
  <TSCView style="flex-grow: 1; flex-shrink: 0; flex-basis: 0dip; height: 20dip; min-width: 60dip;" backgroundColor="green"></TSCView>
  <TSCView style="flex-grow: 1; flex-shrink: 0; flex-basis: 50%; height: 20dip; max-width: 20dip; width: 20dip;" backgroundColor="blue"></TSCView>
</TSCView>
  `,
})
export class FlexGrowFlexBasisPercentMinMaxComponent {}
