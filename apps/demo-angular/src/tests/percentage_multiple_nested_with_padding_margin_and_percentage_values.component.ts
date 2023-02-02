import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="percentage_multiple_nested_with_padding_margin_and_percentage_values"></ActionBar>
    <TSCView id="test-root" style="width: 200dip; height: 200dip; flex-direction: column;" testID="test-root" backgroundColor="red">
      <TSCView style="flex-grow: 1; flex-basis: 10%; min-width: 60%; margin: 5dip; padding: 3dip; flex-direction: column;" backgroundColor="green">
        <TSCView style="width: 50%; margin: 5dip; padding: 3%; flex-direction: column;" backgroundColor="blue">
          <TSCView style="width: 45%; margin: 5%; padding: 3dip;" backgroundColor="yellow"></TSCView>
        </TSCView>
      </TSCView>
      <TSCView style="flex-grow: 4; flex-basis: 15%; min-width: 20%;" backgroundColor="purple"></TSCView>
    </TSCView>
  `,
})
export class PercentageMultipleNestedWithPaddingMarginAndPercentageValuesComponent {}
