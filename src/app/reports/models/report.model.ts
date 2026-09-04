import { Project } from "../../model/project.model";

interface ProjectReportEntry {
  project: Project,
  trackedTimeMillis: number
}

export interface Report {
  totalTrackedTimeMillis: number,
  projectReportEntries: ProjectReportEntry[],
}
