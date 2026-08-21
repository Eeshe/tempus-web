import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TimeEntryList } from '../time-entry/time-entry-list/time-entry-list';

@Component({
  selector: 'app-home',
  imports: [TimeEntryList],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home.css',
})
export class Home {

}
