import { Component, computed, ElementRef, HostListener, inject, input, output, signal, viewChild } from '@angular/core';
import { Project } from '../../../../model/project.model';
import { ProjectService } from '../../../../services/project.service';

@Component({
  imports: [],
  selector: 'app-project-selector',
  styleUrl: './project-selector.css',
  templateUrl: './project-selector.html',
})
export class ProjectSelector {
  private readonly hostElement = inject(ElementRef);
  private readonly projectService = inject(ProjectService);
  private readonly triggerButton = viewChild<ElementRef<HTMLButtonElement>>('triggerButton');

  readonly selectedProjects = input<Project[]>([]);

  readonly selectedProjectsChangeEvent = output<Project[]>();

  readonly isOpen = signal<boolean>(false);
  readonly popupPosition = signal<{ top: number; left: number }>({ top: 0, left: 0 });
  readonly projects = signal<Project[]>([]);

  readonly allSelected = computed(() => {
    const all: Project[] = this.projects();
    const selected: Project[] = this.selectedProjects();

    return all.length > 0 && all.length === selected.length;
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

    this.projectService.listProjects().subscribe((fetchedProjects) =>
      this.projects.set(
        fetchedProjects.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
      )
    );
  }

  isSelected(checkProject: Project): boolean {
    return this.selectedProjects().some((project) => project.id === checkProject.id);
  }

  toggleProject(projectToggle: Project): void {
    const current: Project[] = this.selectedProjects();
    const updated: Project[] = this.isSelected(projectToggle) ?
      current.filter((project) => project.id !== projectToggle.id)
      : [...current, projectToggle];

    this.selectedProjectsChangeEvent.emit(updated);
  }

  toggleSelectAll(): void {
    this.selectedProjectsChangeEvent.emit(this.allSelected() ? [] : [...this.projects()]);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen() || this.hostElement.nativeElement.contains(event.target)) {
      return;
    }
    this.isOpen.set(false);
  }
}
