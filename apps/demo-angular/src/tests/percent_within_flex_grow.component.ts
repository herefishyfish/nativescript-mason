import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="percent_within_flex_grow"></ActionBar>
    <TSCView id="test-root" style="flex-direction:row; width: 350dip; height: 100dip;" testID="test-root" backgroundColor="red">
      <TSCView style="width:100dip;" backgroundColor="green"></TSCView>
      <TSCView style="flex-grow: 1; flex-direction: column;" backgroundColor="blue">
        <TSCView style="width:100%;" backgroundColor="yellow"></TSCView>
      </TSCView>
      <TSCView style="width: 100dip;" backgroundColor="purple"></TSCView>
    </TSCView>
  `,
})
export class PercentWithinFlexGrowComponent {}
