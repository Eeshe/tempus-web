import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';

interface ReportModel {
  startDate: string,
  endDate: string,
  projectIds: number[],
  descriptions: string[],
  isBillable: boolean | null
}

@Component({
  imports: [FormField],
  selector: 'app-report-form-bar',
  styleUrl: './report-form-bar.css',
  templateUrl: './report-form-bar.html',
})
export class ReportFormBar {
  readonly reportModel = signal<ReportModel>({
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    projectIds: [],
    descriptions: [],
    isBillable: null,
  });

  readonly reportForm = form(this.reportModel);
}
