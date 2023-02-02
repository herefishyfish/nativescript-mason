import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="flex_direction_row"></ActionBar>
    <TSCView id="test-root" style="height: 100dip; width: 100dip;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 10dip;" backgroundColor="green"></TSCView>
      <TSCView style="width: 10dip;" backgroundColor="blue"></TSCView>
      <TSCView style="width: 10dip;" backgroundColor="yellow"></TSCView>
    </TSCView>
  `,
})
export class FlexDirectionRowComponent {}
