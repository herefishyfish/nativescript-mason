
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="align_content_space_evenly_single_line"></ActionBar>
  <TSCView id="test-root" style="width: 100dip; height: 100dip; flex-direction: row; align-content: space-evenly;" backgroundColor="red">
  <TSCView style="height: 10dip; width: 10dip" backgroundColor="green"></TSCView>
  <TSCView style="height: 10dip; width: 10dip" backgroundColor="blue"></TSCView>
  <TSCView style="height: 10dip; width: 10dip" backgroundColor="yellow"></TSCView>
  <TSCView style="height: 10dip; width: 10dip" backgroundColor="purple"></TSCView>
  <TSCView style="height: 10dip; width: 10dip" backgroundColor="cyan"></TSCView>
  <TSCView style="height: 10dip; width: 10dip" backgroundColor="gray"></TSCView>
</TSCView>
  `,
})
export class AlignContentSpaceEvenlySingleLineComponent {}
