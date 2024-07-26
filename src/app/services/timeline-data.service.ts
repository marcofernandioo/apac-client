import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataSet } from 'vis-data';
import { ITimeline } from 'src/app/interfaces/timeline.interface';

const initialState: DataSet<ITimeline> = new DataSet<ITimeline>([
  // You can add some initial data here if needed
]);

@Injectable({
  providedIn: 'root'
})
export class TimelineDataService {
  private timelineDataSubject = new BehaviorSubject<DataSet<ITimeline>>(initialState);
  timelineData$ = this.timelineDataSubject.asObservable();

  updateTimelineData(newData: DataSet<ITimeline>) {
    this.timelineDataSubject.next(newData);
  }
}