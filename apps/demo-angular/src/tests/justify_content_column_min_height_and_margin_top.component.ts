
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="justify_content_column_min_height_and_margin_top"></ActionBar>
  <TSCView id="test-root" style="min-height: 50dip; justify-content: center; flex-direction: column;" backgroundColor="red">
  <TSCView style="height: 20dip; width: 20dip; margin-top: 10dip;" backgroundColor="green"></TSCView>
</TSCView>
  `,
})
export class JustifyContentColumnMinHeightAndMarginTopComponent {}
