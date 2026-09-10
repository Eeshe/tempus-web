import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, output, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { Project } from '../../model/project.model';
import { ProjectService } from '../../services/project.service';
import { AppModal } from '../../shared/modal/modal';
import { ModalBase } from '../../shared/modal-base';

interface CreateProjectModel {
  name: string;
  isPrivate: boolean;
  clientId: number | null;
}

@Component({
  imports: [FormField, AppModal],
  selector: 'app-create-project-form',
  styleUrl: './create-project-form-modal.css',
  templateUrl: './create-project-form-modal.html',
})
export class CreateProjectFormModal extends ModalBase {
  private readonly projectService: ProjectService = inject(ProjectService);

  readonly projectModel = signal<CreateProjectModel>({
    name: "",
    isPrivate: true,
    clientId: null,
  });
  readonly projectForm = form(this.projectModel, (fieldPath) => {
    required(fieldPath.name, { message: "You must provide a project name" });
    required(fieldPath.isPrivate);
  });

  readonly projectCreateEvent = output<Project>();

  onSubmit(event: Event): void {
    event.preventDefault();

    submit(this.projectForm, async () => {
      try {
        const project: Project = await firstValueFrom(this.projectService.createProject(
          this.projectModel().name,
          this.projectModel().isPrivate,
          this.projectModel().clientId
        ));
        this.projectCreateEvent.emit(project);
        this.close();
        return null;
      } catch (error) {
        if (error instanceof HttpErrorResponse && error.status == 400) {
          return { kind: 'usedProjectName', message: "You already have a project with this name" };
        }
        return { kind: 'serverError', message: "Something's wrong server-side" };
      }
    });
  }
}