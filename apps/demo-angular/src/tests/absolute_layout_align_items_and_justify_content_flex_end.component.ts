
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="absolute_layout_align_items_and_justify_content_flex_end"></ActionBar>
  <TSCView id="test-root" style="height: 100dip; width: 110dip; align-items: flex-end; justify-content: flex-end;" backgroundColor="red">
  <TSCView style="position: absolute; width: 60dip; height: 40dip;" backgroundColor="green"></TSCView>
</TSCView>
  `,
})
export class AbsoluteLayoutAlignItemsAndJustifyContentFlexEndComponent {}
