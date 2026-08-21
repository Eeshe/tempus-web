import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ResumableTimeEntryGroup } from './resumable-time-entry-group';
import { TimeEntry } from '../../model/time-entry.model';

describe('ResumableTimeEntryGroup', () => {
  let component: ResumableTimeEntryGroup;
  let fixture: ComponentFixture<ResumableTimeEntryGroup>;

  const mockTimeEntries: TimeEntry[] = [
    {
      id: 1,
      userId: 1,
      groupId: null,
      project: { id: 1, name: 'Tempus', userId: 1, isPrivate: false, clientId: 1, createdAt: '2026-01-01T00:00:00Z' },
      task: null,
      description: 'Test description',
      isBillable: false,
      startTime: '2026-01-01T10:00:00Z',
      endTime: '2026-01-01T11:00:00Z',
      createdAt: '2026-01-01T10:00:00Z',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumableTimeEntryGroup],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ResumableTimeEntryGroup);
    fixture.componentRef.setInput('timeEntries', mockTimeEntries);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
