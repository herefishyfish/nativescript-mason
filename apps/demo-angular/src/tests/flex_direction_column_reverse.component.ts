import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="flex_direction_column_reverse"></ActionBar>
    <TSCView id="test-root" style="height: 100dip; width: 100dip; flex-direction: column-reverse;" testID="test-root" backgroundColor="red">
      <TSCView style="height: 10dip;" backgroundColor="green"></TSCView>
      <TSCView style="height: 10dip;" backgroundColor="blue"></TSCView>
      <TSCView style="height: 10dip;" backgroundColor="yellow"></TSCView>
    </TSCView>
  `,
})
export class FlexDirectionColumnReverseComponent {}
