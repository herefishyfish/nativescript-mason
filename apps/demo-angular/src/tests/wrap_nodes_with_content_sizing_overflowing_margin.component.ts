
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="wrap_nodes_with_content_sizing_overflowing_margin"></ActionBar>
  <TSCView id="test-root" style="width: 500dip; height: 500dip; flex-direction: column;" backgroundColor="red">
  <TSCView style="flex-direction: row; flex-wrap: wrap; width: 85dip;" backgroundColor="green">
    <TSCView style="flex-direction: column;" backgroundColor="blue">
      <TSCView style="height: 40dip; width: 40dip;" backgroundColor="yellow"></TSCView>
    </TSCView>
    <TSCView style="margin-right: 10dip; flex-direction: column;" backgroundColor="purple">
      <TSCView style="height: 40dip; width: 40dip;" backgroundColor="cyan"></TSCView>
    </TSCView>
  </TSCView>
</TSCView>
  `,
})
export class WrapNodesWithContentSizingOverflowingMarginComponent {}
