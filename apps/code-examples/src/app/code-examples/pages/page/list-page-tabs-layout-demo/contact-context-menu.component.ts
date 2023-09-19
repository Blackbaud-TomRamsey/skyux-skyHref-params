import { Component } from '@angular/core';
import { SkyDropdownModule } from '@skyux/popovers';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  standalone: true,
  selector: 'app-contacts-grid-context-menu',
  templateUrl: './contact-context-menu.component.html',
  imports: [SkyDropdownModule],
})
export class ContactContextMenuComponent implements ICellRendererAngularComp {
  protected contactName = '';

  public agInit(params: ICellRendererParams): void {
    this.contactName = params.data && params.data.name;
  }

  public refresh(): boolean {
    return false;
  }
}
