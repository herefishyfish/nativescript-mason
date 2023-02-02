import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="percentage_size_based_on_parent_inner_size"></ActionBar>
    <TSCView id="test-root" style="width: 200dip; height: 400dip; padding: 20dip; flex-direction: column;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 50%; height: 50%;" backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class PercentageSizeBasedOnParentInnerSizeComponent {}
