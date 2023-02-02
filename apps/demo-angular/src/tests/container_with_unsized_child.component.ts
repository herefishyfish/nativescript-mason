import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <ActionBar title="container_with_unsized_child"></ActionBar>
    <TSCView id="test-root" style="width: 100dip; height: 100dip;" testID="test-root" backgroundColor="red">
      <TSCView backgroundColor="green"></TSCView>
    </TSCView>
  `,
})
export class ContainerWithUnsizedChildComponent {}
