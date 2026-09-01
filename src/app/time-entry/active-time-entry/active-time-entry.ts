import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, model } from '@angular/core';
import { map, timer } from 'rxjs';
import { Project } from '../../model/project.model';
import { ProjectTaskSelectorButton } from '../../project/project-selector-button/project-task-selector-button';
import { TimeEntry } from '../models/time-entry.model';
import { TimeEntryStore } from '../stores/time-entry.store';
import { TimeEntryBillableButton } from '../time-entry-billable-button/time-entry-billable-button';
import { TimeEntryDescription } from '../time-entry-description/time-entry-description';

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
export class ActiveTimeEntry {
  private readonly timeEntryStore: TimeEntryStore = inject(TimeEntryStore);

  readonly activeTimeEntry = model.required<TimeEntry>();

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
    this.timeEntryStore.patchDescription(this.activeTimeEntry(), newDescription);
  }

  stopTimeEntry(): void {
    this.timeEntryStore.stopActive(this.activeTimeEntry());
  }

  deleteTimeEntry(): void {
    this.timeEntryStore.delete(this.activeTimeEntry());
  }

  updateTimeEntryProject(project: Project): void {
    this.timeEntryStore.patchProject(this.activeTimeEntry(), project);
  }
}
