import { Component, computed, input } from '@angular/core';
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

  readonly formattedTotalTrackedTime = computed(() => {
    console.log(this.report());
    return formatHHMMSSTime(durationFromMs(this.report().totalTrackedTimeMillis));
  });

}
