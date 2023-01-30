
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="percentage_position_left_top"></ActionBar>
  <TSCView id="test-root" style="width: 400dip; height: 400dip; flex-direction: row;" backgroundColor="red">
  <TSCView style="width: 45%; height: 55%; left: 10%; top: 20%" backgroundColor="green"></TSCView>
</TSCView>
  `,
})
export class PercentagePositionLeftTopComponent {}
