import { Update } from '@ngrx/entity';
import { revereseOptionsOrderAllUpdate } from './../reverse-options-entity/reverse-options.actions';
import { Store } from '@ngrx/store';
import { element } from 'protractor';
import { Observable, Subscription } from 'rxjs';
import { RefreshOptionsOrConfigService } from './../../../services/options-config/refresh-options-or-config.service';
import { DescOptionsService } from './../../../services/options-config/desc-options.service';
import { ReverseOptionsService } from './../../../services/options-config/reverse-options.service';
import { Sortable } from 'sortablejs';
import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, Inject, OnDestroy } from '@angular/core';
import { DescOptions } from 'src/app/models/desc-options';
import { ReverseOptions } from 'src/app/models/reverse-options';
import { OptionOrConfig } from 'src/app/services/options-config/refresh-options-or-config.service';
import { AppState } from 'src/app/reducers';
import { descOptionsOrderAllUpdate } from '../desc-options-entity/desc-options.actions';

@Component({
  selector: 'app-change-options-group-order',
  templateUrl: './change-options-group-order.component.html',
  styleUrls: ['./change-options-group-order.component.scss']
})
export class ChangeOptionsGroupOrderComponent implements OnInit, OnDestroy {

  @Output() emitClose: EventEmitter<any> = new EventEmitter()
  @Output() emitChange: EventEmitter<{ data: ReverseOptions[] | DescOptions[], type: OptionOrConfig }> = new EventEmitter<{ data: ReverseOptions[] | DescOptions[], type: OptionOrConfig }>()
  @Input() elements$: Observable<ReverseOptions[]> | Observable<DescOptions[]>
  elements: ReverseOptions[] | DescOptions[] = []
  @Input() type: OptionOrConfig
  sortable: Sortable
  subElements: Subscription

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.subElements = this.elements$.subscribe(elements => {
      this.elements = elements
      this.createSortable()
    })
  }

  createSortable() {

    this.sortable = new Sortable(this.document.getElementById('sort'), {

      onEnd: function (/**Event*/evt) {
        var element = this.elements[evt.oldIndex];
        this.elements.splice(evt.oldIndex, 1);
        this.elements.splice(evt.newIndex, 0, element);
        this.changeOrder()
      }.bind(this)

    })
  }

  changeOrder() {
    switch (this.type) {
      case OptionOrConfig.desc:
        var updates: Update<DescOptions>[] = this.elements.map((el, i) => {
          var nel = Object.assign({}, el)
          nel.ordering = i + 1
          return {
            id: el.id,
            changes: nel
          }
        })
        this.store.dispatch(descOptionsOrderAllUpdate({ updates }))
        break
      case OptionOrConfig.reverse:
        var updates: Update<ReverseOptions>[] = this.elements.map((el, i) => {
          var nel = Object.assign({}, el)
          nel.ordering = i + 1
          return {
            id: el.id,
            changes: nel
          }
        })
        this.store.dispatch(revereseOptionsOrderAllUpdate({ updates }))
        break;
    }
  }


  closeEdit() {
    this.emitClose.emit()
  }

  ngOnDestroy(): void {
    if (this.subElements) this.subElements.unsubscribe()
  }


}
