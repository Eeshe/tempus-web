import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskSelector } from './task-selector';

describe('TaskSelector', () => {
  let component: TaskSelector;
  let fixture: ComponentFixture<TaskSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
