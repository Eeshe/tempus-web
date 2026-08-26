import { Component, output, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { Project } from '../../../model/project.model';

interface NewTimeEntryModel {
  project: Project | null;
  description: string;
  task: null;
  billable: boolean;
  startTime: string;
  endTime: string | null;
}

function toLocalDateTimeValue(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

@Component({
  imports: [FormField],
  selector: 'app-new-time-entry-form-modal',
  styleUrl: './new-time-entry-form-modal.css',
  templateUrl: './new-time-entry-form-modal.html',
})
export class NewTimeEntryFormModal {
  readonly modalCloseEvent = output<void>();

  readonly newTimeEntryModel = signal<NewTimeEntryModel>({
    project: null,
    description: '',
    task: null,
    billable: true,
    startTime: toLocalDateTimeValue(new Date()),
    endTime: null,
  });

  readonly newTimeEntryForm = form(this.newTimeEntryModel, (fieldPath) => {
    required(fieldPath.description, { message: 'Description is required' });
    required(fieldPath.startTime, { message: 'Start time is required' });
  });

  close(): void {
    this.modalCloseEvent.emit();
  }

  submit(event: Event): void {
    event.preventDefault();
  }
}
