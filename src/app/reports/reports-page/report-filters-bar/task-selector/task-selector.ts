import { Component, computed, ElementRef, HostListener, inject, input, output, signal, viewChild } from '@angular/core';
import { Project } from '../../../../model/project.model';
import { Task } from '../../../../model/task.model';
import { ProjectService } from '../../../../services/project.service';

@Component({
  imports: [],
  selector: 'app-task-selector',
  styleUrl: './task-selector.css',
  templateUrl: './task-selector.html',
})
export class TaskSelector {
  private readonly hostElement = inject(ElementRef);
  private readonly projectService = inject(ProjectService);
  private readonly triggerButton = viewChild<ElementRef<HTMLButtonElement>>('triggerButton');

  readonly selectedTasks = input<Task[]>([]);
  readonly selectedProjects = input<Project[]>([]);

  readonly selectedTasksChangeEvent = output<Task[]>();

  readonly isOpen = signal<boolean>(false);
  readonly popupPosition = signal<{ top: number; left: number }>({ top: 0, left: 0 });
  readonly projects = signal<Project[]>([]);

  readonly availableTasks = computed(() => {
    const projects: Project[] = this.projects();
    const selectedProjectIds: number[] = this.selectedProjects().map((project) => project.id);

    const tasks: Task[] = projects.flatMap((project) => project.tasks);
    if (selectedProjectIds.length === 0) {
      return tasks;
    }
    return tasks.filter((task) => selectedProjectIds.includes(task.projectId));
  });

  readonly allSelected = computed<boolean>(() => {
    const available: Task[] = this.availableTasks();

    return available.length > 0 && available.length === this.selectedTasks().length;
  });

  toggle(): void {
    if (!this.isOpen()) {
      this.openPopup();
    }
    this.isOpen.update((isOpen) => !isOpen);
  }

  private openPopup(): void {
    const button: HTMLButtonElement | undefined = this.triggerButton()?.nativeElement;
    if (!button) {
      return;
    }
    const rect: DOMRect = button.getBoundingClientRect();
    this.popupPosition.set({ top: rect.bottom + 4, left: rect.left });

    this.projectService.listProjects().subscribe(
      (fetchedProjects) =>
        this.projects.set(
          fetchedProjects
            .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
            .map((project) => ({
              ...project,
              tasks: [...project.tasks].sort((a, b) =>
                a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
              ),
            }))
        )
    );
  }

  isSelected(checkTask: Task): boolean {
    return this.selectedTasks().some((task) => task.id === checkTask.id);
  }

  toggleTask(taskToggle: Task): void {
    const current: Task[] = this.selectedTasks();
    const updated: Task[] = this.isSelected(taskToggle)
      ? current.filter((task) => task.id !== taskToggle.id)
      : [...current, taskToggle];

    this.selectedTasksChangeEvent.emit(updated);
  }

  toggleSelectAll(): void {
    this.selectedTasksChangeEvent.emit(this.allSelected() ? [] : [...this.availableTasks()]);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen() || this.hostElement.nativeElement.contains(event.target)) {
      return;
    }
    this.isOpen.set(false);
  }
}
