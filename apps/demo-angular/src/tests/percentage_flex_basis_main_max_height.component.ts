
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="percentage_flex_basis_main_max_height"></ActionBar>
  <TSCView id="test-root" style="width: 200dip; height: 400dip; flex-direction: row;" backgroundColor="red">
  <TSCView style="flex-grow: 1; flex-basis: 10%; max-height: 60%;" backgroundColor="green"></TSCView>
  <TSCView style="flex-grow: 4; flex-basis: 10%; max-height: 20%;" backgroundColor="blue"></TSCView>
</TSCView>
  `,
})
export class PercentageFlexBasisMainMaxHeightComponent {}
