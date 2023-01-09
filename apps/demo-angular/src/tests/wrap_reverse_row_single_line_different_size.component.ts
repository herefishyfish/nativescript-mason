
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="wrap_reverse_row_single_line_different_size"></ActionBar>
  <TSCView id="test-root" style="width: 300dip; flex-direction: row; flex-wrap: wrap-reverse; align-content: flex-start;" backgroundColor="red">
  <TSCView style="height: 10dip; width: 30dip;" backgroundColor="green"></TSCView>
  <TSCView style="height: 20dip; width: 30dip;" backgroundColor="blue"></TSCView>
  <TSCView style="height: 30dip; width: 30dip;" backgroundColor="yellow"></TSCView>
  <TSCView style="height: 40dip; width: 30dip;" backgroundColor="purple"></TSCView>
  <TSCView style="height: 50dip; width: 30dip;" backgroundColor="cyan"></TSCView>
</TSCView>
  `,
})
export class WrapReverseRowSingleLineDifferentSizeComponent {}
