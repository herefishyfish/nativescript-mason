
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="align_items_center_child_without_margin_bigger_than_parent"></ActionBar>
  <TSCView id="test-root" style="height: 50dip; width: 50dip; align-items: center; justify-content: center;" backgroundColor="red">
  <TSCView style="align-items: center;" backgroundColor="green">
    <TSCView style="width: 70dip; height: 70dip;" backgroundColor="blue"></TSCView>
  </TSCView>
</TSCView>
  `,
})
export class AlignItemsCenterChildWithoutMarginBiggerThanParentComponent {}
