import { tap, first } from 'rxjs/operators';
import { appConfigUpdated } from './../app-config-entity/app-config.actions';
import { Store } from '@ngrx/store';
import { AppState } from './../../../reducers/index';
import { Observable } from 'rxjs';
import { OrderStatus } from './../../../models/cart-order';
import { AppConfigData, ACElementConfig, QueryStringState, FilterStatesByRole } from './../../../models/app-config';
import { CalculateService } from './../../../services/calculate/calculate.service';
import { OptionOrConfig, RefreshOptionsOrConfigService } from './../../../services/options-config/refresh-options-or-config.service';
import { AppConfigService } from './../../../services/options-config/app-config.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppConfig } from 'src/app/models/app-config';
import { Update } from '@ngrx/entity';

@Component({
  selector: 'app-app-config-edit',
  templateUrl: './app-config-edit.component.html',
  styleUrls: ['./app-config-edit.component.scss']
})
export class AppConfigEditComponent implements OnInit {

  @Output() emitClose: EventEmitter<any> = new EventEmitter()
  appConfig: AppConfig
  @Input() appConfig$: Observable<AppConfig>
  formData: FormGroup
  statesTypes: Array<{ name: string, value: QueryStringState }> = [
    { name: 'Brak', value: QueryStringState.none },
    { name: 'Tylko', value: QueryStringState.restrict },
    { name: 'Wszystko', value: QueryStringState.all }
  ]

  constructor(
    private fb: FormBuilder,
    private calculateService: CalculateService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.appConfig$.subscribe((appConfig => {
      this.appConfig = appConfig
      this.createForm()
    }))
  }

  createForm() {
    this.formData = this.fb.group({
      extraPrice: [this.appConfig.data.extraPrice, [Validators.required, Validators.pattern('[0-9]+')]],
      inProgressMinutes: this.appConfig.data.inProgressMinutes,
      acc: this.createArray(this.appConfig.data.acc),
      bonusPercents: this.createBonusArray(this.appConfig.data.bonusPercents),
      defaultFiltersStates: this.fb.group({
        waiter: this.fb.group({
          sts: this.createStatesArray(this.appConfig.data.defaultFiltersStates.waiter.sts),
          paid: [this.appConfig.data.defaultFiltersStates.waiter.paid],
          reservation: [this.appConfig.data.defaultFiltersStates.waiter.reservation],
          inprogress: [this.appConfig.data.defaultFiltersStates.waiter.inprogress]
        }),
        admin: this.fb.group({
          sts: this.createStatesArray(this.appConfig.data.defaultFiltersStates.admin.sts),
          paid: [this.appConfig.data.defaultFiltersStates.admin.paid],
          reservation: [this.appConfig.data.defaultFiltersStates.admin.reservation],
          inprogress: [this.appConfig.data.defaultFiltersStates.admin.inprogress]
        })
      })
    })
  }

  createBonusArray(bonusPercents: number[]): FormArray {
    var array = this.fb.array([])
    bonusPercents.map(b => {
      array.push(new FormControl(b))
    })
    return array
  }


  addPercentBonus() {
    (this.formData.get('bonusPercents') as FormArray).push(new FormControl(0, [Validators.required, Validators.pattern('[0-9]+')]));
    this.formData.markAsUntouched()
  }

  removePercentBonus(i: number) {
    this.formData.get('bonusPercents')['controls'].splice(i, 1)
    this.formData.get('bonusPercents')['value'].splice(i, 1)
  }

  createArray(acc: Array<{ name: string, icon: string }>): FormArray {
    var array = this.fb.array([])
    acc.map(ac => {
      array.push(this.fb.group({
        name: [ac.name, Validators.required],
        icon: [ac.icon]
      }))
    })
    return array
  }



  addAcc() {
    (this.formData.get('acc') as FormArray).push(this.fb.group({
      name: ['', Validators.required],
      icon: []
    }));
    this.formData.markAsUntouched()
  }


  removeAcc(i: number) {
    this.formData.get('acc')['controls'].splice(i, 1)
    this.formData.get('acc')['value'].splice(i, 1)
  }


  createStatesArray(sts: Array<OrderStatus>): FormArray {
    var array = this.fb.array([])
    sts.map(s => {
      array.push(new FormControl(s))
    })
    return array
  }

  changeWaiterStates(event: Array<OrderStatus>) {
    this.formData.get('defaultFiltersStates').get('waiter').get('sts')['controls'].splice(0, this.formData.get('defaultFiltersStates').get('waiter').get('sts').value.length)
    this.formData.get('defaultFiltersStates').get('waiter').get('sts')['value'].splice(0, this.formData.get('defaultFiltersStates').get('waiter').get('sts').value.length)
    event.map(s => {
      (this.formData.get('defaultFiltersStates').get('waiter').get('sts') as FormArray).push(new FormControl(s))
    })
  }

  changeAdminStates(event: Array<OrderStatus>) {
    this.formData.get('defaultFiltersStates').get('admin').get('sts')['controls'].splice(0, this.formData.get('defaultFiltersStates').get('waiter').get('sts').value.length)
    this.formData.get('defaultFiltersStates').get('admin').get('sts')['value'].splice(0, this.formData.get('defaultFiltersStates').get('waiter').get('sts').value.length)
    event.map(s => {
      (this.formData.get('defaultFiltersStates').get('admin').get('sts') as FormArray).push(new FormControl(s))
    })
  }


  saveData() {
    if (this.formData.valid) {

      var value: {
        extraPrice: string | number,
        acc: ACElementConfig[],
        bonusPercents: any[],
        inProgressMinutes: string | number,
        defaultFiltersStates: FilterStatesByRole
      } = Object.assign({}, this.formData.value)
      value.extraPrice = this.calculateService.stringToNumber(value.extraPrice);
      value.inProgressMinutes = this.calculateService.stringToNumber(value.inProgressMinutes);
      value.bonusPercents.map((d, i) => {
        value.bonusPercents[i] = this.calculateService.stringToNumber(d)
      })
      var data = <AppConfigData>{ ...this.appConfig.data, ...value }
      let app: AppConfig = { ...this.appConfig, ...{ data: <AppConfigData>data } }
      // let changes: AppConfig = Object.assign({}, app)
      const appUpdate: Update<AppConfig> = {
        id: app.id,
        changes: app
      }
      // this.appConfigService.update(app).then(r => {
      //   this.refreshOptionsOrConfigService.makeRefresh(OptionOrConfig.config)
      // })

      this.store.dispatch(appConfigUpdated({ update: appUpdate }))

    }
  }

  closeEdit() {
    this.emitClose.emit()
  }

}
