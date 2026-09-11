import { Component, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClientModal } from '../../client/client-modal/client-modal';
import { DeleteConfirmationModal } from '../../shared/delete-confirmation-modal/delete-confirmation-modal';
import { InlineEditInput } from '../../shared/input/inline-edit-input/inline-edit-input';
import { AppModal } from '../../shared/modal/modal';
import { ModalBase } from '../../shared/modal/modal-base';
import { Task } from '../../task/models/task.model';
import { TaskList } from '../../task/task-list/task-list';
import { Project } from '../models/project.model';
import { ProjectReportStore } from '../store/project-report.store';

@Component({
  imports: [
    AppModal,
    RouterLink,
    InlineEditInput,
    ClientModal,
    TaskList,
    DeleteConfirmationModal
  ],
  selector: 'app-project-modal',
  styleUrl: './project-modal.css',
  templateUrl: './project-modal.html',
})
export class ProjectModal extends ModalBase {
  private readonly projectReportStore: ProjectReportStore = inject(ProjectReportStore);

  readonly project = input.required<Project>();

  readonly projectDeleteEvent = output<void>();

  readonly isEditingProjectName = signal<boolean>(false);
  readonly isDeleteConfirmationModalOpen = signal<boolean>(false);
  readonly isClientModalOpen = signal<boolean>(false);

  startProjectNameEdit(): void {
    this.isEditingProjectName.set(true);
  }

  editProjectName(newName: string): void {
    this.projectReportStore.editProjectName(this.project(), newName);
    this.stopProjectNameEdit();
  }

  stopProjectNameEdit(): void {
    this.isEditingProjectName.set(false);
  }

  toggleDeleteConfirmationModal(): void {
    this.isDeleteConfirmationModalOpen.update(value => !value);
  }

  handleDeleteConfirmation(confirmedDeletion: boolean): void {
    if (confirmedDeletion) {
      this.projectReportStore.delete(this.project());
      this.projectDeleteEvent.emit();
    }
    this.toggleDeleteConfirmationModal();
  }

  toggleClientModal(): void {
    this.isClientModalOpen.update(value => !value);
  }

  editProjectTask(task: Task): void {
    this.projectReportStore.editProjectTask(this.project(), task);
  }

  deleteProjectTask(task: Task): void {
    this.projectReportStore.deleteProjectTask(this.project(), task);
  }
}
