import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="percentage_flex_basis"></ActionBar>
    <TSCView id="test-root" style="width: 200dip; height: 200dip; flex-direction: row;" testID="test-root" backgroundColor="red">
      <TSCView style="flex-grow: 1; flex-basis: 50%;" backgroundColor="green"></TSCView>
      <TSCView style="flex-grow: 1; flex-basis: 25%;" backgroundColor="blue"></TSCView>
    </TSCView>
  `,
})
export class PercentageFlexBasisComponent {}
