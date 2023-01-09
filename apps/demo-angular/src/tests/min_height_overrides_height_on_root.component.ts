
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="min_height_overrides_height_on_root"></ActionBar>
  <Label id="test-root" style="min-height: 100dip; height: 50dip;" backgroundColor="red">
</Label>
  `,
})
export class MinHeightOverridesHeightOnRootComponent {}
