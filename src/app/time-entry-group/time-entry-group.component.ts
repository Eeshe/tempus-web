import { Component, computed, input, output, signal } from '@angular/core';
import { TimeEntry } from '../model/time-entry.model';
import { formatDate } from '@angular/common';
import { DurationPipe } from '../shared/pipes/duration.pipe';
import { computeDuration, Duration, durationFromMs, formatHHMMSSTime } from '../shared/util/time.util';
import { DisplayNamePipe } from '../shared/pipes/time-entry.pipe';
import { TimeEntryService } from '../services/time-entry.service';
import { TimeEntryDescription } from '../time-entry/time-entry-description/time-entry-description';

@Component({
  selector: 'app-time-entry-group-component',
  imports: [DurationPipe, DisplayNamePipe, TimeEntryDescription],
  templateUrl: './time-entry-group.component.html',
  styleUrl: './time-entry-group.component.css',
})
export class TimeEntryGroupComponent {
  readonly timeEntries = input.required<TimeEntry[]>();
  readonly formattedTotalDuration = computed<string>(() => {
    let totalDurationMs: number = 0;
    for (const timeEntry of this.timeEntries()) {
      const duration: Duration | null = computeDuration(timeEntry.startTime, timeEntry.endTime);
      if (duration == null) {
        continue;
      }
      totalDurationMs += duration.totalMilliseconds;
    }
    return formatHHMMSSTime(durationFromMs(totalDurationMs));
  });
  readonly isExpanded = signal<boolean>(false);

  readonly continueTimeEntryEvent = output<TimeEntry>();
  readonly deleteTimeEntryEvent = output<TimeEntry>();

  constructor(private timeEntryService: TimeEntryService) { }

  formatTime(date: string | null): string {
    if (date == null) {
      return "";
    }
    return formatDate(date, "HH:mm", "en-US");
  }

  toggleCollapsible(): void {
    this.isExpanded.update((value) => !value);
  }

  continueTimeEntry(timeEntry: TimeEntry): void {
    this.timeEntryService.continueTimeEntry(timeEntry).subscribe(newTimeEntry => {
      this.continueTimeEntryEvent.emit(newTimeEntry);
    });
  }

  deleteGroup(): void {
    for (const timeEntry of this.timeEntries()) {
      this.deleteTimeEntry(timeEntry);
    }
  }

  deleteTimeEntry(timeEntry: TimeEntry): void {
    this.timeEntryService.deleteTimeEntry(timeEntry).subscribe();
    this.deleteTimeEntryEvent.emit(timeEntry);
  }
}
