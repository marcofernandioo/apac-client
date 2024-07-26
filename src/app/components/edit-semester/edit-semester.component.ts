import { Component, OnInit, OnChanges, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';
import { ISemester } from 'src/app/interfaces/semester.interface';

interface DateRange {
  name: string;
  label: string;
}

@Component({
  selector: 'app-edit-semester',
  templateUrl: './edit-semester.component.html',
  styleUrls: ['./edit-semester.component.css']
})
export class EditSemesterComponent implements OnInit, OnChanges {
  @Input() parentId: string | null = '';
  @Input() parentType: string | null = '';
  @Input() numberOfSemesters: any = 2;

  dateRangeForm!: FormGroup;
  semesters: number[] = [];
  selectedIntakeID!: number;
  groupIdList: number[] | null = null; // Not displayed
  private originalValues: { [key: string]: any } = {};

  availableIntakes: any[] | null = null;
  selectedIntake: any | null = null;

  dateRanges: DateRange[] = [
    { name: 'semester', label: 'Semester' },
    { name: 'midSemesterBreak', label: 'Mid-Semester Break' },
    { name: 'bufferWeek', label: 'Buffer Week' },
    { name: 'exams', label: 'Exams' },
  ];

  editingState: { [key: string]: boolean } = {};

  constructor(
    private fb: FormBuilder,
    private api: DataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['parentId'] || changes['parentType'] || changes['numberOfSemesters']) {
      console.log(this.parentId, this.parentType);
      this.loadGroupIdList();
      if (changes['numberOfSemesters']) {
        this.updateSemesters();
        this.initForm();
      }
      this.cdr.detectChanges();
    }
  }

  updateSemesters() {
    this.semesters = Array(this.numberOfSemesters).fill(0).map((_, i) => i + 1);
  }

  loadGroupIdList() {
    this.api.getGroups(this.parentId, this.parentType).subscribe({
      next: (response) => {
        this.groupIdList = response.map(item => item.id)
        this.loadIntakesList(this.groupIdList);
      },
      error: (error) => {
        alert("Error loading groups. Please try again.");
      }
    });
  }

  loadIntakesList(list: any) {
    this.api.getIntakesByGroupIdList(list).subscribe({
      next: (response) => {
        this.availableIntakes = response;
      },
      error: (error) => {
        alert("Error loading Intakes. Please try again.");
      }
    })
  }

  initForm() {
    const semestersGroup = this.fb.group({});

    // Clear existing controls
    if (this.dateRangeForm) {
      const existingSemesters = this.dateRangeForm.get('semesters') as FormGroup;
      Object.keys(existingSemesters.controls).forEach(key => {
        existingSemesters.removeControl(key);
      });
    }

    this.semesters.forEach(semesterNum => {
      const semesterGroup = this.fb.group({});
      
      this.dateRanges.forEach(range => {
        semesterGroup.addControl(range.name, this.fb.group({
          startDate: [''],
          endDate: [''],
          duration: ['']
        }));
        this.editingState[`semester${semesterNum}_${range.name}`] = false;
      });

      semestersGroup.addControl(`semester${semesterNum}`, semesterGroup);
    });

    if (this.dateRangeForm) {
      this.dateRangeForm.setControl('semesters', semestersGroup);
    } else {
      this.dateRangeForm = this.fb.group({
        semesters: semestersGroup
      });
    }
  }

  onSelectedIntakeChange(event: any) {
    this.selectedIntakeID = event.value;
    this.fetchSemesterData();
  }

  fetchSemesterData() {
    this.api.getSemestersByIntakeId(String(this.selectedIntakeID)).subscribe({
      next: (res) => {
        this.populateForm(res);
      },
      error: (err) => {
        alert('error')
      }
    })
  }

  populateForm(semesterData: any[]) {
    semesterData.forEach((semester) => {
      const semesterNumber = semester.name.split(' ')[1];
      const semesterGroup = (this.dateRangeForm.get('semesters') as FormGroup).get(`semester${semesterNumber}`) as FormGroup;
      
      if (semesterGroup) {
        // Populate semester dates
        semesterGroup.get('semester')?.patchValue({
          startDate: new Date(semester.startdate),
          endDate: new Date(semester.enddate),
          duration: this.calculateWeeks(new Date(semester.startdate), new Date(semester.enddate))
        });
  
        // Populate mid-semester break dates
        semesterGroup.get('midSemesterBreak')?.patchValue({
          startDate: new Date(semester.midsemstart),
          endDate: new Date(semester.midsemend),
          duration: semester.midsemduration
        });
  
        // Populate buffer week dates
        semesterGroup.get('bufferWeek')?.patchValue({
          startDate: new Date(semester.bufferstart),
          endDate: new Date(semester.bufferend),
          duration: semester.buffersemduration
        });
  
        // Populate exam dates
        semesterGroup.get('exams')?.patchValue({
          startDate: new Date(semester.examstart),
          endDate: new Date(semester.examend),
          duration: semester.examduration
        });
      }
    });
  
    // After populating, disable all controls
    this.disableAllControls();
  }

  disableAllControls() {
    Object.keys(this.dateRangeForm.controls).forEach(key => {
      const control = this.dateRangeForm.get(key);
      control?.disable();
    });
  }

  calculateWeeks(start: Date, end: Date): number {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.ceil(diffDays / 7);
  }

  toggleEdit(semesterNumber: number, rangeName: string) {
    const key = `semester${semesterNumber}_${rangeName}`;
    const semesterGroup = this.dateRangeForm.get('semesters')?.get(`semester${semesterNumber}`) as FormGroup;
    const rangeGroup = semesterGroup?.get(rangeName) as FormGroup;
    
    if (!this.editingState[key]) {
      // Start editing
      this.editingState[key] = true;
      this.originalValues[key] = {...rangeGroup.value};
      rangeGroup.enable();
    } else {
      // Stop editing (this branch probably won't be used now, but kept for consistency)
      this.editingState[key] = false;
      rangeGroup.disable();
    }
  }

  isEditing(semesterNumber: number, rangeName: string): boolean {
    return this.editingState[`semester${semesterNumber}_${rangeName}`];
  }

  saveRow(semesterNumber: number, rangeName: string) {

    const key = `semester${semesterNumber}_${rangeName}`;
    const semesterGroup = this.dateRangeForm.get('semesters')?.get(`semester${semesterNumber}`) as FormGroup;
    const rangeGroup = semesterGroup?.get(rangeName) as FormGroup;

    // Get the entire form data
    rangeGroup.patchValue(this.dateRangeForm.value.semesters[`semester${semesterNumber}`].semester)

    delete this.originalValues[key];
    rangeGroup.disable();
    this.editingState[key] = false;

  }


  cancelEdit(semesterNumber: number, rangeName: string) {
    const key = `semester${semesterNumber}_${rangeName}`;
    const semesterGroup = this.dateRangeForm.get('semesters')?.get(`semester${semesterNumber}`) as FormGroup;
    const rangeGroup = semesterGroup?.get(rangeName) as FormGroup;
    
    // Revert to original values
    if (this.originalValues[key]) {
      rangeGroup.patchValue(this.originalValues[key]);
      delete this.originalValues[key]; // Clean up stored original values
    }
    
    rangeGroup.disable();
    this.editingState[key] = false;
  }

  
  formatData(input: any): any {
    const output: any = [];

    Object.entries(input.semesters).forEach(([semesterKey, semesterValue]: [string, any], index) => {
      const newSemester: ISemester = {
        name: `Semester ${index + 1}`,
        startdate: semesterValue.semester.startDate,
        enddate: semesterValue.semester.endDate,
        duration: semesterValue.semester.duration,
        midsemstart: semesterValue.midSemesterBreak.startDate,
        midsemend: semesterValue.midSemesterBreak.endDate,
        midsemduration: semesterValue.midSemesterBreak.duration,
        bufferstart: semesterValue.bufferWeek.startDate,
        bufferend: semesterValue.bufferWeek.endDate,
        buffersemduration: semesterValue.bufferWeek.duration,
        examstart: semesterValue.exams.startDate,
        examend: semesterValue.exams.endDate,
        examduration: semesterValue.exams.duration,
      };
      output.push(newSemester);
    });
  
    return output;
  }

  formatDates(data: any): any {
    if (data instanceof Date) {
      return this.formatDate(data);
    } else if (Array.isArray(data)) {
      return data.map(item => this.formatDates(item));
    } else if (typeof data === 'object' && data !== null) {
      const formatted: any = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          formatted[key] = this.formatDates(data[key]);
        }
      }
      return formatted;
    }
    return data;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  submitForm() {
    
    const formData = this.dateRangeForm.value;
    const formattedData = this.formatDates(formData);
    const finalData = this.formatData(formattedData);

    this.api.editSemestersByIntakeId(`${this.selectedIntakeID}`, finalData)
    .subscribe({
      next: (res) => {
        alert("Semester Edited")
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}