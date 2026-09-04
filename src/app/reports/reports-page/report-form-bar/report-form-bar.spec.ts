import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportFormBar } from './report-form-bar';

describe('ReportFormBar', () => {
  let component: ReportFormBar;
  let fixture: ComponentFixture<ReportFormBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportFormBar],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportFormBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
