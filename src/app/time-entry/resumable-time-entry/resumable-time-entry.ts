import { formatDate } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Project } from '../../model/project.model';
import { TimeEntry } from '../../model/time-entry.model';
import { ProjectTaskSelectorButton } from '../../project/project-selector-button/project-task-selector-button';
import { DurationPipe } from '../../shared/pipes/duration.pipe';
import { TimeEntryBillableButton } from '../time-entry-billable-button/time-entry-billable-button';
import { TimeEntryDescription } from '../time-entry-description/time-entry-description';

@Component({
  selector: 'app-resumable-time-entry',
  imports: [
    DurationPipe,
    TimeEntryDescription,
    ProjectTaskSelectorButton,
    TimeEntryBillableButton,
  ],
  templateUrl: './resumable-time-entry.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './resumable-time-entry.css',
})
export class ResumableTimeEntry {
  readonly timeEntry = input.required<TimeEntry>();

  readonly resumeTimeEntryEvent = output<TimeEntry>();
  readonly deleteTimeEntryEvent = output<TimeEntry>();
  readonly updateTimeEntryProjectEvent = output<{ timeEntry: TimeEntry, newProject: Project }>();
  readonly updateTimeEntryDescriptionEvent = output<{ timeEntry: TimeEntry, newDescription: string }>();

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
}
