
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="margin_auto_left_fix_right_child_bigger_than_parent"></ActionBar>
  <TSCView id="test-root" style="height: 52dip; width: 52dip; justify-content: center;" backgroundColor="red">
  <TSCView style="width: 72dip; height: 72dip; margin-left: auto; margin-right: 10dip;" backgroundColor="green"></TSCView>
</TSCView>
  `,
})
export class MarginAutoLeftFixRightChildBiggerThanParentComponent {}
