import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-time-entry-description',
  imports: [],
  templateUrl: './time-entry-description.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './time-entry-description.css',
})
export class TimeEntryDescription {
  readonly description = input<string>();
  readonly changeDescriptionEvent = output<string>();

  saveDescriptionChanges(newDescription: string): void {
    this.changeDescriptionEvent.emit(newDescription);
  }
}
