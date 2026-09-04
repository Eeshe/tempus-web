import { Component, computed, input, signal } from '@angular/core';
import { MsToHHMMSSPipe } from '../../../shared/pipes/ms-to-hhmmss.pipe';
import { durationFromMs, formatHHMMSSTime } from '../../../shared/util/time.util';
import { Report } from '../../models/report.model';

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

  readonly sortedProjectReportEntries = computed(() => {

  });

  readonly formattedTotalTrackedTime = computed(() => {
    console.log(this.report());
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
