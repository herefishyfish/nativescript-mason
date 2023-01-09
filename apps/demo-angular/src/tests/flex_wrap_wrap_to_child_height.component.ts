
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="flex_wrap_wrap_to_child_height"></ActionBar>
  <TSCView id="test-root" style="flex-direction: column;" backgroundColor="red">
  <TSCView style="flex-direction: row; align-items: flex-start; flex-wrap: wrap;" backgroundColor="green">
    <TSCView style="width: 100dip; flex-direction: column;" backgroundColor="blue">
      <TSCView style="height: 100dip; width: 100dip;" backgroundColor="yellow"></TSCView>
    </TSCView>
  </TSCView>
  <TSCView style="width: 100dip; height: 100dip;" backgroundColor="purple"></TSCView>
</TSCView>
  `,
})
export class FlexWrapWrapToChildHeightComponent {}
