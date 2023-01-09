
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="padding_no_child"></ActionBar>
  <Label id="test-root" style="padding: 10dip;" backgroundColor="red">
</Label>
  `,
})
export class PaddingNoChildComponent {}
