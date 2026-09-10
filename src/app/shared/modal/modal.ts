import { Component, HostListener, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  styleUrl: './modal.css',
  templateUrl: './modal.html',
})
export class AppModal {
  readonly title = input.required<string>();
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly closeOnBackdropClick = input<boolean>(true);
  readonly closeOnEscape = input<boolean>(true);

  readonly closeEvent = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.closeOnEscape()) {
      this.closeEvent.emit();
    }
  }

  close(): void {
    this.closeEvent.emit();
  }
}