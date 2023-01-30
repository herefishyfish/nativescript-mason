
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="align_baseline_child_multiline"></ActionBar>
  <!-- <div id="test-root" style="width: 100px; align-items: baseline;">
  <div style="width: 50px; height: 60px;"></div>
  <div style="width: 50px; flex-wrap: wrap;">
    <div style="width: 25px; height: 20px;"></div>
    <div style="width: 25px; height: 10px;"></div>
    <div style="width: 25px; height: 20px;"></div>
    <div style="width: 25px; height: 10px;"></div>
  </div>
</div> -->

<TSCView id="test-root" style="width: 100dip; align-items: baseline;background-color: red;" backgroundColor="red">
  <TSCView style="width: 50dip; height: 60dip;background-color: green;" backgroundColor="green"></TSCView>
  <TSCView style="width: 50dip; flex-wrap: wrap;background-color: blue;" backgroundColor="blue">
    <TSCView style="width: 25dip; height: 20dip;background-color: yellow;" backgroundColor="yellow"></TSCView>
    <TSCView style="width: 25dip; height: 10dip;background-color: purple;" backgroundColor="purple"></TSCView>
    <TSCView style="width: 25dip; height: 20dip;background-color: cyan;" backgroundColor="cyan"></TSCView>
    <TSCView style="width: 25dip; height: 10dip;background-color: gray;" backgroundColor="gray"></TSCView>
  </TSCView>
</TSCView>
  `,
})
export class AlignBaselineChildMultilineComponent {}
