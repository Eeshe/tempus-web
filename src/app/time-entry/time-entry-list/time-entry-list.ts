import { AsyncPipe } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { map } from 'rxjs';
import { TimerService } from '../../shared/services/timer.service';
import { computeDuration, durationFromMs, formatHHMMSSTime } from '../../shared/util/time.util';
import { ActiveTimeEntry } from '../active-time-entry/active-time-entry';
import { TimeEntry } from '../models/time-entry.model';
import { ResumableTimeEntryGroup } from '../resumable-time-entry-group/resumable-time-entry-group';
import { DayGroupedTimeEntries, TimeEntryStore } from '../stores/time-entry.store';

@Component({
  imports: [ActiveTimeEntry, ResumableTimeEntryGroup, AsyncPipe],
  selector: 'app-time-entry-list',
  styleUrl: './time-entry-list.css',
  templateUrl: './time-entry-list.html',
})
export class TimeEntryList {
  private readonly timeEntryStore: TimeEntryStore = inject(TimeEntryStore);
  private readonly timerService: TimerService = inject(TimerService);

  readonly timeEntries: Signal<TimeEntry[]> = this.timeEntryStore.timeEntries;
  readonly activeTimeEntries: Signal<TimeEntry[]> = this.timeEntryStore.activeTimeEntries;
  readonly dayGroupedTimeEntries = this.timeEntryStore.dayGroupedTimeEntries;

  readonly todayFormattedTime$ = this.timerService.oneSecondTick$.pipe(map(() => {
    const allTodayTimeEntries: TimeEntry[] = Array.from(this.dayGroupedTimeEntries()[0].allEntries.values()).flat();
    const totalTrackedTimeMs: number = allTodayTimeEntries.reduce((sum, timeEntry) => {
      const trackedTimeMs: number = computeDuration(timeEntry.startTime, timeEntry.endTime!)!.totalMilliseconds;

      return sum + trackedTimeMs;
    }, 0);

    return formatHHMMSSTime(durationFromMs(totalTrackedTimeMs));
  }));

  constructor() {
    this.timeEntryStore.load();
  }

  countTotalTimeEntries(map: Map<string, TimeEntry[]>): number {
    return [...map.values()].reduce((sum, arr) => sum + arr.length, 0);
  }

  isTodayGroup(dayGroupedTimeEntries: DayGroupedTimeEntries): boolean {
    const nowDate: Date = new Date();
    const startDate: Date = new Date(dayGroupedTimeEntries.allEntries.values().next().value![0].startTime);

    return nowDate.getDay() == startDate.getDay();
  }

  hasAtLeastOneEndedTimeEntry(timeEntries: TimeEntry[]): boolean {
    return timeEntries.some(timeEntry => timeEntry.endTime != null);
  }
}
