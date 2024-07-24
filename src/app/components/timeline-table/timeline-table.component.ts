import { Component, OnInit, ElementRef, ViewChild, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { DataSet } from 'vis-data';
import { Timeline } from 'vis-timeline';


interface IGroup {
  id: number;
  content: string;
}

@Component({
  selector: 'app-timeline-table',
  templateUrl: './timeline-table.component.html',
  styleUrls: ['./timeline-table.component.css']
})
export class TimelineTableComponent implements OnInit, OnChanges {

  @ViewChild('visualization', { static: true }) private visualizationElement!: ElementRef;
  private timeline!: Timeline;
  @Input() subProgrammeList!: DataSet<any>;
  @Input() semesters!: DataSet<any>;
  programmeListGroup: DataSet<IGroup> = new DataSet<IGroup>();


  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.createGanttChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['subProgrammeList'] || changes['subItems']) {
      console.log("in component: ")
      console.log(this.subProgrammeList);
      this.updateProgrammeList();
    }
  }

  updateProgrammeList() {
    if (this.timeline) {
      const groups = this.programmeListGroup.get() as IGroup[];
      this.timeline.setGroups(groups);
      // this.createGanttChart();
      this.cdr.detectChanges();
    }
  }

  private createGanttChart() {
    // Configuration for the Timeline
    const options = {
      stack: false,
      editable: true,
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
