import { inject, Service, Signal, signal } from "@angular/core";
import { ProjectReport } from "../../reports/models/report.model";
import { ReportService } from "../../reports/services/report.service";
import { ProjectService } from "../../services/project.service";

@Service()
export class ProjectReportStore {
  private readonly projectService: ProjectService = inject(ProjectService);
  private readonly reportService: ReportService = inject(ReportService);

  private readonly _projectReports = signal<ProjectReport[]>([]);

  readonly projectReports: Signal<ProjectReport[]> = this._projectReports.asReadonly();

  load(): void {
    this.projectService.listProjects().subscribe(projects => {
      for (const project of projects) {
        this.reportService.generateProjectReport(project).subscribe(report =>
          this._projectReports.update((projectReports) =>
            [...projectReports, ...report.projectReportEntries]));
      }
    });
  }
}
