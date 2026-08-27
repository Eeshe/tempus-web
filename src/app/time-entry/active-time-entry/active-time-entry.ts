import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, model, output } from '@angular/core';
import { map, timer } from 'rxjs';
import { Project } from '../model/project.model';
import { TimeEntry } from '../model/time-entry.model';
import { ProjectTaskSelectorButton } from '../project/project-selector-button/project-task-selector-button';
import { TimeEntryService } from '../services/time-entry.service';
import { TimeEntryBillableButton } from '../time-entry/time-entry-billable-button/time-entry-billable-button';
import { TimeEntryDescription } from '../time-entry/time-entry-description/time-entry-description';

@Component({
  selector: 'app-active-time-entry',
  imports: [
    AsyncPipe,
    TimeEntryDescription,
    ProjectTaskSelectorButton,
    TimeEntryBillableButton],
  templateUrl: './active-time-entry.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './active-time-entry.css',
})
export class ActiveTimeEntryComponent {
  private readonly timeEntryService: TimeEntryService = inject(TimeEntryService);

  readonly activeTimeEntry = model.required<TimeEntry>();

  readonly deleteActiveTimeEntryEvent = output<TimeEntry>();
  readonly stopActiveTimeEntryEvent = output<TimeEntry>();

  elapsedTime$ = timer(0, 1000).pipe(map(() => this.formatElapsedTime()));

  formatElapsedTime(): string {
    const start = new Date(this.activeTimeEntry().startTime).getTime();
    const diffMs = Math.max(0, Date.now() - start); // clamp negatives (future dates)

    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  saveTimeEntryDescription(newDescription: string): void {
    this.timeEntryService.patchTimeEntryDescription(this.activeTimeEntry(), newDescription).subscribe();
  }

  stopTimeEntry(): void {
    console.log(new Date());
    console.log(new Date().toISOString());
    this.timeEntryService.patchTimeEntryEndTime(this.activeTimeEntry(), new Date()).subscribe(
      patchedTimeEntry => this.stopActiveTimeEntryEvent.emit(patchedTimeEntry)
    );
  }

  deleteTimeEntry(): void {
    this.timeEntryService.deleteTimeEntry(this.activeTimeEntry()).subscribe();
    this.deleteActiveTimeEntryEvent.emit(this.activeTimeEntry());
  }

  updateTimeEntryProject(project: Project): void {
    this.timeEntryService.patchTimeEntryProject(this.activeTimeEntry(), project).subscribe(
      patchedTimeEntry => this.activeTimeEntry.set(patchedTimeEntry)
    );
  }
}
