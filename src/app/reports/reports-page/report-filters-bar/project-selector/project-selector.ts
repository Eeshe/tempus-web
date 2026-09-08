import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Project } from '../../../../model/project.model';
import { ProjectService } from '../../../../services/project.service';
import { PopupSelectorBase } from '../../../../shared/popup-selector-base';

@Component({
  imports: [],
  selector: 'app-project-selector',
  styleUrl: './project-selector.css',
  templateUrl: './project-selector.html',
})
export class ProjectSelector extends PopupSelectorBase {
  private readonly projectService = inject(ProjectService);

  readonly selectedProjects = input<Project[]>([]);

  readonly selectedProjectsChangeEvent = output<Project[]>();

  readonly projects = signal<Project[]>([]);

  readonly allSelected = computed<boolean>(() => {
    const all: Project[] = this.projects();
    const selected: Project[] = this.selectedProjects();

    return all.length > 0 && all.length === selected.length;
  });

  protected override openPopup(): void {
    super.openPopup();

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
}
