import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { Observable } from "rxjs";
import { Project } from "../../model/project.model";
import { Report } from "../models/report.model";

interface ReportRequest {
  startDate: string,
  endDate: string,
  projectIds: number[] | null,
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
    descriptions: string[],
    isBillable: boolean
  ): Observable<Report> {
    const projectIds: number[] = projects.map(project => project.id);
    const reportRequest: ReportRequest = {
      startDate,
      endDate,
      projectIds,
      descriptions,
      isBillable
    }
    return this.http.post<Report>(this.url, reportRequest, { withCredentials: true });
  }
}
