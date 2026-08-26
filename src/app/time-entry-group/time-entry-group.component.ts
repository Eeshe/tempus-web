import { Component, computed, input, signal } from '@angular/core';
import { TimeEntry } from '../model/time-entry.model';
import { formatDate } from '@angular/common';
import { DurationPipe } from '../shared/pipes/duration.pipe';
import { computeDuration, Duration, durationFromMs, formatHHMMSSTime } from '../shared/util/time.util';

@Component({
  selector: 'app-time-entry-group-component',
  imports: [DurationPipe],
  templateUrl: './time-entry-group.component.html',
  styleUrl: './time-entry-group.component.css',
})
export class TimeEntryGroupComponent {
  readonly timeEntries = input.required<TimeEntry[]>();
  readonly formattedTotalDuration = computed<string>(() => {
    console.log("TIME ENTRIES:", this.timeEntries());
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

  generateProjectDisplayName(timeEntry: TimeEntry): string {
    return timeEntry.project.name + (timeEntry.task ? ":" + timeEntry.task.name : "")
  }

  formatTime(date: string | null): string {
    if (date == null) {
      return "";
    }
    return formatDate(date, "HH:mm", "en-US");
  }

  toggleCollapsible(): void {
    this.isExpanded.update((value) => !value);
  }
}
