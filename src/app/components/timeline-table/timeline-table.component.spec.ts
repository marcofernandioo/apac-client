import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineTableComponent } from './timeline-table.component';

describe('TimelineTableComponent', () => {
  let component: TimelineTableComponent;
  let fixture: ComponentFixture<TimelineTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelineTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
