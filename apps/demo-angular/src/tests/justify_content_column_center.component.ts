
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="justify_content_column_center"></ActionBar>
  <TSCView id="test-root" style="width: 100dip; height: 100dip; justify-content: center; flex-direction: column;" backgroundColor="red">
  <TSCView style="height: 10dip;" backgroundColor="green"></TSCView>
  <TSCView style="height: 10dip;" backgroundColor="blue"></TSCView>
  <TSCView style="height: 10dip;" backgroundColor="yellow"></TSCView>
</TSCView>
  `,
})
export class JustifyContentColumnCenterComponent {}
