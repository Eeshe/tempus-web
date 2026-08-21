import { formatDate } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TimeEntry } from '../../model/time-entry.model';
import { DurationPipe } from '../../shared/pipes/duration.pipe';
import { DisplayNamePipe } from '../../shared/pipes/time-entry.pipe';
import { TimeEntryDescription } from '../time-entry-description/time-entry-description';

@Component({
  selector: 'app-resumable-time-entry',
  imports: [DurationPipe, DisplayNamePipe, TimeEntryDescription],
  templateUrl: './resumable-time-entry.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './resumable-time-entry.css',
})
export class ResumableTimeEntry {
  readonly timeEntry = input.required<TimeEntry>();

  readonly resumeTimeEntryEvent = output<TimeEntry>();
  readonly deleteTimeEntryEvent = output<TimeEntry>();

  formatTime(date: string | null): string {
    if (date == null) {
      return '';
    }
    return formatDate(date, 'HH:mm', 'en-US', Intl.DateTimeFormat().resolvedOptions().timeZone);
  }
}
