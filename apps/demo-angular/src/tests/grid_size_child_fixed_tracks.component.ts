
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
  <ActionBar title="grid_size_child_fixed_tracks"></ActionBar>
  <TSCView id="test-root" style="height: 120dip; width: 120dip; display: grid; grid-template-columns: 40dip 40dip 40dip;grid-template-rows: 40dip 40dip 40dip;" backgroundColor="red">
  <Label style="align-self: start;justify-self: start;" backgroundColor="green">HH​HH​HH​HH</Label>
  <Label style="align-self: start;justify-self: start;" backgroundColor="blue">HHH​HHH</Label>
  <Label style="align-self: start;justify-self: start;" backgroundColor="yellow">HH​HHHH</Label>
  <Label style="align-self: start;justify-self: start;width:20dip" backgroundColor="purple">HH​HH​HH​HH</Label>
  <Label style="align-self: start;justify-self: start;max-width:30dip" backgroundColor="cyan">HH​HH​HH​HH</Label>
</TSCView>
  `,
})
export class GridSizeChildFixedTracksComponent {}
