import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MigrationSettings } from './migration-settings';

describe('MigrationSettings', () => {
  let component: MigrationSettings;
  let fixture: ComponentFixture<MigrationSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MigrationSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(MigrationSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
