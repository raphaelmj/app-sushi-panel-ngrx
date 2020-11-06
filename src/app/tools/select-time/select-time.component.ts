import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Component, EventEmitter, OnInit, Output, OnDestroy, Input } from '@angular/core';
import * as moment from "moment";

export interface TimeModel {
  hours: number
  minutes: number
  seconds: number
}

@Component({
  selector: 'app-select-time',
  templateUrl: './select-time.component.html',
  styleUrls: ['./select-time.component.scss']
})
export class SelectTimeComponent implements OnInit, OnDestroy {

  @Output() emitClose: EventEmitter<any> = new EventEmitter()
  @Output() emitChange: EventEmitter<TimeModel> = new EventEmitter<TimeModel>()
  @Input() timeString: string
  timeData: FormControl
  subChange: Subscription
  time: TimeModel
  isChanged: boolean = false

  constructor() { }


  ngOnInit(): void {
    if (!this.timeString) {
      this.timeString = moment().format('HH:mm')
    }
    this.timeData = new FormControl(this.timeString);
    this.subChange = this.timeData.valueChanges.subscribe(v => {
      this.isChanged = true
      this.time = this.createTimeModel(v)
    })
  }

  closeEdit() {
    this.emitClose.emit()
  }

  updateTime() {
    if (this.isChanged) {
      this.emitChange.emit(this.time)
    } else {
      this.emitClose.emit()
    }
  }

  createTimeModel(timeString: string): TimeModel {
    if (timeString) {
      var ex = timeString.split(':')
      return {
        hours: Number(ex[0]),
        minutes: Number(ex[1]),
        seconds: 0
      }
    }
  }



  ngOnDestroy(): void {
    if (this.subChange) this.subChange.unsubscribe()
  }

}
