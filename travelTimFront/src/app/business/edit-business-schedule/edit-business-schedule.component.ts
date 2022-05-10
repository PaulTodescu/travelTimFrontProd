import {Component, Inject, Injector, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DaySchedule} from "../../entities/daySchedule";
import {MatCheckboxChange} from "@angular/material/checkbox";
import Swal from "sweetalert2";

@Component({
  selector: 'app-test',
  templateUrl: './edit-business-schedule.component.html',
  styleUrls: ['./edit-business-schedule.component.scss']
})
export class EditBusinessScheduleComponent implements OnInit {

  constructor(
    private injector: Injector,
    private dialogRef: MatDialogRef<EditBusinessScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      schedule: DaySchedule[]
  }) {
    if (this.data.schedule.length === 0){
      this.scheduleToEdit = this.defaultSchedule;
    } else {
      this.scheduleToEdit = this.data.schedule;
    }
  }

  displayedColumns: string[] = ['day', 'from', 'to', 'closed'];

  scheduleToEdit!: DaySchedule[];
  defaultSchedule: DaySchedule[] = [
    {day: 'Monday', startTime: "12:00", endTime: "12:00", closed: false},
    {day: 'Tuesday', startTime: "12:00", endTime: "12:00", closed: false},
    {day: 'Wednesday', startTime: "12:00", endTime: "12:00", closed: false},
    {day: 'Thursday', startTime: "12:00", endTime: "12:00", closed: false},
    {day: 'Friday', startTime: "12:00", endTime: "12:00", closed: false},
    {day: 'Saturday', startTime: "12:00", endTime: "12:00", closed: false},
    {day: 'Sunday', startTime: "12:00", endTime: "12:00", closed: false}
  ];

  timeList: string[] = [
    "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30",
    "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
    "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "00:00", "closed"
  ]

  public changeStartTime(day: string, startTime: string): void {
    let daySchedule = this.scheduleToEdit.find(element => element.day === day);
    if (daySchedule !== undefined){
      daySchedule.startTime = startTime;
      if (daySchedule.startTime.localeCompare('closed') === 0){
        daySchedule.endTime = 'closed';
        daySchedule.closed = true;
      }
      this.scheduleToEdit.splice(this.scheduleToEdit.indexOf(daySchedule), 1, daySchedule);
    }
  }

  public changeEndTime(day: string, endTime: string): void {
    let daySchedule = this.scheduleToEdit.find(element => element.day === day);
    if (daySchedule !== undefined){
      daySchedule.endTime = endTime;
      if (daySchedule.endTime.localeCompare('closed') === 0){
        daySchedule.startTime = 'closed';
        daySchedule.closed = true;
      }
      this.scheduleToEdit.splice(this.scheduleToEdit.indexOf(daySchedule), 1, daySchedule);
    }
  }

  public changeClosed(day: string, event: MatCheckboxChange) {
    let daySchedule = this.scheduleToEdit.find(element => element.day === day);
    if (daySchedule !== undefined) {
      if (event.checked) {
        daySchedule.startTime = 'closed';
        daySchedule.endTime = 'closed';
        daySchedule.closed = true;
        this.scheduleToEdit.splice(this.scheduleToEdit.indexOf(daySchedule), 1, daySchedule);
      } else {
        daySchedule.startTime = '12:00';
        daySchedule.endTime = '12:00';
        daySchedule.closed = false;
        this.scheduleToEdit.splice(this.scheduleToEdit.indexOf(daySchedule), 1, daySchedule);
      }
    }
  }

  public convertStringToBoolean(value: string): boolean {
    return Boolean(value);
  }

  public closeSchedule(): void {
    this.dialogRef.close();
  }

  public saveSchedule(): void{
    let schedule = this.scheduleToEdit;
    let dialogRef: MatDialogRef<EditBusinessScheduleComponent> = this.injector.get(MatDialogRef);
    Swal.fire({
      toast: true,
      position: 'bottom-start',
      icon: 'success',
      title: 'schedule saved',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    }).then(function(){})
    dialogRef.close({
      schedule: schedule
    });
  }

  ngOnInit(): void {
    if (this.data.schedule.length === 0){
      this.scheduleToEdit = this.defaultSchedule;
    } else {
      this.scheduleToEdit = JSON.parse(JSON.stringify(this.data.schedule));
    }
  }

}
