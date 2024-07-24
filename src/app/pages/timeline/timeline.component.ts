import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { Timeline, DataSet } from 'vis-timeline/standalone';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

// import { TimelineTableComponent } from 'src/app/components/timeline-table/timeline-table.component';
import { DataService } from 'src/app/services/data.service';
import { MatSelectChange } from '@angular/material/select';


interface SubProgramme {
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

  subProgrammeList: DataSet<SubProgramme> = new DataSet<SubProgramme>([
    { id: 1, content: 'CERTIFICATE 2023', nestedGroups: [2, 3, 5] },
    { id: 4, content: 'CERTIFICATE 2024', nestedGroups: [6] },
    { id: 2, content: 'AFCF2303' },
    { id: 3, content: 'AFCF2307' },
    { id: 5, content: 'AFCF2403' },
    { id: 6, content: 'AFCF2408' }
  ])

  semesters: DataSet<any> = new DataSet<any>([
    { id: 1, group: 2, content: 'Semester 1', start: new Date(2023, 0, 1), end: new Date(2023, 0, 5) },
    { id: 2, group: 2, content: 'Semester 2', start: new Date(2023, 0, 6), end: new Date(2023, 0, 10) },
    { id: 3, group: 3, content: 'Semester 3', start: new Date(2023, 0, 3), end: new Date(2023, 0, 8) },
    { id: 4, group: 5, content: 'Semester 4', start: new Date(2023, 0, 5), end: new Date(2023, 0, 12) },
    { id: 5, group: 6, content: 'Semester 5', start: new Date(2023, 0, 8), end: new Date(2023, 0, 15) }
  ]);

  constructor(private api: DataService, private cdr: ChangeDetectorRef) { }

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
    this.cdr.detectChanges();
  }

}
