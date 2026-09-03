import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-billable-selector',
  styleUrl: './billable-selector.css',
  templateUrl: './billable-selector.html',
})
export class BillableSelector {
  readonly isBillable = input<boolean>(false);

  readonly isBillableChangeEvent = output<boolean>();

  toggle(): void {
    this.isBillableChangeEvent.emit(!this.isBillable());
  }
}
