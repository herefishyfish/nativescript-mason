import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="flex_direction_column_no_height"></ActionBar>
    <TSCView id="test-root" style="width: 100dip; flex-direction: column;" testID="test-root" backgroundColor="red">
      <TSCView style="height: 10dip;" backgroundColor="green"></TSCView>
      <TSCView style="height: 10dip;" backgroundColor="blue"></TSCView>
      <TSCView style="height: 10dip;" backgroundColor="yellow"></TSCView>
    </TSCView>
  `,
})
export class FlexDirectionColumnNoHeightComponent {}
