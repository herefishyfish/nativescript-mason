import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="measure_stretch_overrides_measure"></ActionBar>
    <TSCView id="test-root" style="width: 20dip;height: 10dip;" testID="test-root" backgroundColor="red">
      <TSCView style="flex-basis: 5dip;flex-grow: 1;" backgroundColor="green"></TSCView>
      <Label style="flex-basis: 5dip;flex-grow: 1;" backgroundColor="blue">H</Label>
    </TSCView>
  `,
})
export class MeasureStretchOverridesMeasureComponent {}
