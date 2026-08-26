import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeEntryComponent } from './time-entry-component';

describe('TimeEntryComponent', () => {
  let component: TimeEntryComponent;
  let fixture: ComponentFixture<TimeEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeEntryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeEntryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
