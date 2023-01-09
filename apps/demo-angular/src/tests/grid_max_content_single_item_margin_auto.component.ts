
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="grid_max_content_single_item_margin_auto"></ActionBar>
  <TSCView id="test-root" style="display: grid; grid-template-columns: 40dip max-content 40dip;grid-template-rows: 40dip 40dip 40dip" backgroundColor="red">
  <TSCView backgroundColor="green"></TSCView>
  <Label style="margin: auto" backgroundColor="blue">HH​HH</Label>
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
export class GridMaxContentSingleItemMarginAutoComponent {}
