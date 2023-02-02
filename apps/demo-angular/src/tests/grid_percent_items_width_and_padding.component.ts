import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="grid_percent_items_width_and_padding"></ActionBar>
    <TSCView id="test-root" style="display: grid;width: 200dip;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 50%;padding: 3%;" backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class GridPercentItemsWidthAndPaddingComponent {}
