
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="flex_shrink_by_outer_margin_with_max_size"></ActionBar>
  <TSCView id="test-root" style="height: 100dip; max-height: 80dip; flex-direction: column;" backgroundColor="red">
  <TSCView style="height: 20dip; width: 20dip; margin-top: 100dip;" backgroundColor="green"></TSCView>
</TSCView>
  `,
})
export class FlexShrinkByOuterMarginWithMaxSizeComponent {}
