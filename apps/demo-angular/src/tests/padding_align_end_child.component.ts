import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="padding_align_end_child"></ActionBar>
    <TSCView id="test-root" style="width: 200dip; height: 200dip; justify-content: flex-end; align-items: flex-end;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 100dip; height: 100dip; padding: 20dip;" backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class PaddingAlignEndChildComponent {}
