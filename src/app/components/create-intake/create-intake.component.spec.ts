import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIntakeComponent } from './create-intake.component';

describe('CreateIntakeComponent', () => {
  let component: CreateIntakeComponent;
  let fixture: ComponentFixture<CreateIntakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateIntakeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateIntakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
