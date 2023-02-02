import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="justify_content_row_min_width_and_margin"></ActionBar>
    <TSCView id="test-root" style="min-width: 50dip; justify-content: center; flex-direction: row;" testID="test-root" backgroundColor="red">
      <TSCView style="height: 20dip; width: 20dip; margin-left: 10dip;" backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class JustifyContentRowMinWidthAndMarginComponent {}
