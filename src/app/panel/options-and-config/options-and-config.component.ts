import { selectUser } from './../../login/auth.selectors';
import { selectDescOptionsList } from './selectors/desc-options-selectors.selectors';
import { selectReverseOptions, selectReverseOptionsList } from './selectors/reverse-options-selectors.selectors';
import { selectAllAppConfig, selectFirstAppConfig } from './selectors/app-config-selectors.selectors';
import { tap, map } from 'rxjs/operators';
import { AppState } from './../../reducers/index';
import { Store, select } from '@ngrx/store';
import { UserService } from './../../services/auth/user.service';
import { AddOptionElementComponent } from './add-option-element/add-option-element.component';
import { ChangeOptionsGroupOrderComponent } from './change-options-group-order/change-options-group-order.component';
import { AppConfigService } from './../../services/options-config/app-config.service';
import { ReverseOptionsService } from './../../services/options-config/reverse-options.service';
import { DescOptionsService } from './../../services/options-config/desc-options.service';
import { Subscription, Observable } from 'rxjs';
import { OptionOrConfig, RefreshOptionsOrConfigService } from './../../services/options-config/refresh-options-or-config.service';
import { DescOptions } from './../../models/desc-options';
import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver, Type } from '@angular/core';
import { ReverseOptions } from 'src/app/models/reverse-options';
import { AppConfig } from 'src/app/models/app-config';
import { AppConfigEditComponent } from './app-config-edit/app-config-edit.component';
import { User } from 'src/app/models/user';
import { UsersAdminComponent } from './users-admin/users-admin.component';

@Component({
  selector: 'app-options-and-config',
  templateUrl: './options-and-config.component.html',
  styleUrls: ['./options-and-config.component.scss']
})
export class OptionsAndConfigComponent implements OnInit, OnDestroy {

  @ViewChild('temp', { read: ViewContainerRef }) temp: ViewContainerRef
  changeOR: ComponentRef<ChangeOptionsGroupOrderComponent>
  usersAdminC: ComponentRef<UsersAdminComponent>
  addOC: ComponentRef<AddOptionElementComponent>
  appConfigEditC: ComponentRef<AppConfigEditComponent>
  reverseOptions: ReverseOptions[]
  reverseOptions$: Observable<ReverseOptions[]>
  descOptions$: Observable<DescOptions[]>
  appConfig: AppConfig
  subRefresh: Subscription
  subDesc: Subscription
  subReverse: Subscription
  subConfig: Subscription
  optionOrConfig = OptionOrConfig
  currentUser: User = null

  constructor(
    private cf: ComponentFactoryResolver,
    private userService: UserService,
    private store: Store<AppState>,
  ) {
    this.store
      .pipe(
        select(selectUser)
      ).subscribe(user => {
        this.currentUser = user
      })

  }


  ngOnInit(): void {
    this.reverseOptions$ = this.store
      .pipe(
        select(selectReverseOptionsList),
      )
    this.descOptions$ = this.store
      .pipe(
        select(selectDescOptionsList),
      )
  }


  changeOrderStart(type: OptionOrConfig) {
    this.temp.clear()
    let pop = this.cf.resolveComponentFactory(<Type<ChangeOptionsGroupOrderComponent>>ChangeOptionsGroupOrderComponent)
    this.changeOR = this.temp.createComponent(pop)
    switch (type) {
      case OptionOrConfig.desc:
        this.changeOR.instance.elements$ = this.store.pipe(select(selectDescOptionsList))
        this.changeOR.instance.type = OptionOrConfig.desc
        break
      case OptionOrConfig.reverse:
        this.changeOR.instance.elements$ = this.store.pipe(select(selectReverseOptionsList))
        this.changeOR.instance.type = OptionOrConfig.reverse
        break;
    }

    this.changeOR.instance.emitClose.subscribe(r => {
      this.changeOR.destroy()
    })
  }


  addOptionsGroup(type: OptionOrConfig) {
    this.temp.clear()
    let add = this.cf.resolveComponentFactory(<Type<AddOptionElementComponent>>AddOptionElementComponent)
    this.addOC = this.temp.createComponent(add)
    switch (type) {
      case OptionOrConfig.desc:
        this.addOC.instance.type = OptionOrConfig.desc
        break
      case OptionOrConfig.reverse:
        this.addOC.instance.type = OptionOrConfig.reverse
        break;
    }
    this.addOC.instance.emitClose.subscribe(r => {
      this.addOC.destroy()
    })
  }


  openAppConfig() {
    this.temp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<AppConfigEditComponent>>AppConfigEditComponent);
    this.appConfigEditC = this.temp.createComponent(edit);
    // this.appConfigEditC.instance.appConfig = this.appConfig
    this.appConfigEditC.instance.appConfig$ = this.store.pipe(select(selectFirstAppConfig))
    this.appConfigEditC.instance.emitClose.subscribe(e => {
      this.appConfigEditC.destroy();
    })
  }


  async openPasswordsUsers() {
    this.temp.clear()
    if (this.currentUser.permission == 'superadmin') {
      const users: User[] = await this.getUsers()
      let a = this.cf.resolveComponentFactory(<Type<UsersAdminComponent>>UsersAdminComponent);
      this.usersAdminC = this.temp.createComponent(a)
      this.usersAdminC.instance.users = users;
      this.usersAdminC.instance.currentUser = this.currentUser;
      this.usersAdminC.instance.emitClose.subscribe(r => {
        this.usersAdminC.destroy();
      })
    }
  }


  private async getUsers(): Promise<User[]> {
    return this.userService.getUsers().toPromise()
  }


  ngOnDestroy(): void {
    if (this.subRefresh)
      this.subRefresh.unsubscribe()
    if (this.subDesc)
      this.subDesc.unsubscribe()
    if (this.subReverse)
      this.subReverse.unsubscribe()
    if (this.subConfig)
      this.subConfig.unsubscribe()
  }

}
