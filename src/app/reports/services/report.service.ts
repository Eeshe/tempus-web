import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { Observable } from "rxjs";
import { Project } from "../../project/models/project.model";
import { Task } from "../../task/models/task.model";
import { Report } from "../models/report.model";

interface ReportRequest {
  startDate: string,
  endDate: string,
  projectIds: number[] | null,
  taskIds: number[] | null,
  descriptions: string[] | null,
  isBillable: boolean,
}

@Service()
export class ReportService {
  private readonly url: string = "/api/v1/reports";
  private readonly http: HttpClient = inject(HttpClient);

  generateReport(
    startDate: string,
    endDate: string,
    projects: Project[],
    tasks: Task[],
    descriptions: string[],
    isBillable: boolean
  ): Observable<Report> {
    const projectIds: number[] = projects.map(project => project.id);
    const taskIds: number[] = tasks.map(task => task.id);
    const reportRequest: ReportRequest = {
      startDate,
      endDate,
      projectIds,
      taskIds,
      descriptions,
      isBillable
    }
    return this.http.post<Report>(this.url, reportRequest, { withCredentials: true });
  }

  generateProjectReport(project: Project): Observable<Report> {
    const projectId: number = project.id;

    return this.http.get<Report>(`${this.url}/project/${projectId}`, { withCredentials: true })
  }
}
