
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="margin_should_not_be_part_of_max_height"></ActionBar>
  <TSCView id="test-root" style="width: 250dip; height: 250dip;" backgroundColor="red">
  <TSCView style="width: 100dip; height: 100dip; max-height: 100dip; margin-top: 20dip;" backgroundColor="green"></TSCView>
</TSCView>
  `,
})
export class MarginShouldNotBePartOfMaxHeightComponent {}
