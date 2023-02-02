import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="absolute_layout_no_size"></ActionBar>
    <TSCView id="test-root" style="height: 100dip; width: 100dip;" testID="test-root" backgroundColor="red">
      <TSCView style="position: absolute;" backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class AbsoluteLayoutNoSizeComponent {}
