import { RefreshUsersListService } from './../../../../services/refresh-users-list.service';
import { Observable, of, Subscription } from 'rxjs';
import { ConfirmByInputDataComponent, InputConfirmType, InputConfirmResponse } from './../../../../tools/confirm-by-input-data/confirm-by-input-data.component';
import { ConfirmBundleResponse } from './../../../../tools/confirm-window/confirm-window.component';
import { UserService } from './../../../../services/auth/user.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { User, UserPerm } from './../../../../models/user';
import { Component, Input, OnInit, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver, Type, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ConfirmWindowComponent } from 'src/app/tools/confirm-window/confirm-window.component';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-user-one-edit',
  templateUrl: './user-one-edit.component.html',
  styleUrls: ['./user-one-edit.component.scss']
})
export class UserOneEditComponent implements OnInit, OnDestroy {

  @Input() user: User
  @Input() currentUser: User
  @Input() index: number
  @Input() superAdminCount: number
  @Output() emitRemoveUnSave: EventEmitter<number> = new EventEmitter<number>()
  userForm: FormGroup
  hidePassword: boolean = true
  hidePasswordC: boolean = true
  perms: Array<{ value: UserPerm, name: string }> = [
    { value: UserPerm.normal, name: 'użytkownik' },
    { value: UserPerm.super, name: 'superadmin' }
  ]

  @ViewChild('temp', { read: ViewContainerRef }) temp: ViewContainerRef
  confirmC: ComponentRef<ConfirmWindowComponent>
  confirmInputC: ComponentRef<ConfirmByInputDataComponent>
  userPerm = UserPerm
  superAdminError: boolean = false
  passwordNotCompare: boolean = false

  subChangePassword: Subscription


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private cf: ComponentFactoryResolver,
    private refreshUsersListService: RefreshUsersListService
  ) { }


  ngOnInit(): void {
    this.createForm()
    if (!this.user.id) {
      this.userForm.get('password').setValidators([Validators.required, Validators.minLength(5)])
    }
    this.changePasswordFieldSubscribe()
  }

  changePasswordFieldSubscribe() {
    this.userForm.get('password').valueChanges.subscribe(v => {
      if (this.user.id) {
        if (v == '' && !this.userForm.get('password').valid) {
          this.userForm.get('password').clearValidators()
          this.userForm.get('password').updateValueAndValidity()
        } else {
          this.userForm.get('password').setValidators([Validators.required, Validators.minLength(5)])
        }
      }
    })
  }

  createForm() {
    this.userForm = this.fb.group({
      nick: [this.user.nick, [Validators.required, Validators.minLength(3)], this.validateIsNickFree.bind(this)],
      password: ['', Validators.minLength(5)],
      comparePassword: [''],
      status: [this.user.status],
      permission: [this.user.permission]
    })
  }

  validateIsNickFree(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    var id: number | null = (this.user.id) ? this.user.id : null
    return this.userService.checkIsUserNameFreeExcept(id, control.value).pipe(
      map(isTaken => (!isTaken ? { uniqueNick: false } : null)),
      catchError(() => of(null))
    )
  }

  async removeUser() {

    var users: User[] = await this.userService.getUsers().toPromise()
    this.superAdminCount = this.countSuperAdmin(users)

    if (!this.user.id) {

      this.emitRemoveUnSave.emit(this.index)

    } else {
      if (this.user.permission != UserPerm.super) {
        this.startRemoveFromBase()
      } else {
        if (this.user.id != this.currentUser.id && this.superAdminCount > 0) {
          this.startRemoveFromBase()
        }
      }
    }

  }

  startRemoveFromBase() {
    this.temp.clear()
    let confirm = this.cf.resolveComponentFactory(<Type<ConfirmWindowComponent>>ConfirmWindowComponent)
    this.confirmC = this.temp.createComponent<ConfirmWindowComponent>(confirm)
    this.confirmC.instance.showConfirm = true
    this.confirmC.instance.bundleData = this.user.id
    this.confirmC.instance.message = 'Czy chcesz usunąć użytkowanika?'
    this.confirmC.instance.emitActionConfirm.subscribe((r: ConfirmBundleResponse) => {

      if (r.do) {
        this.confirmC.destroy()
        this.confirmRemoveFromBaseByPassword(r.bundleData)
      } else {
        this.confirmC.destroy()
      }
    })
  }

  confirmRemoveFromBaseByPassword(id: number) {
    this.temp.clear()
    let confirm = this.cf.resolveComponentFactory(<Type<ConfirmByInputDataComponent>>ConfirmByInputDataComponent)
    this.confirmInputC = this.temp.createComponent<ConfirmByInputDataComponent>(confirm)
    this.confirmInputC.instance.bundleData = id
    this.confirmInputC.instance.message = 'Potwierdź usnunięcie swoim hasłem.'
    this.confirmInputC.instance.type = InputConfirmType.somePassword
    // this.confirmInputC.instance.type = InputConfirmType.somePassword
    this.confirmInputC.instance.emitActionConfirm.subscribe((r: InputConfirmResponse) => {

      if (r.do) {
        // this.confirmInputC.destroy()
        console.log(r)

        switch (r.type) {
          case InputConfirmType.randomNumber:

            this.removeUserFromBase(r.bundleData)

            break;
          case InputConfirmType.somePassword:

            this.userService.checkUserPassword(this.currentUser.id, r.dataStr).then((cr: { confirm: boolean }) => {
              if (cr.confirm) {
                this.confirmInputC.instance.isInputOk = true
                this.removeUserFromBase(r.bundleData)
              } else {
                this.confirmInputC.instance.isInputOk = false
              }
              this.confirmInputC.destroy()
            }).catch(err => {
              this.confirmInputC.destroy()
            })

            break;
        }

      } else {
        this.confirmInputC.destroy()
      }
    })
  }

  removeUserFromBase(id: number) {
    this.userService.deleteUser(id).then(r => {
      this.refreshUsersListService.refresh()
    })
  }

  async submitForm() {

    var users: User[] = await this.userService.getUsers().toPromise()
    this.superAdminCount = this.countSuperAdmin(users)

    if (this.userForm.valid) {

      if (this.user.id) {

        var bool: boolean = this.checkCanUpdateValidPerm()

        if (!bool)
          return

        if (bool) {

          if (this.userForm.get('password').value != '') {
            if (this.userForm.get('password').value == this.userForm.get('comparePassword').value) {
              this.passwordNotCompare = false
              this.updateUser()
            } else {
              this.passwordNotCompare = true
            }
          } else {
            this.passwordNotCompare = false
            this.userForm.get('comparePassword').setValue('')
            this.updateUser()
          }

        }

      } else {

        if (this.userForm.get('password').value == this.userForm.get('comparePassword').value) {
          this.passwordNotCompare = false
          this.createUser()
        } else {
          this.passwordNotCompare = true
        }

      }

    }


  }

  checkCanUpdateValidPerm(): boolean {

    var bool: boolean = false

    switch (this.user.permission) {
      case UserPerm.normal:
        bool = true
        break;
      case UserPerm.super:

        if (this.superAdminCount < 2) {
          if (this.userForm.get('permission').value != UserPerm.super) {
            this.superAdminError = true
            bool = false
          } else {
            if (this.userForm.get('status').value) {
              this.superAdminError = false
              bool = true
            } else {
              this.superAdminError = true
              bool = false
            }
          }
        } else {
          this.superAdminError = false
          bool = true
        }

        break;
    }
    return bool
  }

  countSuperAdmin(users: User[]): number {
    var adminC: number = 0
    users.map(u => {
      if (u.permission == UserPerm.super && u.status) {
        adminC++
      }
    })
    return adminC
  }

  updateUser() {
    var { comparePassword, ...rest } = this.userForm.value
    let user: User = { ...this.user, ...rest }
    this.userService.updateUser(user).then(r => {
      this.refreshUsersListService.refresh()
    })
  }

  createUser() {
    var { comparePassword, ...rest } = this.userForm.value
    let user: User = { ...this.user, ...rest }
    this.userService.createUser(user).then(r => {
      this.refreshUsersListService.refresh()
    })
  }

  ngOnDestroy(): void {
    if (this.subChangePassword) this.subChangePassword.unsubscribe()
  }

}
