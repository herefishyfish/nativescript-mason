
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="wrap_row_align_items_center"></ActionBar>
  <TSCView id="test-root" style="width: 100dip; flex-direction: row; flex-wrap: wrap; align-items: center;" backgroundColor="red">
  <TSCView style="height: 10dip; width: 30dip;" backgroundColor="green"></TSCView>
  <TSCView style="height: 20dip; width: 30dip;" backgroundColor="blue"></TSCView>
  <TSCView style="height: 30dip; width: 30dip;" backgroundColor="yellow"></TSCView>
  <TSCView style="height: 30dip; width: 30dip;" backgroundColor="purple"></TSCView>
</TSCView>
  `,
})
export class WrapRowAlignItemsCenterComponent {}
