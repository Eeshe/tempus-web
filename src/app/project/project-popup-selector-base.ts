import { Directive, inject, signal } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { PopupSelectorBase } from '../shared/selector/popup-selector-base';
import { Project } from './models/project.model';

@Directive({
  standalone: true,
})
export abstract class ProjectPopupSelectorBase extends PopupSelectorBase {
  private readonly projectService: ProjectService = inject(ProjectService);

  readonly projects = signal<Project[]>([]);

  protected override openPopup(): void {
    super.openPopup();

    this.projectService.listProjects().subscribe((fetchedProjects) =>
      this.projects.set(
        fetchedProjects.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
      )
    );
  }
}
