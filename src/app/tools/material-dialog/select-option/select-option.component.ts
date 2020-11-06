import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface SelectOptionsInputData<T> {
  options: SelectOption<T>[]
  customConfig: SelectOptionsCustomConfig
}

export interface SelectOptionsCustomConfig {
  showTitle: boolean
}

export interface SelectOption<T> {
  name: string;
  value: T;
  selected?: boolean
}


@Component({
  selector: 'app-select-option',
  templateUrl: './select-option.component.html',
  styleUrls: ['./select-option.component.scss']
})
export class SelectOptionComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SelectOptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { customConfig: any, options: SelectOption<any>[] }) { }

  ngOnInit(): void {
  }

  selectClose(d: SelectOption<any>) {
    this.dialogRef.close(d);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
