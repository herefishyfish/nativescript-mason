import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="absolute_layout_align_items_and_justify_content_center_and_bottom_position"></ActionBar>
    <FlexboxLayout id="test-root" style="height: 100dip; width: 110dip; align-items: center; justify-content: center;" backgroundColor="red">
      <FlexboxLayout style="position: absolute; width: 60dip; height: 40dip;bottom:10dip;" backgroundColor="green"></FlexboxLayout>
    </FlexboxLayout>
  `,
})
export class FlexComponent {}
