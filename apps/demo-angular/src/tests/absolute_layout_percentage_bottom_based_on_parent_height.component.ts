
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="absolute_layout_percentage_bottom_based_on_parent_height"></ActionBar>
  <TSCView id="test-root" style="width: 100dip; height: 200dip;" backgroundColor="red">
  <TSCView style="position: absolute; top: 50%; width: 10dip; height: 10dip;" backgroundColor="green"></TSCView>
  <TSCView style="position: absolute; bottom: 50%; width: 10dip; height: 10dip;" backgroundColor="blue"></TSCView>
  <TSCView style="position: absolute; top: 10%; width: 10dip; bottom: 10%;" backgroundColor="yellow"></TSCView>
</TSCView>
  `,
})
export class AbsoluteLayoutPercentageBottomBasedOnParentHeightComponent {}
