import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="align_content_space_between_wrapped"></ActionBar>
    <TSCView id="test-root" style="width: 100dip; height: 100dip; flex-direction: row; flex-wrap: wrap; align-content: space-between;" testID="test-root" backgroundColor="red">
      <TSCView style="height: 10dip; width: 50dip" backgroundColor="green"></TSCView>
      <TSCView style="height: 10dip; width: 50dip" backgroundColor="blue"></TSCView>
      <TSCView style="height: 10dip; width: 50dip" backgroundColor="yellow"></TSCView>
      <TSCView style="height: 10dip; width: 50dip" backgroundColor="purple"></TSCView>
      <TSCView style="height: 10dip; width: 50dip" backgroundColor="cyan"></TSCView>
      <TSCView style="height: 10dip; width: 50dip" backgroundColor="gray"></TSCView>
    </TSCView>
  `,
})
export class AlignContentSpaceBetweenWrappedComponent {}
