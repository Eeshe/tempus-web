import { Component, inject, input } from '@angular/core';
import { TimeEntry } from '../../model/time-entry.model';
import { TimeEntryService } from '../../services/time-entry.service';

@Component({
  imports: [],
  selector: 'app-time-entry-billable-button',
  styleUrl: './time-entry-billable-button.css',
  templateUrl: './time-entry-billable-button.html',
})
export class TimeEntryBillableButton {
  private readonly timeEntryService: TimeEntryService = inject(TimeEntryService);

  readonly timeEntry = input.required<TimeEntry>();

  toggleBillable(): void {
    const newBillableStatus: boolean = !this.timeEntry().isBillable;
    this.timeEntry().isBillable = newBillableStatus;

    this.timeEntryService.patchTimeEntryBillable(this.timeEntry(), newBillableStatus).subscribe();
  }
}
