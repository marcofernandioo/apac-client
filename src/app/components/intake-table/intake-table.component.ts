import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { DataService } from 'src/app/services/data.service';
import { saveAs } from 'file-saver';
import { MatTableDataSource } from '@angular/material/table';

import { IIntake } from 'src/app/interfaces/intake.interface';

@Component({
  selector: 'app-intake-table',
  templateUrl: './intake-table.component.html',
  styleUrls: ['./intake-table.component.css']
})
export class IntakeTableComponent implements OnInit {

  displayedColumns: string[] = ['code', 'startdate', 'enddate'];
  selectedYear: number = 2024; // temporary;
  yearList: number[] = [2024];
  yearlyIntakesAsTable!: MatTableDataSource<IIntake>;
  yearlyIntakes!: any[];

  constructor(
    private api: DataService
  ) { }

  ngOnInit(): void {
    this.loadIntakesByYear();
  }

  loadIntakesByYear() {
    this.api.getIntakesByYear(this.selectedYear).subscribe({
      next: (res) => {
        this.yearlyIntakes = res;
        this.yearlyIntakesAsTable = new MatTableDataSource(res);
        this.yearList = res.map((intake: any) => intake.startDate.slice(0,4))
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  onSelectedYearChange(event: MatSelectChange) {
    this.loadIntakesByYear();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  downloadCSV() {
    const csvData = this.convertToCSV(this.yearlyIntakes);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${this.selectedYear} Intakes.csv`);
  }

  convertToCSV(data: IIntake[]): string {
    const header = ['Code', 'Start Date', 'End Date'];
    const csvRows = [header.join(',')];

    for (const intake of data) {
      const row = [
        intake.code,
        this.formatDate(intake.startdate),
        this.formatDate(intake.enddate)
      ];
      csvRows.push(row.join(','));
    }

    return csvRows.join('\n');
  }

}
