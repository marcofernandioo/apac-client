import { Component, OnInit, ElementRef, ViewChild, Input, OnChanges, SimpleChanges, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { DataSet } from 'vis-data';
import { Timeline } from 'vis-timeline';
import { Subscription} from 'rxjs';

import { ITimeline } from 'src/app/interfaces/timeline.interface';
import { TimelineDataService } from 'src/app/services/timeline-data.service';


interface IGroup {
  id: number;
  content: string;
}

@Component({
  selector: 'app-timeline-table',
  templateUrl: './timeline-table.component.html',
  styleUrls: ['./timeline-table.component.css']
})
export class TimelineTableComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('visualization', { static: true }) private visualizationElement!: ElementRef;
  private timeline!: Timeline;
  @Input() subProgrammeList!: DataSet<any>;
  @Input() semesters!: DataSet<any>;
  programmeListGroup: DataSet<IGroup> = new DataSet<IGroup>();

  subscription!: Subscription;
  timelineData!: DataSet<ITimeline>;


  constructor(
    private cdr: ChangeDetectorRef, 
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['subProgrammeList'] || changes['semesters']) {
      this.updateTimeline();
    }
  }

  ngOnDestroy() {
    if (this.timeline) {
      this.timeline.destroy();
      this.subProgrammeList = new DataSet();
      this.semesters = new DataSet();
    }
  }

  private updateTimeline() {
  if (this.timeline) {
    this.timeline.destroy();
  }
  this.createGanttChart();
  this.cdr.detectChanges();
  }

  updateProgrammeList() {
    if (this.timeline) {
      const groups = this.programmeListGroup.get() as IGroup[];
      this.timeline.setGroups(groups);
      this.cdr.detectChanges();
    }
  }

  private createGanttChart() {
    // Configuration for the Timeline
    const options = {
      stack: false,
      groupOrder: 'content',
      zoomMin: 1000 * 60 * 60 * 24 * 31 * 12, // 1 year in milisec.
      zoomMax: 1000 * 60 * 60 * 24 * 31 * 12 * 3, // 3 years in milisec.
    };

    // Create a Timeline
    this.timeline = new Timeline(
      this.visualizationElement.nativeElement,
      this.semesters,
      this.subProgrammeList,
      options
    );
  }

}
