import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="flex_grow_to_min"></ActionBar>
  <TSCView id="test-root" style="min-height: 100dip; max-height: 500dip; width: 100dip; flex-direction: column;" backgroundColor="red">
  <TSCView style="flex-grow: 1; flex-shrink: 1;" backgroundColor="green"></TSCView>
  <TSCView style="height: 50dip;" backgroundColor="blue"></TSCView>
</TSCView>
  `,
})
export class FlexGrowToMinComponent {}
