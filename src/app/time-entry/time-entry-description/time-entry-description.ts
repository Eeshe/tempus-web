import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-time-entry-description',
  imports: [],
  templateUrl: './time-entry-description.html',
  styleUrl: './time-entry-description.css',
})
export class TimeEntryDescription {
  readonly description = input<string>();
  readonly changeDescriptionEvent = output<string>();

  saveDescriptionChanges(event: FocusEvent): void {
    const newDescription: string = (event.target as HTMLInputElement).value;
    this.changeDescriptionEvent.emit(newDescription);
  }
}
