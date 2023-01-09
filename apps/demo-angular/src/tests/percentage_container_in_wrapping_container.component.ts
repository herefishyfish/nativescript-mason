
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="percentage_container_in_wrapping_container"></ActionBar>
  <TSCView id="test-root" style="align-items: center; width: 200dip; height: 200dip; justify-content: center; flex-direction: column;" backgroundColor="red">
  <TSCView style="flex-direction: column;" backgroundColor="green">
    <TSCView style="alignItems: center; flex-direction: row; justify-content: center; width: 100%;" backgroundColor="blue">
      <TSCView style="width: 50dip; height: 50dip;" backgroundColor="yellow"></TSCView>
      <TSCView style="width: 50dip; height: 50dip;" backgroundColor="purple"></TSCView>
    </TSCView>
  </TSCView>
</TSCView>
  `,
})
export class PercentageContainerInWrappingContainerComponent {}
