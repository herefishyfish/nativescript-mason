
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="border_stretch_child"></ActionBar>
  <TSCView id="test-root" style="width: 100dip; height: 100dip; border-width: 10dip;" backgroundColor="red">
  <TSCView style="width: 10dip;" backgroundColor="green"></TSCView>
</TSCView>
  `,
})
export class BorderStretchChildComponent {}
