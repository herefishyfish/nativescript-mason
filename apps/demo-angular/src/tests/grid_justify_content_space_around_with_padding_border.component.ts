import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="grid_justify_content_space_around_with_padding_border"></ActionBar>
    <TSCView id="test-root" style="height: 200dip; width: 200dip; display: grid; grid-template-columns: 40dip 40dip 40dip;grid-template-rows: 40dip 40dip 40dip;justify-content: space-around;padding: 10dip 20dip 30dip 40dip;border-width: 2dip 4dip 6dip 8dip;" testID="test-root" backgroundColor="red">
      <TSCView backgroundColor="green"></TSCView>
      <TSCView backgroundColor="blue"></TSCView>
      <TSCView backgroundColor="yellow"></TSCView>
      <TSCView backgroundColor="purple"></TSCView>
      <TSCView backgroundColor="cyan"></TSCView>
      <TSCView backgroundColor="gray"></TSCView>
      <TSCView backgroundColor="darkGray"></TSCView>
      <TSCView backgroundColor="lightGray"></TSCView>
      <TSCView backgroundColor="lightBlue"></TSCView>
    </TSCView>
  `,
})
export class GridJustifyContentSpaceAroundWithPaddingBorderComponent {}
