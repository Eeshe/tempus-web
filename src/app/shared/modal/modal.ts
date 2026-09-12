import { Component, HostListener, input, OnDestroy, output } from '@angular/core';

const openModals: AppModal[] = [];

@Component({
  selector: 'app-modal',
  styleUrl: './modal.css',
  templateUrl: './modal.html',
})
export class AppModal implements OnDestroy {
  readonly title = input<string>();
  readonly ariaLabel = input<string>();
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly closeOnBackdropClick = input<boolean>(true);
  readonly closeOnEscape = input<boolean>(true);

  readonly closeEvent = output<void>();

  constructor() {
    openModals.push(this);
  }

  ngOnDestroy(): void {
    const index: number = openModals.indexOf(this);
    if (index === -1) {
      return;
    }
    openModals.splice(index, 1);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.closeOnEscape() && openModals[openModals.length - 1] === this) {
      this.closeEvent.emit();
    }
  }

  close(): void {
    this.closeEvent.emit();
  }
}
