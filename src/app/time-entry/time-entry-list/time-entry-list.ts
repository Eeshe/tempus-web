import { Component, inject, Signal } from '@angular/core';
import { ActiveTimeEntry } from '../active-time-entry/active-time-entry';
import { TimeEntry } from '../models/time-entry.model';
import { ResumableTimeEntryGroup } from '../resumable-time-entry-group/resumable-time-entry-group';
import { TimeEntryStore } from '../stores/time-entry.store';

@Component({
  imports: [ActiveTimeEntry, ResumableTimeEntryGroup],
  selector: 'app-time-entry-list',
  styleUrl: './time-entry-list.css',
  templateUrl: './time-entry-list.html',
})
export class TimeEntryList {
  private readonly timeEntryStore: TimeEntryStore = inject(TimeEntryStore);

  readonly timeEntries: Signal<TimeEntry[]> = this.timeEntryStore.timeEntries;
  readonly activeTimeEntries: Signal<TimeEntry[]> = this.timeEntryStore.activeTimeEntries;
  readonly dayGroupedTimeEntries = this.timeEntryStore.dayGroupedTimeEntries;

  constructor() {
    this.timeEntryStore.load();
  }

  countTotalTimeEntries(map: Map<string, TimeEntry[]>): number {
    return [...map.values()].reduce((sum, arr) => sum + arr.length, 0);
  }

  hasAtLeastOneEndedTimeEntry(map: Map<string, TimeEntry[]>): boolean {
    for (const timeEntries of map.values()) {
      if (timeEntries.some(timeEntry => timeEntry.endTime != null)) return true;
    }
    return false;
  }
}
