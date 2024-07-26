import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { DataService } from 'src/app/services/data.service';

// Custom date formats        console.log(error);

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-create-intake',
  templateUrl: './create-intake.component.html',
  styleUrls: ['./create-intake.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ]
})
export class CreateIntakeComponent implements OnInit, OnChanges {

  @Input() parentId: string | null = '';
  @Input() parentType: string | null = '';
  @Input() parentCode: string | null = '';

  selectedProgramme: string | null = '';
  groupList: any[] | null = null;
  semesterStartDate!: Date;
  semesterEndDate!: Date;
  orientationDate!: Date;
  selectedGroup: any = null;
  intakePrefix: String = '';
  duration: Number = 1;

  constructor(private api: DataService) {
  }

  formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }


  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes['parentId'] || changes['parentType']) {
        this.loadGroupList();
      }
  }

  loadGroupList() {
    this.api.getGroups(this.parentId, this.parentType).subscribe({
      next: (response) => {
        this.groupList = Array.isArray(response) ? response : [response];
      },
      error: (error) => {
        console.error('Error loading groups:', error);
        alert("Error loading groups. Please try again.");
      }
    });
  }

  updateIntakePrefix() {
      if (this.semesterStartDate) {
      const year = this.semesterStartDate.getFullYear().toString().substr(-2);
      const month = (this.semesterStartDate.getMonth() + 1).toString().padStart(2, '0');
      this.intakePrefix = `${this.parentCode}${year}${month}`;
    } else {
      this.intakePrefix = '';
    }
  }

  onProgrammeChange() {
    this.loadGroupList();
    this.updateIntakePrefix();
  }

  onStartDateChange() {
    this.updateIntakePrefix();
  }

  onSelectedGroupChange(event: MatSelectChange) {
    this.selectedGroup = event.value;
  }

  calculateDuration() {
    const timeDifference = this.semesterEndDate.getTime() - this.semesterStartDate.getTime();
    const weeksDifference = timeDifference / (1000 * 60 * 60 * 24 * 7);
    return Math.floor(weeksDifference);
  }

  onSubmit() {
    const intakeData = {
      groupid: this.selectedGroup.id,
      code: this.intakePrefix,
      orientation: this.formatDateToYYYYMMDD(this.orientationDate),
      startdate: this.formatDateToYYYYMMDD(this.semesterStartDate),
      enddate: this.formatDateToYYYYMMDD(this.semesterEndDate),
      duration: this.calculateDuration()
    }
    this.api.createIntake(intakeData).subscribe({
      next: (response) => {
        alert('Intake Added Successfully')
      },
      error: (error) => {
        alert('Error creating intake, please try again')
      }
    })
  }

}
