import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="max_height_overrides_height"></ActionBar>
    <TSCView id="test-root" testID="test-root" backgroundColor="red">
      <TSCView style="max-height: 100dip; height: 200dip;" backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class MaxHeightOverridesHeightComponent {}
