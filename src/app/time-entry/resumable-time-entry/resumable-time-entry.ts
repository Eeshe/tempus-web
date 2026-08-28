import { formatDate } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, OnInit, output, signal } from '@angular/core';
import { Project } from '../../model/project.model';
import { TimeEntry } from '../../model/time-entry.model';
import { ProjectTaskSelectorButton } from '../../project/project-selector-button/project-task-selector-button';
import { TimeInput } from '../../shared/input/time-input/time-input';
import { DurationPipe } from '../../shared/pipes/duration.pipe';
import { fromHHmmTime, HHmmToMinutes, toHHmmTime } from '../../shared/util/time.util';
import { TimeEntryBillableButton } from '../time-entry-billable-button/time-entry-billable-button';
import { TimeEntryDescription } from '../time-entry-description/time-entry-description';

@Component({
  selector: 'app-resumable-time-entry',
  imports: [
    DurationPipe,
    TimeEntryDescription,
    ProjectTaskSelectorButton,
    TimeEntryBillableButton,
    TimeInput,
  ],
  templateUrl: './resumable-time-entry.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './resumable-time-entry.css',
})
export class ResumableTimeEntry implements OnInit {
  readonly timeEntry = input.required<TimeEntry>();

  readonly startTimeInput = signal<string>("");
  readonly endTimeInput = signal<string>("");

  readonly resumeTimeEntryEvent = output<TimeEntry>();
  readonly deleteTimeEntryEvent = output<TimeEntry>();
  readonly updateTimeEntryProjectEvent = output<{ timeEntry: TimeEntry, newProject: Project }>();
  readonly updateTimeEntryDescriptionEvent = output<{ timeEntry: TimeEntry, newDescription: string }>();
  readonly updateTimeEntryStartTimeEvent = output<{ timeEntry: TimeEntry, newStartTime: Date }>();
  readonly updateTimeEntryEndTimeEvent = output<{ timeEntry: TimeEntry, newEndTime: Date }>();

  ngOnInit(): void {
    this.setDefaultStartTime();
    this.setDefaultEndTime();
  }

  formatTime(date: string | null): string {
    if (date == null) {
      return '';
    }
    return formatDate(date, 'HH:mm', 'en-US', Intl.DateTimeFormat().resolvedOptions().timeZone);
  }

  updateTimeEntryDescription(newDescription: string): void {
    this.updateTimeEntryDescriptionEvent.emit({
      timeEntry: this.timeEntry(),
      newDescription,
    })
  }

  updateTimeEntryProject(newProject: Project): void {
    this.updateTimeEntryProjectEvent.emit({
      timeEntry: this.timeEntry(),
      newProject: newProject,
    })
  }

  updateTimeEntryStartTime(newStartTime: string | null): void {
    if (newStartTime == null || newStartTime === "" || newStartTime.length < 5) {
      this.setDefaultStartTime();
      return;
    }
    const startTimeMinutes: number = HHmmToMinutes(newStartTime);
    const endTimeMinutes: number = HHmmToMinutes(this.endTimeInput());
    if (startTimeMinutes === endTimeMinutes) {
      this.setDefaultStartTime();
      return;
    }
    const startTimeDate: Date = new Date(this.timeEntry().startTime);
    if (startTimeMinutes > endTimeMinutes) {
      startTimeDate.setDate(startTimeDate.getDate() - 1);
    }
    this.updateTimeEntryStartTimeEvent.emit({
      timeEntry: this.timeEntry(),
      newStartTime: fromHHmmTime(newStartTime, startTimeDate),
    });
  }

  private setDefaultStartTime(): void {
    this.startTimeInput.set(toHHmmTime(new Date(this.timeEntry().startTime)));
  }

  updateTimeEntryEndTime(newEndTime: string | null): void {
    if (newEndTime == null || newEndTime === "" || newEndTime.length < 5) {
      this.setDefaultEndTime();
      return;
    }
    const startTimeMinutes: number = HHmmToMinutes(this.startTimeInput());
    const endTimeMinutes: number = HHmmToMinutes(newEndTime);
    if (startTimeMinutes === endTimeMinutes) {
      this.setDefaultEndTime();
      return;
    }
    const endTimeDate: Date = new Date(this.timeEntry().endTime!);
    if (endTimeMinutes < startTimeMinutes) {
      endTimeDate.setDate(endTimeDate.getDate() + 1);
    }
    this.updateTimeEntryEndTimeEvent.emit({
      timeEntry: this.timeEntry(),
      newEndTime: fromHHmmTime(newEndTime, endTimeDate),
    });
  }

  private setDefaultEndTime(): void {
    this.endTimeInput.set(toHHmmTime(new Date(this.timeEntry().endTime!)));
  }

}
