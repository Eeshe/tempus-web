import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-billable-filter',
  styleUrl: './billable-filter.css',
  templateUrl: './billable-filter.html',
})
export class BillableFilter {
  readonly isBillable = input<boolean>(false);

  readonly isBillableChangeEvent = output<boolean>();

  toggle(): void {
    this.isBillableChangeEvent.emit(!this.isBillable());
  }
}
