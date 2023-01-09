
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="grid_relayout_vertical_text"></ActionBar>
  <TSCView id="test-root" style="display: grid;grid-template-columns: min-content;grid-template-rows: 40dip;" backgroundColor="red">
    <Label style="writing-mode: vertical-lr;" backgroundColor="green">HH​HH​HH​HH​HH​HH​HH</Label>
    <Label backgroundColor="blue">HH​HH​HH</Label>
  </TSCView>
  `,
})
export class GridRelayoutVerticalTextComponent {}
