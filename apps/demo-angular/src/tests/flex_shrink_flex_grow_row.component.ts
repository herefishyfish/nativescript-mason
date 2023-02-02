import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="flex_shrink_flex_grow_row"></ActionBar>
    <TSCView id="test-root" style="width: 500dip; height: 500dip; flex-direction: row;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 500dip; height: 100dip; flex-grow: 0; flex-shrink: 1;" backgroundColor="green"></TSCView>
      <TSCView style="width: 500dip; height: 100dip; flex-grow: 0; flex-shrink: 1;" backgroundColor="blue"></TSCView>
    </TSCView>
  `,
})
export class FlexShrinkFlexGrowRowComponent {}
