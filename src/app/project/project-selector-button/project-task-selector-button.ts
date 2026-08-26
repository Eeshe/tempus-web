import { Component, ElementRef, HostListener, inject, input, output, signal, viewChild } from '@angular/core';
import { Project } from '../../model/project.model';
import { ProjectService } from '../../services/project.service';
import { CreateProjectFormModal } from '../create-project-form/create-project-form-modal';

@Component({
  imports: [CreateProjectFormModal],
  selector: 'app-project-task-selector-button',
  styleUrl: './project-task-selector-button.css',
  templateUrl: './project-task-selector-button.html',
})
export class ProjectTaskSelectorButton {
  private readonly projectService: ProjectService = inject(ProjectService);
  private readonly buttonElement = viewChild<ElementRef<HTMLButtonElement>>('projectButton');
  private readonly hostElement = inject(ElementRef);

  readonly isSelectorOpen = signal(false);
  readonly selectedProject = input<Project | null>();
  readonly popup = signal<{ top: number; left: number }>({ top: 0, left: 0 });
  readonly projects = signal<Project[]>([]);

  readonly isCreateProjectFormOpen = signal<boolean>(false);

  readonly projectSelectEvent = output<Project>();

  toggle(): void {
    if (!this.isSelectorOpen()) {
      this.createPopUp();
    }
    this.isSelectorOpen.update((v) => !v);
  }

  private createPopUp(): void {
    const popUpElement = this.buttonElement()?.nativeElement;
    if (popUpElement) {
      const rect = popUpElement.getBoundingClientRect();
      this.popup.set({ top: rect.bottom + 4, left: rect.left });
    }
    this.projectService.listProjects().subscribe(
      fetchedProjects => this.projects.set(fetchedProjects.sort((projectA, projectB) =>
        projectA.name.localeCompare(projectB.name, undefined, { sensitivity: "base" })))
    );
  }

  changeTimeEntryProject(clickedProject: Project): void {
    this.projectSelectEvent.emit(clickedProject);
    this.toggle();
  }

  addCreatedProject(newProject: Project): void {
    this.projects.update(projects => [...projects, newProject]);
    this.projectSelectEvent.emit(newProject);
  }

  toggleCreateProjectForm(): void {
    this.isCreateProjectFormOpen.update(value => !value);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isSelectorOpen() && !this.hostElement.nativeElement.contains(event.target)) {
      this.isSelectorOpen.set(false);
    }
  }
}
