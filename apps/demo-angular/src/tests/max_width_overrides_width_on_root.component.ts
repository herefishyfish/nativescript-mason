
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="max_width_overrides_width_on_root"></ActionBar>
  <Label id="test-root" style="max-width: 100dip; width: 200dip;" backgroundColor="red">
</Label>
  `,
})
export class MaxWidthOverridesWidthOnRootComponent {}
