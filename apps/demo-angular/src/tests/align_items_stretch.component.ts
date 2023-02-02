import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="align_items_stretch"></ActionBar>
    <TSCView id="test-root" style="width: 100dip; height: 100dip;" testID="test-root" backgroundColor="red">
      <TSCView style="width: 10dip;" backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class AlignItemsStretchComponent {}
