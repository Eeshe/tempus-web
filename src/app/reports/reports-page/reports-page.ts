import { Component, signal } from '@angular/core';
import { Report } from '../models/report.model';
import { ReportDetailsList } from './report-details-list/report-details-list';
import { ReportFiltersBar } from './report-filters-bar/report-filters-bar';

@Component({
  imports: [ReportFiltersBar, ReportDetailsList],
  selector: 'app-reports-page',
  styleUrl: './reports-page.css',
  templateUrl: './reports-page.html',
})
export class ReportsPage {
  readonly currentReport = signal<Report>({
    totalTrackedTimeMillis: 0,
    projectReportEntries: []
  });
}
