import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { DataService } from 'src/app/services/data.service';
import { MatSelectChange } from '@angular/material/select';

interface DateRange {
  name: string;
  label: string;
}

@Component({
  selector: 'app-create-semester',
  templateUrl: './create-semester.component.html',
  styleUrls: ['./create-semester.component.css']
})
export class CreateSemesterComponent implements OnInit, OnChanges {
  @Input() parentId: string | null = '';
  @Input() parentType: string | null = '';
  @Input() numberOfSemesters: any = 2;

  dateRangeForm!: FormGroup;
  selectedIntakeID!: Number;
  semesters: number[] = [];
  groupIdList: number [] | null = null;

  availableIntakes: any[] | null = null;
  selectedIntake: any | null = null;

  dateRanges: DateRange[] = [
    { name: 'semester', label: 'Semester' },
    { name: 'midSemesterBreak', label: 'Mid-Semester Break' },
    { name: 'bufferWeek', label: 'Buffer Week' },
    { name: 'exams', label: 'Exams' },
  ];

  constructor(
    private api: DataService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  loadGroupIdList() {
    this.api.getGroups(this.parentId, this.parentType).subscribe({
      next: (response) => {
        this.groupIdList = response.map(item => item.id)
        this.loadIntakesList(this.groupIdList);
      },
      error: (error) => {
        console.error('Error loading groups:', error);
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
        console.error('Error intakes:', error);
        alert("Error loading Intakes. Please try again.");
      }
    })
  }

  onSelectedIntakeChange(event: MatSelectChange) {
    this.selectedIntakeID = event.value;
  }

  updateSemesters() {
    this.semesters = Array(this.numberOfSemesters).fill(0).map((_, i) => i + 1);
  }

  ngOnInit() {
    this.semesters = Array(this.numberOfSemesters).fill(0).map((_, i) => i + 1);
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['parentId'] || changes['parentType'] || changes['numberOfSemesters']) {
      this.loadGroupIdList();
      
      if (changes['numberOfSemesters']) {
        this.updateSemesters();
        this.initForm();
      }
      
      this.cdr.detectChanges();
    }
  }

  initForm() {
    const semestersGroup = this.fb.group({});

    this.semesters.forEach(semesterNum => {
      const semesterGroup = this.fb.group({});
      
      this.dateRanges.forEach(range => {
        semesterGroup.addControl(range.name, this.fb.group({
          startDate: ['', Validators.required],
          endDate: ['', Validators.required],
          duration: ['', [Validators.required, Validators.min(range.name === 'semester' ? 1 : 0)]]
        }));
      });

      semestersGroup.addControl(`semester${semesterNum}`, semesterGroup);
    });

    this.dateRangeForm = this.fb.group({
      semesters: semestersGroup
    });

    this.semesters.forEach(semesterNum => {
      this.dateRanges.forEach(range => {
        this.setupDateListeners(semesterNum, range.name);
      });
    });
  }

  setupDateListeners(semesterNum: number, rangeName: string) {
    const rangeGroup = this.dateRangeForm.get(`semesters.semester${semesterNum}.${rangeName}`);
    
    rangeGroup?.get('startDate')?.valueChanges.subscribe(() => this.updateEndDateOrDuration(semesterNum, rangeName));
    rangeGroup?.get('endDate')?.valueChanges.subscribe(() => this.updateStartDateOrDuration(semesterNum, rangeName));
    rangeGroup?.get('duration')?.valueChanges.subscribe(() => this.updateEndDate(semesterNum, rangeName));
  }

  updateEndDateOrDuration(semesterNum: number, rangeName: string) {
    const rangeGroup = this.dateRangeForm.get(`semesters.semester${semesterNum}.${rangeName}`);
    const startDate = rangeGroup?.get('startDate')?.value;
    const endDate = rangeGroup?.get('endDate')?.value;
    const duration = rangeGroup?.get('duration')?.value;

    if (startDate && duration) {
      const newEndDate = new Date(startDate);
      newEndDate.setDate(newEndDate.getDate() + duration * 7);
      rangeGroup?.get('endDate')?.setValue(newEndDate, { emitEvent: false });
    } else if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      rangeGroup?.get('duration')?.setValue(Math.round(diffDays / 7), { emitEvent: false });
    }
  }

  updateStartDateOrDuration(semesterNum: number, rangeName: string) {
    const rangeGroup = this.dateRangeForm.get(`semesters.semester${semesterNum}.${rangeName}`);
    const startDate = rangeGroup?.get('startDate')?.value;
    const endDate = rangeGroup?.get('endDate')?.value;
    const duration = rangeGroup?.get('duration')?.value;

    if (endDate && duration) {
      const newStartDate = new Date(endDate);
      newStartDate.setDate(newStartDate.getDate() - duration * 7);
      rangeGroup?.get('startDate')?.setValue(newStartDate, { emitEvent: false });
    } else if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      rangeGroup?.get('duration')?.setValue(Math.round(diffDays / 7), { emitEvent: false });
    }
  }

  updateEndDate(semesterNum: number, rangeName: string) {
    const rangeGroup = this.dateRangeForm.get(`semesters.semester${semesterNum}.${rangeName}`);
    const startDate = rangeGroup?.get('startDate')?.value;
    const duration = rangeGroup?.get('duration')?.value;

    if (startDate && duration) {
      const newEndDate = new Date(startDate);
      newEndDate.setDate(newEndDate.getDate() + duration * 7);
      rangeGroup?.get('endDate')?.setValue(newEndDate, { emitEvent: false });
    }
  }

  dateRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const form = control as FormGroup;
    const errors: { [key: string]: boolean } = {};

    for (let i = 1; i <= this.numberOfSemesters; i++) {
      const semesterGroup = form.get(`semesters.semester${i}`);
      const semesterStart = semesterGroup?.get('semester.startDate')?.value;
      const semesterEnd = semesterGroup?.get('semester.endDate')?.value;

      if (semesterStart && semesterEnd) {
        ['midSemesterBreak', 'bufferWeek', 'exams'].forEach(period => {
          const periodStart = semesterGroup?.get(`${period}.startDate`)?.value;
          const periodEnd = semesterGroup?.get(`${period}.endDate`)?.value;

          if (periodStart && periodEnd) {
            if (periodStart < semesterStart || periodEnd > semesterEnd) {
              errors[`semester${i}_${period}OutOfRange`] = true;
            }
          }
        });
      }
    }

    return Object.keys(errors).length ? errors : null;
  }

  formatData(input: any): any {
    const output: any = [];

    Object.entries(input.semesters).forEach(([semesterKey, semesterValue]: [string, any], index) => {
      const newSemester: any = {
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
        intakeid: this.selectedIntakeID
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
    if (this.dateRangeForm.valid) {
      const formData = this.dateRangeForm.value;
      const formattedData = this.formatDates(formData);
      const finalData = this.formatData(formattedData);
      console.log(finalData);
      this.api.createBulkSemesters(finalData, this.selectedIntakeID).subscribe({
        next: (res) => {
          alert('Semester created successfully!')
        },
        error: (err) => {
          console.log(err);
          alert('Error creating semester. Try again.')
        }
      })
      this.resetForm();
    } else {
      console.log('Form is invalid. Please check all fields.');
    }
  }

  resetForm() {
    this.dateRangeForm.reset();
    
    // Re-initialize the form with empty values
    const semestersControl = this.dateRangeForm.get('semesters') as FormGroup;
    
    this.semesters.forEach(semesterNum => {
      const semesterGroup = semestersControl.get('semester' + semesterNum) as FormGroup;
      
      this.dateRanges.forEach(range => {
        const rangeGroup = semesterGroup.get(range.name) as FormGroup;
        rangeGroup.patchValue({
          startDate: null,
          endDate: null,
          duration: null
        });
      });
    });
  }
 
}