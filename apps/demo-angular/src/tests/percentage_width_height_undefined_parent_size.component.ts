import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="percentage_width_height_undefined_parent_size"></ActionBar>
    <TSCView id="test-root" style="flex-direction: column;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 50%; height: 50%;" backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class PercentageWidthHeightUndefinedParentSizeComponent {}
