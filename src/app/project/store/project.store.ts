import { inject, Service, Signal, signal } from "@angular/core";
import { forkJoin } from "rxjs";
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
    this.projectService.listProjects().subscribe(projects =>
      forkJoin(projects.map(project => this.reportService.generateProjectReport(project))).subscribe(reports =>
        this._projectReports.set(reports.flatMap(report => report.projectReportEntries))
      ));
  }
}
