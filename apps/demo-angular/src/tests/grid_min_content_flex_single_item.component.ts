
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="grid_min_content_flex_single_item"></ActionBar>
  <TSCView id="test-root" style="display: grid; grid-template-columns: 40dip min-content 1fr;grid-template-rows: 40dip 40dip 40dip" backgroundColor="red">
  <TSCView backgroundColor="green"></TSCView>
  <TSCView style="min-width: 10dip;" backgroundColor="blue"></TSCView>
  <TSCView backgroundColor="yellow"></TSCView>
  <TSCView backgroundColor="purple"></TSCView>
  <Label style="grid-column: span 2" backgroundColor="cyan">HH​HH</Label>
  <TSCView backgroundColor="gray"></TSCView>
  <TSCView backgroundColor="darkGray"></TSCView>
  <TSCView backgroundColor="lightGray"></TSCView>
</TSCView>
  `,
})
export class GridMinContentFlexSingleItemComponent {}
