import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSemesterComponent } from './create-semester.component';

describe('CreateSemesterComponent', () => {
  let component: CreateSemesterComponent;
  let fixture: ComponentFixture<CreateSemesterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSemesterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSemesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
