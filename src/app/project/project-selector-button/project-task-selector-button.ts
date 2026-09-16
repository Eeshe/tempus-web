import { Component, computed, input, output, signal } from '@angular/core';
import { CreateTaskFormModal } from '../../task/create-task-form-modal/create-task-form-modal';
import { Task } from '../../task/models/task.model';
import { CreateProjectFormModal } from '../create-project-form-modal/create-project-form-modal';
import { Project } from '../models/project.model';
import { ProjectPopupSelectorBase } from '../project-popup-selector-base';

@Component({
  imports: [CreateProjectFormModal, CreateTaskFormModal],
  selector: 'app-project-task-selector-button',
  styleUrl: './project-task-selector-button.css',
  templateUrl: './project-task-selector-button.html',
})
export class ProjectTaskSelectorButton extends ProjectPopupSelectorBase {
  readonly selectedProject = input<Project | null>();
  readonly selectedTask = input<Task | null>();
  readonly displayText = computed<string>(() => {
    if (this.selectedProject() == null) {
      return "Select a Project";
    }
    if (this.selectedTask() == null) {
      return this.selectedProject()!.name;
    }
    return `${this.selectedProject()!.name}:${this.selectedTask()!.name}`;
  });

  readonly isCreateProjectFormModalOpen = signal<boolean>(false);
  readonly createTaskFormModalProject = signal<Project | null>(null);

  readonly projectSelectEvent = output<Project>();
  readonly taskSelectEvent = output<{ newProject: Project, newTask: Task }>();

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

  addCreatedTask(project: Project, task: Task): void {
    this.taskSelectEvent.emit({ newProject: project, newTask: task });
  }

  toggleCreateProjectForm(): void {
    this.isCreateProjectFormModalOpen.update(value => !value);
  }

  setCreateTaskFormModalProject(project: Project | null): void {
    this.createTaskFormModalProject.set(project);
  }
}
