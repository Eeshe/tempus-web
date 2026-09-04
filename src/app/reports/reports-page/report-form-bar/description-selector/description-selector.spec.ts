import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DescriptionSelector } from './description-selector';

describe('DescriptionSelector', () => {
  let component: DescriptionSelector;
  let fixture: ComponentFixture<DescriptionSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescriptionSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(DescriptionSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
