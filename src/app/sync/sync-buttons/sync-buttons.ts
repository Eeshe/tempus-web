import { afterNextRender, Component, computed, inject, signal } from '@angular/core';
import { timer } from 'rxjs';
import { SyncData } from '../model/sync-data.model';
import { SyncDataService } from '../service/sync-data.service';

@Component({
  imports: [],
  selector: 'app-sync-buttons',
  styleUrl: './sync-buttons.css',
  templateUrl: './sync-buttons.html',
})
export class SyncButtons {
  private readonly syncDataService: SyncDataService = inject(SyncDataService);

  readonly syncData = signal<SyncData | null>(null);

  readonly canImport = computed<boolean>(() => {
    const syncData: SyncData | null = this.syncData();
    if (syncData == null || syncData.remoteSnapshotTime == null) {
      return false;
    }
    if (syncData.localSnapshotTime == null) {
      return true;
    }
    return syncData.remoteSnapshotTime > syncData.localSnapshotTime;
  });

  readonly formattedLastImportTime = computed<string>(() =>
    this.formatSnapshotTime(this.syncData()?.remoteSnapshotTime ?? null));
  readonly formattedLastExportTime = computed<string>(() =>
    this.formatSnapshotTime(this.syncData()?.localSnapshotTime ?? null));

  private formatSnapshotTime(dateStr: string | null): string {
    if (dateStr == null) {
      return "N/A";
    }
    const date: Date = new Date(dateStr);
    const now: Date = new Date();
    const timeStr: string = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const isToday: boolean = this.isSameDay(date, now);
    const yesterday: Date = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday: boolean = this.isSameDay(date, yesterday);

    const dayLabel: string = isToday ? 'Today' : (isYesterday ? 'Yesterday' :
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', }));

    return `${dayLabel}, ${timeStr}`;
  }

  private isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
  }

  constructor() {
    afterNextRender(() => timer(1000, 5000).subscribe(() => this.updateSyncData()));
  }

  triggerExport(): void {
    this.syncDataService.triggerExport().subscribe(() => this.updateSyncData());
  }

  triggerImport(): void {
    this.syncDataService.triggerImport().subscribe(() => {
      this.updateSyncData();
      window.location.reload();
    });
  }

  private updateSyncData(): void {
    this.syncDataService.getSyncData().subscribe(syncData => this.syncData.set(syncData));
  }
}
