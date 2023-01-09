
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="flex_root_ignored"></ActionBar>
  <TSCView id="test-root" style="width: 100dip; min-height: 100dip; max-height: 500dip; flex-direction: column;" backgroundColor="red">
  <TSCView style="flex-basis: 200dip; flex-grow: 1;" backgroundColor="green"></TSCView>
  <TSCView style="height: 100dip; " backgroundColor="blue"></TSCView>
</TSCView>
  `,
})
export class FlexRootIgnoredComponent {}
