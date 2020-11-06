import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

export interface ConfirmBundleResponse {
  do: boolean
  bundleData: any
}

@Component({
  selector: 'app-confirm-window',
  templateUrl: './confirm-window.component.html',
  styleUrls: ['./confirm-window.component.scss']
})
export class ConfirmWindowComponent implements OnInit, OnChanges {

  @Input() message: string;
  @Input() showConfirm: boolean;
  @Input() bundleData: any;
  @Output() emitActionConfirm: EventEmitter<ConfirmBundleResponse> = new EventEmitter<ConfirmBundleResponse>();

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes.showConfirm)
  }

  confirm() {
    this.showConfirm = false;
    this.emitActionConfirm.emit({ do: true, bundleData: this.bundleData });
  }

  forget() {
    this.showConfirm = false;
    this.emitActionConfirm.emit({ do: false, bundleData: this.bundleData });
  }


}
