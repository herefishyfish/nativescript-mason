
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="grid_fit_content_points_argument"></ActionBar>
  <TSCView id="test-root" style="display: grid; grid-template-columns: 40dip fit-content(30dip) 40dip;grid-template-rows: 40dip 40dip 40dip" backgroundColor="red">
  <TSCView backgroundColor="green"></TSCView>
  <Label backgroundColor="blue">HH​HH</Label>
  <TSCView backgroundColor="yellow"></TSCView>
  <TSCView backgroundColor="purple"></TSCView>
  <TSCView backgroundColor="cyan"></TSCView>
  <TSCView backgroundColor="gray"></TSCView>
  <TSCView backgroundColor="darkGray"></TSCView>
  <TSCView backgroundColor="lightGray"></TSCView>
  <TSCView backgroundColor="lightBlue"></TSCView>
</TSCView>
  `,
})
export class GridFitContentPointsArgumentComponent {}
