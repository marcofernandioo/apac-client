import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeTableComponent } from './intake-table.component';

describe('IntakeTableComponent', () => {
  let component: IntakeTableComponent;
  let fixture: ComponentFixture<IntakeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntakeTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntakeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
