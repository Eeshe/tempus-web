import { Component, signal } from '@angular/core';
import { Report } from '../models/report.model';
import { ReportDetailsList } from './report-details-list/report-details-list';
import { ReportFormBar } from './report-form-bar/report-form-bar';

@Component({
  imports: [ReportFormBar, ReportDetailsList],
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
