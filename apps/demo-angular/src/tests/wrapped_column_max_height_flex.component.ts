import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="wrapped_column_max_height_flex"></ActionBar>
    <TSCView id="test-root" style="height: 500dip; width: 700dip; flex-direction: column;align-items: center; justify-content: center; align-content: center; flex-wrap:wrap;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 100dip; height: 500dip; max-height: 200dip; flex: 1;" backgroundColor="green"></TSCView>
      <TSCView style="width: 200dip; height: 200dip; margin: 20dip; flex: 1" backgroundColor="blue"></TSCView>
      <TSCView style="width: 100dip; height: 100dip;" backgroundColor="yellow"></TSCView>
    </TSCView>
  `,
})
export class WrappedColumnMaxHeightFlexComponent {}
