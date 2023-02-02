import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="display_none_with_child"></ActionBar>
    <TSCView id="test-root" style="width: 100dip; height: 100dip; flex-direction: row;" testID="test-root" backgroundColor="red">
      <TSCView style="flex: 1;" backgroundColor="green"></TSCView>
      <TSCView style="flex: 1; display:none; flex-direction: column;" backgroundColor="blue">
        <TSCView style="flex: 1; width: 20dip;" backgroundColor="yellow"></TSCView>
      </TSCView>
      <TSCView style="flex: 1;" backgroundColor="purple"></TSCView>
    </TSCView>
  `,
})
export class DisplayNoneWithChildComponent {}
