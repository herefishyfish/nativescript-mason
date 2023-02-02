import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="max_width_overrides_width"></ActionBar>
    <TSCView id="test-root" testID="test-root" backgroundColor="red">
      <TSCView style="max-width: 100dip; width: 200dip;" backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class MaxWidthOverridesWidthComponent {}
