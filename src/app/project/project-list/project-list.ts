import { Component, inject } from '@angular/core';
import { Project } from '../../model/project.model';
import { ProjectReport } from '../../reports/models/report.model';
import { MsToHHMMSSPipe } from '../../shared/pipes/ms-to-hhmmss.pipe';
import { ProjectReportStore } from '../store/project.store';

@Component({
  imports: [MsToHHMMSSPipe],
  selector: 'app-project-list',
  styleUrl: './project-list.css',
  templateUrl: './project-list.html',
})
export class ProjectList {
  private readonly projectReportStore: ProjectReportStore = inject(ProjectReportStore);

  readonly projectReports = this.projectReportStore.projectReports;

  constructor() {
    this.projectReportStore.load();
  }

  openProjectModal(project: Project): void {

  }

  calculateAccumulatedPay(projectReport: ProjectReport): string {
    const hourlyRate: number | null = projectReport.project.hourlyRate;
    if (hourlyRate == null) {
      return "N/A";
    }
    const trackedHours: number = projectReport.trackedTimeMillis / 1000 / 60 / 60;

    return (hourlyRate * trackedHours).toFixed(2);
  }
}
