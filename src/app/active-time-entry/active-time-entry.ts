import { Component, input } from '@angular/core';
import { TimeEntry } from '../model/time-entry.model';
import { DisplayNamePipe } from '../shared/pipes/time-entry.pipe';
import { map, timer } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { TimeEntryDescription } from '../time-entry/time-entry-description/time-entry-description';

@Component({
  selector: 'app-active-time-entry',
  imports: [DisplayNamePipe, AsyncPipe, TimeEntryDescription],
  templateUrl: './active-time-entry.html',
  styleUrl: './active-time-entry.css',
})
export class ActiveTimeEntryComponent {
  readonly activeTimeEntry = input.required<TimeEntry>();

  elapsedTime$ = timer(0, 1000).pipe(map(() => this.formatElapsedTime()));

  formatElapsedTime(): string {
    const start = new Date(this.activeTimeEntry().startTime).getTime();
    const diffMs = Math.max(0, Date.now() - start); // clamp negatives (future dates)

    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  saveTimeEntryDescription(newDescription: string): void {
    alert("NEW DESCRIPTION: " + newDescription);
  }

  stopTimeEntry(): void {
    // TODO
    alert("STOPPED");
  }

  deleteTimeEntry(): void {
    alert("DELETED");
  }
}
