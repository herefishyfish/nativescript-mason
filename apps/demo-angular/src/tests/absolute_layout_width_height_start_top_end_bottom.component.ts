import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="absolute_layout_width_height_start_top_end_bottom"></ActionBar>
    <TSCView id="test-root" style="width: 100dip; height: 100dip;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 10dip; height: 10dip; position: absolute; left: 10dip; top: 10dip; right: 10dip; bottom: 10dip;" backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class AbsoluteLayoutWidthHeightStartTopEndBottomComponent {}
