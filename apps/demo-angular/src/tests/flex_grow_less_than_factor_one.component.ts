
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="flex_grow_less_than_factor_one"></ActionBar>
  <TSCView id="test-root" style="width: 500dip; height: 200dip;" backgroundColor="red">
  <TSCView style="flex-grow:0.2; flex-shrink:0; flex-basis: 40dip;" backgroundColor="green"></TSCView>
  <TSCView style="flex-grow:0.2; flex-shrink:0;" backgroundColor="blue"></TSCView>
  <TSCView style="flex-grow:0.4; flex-shrink:0;" backgroundColor="yellow"></TSCView>
</TSCView>
  `,
})
export class FlexGrowLessThanFactorOneComponent {}
