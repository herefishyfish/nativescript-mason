
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="margin_should_not_be_part_of_max_width"></ActionBar>
  <TSCView id="test-root" style="width: 250dip; height: 250dip;" backgroundColor="red">
  <TSCView style="width: 100dip; height: 100dip; max-width: 100dip; margin-left: 20dip;" backgroundColor="green"></TSCView>
</TSCView>
  `,
})
export class MarginShouldNotBePartOfMaxWidthComponent {}
