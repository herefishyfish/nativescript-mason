
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="flex_grow_child"></ActionBar>
  <TSCView id="test-root" style="flex-direction: row;" backgroundColor="red">
  <TSCView style="height: 100dip; flex-grow: 1; flex-basis: 0dip;" backgroundColor="green"></TSCView>
</TSCView>
  `,
})
export class FlexGrowChildComponent {}
