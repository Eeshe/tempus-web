import { Component, inject, output, signal } from '@angular/core';
import { form, submit } from '@angular/forms/signals';
import { Project } from '../../../model/project.model';
import { Report } from '../../models/report.model';
import { ReportService } from '../../services/report.service';
import { BillableSelector } from './billable-selector/billable-selector';
import { DateRangeSelector } from './date-range-selector/date-range-selector';
import { DescriptionSelector } from './description-selector/description-selector';
import { ProjectSelector } from './project-selector/project-selector';

interface ReportModel {
  startDate: string,
  endDate: string,
  projects: Project[],
  descriptions: string[],
  isBillable: boolean
}

@Component({
  imports: [BillableSelector, DateRangeSelector, DescriptionSelector, ProjectSelector],
  selector: 'app-report-form-bar',
  styleUrl: './report-form-bar.css',
  templateUrl: './report-form-bar.html',
})
export class ReportFormBar {
  private readonly reportService: ReportService = inject(ReportService);

  readonly reportModel = signal<ReportModel>({
    startDate: '',
    endDate: '',
    projects: [],
    descriptions: [],
    isBillable: false,
  });
  readonly reportForm = form(this.reportModel);

  readonly startDate = signal<string | null>(null);
  readonly endDate = signal<string | null>(null);
  readonly projects = signal<Project[]>([]);
  readonly descriptions = signal<string[]>([]);
  readonly isBillable = signal<boolean>(false);

  readonly reportGenerateEvent = output<Report>();

  setStartDate(value: string | null): void {
    this.startDate.set(value);
    this.reportModel.update(model => ({ ...model, startDate: value ?? '' }));
  }

  setEndDate(value: string | null): void {
    this.endDate.set(value);
    this.reportModel.update(model => ({ ...model, endDate: value ?? '' }));
  }

  setProjects(projects: Project[]): void {
    this.projects.set(projects);
    this.reportModel.update(model => ({ ...model, projects: projects }));
  }

  setDescriptions(descriptions: string[]): void {
    this.descriptions.set(descriptions);
    this.reportModel.update(model => ({ ...model, descriptions: descriptions }));
  }

  setBillable(isBillable: boolean): void {
    this.isBillable.set(isBillable);
    this.reportModel.update(model => ({ ...model, isBillable: isBillable }));
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    submit(this.reportForm, async () => {
      this.reportService.generateReport(
        this.reportModel().startDate,
        this.reportModel().endDate,
        this.reportModel().projects,
        this.reportModel().descriptions,
        this.reportModel().isBillable,
      ).subscribe(report => {
        this.reportGenerateEvent.emit(report);
      });
    });
  }
}
