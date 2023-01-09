
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="display_none_fixed_size"></ActionBar>
  <TSCView id="test-root" style="width: 100dip; height: 100dip; flex-direction: row;" backgroundColor="red">
  <TSCView style="flex-grow: 1;" backgroundColor="green"></TSCView>
  <TSCView style="width: 20dip; height: 20dip; display:none;" backgroundColor="blue"></TSCView>
</TSCView>
  `,
})
export class DisplayNoneFixedSizeComponent {}
