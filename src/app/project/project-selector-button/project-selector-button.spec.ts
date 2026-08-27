import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectSelectorButton } from './project-selector-button';

describe('ProjectSelectorButton', () => {
  let component: ProjectSelectorButton;
  let fixture: ComponentFixture<ProjectSelectorButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectSelectorButton],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectSelectorButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
