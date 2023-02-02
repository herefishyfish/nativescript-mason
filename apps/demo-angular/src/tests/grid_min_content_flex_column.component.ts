import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="grid_min_content_flex_column"></ActionBar>
    <TSCView id="test-root" style="display: grid; grid-template-columns: min-content;grid-template-rows: 40dip" testID="test-root" backgroundColor="red">
      <TSCView style="display: flex;flex-direction: column" backgroundColor="green">
        <Label backgroundColor="blue">HH​HH</Label>
        <Label backgroundColor="yellow">HH​HH</Label>
        <Label backgroundColor="purple">HH​HH</Label>
      </TSCView>
    </TSCView>
  `,
})
export class GridMinContentFlexColumnComponent {}
