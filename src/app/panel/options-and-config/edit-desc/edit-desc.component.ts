import { descOptionsRemoveOne } from './../desc-options-entity/desc-options.actions';
import { Update } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { ConfirmWindowComponent } from './../../../tools/confirm-window/confirm-window.component';
import { OptionOrConfig, RefreshOptionsOrConfigService } from './../../../services/options-config/refresh-options-or-config.service';
import { DescOptionsService } from './../../../services/options-config/desc-options.service';
import { DescOptions } from './../../../models/desc-options';
import { Component, Input, OnInit, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver, Type } from '@angular/core';
import { AppState } from 'src/app/reducers';
import * as DescOptionsActions from "../desc-options-entity/desc-options.actions";

@Component({
  selector: 'app-edit-desc',
  templateUrl: './edit-desc.component.html',
  styleUrls: ['./edit-desc.component.scss']
})
export class EditDescComponent implements OnInit {


  @ViewChild('temp', { read: ViewContainerRef }) temp: ViewContainerRef
  confirmC: ComponentRef<ConfirmWindowComponent>
  @Input() descOptions: DescOptions[] = []

  constructor(
    private cf: ComponentFactoryResolver,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {

  }

  changeData(event: { data: DescOptions, index: number }) {
    var update: Update<DescOptions> = {
      id: event.data.id,
      changes: event.data
    }
    this.store.dispatch(DescOptionsActions.descOptionsUpdated({ update }))
  }


  remove(descOption: DescOptions) {
    this.temp.clear()
    let confirm = this.cf.resolveComponentFactory(<Type<ConfirmWindowComponent>>ConfirmWindowComponent)
    this.confirmC = this.temp.createComponent<ConfirmWindowComponent>(confirm)
    this.confirmC.instance.showConfirm = true
    this.confirmC.instance.bundleData = descOption
    this.confirmC.instance.message = 'Czy checesz usunąć element?'
    this.confirmC.instance.emitActionConfirm.subscribe(r => {

      if (r.do) {
        this.confirmC.destroy()
        this.store.dispatch(DescOptionsActions.descOptionsRemoveOne({ key: r.bundleData.id }))
      } else {
        this.confirmC.destroy()
      }
    })
  }

}
