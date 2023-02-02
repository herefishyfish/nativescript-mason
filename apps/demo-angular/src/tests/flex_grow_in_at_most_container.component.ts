import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="flex_grow_in_at_most_container"></ActionBar>
    <TSCView id="test-root" style="width: 100dip; height: 100dip; background-color: white; flex-direction: row; align-items: flex-start;" testID="test-root" backgroundColor="red">
      <TSCView style="flex-direction: row;" backgroundColor="green">
        <TSCView style="flex-grow: 1; flex-basis: 0dip;" backgroundColor="blue"></TSCView>
      </TSCView>
    </TSCView>
  `,
})
export class FlexGrowInAtMostContainerComponent {}
