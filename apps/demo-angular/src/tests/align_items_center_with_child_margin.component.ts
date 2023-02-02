import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="align_items_center_with_child_margin"></ActionBar>
    <TSCView id="test-root" style="width: 100dip; height: 100dip; align-items: center;" testID="test-root" backgroundColor="red">
      <TSCView style="height: 10dip; width: 10dip; margin-top: 10dip;" backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class AlignItemsCenterWithChildMarginComponent {}
