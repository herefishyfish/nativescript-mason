import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="flex_wrap_align_stretch_fits_one_row"></ActionBar>
    <TSCView id="test-root" style="width: 150dip; height: 100dip; flex-wrap: wrap; flex-direction: row;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 50dip;" backgroundColor="green"></TSCView>
      <TSCView style="width: 50dip;" backgroundColor="blue"></TSCView>
    </TSCView>
  `,
})
export class FlexWrapAlignStretchFitsOneRowComponent {}
