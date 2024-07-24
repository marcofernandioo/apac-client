import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-semester',
  templateUrl: './create-semester.component.html',
  styleUrls: ['./create-semester.component.css']
})
export class CreateSemesterComponent implements OnInit {
  intakeList: any[] | null = null;
  selectedIntake: any = null;

  groupList: any[] | null = null;
  selectedGroup: any = null;

  constructor() { }

  ngOnInit(): void {
  }

}
