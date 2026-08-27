import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveTimeEntryComponent } from './active-time-entry';

describe('ActiveTimeEntryComponent', () => {
  let component: ActiveTimeEntryComponent;
  let fixture: ComponentFixture<ActiveTimeEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveTimeEntryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveTimeEntryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
