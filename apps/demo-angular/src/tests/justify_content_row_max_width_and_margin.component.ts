
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="justify_content_row_max_width_and_margin"></ActionBar>
  <TSCView id="test-root" style="width: 100dip; max-width: 80dip; justify-content: center; flex-direction: row;" backgroundColor="red">
  <TSCView style="height: 20dip; width: 20dip; margin-left: 100dip;" backgroundColor="green"></TSCView>
</TSCView>
  `,
})
export class JustifyContentRowMaxWidthAndMarginComponent {}
