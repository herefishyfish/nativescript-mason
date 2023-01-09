
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="min_max_percent_no_width_height"></ActionBar>
  <TSCView id="test-root" style="width: 100dip; height: 100dip; align-items: flex-start; flex-direction: column;" backgroundColor="red">
  <TSCView style="min-width: 10%; max-width: 10%; min-height: 10%; max-height: 10%;" backgroundColor="green"></TSCView>
</TSCView>
  `,
})
export class MinMaxPercentNoWidthHeightComponent {}
