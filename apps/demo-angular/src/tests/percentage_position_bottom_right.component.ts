
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="percentage_position_bottom_right"></ActionBar>
  <TSCView id="test-root" style="width: 500dip; height: 500dip; flex-direction: row;" backgroundColor="red">
  <TSCView style="width: 55%; height: 15%; bottom: 10%; right: 20%" backgroundColor="green"></TSCView>
</TSCView>
  `,
})
export class PercentagePositionBottomRightComponent {}
