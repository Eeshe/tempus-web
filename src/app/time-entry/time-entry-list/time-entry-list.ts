import { formatDate } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Project } from '../../model/project.model';
import { TimeEntry } from '../../model/time-entry.model';
import { TimeEntryService } from '../../services/time-entry.service';
import { computeDuration, Duration, durationFromMs, formatHHMMSSTime } from '../../shared/util/time.util';
import { ActiveTimeEntry } from '../active-time-entry/active-time-entry';
import { ResumableTimeEntryGroup } from '../resumable-time-entry-group/resumable-time-entry-group';

interface DayGroupedTimeEntries {
  formattedDate: string;
  groupedEntries: Map<string, TimeEntry[]>;
  formattedTotalTime: string;
}

@Component({
  imports: [ActiveTimeEntry, ResumableTimeEntryGroup],
  selector: 'app-time-entry-list',
  styleUrl: './time-entry-list.css',
  templateUrl: './time-entry-list.html',
})
export class TimeEntryList implements OnInit {
  private readonly timeEntryService: TimeEntryService = inject(TimeEntryService);

  timeEntries = signal<TimeEntry[]>([]);

  activeTimeEntries = computed<TimeEntry[]>(() => {
    const activeTimeEntries: TimeEntry[] = [];
    for (const timeEntry of this.timeEntries()) {
      if (timeEntry.endTime !== null) {
        continue;
      }
      activeTimeEntries.push(timeEntry);
    }
    return activeTimeEntries;
  });

  dayGroupedTimeEntries = computed<DayGroupedTimeEntries[]>(() => this.groupTimeEntriesByDay());

  groupTimeEntriesByDay(): DayGroupedTimeEntries[] {
    const dayGroups: Map<string, Map<string, TimeEntry[]>> = new Map<string, Map<string, TimeEntry[]>>();

    for (const timeEntry of this.timeEntries()) {
      if (timeEntry.endTime == null) {
        continue;
      }
      const formattedDate: string = this.formatDayDate(timeEntry.startTime);
      // ID is project id + description + taskId + billable
      // Ex. Tempusv0.9.0Developmentfalse
      const timeEntryGroupId: string =
        timeEntry.project.id +
        (timeEntry.description ? timeEntry.description : '') +
        (timeEntry.task ? timeEntry.task.id : '') +
        timeEntry.isBillable;

      const dayProjectGroups: Map<string, TimeEntry[]> =
        dayGroups.get(formattedDate) ?? new Map<string, TimeEntry[]>();
      const groupedEntries: TimeEntry[] = dayProjectGroups.get(timeEntryGroupId) ?? [];

      groupedEntries.push(timeEntry);
      dayProjectGroups.set(timeEntryGroupId, groupedEntries);
      dayGroups.set(formattedDate, dayProjectGroups);
    }
    return Array.from(dayGroups, ([formattedDate, groupedEntries]) => {
      const totalTimeMs: number = [...groupedEntries.values()]
        .flatMap((entries) => entries)
        .reduce((sum, timeEntry) => {
          const duration: Duration | null = computeDuration(timeEntry.startTime, timeEntry.endTime);

          return sum + (duration?.totalMilliseconds ?? 0);
        }, 0);
      const formattedTotalTime: string = formatHHMMSSTime(durationFromMs(totalTimeMs));
      return {
        formattedDate: formattedDate,
        groupedEntries: groupedEntries,
        formattedTotalTime: formattedTotalTime,
      };
    });
  }

  ngOnInit(): void {
    this.timeEntryService.listTimeEntries().subscribe((response) => {
      this.timeEntries.set(response);
    });
  }

  private formatDayDate(date: string | null) {
    return date ? formatDate(date, 'EEEE, MMM d', 'en-US') : 'Unknown';
  }

  addTimeEntry(timeEntry: TimeEntry): void {
    this.timeEntries.update((timeEntries) => [...timeEntries, timeEntry]);
  }

  deleteTimeEntry(timeEntry: TimeEntry): void {
    this.timeEntryService.deleteTimeEntry(timeEntry).subscribe(() =>
      this.timeEntries.update((timeEntries) =>
        timeEntries.filter((oldTimeEntry) => oldTimeEntry.id !== timeEntry.id),
      ));
  }

  updateTimeEntryDescription(timeEntry: TimeEntry, newDescription: string): void {
    this.timeEntryService.patchTimeEntryDescription(timeEntry, newDescription).subscribe(
      patchedTimeEntry => this.updateTimeEntry(patchedTimeEntry));
  }

  updateTimeEntryProject(timeEntry: TimeEntry, newProject: Project): void {
    this.timeEntryService.patchTimeEntryProject(timeEntry, newProject).subscribe(
      patchedTimeEntry => this.updateTimeEntry(patchedTimeEntry));
  }

  updateTimeEntryStartTime(timeEntry: TimeEntry, newStartTime: Date): void {
    this.timeEntryService.patchTimeEntryStartTime(timeEntry, newStartTime).subscribe(
      patchedTimeEntry => this.updateTimeEntry(patchedTimeEntry));
  }

  updateTimeEntryEndTime(timeEntry: TimeEntry, newEndTime: Date): void {
    this.timeEntryService.patchTimeEntryEndTime(timeEntry, newEndTime).subscribe(
      patchedTimeEntry => this.updateTimeEntry(patchedTimeEntry));
  }

  private updateTimeEntry(updatedTimeEntry: TimeEntry): void {
    this.timeEntries.update((timeEntries) =>
      timeEntries.map(timeEntry =>
        timeEntry.id === updatedTimeEntry.id ?
          updatedTimeEntry : timeEntry));
  }

  stopActiveTimeEntry(stoppedTimeEntry: TimeEntry): void {
    this.timeEntries.update(timeEntries => timeEntries.map(timeEntry =>
      timeEntry.id === stoppedTimeEntry.id ? stoppedTimeEntry : timeEntry));
  }
}
