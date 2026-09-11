import { Project } from "../../project/models/project.model";

export interface ProjectReport {
  project: Project,
  trackedTimeMillis: number
}

export interface Report {
  totalTrackedTimeMillis: number,
  projectReportEntries: ProjectReport[],
}
