
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="percentage_moderate_complexity"></ActionBar>
  <TSCView id="test-root" style="display: flex;flex-direction:column;width: 200dip;padding: 3dip;" backgroundColor="red">
  <TSCView style="display: flex;flex-direction:column;width: 50%; margin: 5dip; padding: 3%;" backgroundColor="green">
    <TSCView style="width: 45%; margin: 5%; padding: 3dip;" backgroundColor="blue"></TSCView>
  </TSCView>
</TSCView>
  `,
})
export class PercentageModerateComplexityComponent {}
