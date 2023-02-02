import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="align_items_min_max"></ActionBar>
    <TSCView id="test-root" style="max-width: 200dip; min-width: 100dip; height: 100dip; align-items: center; flex-direction: column;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 60dip; height: 60dip;" backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class AlignItemsMinMaxComponent {}
