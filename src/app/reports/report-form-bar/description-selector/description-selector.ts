import { Component, ElementRef, HostListener, inject, input, output, signal, viewChild } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-description-selector',
  styleUrl: './description-selector.css',
  templateUrl: './description-selector.html',
})
export class DescriptionSelector {
  private readonly hostElement: ElementRef = inject(ElementRef);
  private readonly triggerButton = viewChild<ElementRef<HTMLButtonElement>>('triggerButton');
  private readonly descriptionInput = viewChild<ElementRef<HTMLInputElement>>('descriptionInput');

  readonly descriptions = input<string[]>([]);

  readonly descriptionsChangeEvent = output<string[]>();

  readonly isOpen = signal<boolean>(false);
  readonly popupPosition = signal<{ top: number; left: number }>({ top: 0, left: 0 });
  readonly inputValue = signal<string>('');

  toggle(): void {
    if (!this.isOpen()) {
      this.openPopup();
    }
    this.isOpen.update((isOpen: boolean) => !isOpen);
  }

  private openPopup(): void {
    const button: HTMLButtonElement | undefined = this.triggerButton()?.nativeElement;
    if (!button) {
      return;
    }
    const rect: DOMRect = button.getBoundingClientRect();
    this.popupPosition.set({ top: rect.bottom + 4, left: rect.left });

    setTimeout(() => {
      this.descriptionInput()?.nativeElement.focus();
    });
  }

  onInput(event: Event): void {
    const target: HTMLInputElement = event.target as HTMLInputElement;

    this.inputValue.set(target.value);
  }

  addDescription(): void {
    const trimmed: string = this.inputValue().trim();
    if (trimmed === '') {
      return;
    }
    const current: string[] = this.descriptions();
    if (current.includes(trimmed)) {
      this.inputValue.set('');
      return;
    }
    this.descriptionsChangeEvent.emit(this.sortDescriptions([...current, trimmed]));

    this.inputValue.set('');
  }

  removeDescription(descriptionToRemove: string): void {
    const updated: string[] = this.descriptions().filter(
      (description: string) => description !== descriptionToRemove
    );
    this.descriptionsChangeEvent.emit(this.sortDescriptions(updated));
  }

  private sortDescriptions(descriptions: string[]): string[] {
    return [...descriptions].sort((a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen() || this.hostElement.nativeElement.contains(event.target)) {
      return;
    }
    this.isOpen.set(false);
  }
}
