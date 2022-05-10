import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {DaySchedule} from "../../entities/daySchedule";

@Component({
  selector: 'app-business-schedule',
  templateUrl: './business-schedule.component.html',
  styleUrls: ['./business-schedule.component.scss']
})
export class BusinessScheduleComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    schedule: DaySchedule[]
  }) { }

  displayedColumns: string[] = ['day', 'from', 'to'];

  ngOnInit(): void {
  }

}
