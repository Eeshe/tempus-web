import { Component, inject, input, output, signal } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { PopupSelectorBase } from '../../shared/selector/popup-selector-base';
import { Task } from '../../task/models/task.model';
import { CreateProjectFormModal } from '../create-project-form-modal/create-project-form-modal';
import { Project } from '../models/project.model';

@Component({
  imports: [CreateProjectFormModal],
  selector: 'app-project-task-selector-button',
  styleUrl: './project-task-selector-button.css',
  templateUrl: './project-task-selector-button.html',
})
export class ProjectTaskSelectorButton extends PopupSelectorBase {
  private readonly projectService: ProjectService = inject(ProjectService);

  readonly selectedProject = input<Project | null>();
  readonly selectedTask = input<Task | null>();
  readonly projects = signal<Project[]>([]);

  readonly isCreateProjectFormOpen = signal<boolean>(false);

  readonly projectSelectEvent = output<Project>();
  readonly taskSelectEvent = output<{ newProject: Project, newTask: Task }>();

  formatDisplayText(): string {
    if (this.selectedProject() == null) {
      return "Select a Project";
    }
    if (this.selectedTask() == null) {
      return this.selectedProject()!.name;
    }
    return `${this.selectedProject()!.name}:${this.selectedTask()!.name}`;
  }

  protected override openPopup(): void {
    super.openPopup();

    this.projectService.listProjects().subscribe(
      fetchedProjects => this.projects.set(fetchedProjects.sort((projectA, projectB) =>
        projectA.name.localeCompare(projectB.name, undefined, { sensitivity: "base" })))
    );
  }

  changeTimeEntryProject(clickedProject: Project): void {
    this.projectSelectEvent.emit(clickedProject);
    this.toggle();
  }

  changeTimeEntryTask(project: Project, clickedTask: Task): void {
    this.taskSelectEvent.emit({ newProject: project, newTask: clickedTask });
    this.toggle();
  }

  addCreatedProject(newProject: Project): void {
    this.projects.update(projects => [...projects, newProject]);
    this.projectSelectEvent.emit(newProject);
  }

  toggleCreateProjectForm(): void {
    this.isCreateProjectFormOpen.update(value => !value);
  }
}
