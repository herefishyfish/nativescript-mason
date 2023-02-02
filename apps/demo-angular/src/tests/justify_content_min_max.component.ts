import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="justify_content_min_max"></ActionBar>
    <TSCView id="test-root" style="max-height: 200dip; min-height: 100dip; width: 100dip; justify-content: center; flex-direction: column;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 60dip; height: 60dip;" backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class JustifyContentMinMaxComponent {}
