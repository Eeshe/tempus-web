import { Component, computed, input, signal } from '@angular/core';
import { MsToHHMMSSPipe } from '../../../shared/pipes/ms-to-hhmmss.pipe';
import { durationFromMs, formatHHMMSSTime } from '../../../shared/util/time.util';
import { ProjectReport, Report } from '../../models/report.model';

@Component({
  imports: [MsToHHMMSSPipe],
  selector: 'app-report-details-list',
  styleUrl: './report-details-list.css',
  templateUrl: './report-details-list.html',
})
export class ReportDetailsList {
  readonly report = input.required<Report>();

  readonly sortColumn = signal<"project" | "duration">("project");
  readonly sortDirection = signal<"asc" | "desc">("desc")

  readonly sortedProjectReportEntries = computed<ProjectReport[]>(() => {
    const sortColumn: "project" | "duration" = this.sortColumn();
    const sortDirection: "asc" | "desc" = this.sortDirection();

    let entries = this.report().projectReportEntries.sort((projectReportEntryA, projectReportEntryB) => {
      if (sortColumn === "project") {
        return projectReportEntryA.project.name.localeCompare(projectReportEntryB.project.name, undefined, { sensitivity: "base" });
      } else {
        return projectReportEntryA.trackedTimeMillis - projectReportEntryB.trackedTimeMillis;
      }
    });
    if (sortDirection === "desc") {
      entries = entries.reverse();
    }
    return entries;
  });

  readonly formattedTotalTrackedTime = computed(() => {
    return formatHHMMSSTime(durationFromMs(this.report().totalTrackedTimeMillis));
  });

  toggleSort(newSortColumn: "project" | "duration"): void {
    const currentSortColumn: string = this.sortColumn();
    if (newSortColumn !== currentSortColumn) {
      this.sortColumn.set(newSortColumn);
      this.sortDirection.set("desc");
      return;
    }
    this.sortDirection.update(currentSortDirection => currentSortDirection !== "asc" ? "asc" : "desc");
  }
}
