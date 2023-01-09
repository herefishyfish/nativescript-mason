
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="grid_fr_auto_no_sized_items"></ActionBar>
  <TSCView id="test-root" style="width: auto;height: auto;display: grid; grid-template-columns: 40dip 1fr 1fr;grid-template-rows: 40dip 1fr 1fr" backgroundColor="red">
  <TSCView backgroundColor="green"></TSCView>
  <TSCView backgroundColor="blue"></TSCView>
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
export class GridFrAutoNoSizedItemsComponent {}
