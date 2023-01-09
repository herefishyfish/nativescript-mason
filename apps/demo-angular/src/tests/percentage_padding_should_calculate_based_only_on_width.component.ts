
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="percentage_padding_should_calculate_based_only_on_width"></ActionBar>
  <TSCView id="test-root" style="width: 200dip; height: 100dip; flex-direction: column;" backgroundColor="red">
  <TSCView style="flex-grow: 1; padding: 10%; flex-direction: column;" backgroundColor="green">
    <TSCView style="width: 10dip; height: 10dip;" backgroundColor="blue"></TSCView>
  </TSCView>
</TSCView>
  `,
})
export class PercentagePaddingShouldCalculateBasedOnlyOnWidthComponent {}
