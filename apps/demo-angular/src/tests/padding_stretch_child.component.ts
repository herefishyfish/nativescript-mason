import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="padding_stretch_child"></ActionBar>
    <TSCView id="test-root" style="width: 100dip; height: 100dip; padding: 10dip;" testID="test-root" backgroundColor="red">
      <TSCView style="height: 10dip;" backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class PaddingStretchChildComponent {}
