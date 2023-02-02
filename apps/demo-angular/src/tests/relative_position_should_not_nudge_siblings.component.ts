import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="relative_position_should_not_nudge_siblings"></ActionBar>
    <TSCView id="test-root" style="height: 100dip; width: 100dip; flex-direction: column;" testID="test-root" backgroundColor="red">
      <TSCView style="top: 15dip; height: 10dip;" backgroundColor="green"></TSCView>
      <TSCView style="top: 15dip; height: 10dip;" backgroundColor="blue"></TSCView>
    </TSCView>
  `,
})
export class RelativePositionShouldNotNudgeSiblingsComponent {}
