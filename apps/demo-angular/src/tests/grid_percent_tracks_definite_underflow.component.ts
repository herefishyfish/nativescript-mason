import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="grid_percent_tracks_definite_underflow"></ActionBar>
    <TSCView id="test-root" style="height: 60dip; width: 120dip; display: grid; grid-template-columns: 10% 20% 30%;grid-template-rows: 30% 60%;" testID="test-root" backgroundColor="red">
      <TSCView backgroundColor="green"></TSCView>
      <TSCView backgroundColor="blue"></TSCView>
      <TSCView backgroundColor="yellow"></TSCView>
      <TSCView backgroundColor="purple"></TSCView>
      <TSCView backgroundColor="cyan"></TSCView>
      <TSCView backgroundColor="gray"></TSCView>
    </TSCView>
  `,
})
export class GridPercentTracksDefiniteUnderflowComponent {}
