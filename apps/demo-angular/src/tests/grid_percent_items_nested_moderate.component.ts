
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="grid_percent_items_nested_moderate"></ActionBar>
  <TSCView id="test-root" style="display: grid;width: 200dip;padding: 3dip;" backgroundColor="red">
  <TSCView style="display: grid;width: 50%; margin: 5dip; padding: 3%;" backgroundColor="green">
    <TSCView style="width: 45%; margin: 5%; padding: 3dip;" backgroundColor="blue"></TSCView>
  </TSCView>
</TSCView>
  `,
})
export class GridPercentItemsNestedModerateComponent {}
