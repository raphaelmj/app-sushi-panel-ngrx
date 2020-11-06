import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';

export enum InputConfirmType {
  randomNumber = "randomNumber",
  somePassword = "somePassword"
}

export interface InputConfirmResponse {
  do: boolean
  bundleData: any
  type: InputConfirmType,
  dataStr: string
}

@Component({
  selector: 'app-confirm-by-input-data',
  templateUrl: './confirm-by-input-data.component.html',
  styleUrls: ['./confirm-by-input-data.component.scss']
})
export class ConfirmByInputDataComponent implements OnInit, OnChanges {

  @Input() message: string;
  @Input() bundleData: any;
  @Input() confirmName: string = 'Usuń'
  @Input() type: InputConfirmType
  @Input() isInputOk: boolean = true
  @Output() emitActionConfirm: EventEmitter<InputConfirmResponse> = new EventEmitter<InputConfirmResponse>();

  inputConfirmType = InputConfirmType
  randomCode: string
  formStr: FormGroup


  constructor(private fb: FormBuilder) { }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {
    this.randomCode = Math.random().toString(8).substring(2, 4) + Math.random().toString(8).substring(6, 8);
    this.createForm()
  }

  createForm() {
    this.formStr = this.fb.group({
      dataStr: ['', Validators.required]
    })
  }

  forget() {
    this.emitActionConfirm.emit({
      do: false,
      bundleData: this.bundleData,
      type: this.type,
      dataStr: this.formStr.get('dataStr').value
    })
  }

  submitStrCode() {
    if (this.formStr.valid) {
      if (this.randomCode == this.formStr.get('dataStr').value) {
        this.isInputOk = true
        this.emitActionConfirm.emit({
          do: true,
          bundleData: this.bundleData,
          type: this.type,
          dataStr: this.formStr.get('dataStr').value
        })
      } else {
        this.isInputOk = false
      }
    }
  }

  submitSomePassword() {
    if (this.formStr.valid) {
      this.emitActionConfirm.emit({
        do: true,
        bundleData: this.bundleData,
        type: this.type,
        dataStr: this.formStr.get('dataStr').value
      })
    }
  }

}
