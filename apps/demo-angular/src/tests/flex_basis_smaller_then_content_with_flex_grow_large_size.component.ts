
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="flex_basis_smaller_then_content_with_flex_grow_large_size"></ActionBar>
  <TSCView id="test-root" style="flex-direction: row; width: 100dip;" backgroundColor="red">
  <TSCView style="flex-basis: 0dip; flex-grow: 1; flex-direction: column;" backgroundColor="green">
    <TSCView style="width: 70dip; height: 100dip;" backgroundColor="blue"></TSCView>
  </TSCView>
  <TSCView style="flex-basis: 0dip; flex-grow: 1; flex-direction: column;" backgroundColor="yellow">
    <TSCView style="width: 20dip; height: 100dip;" backgroundColor="purple"></TSCView>
  </TSCView>
</TSCView>
  `,
})
export class FlexBasisSmallerThenContentWithFlexGrowLargeSizeComponent {}
