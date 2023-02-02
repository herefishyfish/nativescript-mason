import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="flex_grow_root_minimized"></ActionBar>
    <TSCView id="test-root" style="width: 100dip; min-height: 100dip; max-height: 500dip; flex-direction: column;" testID="test-root" backgroundColor="red">
      <TSCView style="min-height: 100dip; max-height: 500dip; flex-grow:1; flex-direction: column;" backgroundColor="green">
        <TSCView style="flex-basis: 200dip; flex-grow: 1;" backgroundColor="blue"></TSCView>
        <TSCView style="height: 100dip; " backgroundColor="yellow"></TSCView>
      </TSCView>
    </TSCView>
  `,
})
export class FlexGrowRootMinimizedComponent {}
