
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="align_self_flex_end_override_flex_start"></ActionBar>
  <TSCView id="test-root" style="width:100dip; height: 100dip; align-items: flex-start;" backgroundColor="red">
  <TSCView style="height: 10dip; width: 10dip; align-self: flex-end;" backgroundColor="green"></TSCView>
</TSCView>
  `,
})
export class AlignSelfFlexEndOverrideFlexStartComponent {}
