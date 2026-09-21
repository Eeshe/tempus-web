import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SyncButtons } from './sync-buttons';

describe('SyncButtons', () => {
  let component: SyncButtons;
  let fixture: ComponentFixture<SyncButtons>;

  function triggerButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.sync-trigger');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyncButtons],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(SyncButtons);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens on trigger click and closes on a second click', () => {
    triggerButton().click();
    fixture.detectChanges();
    expect(component.isOpen()).toBe(true);

    triggerButton().click();
    fixture.detectChanges();
    expect(component.isOpen()).toBe(false);
  });

  it('opens on hover and closes after the pointer leaves', () => {
    vi.useFakeTimers();
    try {
      fixture.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
      fixture.detectChanges();
      expect(component.isOpen()).toBe(true);

      fixture.nativeElement.dispatchEvent(new MouseEvent('mouseleave'));
      vi.advanceTimersByTime(200);
      fixture.detectChanges();
      expect(component.isOpen()).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it('stays open after a click when the pointer leaves', () => {
    triggerButton().click();
    fixture.detectChanges();

    fixture.nativeElement.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    expect(component.isOpen()).toBe(true);
  });

  it('marks import as ready when a newer remote snapshot exists', () => {
    component.syncData.set({
      localSnapshotTime: '2026-01-01T10:00:00Z',
      remoteSnapshotTime: '2026-01-01T11:00:00Z',
    });
    fixture.detectChanges();

    const importButton: HTMLButtonElement = fixture.nativeElement.querySelector('.sync-action--import');
    expect(importButton.classList.contains('sync-action--ready')).toBe(true);
    expect(importButton.disabled).toBe(false);

    const trigger: HTMLButtonElement = fixture.nativeElement.querySelector('.sync-trigger');
    expect(trigger.classList.contains('sync-trigger--ready')).toBe(true);

    component.syncData.set(null);
    fixture.detectChanges();
    expect(trigger.classList.contains('sync-trigger--ready')).toBe(false);
  });
});
