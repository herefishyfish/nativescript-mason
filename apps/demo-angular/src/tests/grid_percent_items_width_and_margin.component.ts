
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="grid_percent_items_width_and_margin"></ActionBar>
  <TSCView id="test-root" style="display: grid;width: 200dip;padding: 3dip;" backgroundColor="red">
  <TSCView style="width: 45%;margin: 5%; padding: 3dip;" backgroundColor="green"></TSCView>
</TSCView>
  `,
})
export class GridPercentItemsWidthAndMarginComponent {}
