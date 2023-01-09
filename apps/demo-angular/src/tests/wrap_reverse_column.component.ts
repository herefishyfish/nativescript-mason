
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="wrap_reverse_column"></ActionBar>
  <TSCView id="test-root" style="width: 100dip; height: 100dip; flex-wrap: wrap-reverse; flex-direction: column;" backgroundColor="red">
  <TSCView style="height: 31dip; width: 30dip;" backgroundColor="green"></TSCView>
  <TSCView style="height: 32dip; width: 30dip;" backgroundColor="blue"></TSCView>
  <TSCView style="height: 33dip; width: 30dip;" backgroundColor="yellow"></TSCView>
  <TSCView style="height: 34dip; width: 30dip;" backgroundColor="purple"></TSCView>
</TSCView>
  `,
})
export class WrapReverseColumnComponent {}
