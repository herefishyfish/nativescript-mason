import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="grid_basic_implicit_tracks"></ActionBar>
    <TSCView id="test-root" style="display: grid; grid-template-columns: 40dip;grid-template-rows: 40dip;" testID="test-root" backgroundColor="red">
      <TSCView backgroundColor="green"></TSCView>
      <TSCView style="width: 35dip;height:35dip;" backgroundColor="blue"></TSCView>
    </TSCView>
  `,
})
export class GridBasicImplicitTracksComponent {}
