import { Component, computed, inject, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { TimeEntry } from '../../model/time-entry.model';
import {
  computeDuration,
  Duration,
  durationFromMs,
  formatHHMMSSTime,
} from '../../shared/util/time.util';
import { DisplayNamePipe } from '../../shared/pipes/time-entry.pipe';
import { TimeEntryService } from '../../services/time-entry.service';
import { TimeEntryDescription } from '../time-entry-description/time-entry-description';
import { ResumableTimeEntry } from '../resumable-time-entry/resumable-time-entry';

@Component({
  selector: 'app-resumable-time-entry-group',
  imports: [DisplayNamePipe, TimeEntryDescription, ResumableTimeEntry],
  templateUrl: './resumable-time-entry-group.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './resumable-time-entry-group.css',
})
export class ResumableTimeEntryGroup {
  private readonly timeEntryService: TimeEntryService = inject(TimeEntryService);

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

  readonly resumeTimeEntryEvent = output<TimeEntry>();
  readonly deleteTimeEntryEvent = output<TimeEntry>();

  toggleCollapsible(): void {
    this.isExpanded.update((value) => !value);
  }

  resumeTimeEntry(timeEntry: TimeEntry): void {
    this.timeEntryService.resumeTimeEntry(timeEntry).subscribe((newTimeEntry) => {
      this.resumeTimeEntryEvent.emit(newTimeEntry);
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
