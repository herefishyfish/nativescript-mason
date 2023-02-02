import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="min_width_overrides_width"></ActionBar>
    <TSCView id="test-root" testID="test-root" backgroundColor="red">
      <TSCView style="min-width: 100dip; width: 50dip;" backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class MinWidthOverridesWidthComponent {}
