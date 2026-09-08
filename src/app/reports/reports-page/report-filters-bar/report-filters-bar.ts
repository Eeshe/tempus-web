import { afterNextRender, Component, inject, output, signal } from '@angular/core';
import { Project } from '../../../model/project.model';
import { Task } from '../../../model/task.model';
import { formatYYYYMMDDDate } from '../../../shared/util/date.util';
import { Report } from '../../models/report.model';
import { ReportService } from '../../services/report.service';
import { BillableSelector } from './billable-selector/billable-selector';
import { DateRangeSelector } from './date-range-selector/date-range-selector';
import { DescriptionSelector } from './description-selector/description-selector';
import { ProjectSelector } from './project-selector/project-selector';
import { TaskSelector } from './task-selector/task-selector';

@Component({
  imports: [BillableSelector, DateRangeSelector, DescriptionSelector, ProjectSelector, TaskSelector],
  selector: 'app-report-filters-bar',
  styleUrl: './report-filters-bar.css',
  templateUrl: './report-filters-bar.html',
})
export class ReportFiltersBar {
  private readonly reportService: ReportService = inject(ReportService);

  readonly startDate = signal<string | null>(null);
  readonly endDate = signal<string | null>(null);
  readonly projects = signal<Project[]>([]);
  readonly tasks = signal<Task[]>([]);
  readonly descriptions = signal<string[]>([]);
  readonly isBillable = signal<boolean>(false);

  readonly reportGenerateEvent = output<Report>();

  constructor() {
    afterNextRender(() => {
      this.setStartDate(formatYYYYMMDDDate(new Date()));
      this.setEndDate(formatYYYYMMDDDate(new Date()));
    });
  }

  setStartDate(value: string | null): void {
    this.startDate.set(value);
    this.generateReport();
  }

  setEndDate(value: string | null): void {
    this.endDate.set(value);
    this.generateReport();
  }

  setProjects(projects: Project[]): void {
    this.projects.set(projects);
    this.generateReport();
  }

  setTasks(tasks: Task[]): void {
    this.tasks.set(tasks);
    this.generateReport();
  }

  setDescriptions(descriptions: string[]): void {
    this.descriptions.set(descriptions);
    this.generateReport();
  }

  setBillable(isBillable: boolean): void {
    this.isBillable.set(isBillable);
    this.generateReport();
  }

  generateReport(): void {
    if (this.startDate() == null || this.endDate() == null) {
      return;
    }
    this.reportService.generateReport(
      this.startDate()!,
      this.endDate()!,
      this.projects(),
      this.tasks(),
      this.descriptions(),
      this.isBillable(),
    ).subscribe(report => {
      this.reportGenerateEvent.emit(report);
    });
  }
}
