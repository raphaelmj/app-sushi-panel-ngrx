import { Update } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { ConfirmWindowComponent } from './../../../tools/confirm-window/confirm-window.component';
import { OptionOrConfig, RefreshOptionsOrConfigService } from './../../../services/options-config/refresh-options-or-config.service';
import { ReverseOptionsService } from './../../../services/options-config/reverse-options.service';
import { Component, Input, OnInit, ComponentRef, ViewChild, ViewContainerRef, ComponentFactoryResolver, Type } from '@angular/core';
import { ReverseOptions } from 'src/app/models/reverse-options';
import { AppState } from 'src/app/reducers';
import * as ReverseOptionsActions from "../reverse-options-entity/reverse-options.actions"

@Component({
  selector: 'app-edit-reverse',
  templateUrl: './edit-reverse.component.html',
  styleUrls: ['./edit-reverse.component.scss']
})
export class EditReverseComponent implements OnInit {

  @ViewChild('temp', { read: ViewContainerRef }) temp: ViewContainerRef
  confirmC: ComponentRef<ConfirmWindowComponent>
  @Input() reverseOptions: ReverseOptions[] = []

  constructor(
    private cf: ComponentFactoryResolver,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {

  }

  changeData(event: { data: ReverseOptions, index: number }) {
    const update: Update<ReverseOptions> = {
      id: event.data.id,
      changes: event.data
    }
    this.store.dispatch(ReverseOptionsActions.reverseOptionsUpdated({ update }))
  }

  remove(reverseOption: ReverseOptions) {
    this.temp.clear()
    let confirm = this.cf.resolveComponentFactory(<Type<ConfirmWindowComponent>>ConfirmWindowComponent)
    this.confirmC = this.temp.createComponent<ConfirmWindowComponent>(confirm)
    this.confirmC.instance.showConfirm = true
    this.confirmC.instance.bundleData = reverseOption
    this.confirmC.instance.message = 'Czy checesz usunąć element?'
    this.confirmC.instance.emitActionConfirm.subscribe(r => {

      if (r.do) {
        this.confirmC.destroy()
        this.store.dispatch(ReverseOptionsActions.reverseOptionsRemoveOne({ key: r.bundleData.id }))
      } else {
        this.confirmC.destroy()
      }
    })
  }


}
