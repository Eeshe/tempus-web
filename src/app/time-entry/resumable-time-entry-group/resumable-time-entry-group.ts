import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { Project } from '../../model/project.model';
import { TimeEntry } from '../../model/time-entry.model';
import { ProjectTaskSelectorButton } from '../../project/project-selector-button/project-task-selector-button';
import { TimeEntryService } from '../../services/time-entry.service';
import {
  computeDuration,
  Duration,
  durationFromMs,
  formatHHMMSSTime,
  toHHmmTime,
} from '../../shared/util/time.util';
import { ResumableTimeEntry } from '../resumable-time-entry/resumable-time-entry';
import { TimeEntryDescription } from '../time-entry-description/time-entry-description';

@Component({
  selector: 'app-resumable-time-entry-group',
  imports: [
    TimeEntryDescription,
    ProjectTaskSelectorButton,
    ResumableTimeEntry],
  templateUrl: './resumable-time-entry-group.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './resumable-time-entry-group.css',
})
export class ResumableTimeEntryGroup {
  private readonly timeEntryService: TimeEntryService = inject(TimeEntryService);

  readonly timeEntries = input.required<TimeEntry[]>();
  readonly formattedStartToEndTime = computed<string>(() => {
    const startTime: string = toHHmmTime(new Date(this.timeEntries()[this.timeEntries().length - 1].startTime));
    const endTime: string = toHHmmTime(new Date(this.timeEntries()[0].endTime!));

    return startTime + " – " + endTime;
  });
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
  readonly updateTimeEntryDescriptionEvent = output<{ timeEntry: TimeEntry, newDescription: string }>();
  readonly updateTimeEntryProjectEvent = output<{ timeEntry: TimeEntry, newProject: Project }>();
  readonly updateTimeEntryStartTimeEvent = output<{ timeEntry: TimeEntry, newStartTime: Date }>();
  readonly updateTimeEntryEndTimeEvent = output<{ timeEntry: TimeEntry, newEndTime: Date }>();

  toggleCollapsible(event?: MouseEvent): void {
    if (this.timeEntries().length <= 1) {
      return;
    }
    if (event && (event.target as HTMLElement).closest('button, input, select, textarea, a, [contenteditable="true"]')) {
      return;
    }
    this.isExpanded.update((value) => !value);
  }

  resumeTimeEntry(timeEntry: TimeEntry): void {
    this.timeEntryService.resumeTimeEntry(timeEntry).subscribe((newTimeEntry) => {
      this.resumeTimeEntryEvent.emit(newTimeEntry);
    });
  }

  deleteGroup(): void {
    for (const timeEntry of this.timeEntries()) {
      this.deleteTimeEntryEvent.emit(timeEntry);
    }
  }

  updateGroupDescription(newDescription: string): void {
    this.timeEntries().forEach((timeEntry) => this.updateTimeEntryDescriptionEvent.emit({
      timeEntry: timeEntry,
      newDescription: newDescription,
    }));
  }

  updateGroupProject(newProject: Project): void {
    this.timeEntries().forEach((timeEntry) => this.updateTimeEntryProjectEvent.emit({
      timeEntry: timeEntry,
      newProject: newProject,
    }));
  }
}
