import { Component, ElementRef, HostListener, inject, input, output, signal, viewChild } from '@angular/core';
import { DateInput } from '../../../../shared/input/date-input/date-input';
import { formatYYYYMMDDDate } from '../../../../shared/util/date.util';

@Component({
  imports: [DateInput],
  selector: 'app-date-range-selector',
  styleUrl: './date-range-selector.css',
  templateUrl: './date-range-selector.html',
})
export class DateRangeSelector {
  private readonly hostElement = inject(ElementRef);
  private readonly triggerButton = viewChild<ElementRef<HTMLButtonElement>>('triggerButton');

  readonly startDate = input<string | null>(null);
  readonly endDate = input<string | null>(null);

  readonly startDateChangeEvent = output<string | null>();
  readonly endDateChangeEvent = output<string | null>();

  readonly isOpen = signal<boolean>(false);
  readonly popupPosition = signal<{ top: number; left: number }>({ top: 0, left: 0 });

  readonly startDateInvalid = signal<boolean>(false);
  readonly endDateInvalid = signal<boolean>(false);

  toggle(): void {
    if (!this.isOpen()) {
      this.openPopup();
    }
    this.isOpen.update((isOpen) => !isOpen);
  }

  private openPopup(): void {
    const button: HTMLButtonElement | undefined = this.triggerButton()?.nativeElement;
    if (!button) {
      return;
    }
    const rect: DOMRect = button.getBoundingClientRect();
    this.popupPosition.set({ top: rect.bottom + 4, left: rect.left });
  }

  onStartDateChange(value: string | null): void {
    this.startDateChangeEvent.emit(value);

    this.validateDates(value, this.endDate());
  }

  onEndDateChange(value: string | null): void {
    this.endDateChangeEvent.emit(value);

    this.validateDates(this.startDate(), value);
  }

  onStartDateTouch(): void { }
  onEndDateTouch(): void { }

  private validateDates(start: string | null, end: string | null): void {
    if (start && end) {
      this.startDateInvalid.set(start > end);
      this.endDateInvalid.set(end < start);
    } else {
      this.startDateInvalid.set(false);
      this.endDateInvalid.set(false);
    }
  }

  setPreset(preset: string): void {
    const today: Date = new Date();
    const year: number = today.getFullYear();
    const month: number = today.getMonth();
    const day: number = today.getDate();
    const dayOfWeek: number = today.getDay();
    const mondayOffset: number = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    let start: Date;
    let end: Date;

    switch (preset) {
      case 'today':
        start = new Date(year, month, day);
        end = new Date(year, month, day);
        break;
      case 'yesterday':
        start = new Date(year, month, day - 1);
        end = new Date(year, month, day - 1);
        break;
      case 'thisWeek':
        start = new Date(year, month, day - mondayOffset);
        end = new Date(year, month, day);
        break;
      case 'lastWeek':
        start = new Date(year, month, day - mondayOffset - 7);
        end = new Date(year, month, day - mondayOffset - 1);
        break;
      case 'thisMonth':
        start = new Date(year, month, 1);
        end = new Date(year, month, day);
        break;
      case 'lastMonth':
        start = new Date(year, month - 1, 1);
        end = new Date(year, month, 0);
        break;
      case 'thisYear':
        start = new Date(year, 0, 1);
        end = new Date(year, month, day);
        break;
      case 'lastYear':
        start = new Date(year - 1, 0, 1);
        end = new Date(year - 1, 11, 31);
        break;
      default:
        return;
    }
    start.setHours(0);
    end.setHours(23);

    const startStr: string = formatYYYYMMDDDate(start);
    const endStr: string = formatYYYYMMDDDate(end);

    this.startDateChangeEvent.emit(startStr);
    this.endDateChangeEvent.emit(endStr);

    this.validateDates(startStr, endStr);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen() || this.hostElement.nativeElement.contains(event.target)) {
      return;
    }
    this.isOpen.set(false);
  }
}
