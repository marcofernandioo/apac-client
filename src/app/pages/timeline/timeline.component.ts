import { Component, OnInit, ChangeDetectorRef, OnChanges, SimpleChanges  } from '@angular/core';
import { Timeline, DataSet } from 'vis-timeline/standalone';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

// import { TimelineTableComponent } from 'src/app/components/timeline-table/timeline-table.component';
import { DataService } from 'src/app/services/data.service';
import { MatSelectChange } from '@angular/material/select';
import { IGroup } from 'src/app/interfaces/group.interface';
import { IIntake } from 'src/app/interfaces/intake.interface';

import { TimelineDataService } from 'src/app/services/timeline-data.service';
import { ISemester } from 'src/app/interfaces/semester.interface';


interface ITimeline {
  id: number;
  content: string;
  nestedGroups?: number[];
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
})
export class TimelineComponent implements OnInit {
  parentList: any[] = [];
  // selectedParentName: string = '';
  selectedParentId: string = '';
  selectedParentType: string = '';
  selectedParentCode: string = '';

  timelineDataset: DataSet<ITimeline> = new DataSet();

  semesters: DataSet<any> = new DataSet<any>([
    { id: 1, group: 2, content: 'Semester 1', start: new Date(2023, 0, 1), end: new Date(2023, 0, 5) },
    { id: 2, group: 2, content: 'Semester 2', start: new Date(2023, 0, 6), end: new Date(2023, 0, 10) },
    { id: 3, group: 3, content: 'Semester 3', start: new Date(2023, 0, 3), end: new Date(2023, 0, 8) },
    { id: 4, group: 5, content: 'Semester 4', start: new Date(2023, 0, 5), end: new Date(2023, 0, 12) },
    { id: 5, group: 6, content: 'Semester 5', start: new Date(2023, 0, 8), end: new Date(2023, 0, 15) }
  ]);

  constructor(
    private api: DataService, 
    private cdr: ChangeDetectorRef,
    private timelineDataService: TimelineDataService
  ) { }

  ngOnInit(): void {
    this.loadParents();
  }

  loadParents() {
    this.api.getParents().subscribe({
      next: (response) => {
        this.parentList = response.items;
        console.log('Parents loaded:', this.parentList);
      },
      error: (error) => {
        console.error('Error loading parents:', error);
        // Handle error (e.g., show an error message to the user)
      }
    })
  }

  getParentName(parent: any): string {
    return parent.coursename || parent.programmename || '';
  }

  onSelectedParentChange(event: MatSelectChange) {
    // console.log("Selected: ", event.value);
    console.log('changed from parent',this.selectedParentId, this.selectedParentType)
    this.selectedParentId = event.value.id;
    this.selectedParentCode = event.value.code;
    if (event.value.coursename) 
      this.selectedParentType = "course";
    if (event.value.programmename)
      this.selectedParentType = "programme";
    this.loadTimelineDataset();
    this.cdr.detectChanges();
  }

  // From the selected parent, get all the groups.
  // When we want to add feature to filter by year, we can just get the
  // group with specific year. 
  async getGroups(): Promise<IGroup[]> {
    return new Promise((resolve, reject) => {
      this.api.getGroups(this.selectedParentId, this.selectedParentType).subscribe({
        next: (res) => {
          console.log(res);
          resolve(res);
        },
        error: (err) => {
          console.log(err);
          reject(err);
        }
      });
    });
  }

  async getIntakes(list: any): Promise<IIntake[]> {
    return new Promise((resolve, reject) => {
      this.api.getIntakesByGroupIdList(list).subscribe({
        next: (res) => resolve(res),
        error: (err) => reject(err)
      })
    })
  }

  // From the queried groups id, get all the semesters.
  async getSemesters(list: any):Promise<any[]> {
    // Return all semesters.
    return new Promise((resolve, reject) => {
      this.api.getSemestersByIntakeIdList(list).subscribe({
        next: (res) => resolve (res),
        error: (err) => reject(err)
      })
    })
  }

  
  // Formatting
  combineDataIntoTimeline(groups: IGroup[], intakes: IIntake[]): ITimeline[] {
    const timeline: ITimeline[] = [];
  
    // Process groups
    groups.forEach(group => {
      const nestedGroups = intakes
        .filter(intake => intake.groupid === group.id)
        .map(intake => intake.id);
  
      timeline.push({
        id: group.id,
        content: group.groupname,
        nestedGroups: nestedGroups.length > 0 ? nestedGroups : undefined
      });
    });
  
    // Process intakes
    intakes.forEach(intake => {
      timeline.push({
        id: intake.id,
        content: intake.code
      });
    });
  
    return timeline;
  }

  // Formatting
  transformData(semesters: ISemester[]): any[] {
    return semesters.map((semester, index) => ({
      
      data: {
        id: index + 1,
        group: '',  // Leave blank for now
        content: semester.name,
        start: new Date(semester.startdate),
        end: new Date(semester.enddate)
      },
      intakeId: semester.intakeid,
    
    }));
  }

  // data is the output of the transformedData.
  assignIntakeId(data: any[], intakeList: any[], tl: any[]) {
    // console.log(data);
    // in the temporaryIntake, from the intake id, get the "name".
    // in the allSemesters, from the "name", get the id.
    // assign this id to semester's object's group.
    return data.map((object) => {
      const intakeName = intakeList.find(int => int.id === object.intakeId)?.code;
      const sumthing = tl.find(sem => sem.content === intakeName)?.id;
      // return {
      //   ...object,
      //   data: {
      //     ...object.data,
      //     group: sumthing || '' // Use an empty string if sumthing is undefined
      //   }
      // };
      return {
        ...object.data,
        group: sumthing
      }
    })

  }


  // const temporarySemesters = await this.getSemesters(groupIdList);
    // console.log(temporarySemesters);

  async loadTimelineDataset() {
    this.timelineDataset = new DataSet();
    // 1. Store all the Groups into a single list.
    const temporaryGroups = await this.getGroups();
    
    // 2. Get only the Id of the list.
    const groupIdList = temporaryGroups.map(obj => obj.id); // Change this using JSHOF
    
    // 3. From the Group id List, get all the intakes.
    const temporaryIntakes: IIntake[] = await this.getIntakes(groupIdList);
    const intakeIdList = temporaryIntakes.map(o => o.id);
    
    // 4. Combine and transform the two.
    const timelineData = this.combineDataIntoTimeline(temporaryGroups, temporaryIntakes);

    // 5. Combine groupsDataset with semestersDataset into timelineDataset. End.
    this.timelineDataset = new DataSet(timelineData);
    const allSemesters: any[]  = await this.getSemesters(intakeIdList);

    const transformedData = this.transformData(allSemesters);

    const finalSemesterData = this.assignIntakeId(transformedData, temporaryIntakes, timelineData);
    this.semesters = new DataSet(finalSemesterData);
  }

}
