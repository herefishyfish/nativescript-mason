
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="align_stretch_should_size_based_on_parent"></ActionBar>
  <TSCView id="test-root" style="width: 100dip; height: 100dip;" backgroundColor="red">
  <TSCView style="flex-grow: 0; flex-shrink: 1; justify-content: center;" backgroundColor="green">
    <TSCView style="flex-grow: 1; flex-shrink: 1;" backgroundColor="blue">
      <TSCView style="width: 20dip; height: 20dip;" backgroundColor="yellow"></TSCView>
    </TSCView>
  </TSCView>
</TSCView>
  `,
})
export class AlignStretchShouldSizeBasedOnParentComponent {}
