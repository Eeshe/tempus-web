import { Component, inject } from '@angular/core';
import { Project } from '../../model/project.model';
import { ProjectReport } from '../../reports/models/report.model';
import { MsToHHMMSSPipe } from '../../shared/pipes/ms-to-hhmmss.pipe';
import { SortableColumn, SortableTable } from '../../shared/sortable-table/sortable-table';
import { ProjectReportStore } from '../store/project.store';

@Component({
  imports: [SortableTable, MsToHHMMSSPipe],
  selector: 'app-project-list',
  styleUrl: './project-list.css',
  templateUrl: './project-list.html',
})
export class ProjectList {
  private readonly projectReportStore: ProjectReportStore = inject(ProjectReportStore);

  readonly projectReports = this.projectReportStore.projectReports;

  readonly columns: SortableColumn<ProjectReport>[] = [
    {
      key: 'project',
      label: 'Project',
      align: 'left',
      sortValue: (projectReport) => projectReport.project.name,
    },
    {
      key: 'duration',
      label: 'Duration',
      align: 'left',
      sortValue: (projectReport) => projectReport.trackedTimeMillis,
    },
    {
      key: 'client',
      label: 'Client',
      align: 'left',
      sortValue: (projectReport) => projectReport.project.clientId,
    },
    {
      key: 'hourlyRate',
      label: 'Hourly Rate (USD)',
      align: 'center',
      cellAlign: 'center',
      sortValue: (projectReport) => projectReport.project.hourlyRate ?? -1,
    },
    {
      key: 'accumulatedPay',
      label: 'Accumulated Pay (USD)',
      align: 'center',
      cellAlign: 'center',
      sortValue: (projectReport) => this.calculateAccumulatedPay(projectReport),
    },
  ];

  trackBy(_index: number, projectReport: ProjectReport): unknown {
    return projectReport.project.id;
  }

  constructor() {
    this.projectReportStore.load();
  }

  openProjectModal(project: Project): void { }

  calculateAccumulatedPay(projectReport: ProjectReport): number {
    const hourlyRate: number | null = projectReport.project.hourlyRate;
    if (hourlyRate == null) {
      return -1;
    }
    const trackedHours: number = projectReport.trackedTimeMillis / 1000 / 60 / 60;

    return Math.round(hourlyRate * trackedHours);
  }
}
