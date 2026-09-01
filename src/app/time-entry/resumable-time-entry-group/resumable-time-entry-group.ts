import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Project } from '../../model/project.model';
import { ProjectTaskSelectorButton } from '../../project/project-selector-button/project-task-selector-button';
import {
  computeDuration,
  Duration,
  durationFromMs,
  formatHHMMSSTime,
  toHHmmTime,
} from '../../shared/util/time.util';
import { TimeEntry } from '../models/time-entry.model';
import { ResumableTimeEntry } from '../resumable-time-entry/resumable-time-entry';
import { TimeEntryStore } from '../stores/time-entry.store';
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
  private readonly timeEntryStore: TimeEntryStore = inject(TimeEntryStore);

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
    this.timeEntryStore.resume(timeEntry);
  }

  deleteGroup(): void {
    this.timeEntries().forEach((timeEntry) => this.timeEntryStore.delete(timeEntry));
  }

  updateGroupDescription(newDescription: string): void {
    this.timeEntries().forEach((timeEntry) => this.timeEntryStore.patchDescription(timeEntry, newDescription));
  }

  updateGroupProject(newProject: Project): void {
    this.timeEntries().forEach((timeEntry) => this.timeEntryStore.patchProject(timeEntry, newProject));
  }

  updateGroupBillable(isBillable: boolean): void {
    this.timeEntries().forEach((timeEntry) => this.timeEntryStore.patchBillable(timeEntry, isBillable));
  }
}
