import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="absolute_layout_in_wrap_reverse_row_container"></ActionBar>
    <TSCView id="test-root" style="flex-direction: row; width:100dip; height: 100dip; flex-wrap: wrap-reverse;" testID="test-root" backgroundColor="red">
      <TSCView style="width:20dip; height:20dip; position: absolute;" backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class AbsoluteLayoutInWrapReverseRowContainerComponent {}
