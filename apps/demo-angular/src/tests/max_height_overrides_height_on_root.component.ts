import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="max_height_overrides_height_on_root"></ActionBar>
    <TSCView id="test-root" style="max-height: 100dip; height: 200dip;" testID="test-root" backgroundColor="red"></TSCView>
  `,
})
export class MaxHeightOverridesHeightOnRootComponent {}
