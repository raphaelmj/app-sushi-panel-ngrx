import { Store, select } from '@ngrx/store';
import { RefreshOptionsOrConfigService } from './../../../services/options-config/refresh-options-or-config.service';
import { ReverseOptionsService } from './../../../services/options-config/reverse-options.service';
import { DescOptionsService } from './../../../services/options-config/desc-options.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OptionOrConfig } from 'src/app/services/options-config/refresh-options-or-config.service';
import { DescOptions } from 'src/app/models/desc-options';
import { ReverseOptions } from 'src/app/models/reverse-options';
import { AppState } from 'src/app/reducers';
import { map, tap, concatMap, first } from 'rxjs/operators';
import * as ReverseOptionsActions from "../reverse-options-entity/reverse-options.actions";
import * as DescOptionsActions from "../desc-options-entity/desc-options.actions"

@Component({
  selector: 'app-add-option-element',
  templateUrl: './add-option-element.component.html',
  styleUrls: ['./add-option-element.component.scss']
})
export class AddOptionElementComponent implements OnInit {

  @Output() emitClose: EventEmitter<any> = new EventEmitter()
  @Output() emitAdd: EventEmitter<any> = new EventEmitter()
  @Input() type: OptionOrConfig
  formData: FormGroup

  constructor(
    private fb: FormBuilder,
    private reverseOptionsService: ReverseOptionsService,
    private descOptionsService: DescOptionsService,
    private store: Store<AppState>) { }

  ngOnInit(): void {
    this.createForm()
  }

  createForm() {
    this.formData = this.fb.group({
      name: ['', Validators.required]
    })
  }

  saveData() {
    if (this.formData.valid) {
      switch (this.type) {
        case OptionOrConfig.desc:
          let desc: DescOptions = { ...{ tags: [] }, ...this.formData.value }
          this.descOptionsService.createOne(desc)
            .pipe(
              first()
            )
            .subscribe(r => {
              this.store.dispatch(DescOptionsActions.descOptionsAddOne({ entity: r }))
            })
          break
        case OptionOrConfig.reverse:
          let rev: ReverseOptions = { ...{ tags: [] }, ...this.formData.value }
          this.reverseOptionsService.createOne(rev)
            .pipe(
              first()
            )
            .subscribe(r => {
              this.store.dispatch(ReverseOptionsActions.reverseOptionsAddOne({ entity: r }))
            })
          break;
      }
    }
  }

  closeEdit() {
    this.emitClose.emit()
  }

}
