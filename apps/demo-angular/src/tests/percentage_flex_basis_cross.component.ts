import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
<<<<<<< HEAD
  <ActionBar title="percentage_flex_basis_cross"></ActionBar>
  <TSCView id="test-root" style="width: 200dip; height: 400dip; flex-direction: column;" backgroundColor="red">
  <TSCView style="flex-grow: 1; flex-basis: 50%;" backgroundColor="green"></TSCView>
  <TSCView style="flex-grow: 1; flex-basis: 25%;" backgroundColor="blue"></TSCView>
</TSCView>
=======
    <ActionBar title="percentage_flex_basis_cross"></ActionBar>
    <TSCView id="test-root" style="width: 200dip; height: 400dip; flex-direction: column;" backgroundColor="red">
      <TSCView style="flex-grow: 1; flex-basis: 50%;" backgroundColor="green"></TSCView>
      <TSCView style="flex-grow: 1; flex-basis: 25%;" backgroundColor="blue"></TSCView>
    </TSCView>
>>>>>>> 7fff08659e98cfd091aecc60113fc1c6002389c7
  `,
})
export class PercentageFlexBasisCrossComponent {}
