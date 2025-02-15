import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SkyDropdownModule } from '@skyux/popovers';

type DropdownItem = {
  name: string;
  disabled: boolean;
};

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [CommonModule, SkyDropdownModule],
})
export class DemoComponent {
  protected items: DropdownItem[] = [
    { name: 'Option 1', disabled: false },
    { name: 'Disabled option', disabled: true },
    { name: 'Option 3', disabled: false },
    { name: 'Option 4', disabled: false },
    { name: 'Option 5', disabled: false },
  ];

  public actionClicked(action: string): void {
    alert(`You selected ${action}.`);
  }
}
