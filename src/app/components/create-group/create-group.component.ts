import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnInit {

  groupname: string = '';
  @Input() parentId: string = '';
  @Input() parentType: string = '';

  constructor(private api: DataService) { }

  ngOnInit(): void {

  }

  onSubmitCreateGroup() {
    const groupObject = {
      groupname: this.groupname,
      parentid: parseInt(this.parentId),
      parenttype: this.parentType
    }
    this.api.createGroup(groupObject).subscribe({
      next: (res) => {
        console.log(res);
        alert("Group Created")
      },
      error: (err) => {
        console.log(err);
        alert("Error, try again later")
      }
    })
  }
}
