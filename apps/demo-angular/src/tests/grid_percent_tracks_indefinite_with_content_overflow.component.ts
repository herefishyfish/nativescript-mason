import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="grid_percent_tracks_indefinite_with_content_overflow"></ActionBar>
    <TSCView id="test-root" style="display: grid; grid-template-columns: 40% 40% 40%;grid-template-rows: 50% 80%;" testID="test-root" backgroundColor="red">
      <TSCView style="grid-row:1;grid-column:1;width: 100dip; height: 100dip;" backgroundColor="green"></TSCView>
      <TSCView style="grid-row:1;grid-column:1" backgroundColor="blue"></TSCView>
      <TSCView backgroundColor="yellow"></TSCView>
      <TSCView backgroundColor="purple"></TSCView>
      <TSCView backgroundColor="cyan"></TSCView>
      <TSCView backgroundColor="gray"></TSCView>
      <TSCView backgroundColor="darkGray"></TSCView>
    </TSCView>
  `,
})
export class GridPercentTracksIndefiniteWithContentOverflowComponent {}
