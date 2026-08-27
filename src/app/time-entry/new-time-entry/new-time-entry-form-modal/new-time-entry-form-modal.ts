import { Component, inject, output, signal } from '@angular/core';
import { form, FormField, required, submit, validate } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { Project } from '../../../model/project.model';
import { TimeEntry } from '../../../model/time-entry.model';
import { ProjectTaskSelectorButton } from '../../../project/project-selector-button/project-task-selector-button';
import { TimeEntryService } from '../../../services/time-entry.service';
import { DateInputComponent } from '../../../shared/date-input/date-input';
import { TimeInputComponent } from '../../../shared/time-input/time-input';

interface NewTimeEntryModel {
  project: Project | null;
  description: string;
  task: null;
  billable: boolean;
  startDate: string;
  startTime: string;
  endDate: string | null;
  endTime: string | null;
}

function toLocalDateValue(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toLocalTimeValue(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function combineToISO(date: string, time: string): string {
  return new Date(`${date}T${time}`).toISOString();
}

function isValidTime(time: string | null): boolean {
  return time !== null && /^\d{2}:\d{2}$/.test(time);
}

function isValidDate(date: string | null): boolean {
  if (date === null || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }
  const parsed = new Date(date);
  return !isNaN(parsed.getTime()) && date === parsed.toISOString().slice(0, 10);
}

@Component({
  imports: [FormField, ProjectTaskSelectorButton, TimeInputComponent, DateInputComponent],
  selector: 'app-new-time-entry-form-modal',
  styleUrl: './new-time-entry-form-modal.css',
  templateUrl: './new-time-entry-form-modal.html',
})
export class NewTimeEntryFormModal {
  private readonly timeEntryService: TimeEntryService = inject(TimeEntryService);

  readonly newTimeEntryModel = signal<NewTimeEntryModel>({
    project: null,
    description: '',
    task: null,
    billable: true,
    startDate: toLocalDateValue(new Date()),
    startTime: toLocalTimeValue(new Date()),
    endDate: null,
    endTime: null,
  });

  readonly newTimeEntryForm = form(this.newTimeEntryModel, (fieldPath) => {
    required(fieldPath.project, { message: 'Project is required' });
    required(fieldPath.startDate, { message: 'Start date is required' });
    required(fieldPath.startTime, { message: 'Start time is required' });
    validate(fieldPath.startDate, (ctx) =>
      isValidDate(ctx.value()) ? null : { kind: 'dateFormat', message: 'Enter a valid date (YYYY-MM-DD)' });
    validate(fieldPath.endDate, (ctx) =>
      ctx.value() === null || isValidDate(ctx.value()) ? null : { kind: 'dateFormat', message: 'Enter a valid date (YYYY-MM-DD)' });
    validate(fieldPath.startTime, (ctx) =>
      isValidTime(ctx.value()) ? null : { kind: 'timeFormat', message: 'Enter a valid time (HHmm)' });
    validate(fieldPath.endTime, (ctx) =>
      ctx.value() === null || isValidTime(ctx.value()) ? null : { kind: 'timeFormat', message: 'Enter a valid time (HHmm)' });
  });

  readonly modalCloseEvent = output<void>();
  readonly timeEntryCreateEvent = output<TimeEntry>();

  close(): void {
    this.modalCloseEvent.emit();
  }

  assignProject(project: Project): void {
    this.newTimeEntryModel.update(model => ({ ...model, project }));
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    submit(this.newTimeEntryForm, async () => {
      try {
        const model = this.newTimeEntryModel();
        const createdTimeEntry: TimeEntry = await firstValueFrom(this.timeEntryService.createTimeEntry(
          null,
          model.project!.id,
          null,
          model.description,
          model.billable,
          combineToISO(model.startDate, model.startTime),
          model.endTime ? combineToISO(model.endDate ?? model.startDate, model.endTime) : null));

        this.timeEntryCreateEvent.emit(createdTimeEntry);
        this.close();
        return null;
      } catch (error) {
        return { kind: 'serverError', message: "Something's wrong server-side" };
      }
    });
  }
}
