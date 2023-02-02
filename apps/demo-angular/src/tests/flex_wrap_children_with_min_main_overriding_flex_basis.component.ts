import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="flex_wrap_children_with_min_main_overriding_flex_basis"></ActionBar>
    <TSCView id="test-root" style="width: 100dip; flex-wrap: wrap; flex-direction: row;" testID="test-root" backgroundColor="red">
      <TSCView style="flex-basis: 50dip; height: 50dip; min-width: 55dip;" backgroundColor="green"></TSCView>
      <TSCView style="flex-basis: 50dip; height: 50dip; min-width: 55dip;" backgroundColor="blue"></TSCView>
    </TSCView>
  `,
})
export class FlexWrapChildrenWithMinMainOverridingFlexBasisComponent {}
