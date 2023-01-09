import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
<<<<<<< HEAD
  <ActionBar title="absolute_layout_width_height_start_top"></ActionBar>
  <TSCView id="test-root" style="width: 100dip; height: 100dip;" backgroundColor="red">
  <TSCView style="width: 10dip; height: 10dip; position: absolute; left: 10dip; top: 10dip;" backgroundColor="green"></TSCView>
</TSCView>
=======
    <ActionBar title="absolute_layout_width_height_start_top"></ActionBar>
    <TSCView id="test-root" style="width: 100dip; height: 100dip;" backgroundColor="red">
      <TSCView style="width: 10dip; height: 10dip; position: absolute; left: 10dip; top: 10dip;" backgroundColor="green"></TSCView>
    </TSCView>
>>>>>>> 7fff08659e98cfd091aecc60113fc1c6002389c7
  `,
})
export class AbsoluteLayoutWidthHeightStartTopComponent {}
