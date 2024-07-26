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
  selectedYear: number | null = null;// temporary;
  yearList: number[] = [];
  yearlyIntakesAsTable!: MatTableDataSource<IIntake>;
  yearlyIntakes!: any[];
  allIntakes: IIntake[] = [];

  constructor(
    private api: DataService
  ) { }

  ngOnInit(): void {
    this.loadAllIntakes();
  }

  loadAllIntakes() {
    console.log('log')
    this.api.getAllIntakes().subscribe({
      next: (res: IIntake[]) => {
        this.allIntakes = res;
        this.extractYears();
        console.log(res);
        this.selectedYear = this.yearList[0]; // Select the first year by default
        this.filterIntakesByYear();
      },
      error: (err) => {
        console.error('Error loading intakes:', err);
      }
    });
  }

  extractYears() {
    const years = new Set(this.allIntakes.map(intake => new Date(intake.startdate).getFullYear()));
    this.yearList = Array.from(years).sort((a, b) => b - a); // Sort years in descending order
  }

  filterIntakesByYear() {
    if (this.selectedYear) {
      const filteredIntakes = this.allIntakes.filter(intake => 
        new Date(intake.startdate).getFullYear() === this.selectedYear
      );
      this.yearlyIntakesAsTable = new MatTableDataSource(filteredIntakes);
    }
  }

  onSelectedYearChange(event: MatSelectChange) {
    this.selectedYear = event.value;
    this.filterIntakesByYear();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  downloadCSV() {
    const csvData = this.convertToCSV(this.yearlyIntakesAsTable.data);
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
