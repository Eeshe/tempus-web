import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SyncButtons } from './sync-buttons';

describe('SyncButtons', () => {
  let component: SyncButtons;
  let fixture: ComponentFixture<SyncButtons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyncButtons],
    }).compileComponents();

    fixture = TestBed.createComponent(SyncButtons);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
