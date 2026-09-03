import { Component, signal } from '@angular/core';
import { form, submit } from '@angular/forms/signals';
import { Project } from '../../model/project.model';
import { BillableSelector } from './billable-selector/billable-selector';
import { DateRangeSelector } from './date-range-selector/date-range-selector';
import { DescriptionSelector } from './description-selector/description-selector';
import { ProjectSelector } from './project-selector/project-selector';

interface ReportModel {
  startDate: string,
  endDate: string,
  projects: Project[],
  descriptions: string[],
  isBillable: boolean | null
}

@Component({
  imports: [BillableSelector, DateRangeSelector, DescriptionSelector, ProjectSelector],
  selector: 'app-report-form-bar',
  styleUrl: './report-form-bar.css',
  templateUrl: './report-form-bar.html',
})
export class ReportFormBar {
  readonly reportModel = signal<ReportModel>({
    startDate: '',
    endDate: '',
    projects: [],
    descriptions: [],
    isBillable: null,
  });
  readonly reportForm = form(this.reportModel);

  readonly startDate = signal<string | null>(null);
  readonly endDate = signal<string | null>(null);
  readonly projects = signal<Project[]>([]);
  readonly descriptions = signal<string[]>([]);
  readonly isBillable = signal<boolean>(false);

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

    });
  }
}
