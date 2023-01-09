
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="percentage_flex_basis_cross_min_height"></ActionBar>
  <TSCView id="test-root" style="width: 200dip; height: 400dip; flex-direction: column;" backgroundColor="red">
  <TSCView style="flex-grow: 1; min-height: 60%;" backgroundColor="green"></TSCView>
  <TSCView style="flex-grow: 2; min-height: 10%;" backgroundColor="blue"></TSCView>
</TSCView>
  `,
})
export class PercentageFlexBasisCrossMinHeightComponent {}
