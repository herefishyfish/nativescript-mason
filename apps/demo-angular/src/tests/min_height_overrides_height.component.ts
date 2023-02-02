import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="min_height_overrides_height"></ActionBar>
    <TSCView id="test-root" testID="test-root" backgroundColor="red">
      <TSCView style="min-height: 100dip; height: 50dip;" backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class MinHeightOverridesHeightComponent {}
