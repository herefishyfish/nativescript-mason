import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="grid_percent_items_nested_with_padding_margin"></ActionBar>
    <TSCView id="test-root" style="display:grid;width: 200dip; height: 200dip;grid-template-rows: 1fr 4fr;" testID="test-root" backgroundColor="red">
      <TSCView style="display: grid;min-width: 60%; margin: 5dip; padding: 3dip;" backgroundColor="green">
        <TSCView style="display: grid;width: 50%; margin: 5dip; padding: 3%;" backgroundColor="blue">
          <TSCView style="width: 45%; margin: 5%; padding: 3dip;" backgroundColor="yellow"></TSCView>
        </TSCView>
      </TSCView>
      <TSCView backgroundColor="purple"></TSCView>
    </TSCView>
  `,
})
export class GridPercentItemsNestedWithPaddingMarginComponent {}
