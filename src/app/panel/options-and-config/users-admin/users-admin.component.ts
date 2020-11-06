import { Subscription } from 'rxjs';
import { RefreshUsersListService } from './../../../services/refresh-users-list.service';
import { UserService } from './../../../services/auth/user.service';
import { User, UserPerm } from './../../../models/user';
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-users-admin',
  templateUrl: './users-admin.component.html',
  styleUrls: ['./users-admin.component.scss']
})
export class UsersAdminComponent implements OnInit, OnDestroy {

  @Output() emitClose: EventEmitter<any> = new EventEmitter()
  @Input() users: User[] = []
  @Input() currentUser: User
  superAdminCount: number

  subUsersList: Subscription
  subRefreshUsers: Subscription

  constructor(private userService: UserService, private refreshUsersListService: RefreshUsersListService) {
    this.subscribeToUsersChangeData()
  }

  ngOnInit(): void {
    this.superAdminCount = this.countSuperAdmin()
  }

  subscribeToUsersChangeData() {
    this.subRefreshUsers = this.refreshUsersListService.action$.subscribe(bool => {
      if (bool) {
        this.subUsersList = this.userService.getUsers().subscribe(users => {
          this.users = users
          this.superAdminCount = this.countSuperAdmin()
        })
      }
    })
  }

  countSuperAdmin(): number {
    var adminC: number = 0
    this.users.map(u => {
      if (u.permission == UserPerm.super && u.id && u.status) {
        adminC++
      }
    })
    return adminC
  }

  addNewUser() {
    this.users.push(this.userService.makeEmpty())
  }


  removeUnSave(index: number) {
    this.users.splice(index, 1)
  }


  closeEdit() {
    this.emitClose.emit()
  }

  ngOnDestroy(): void {
    if (this.subUsersList) this.subUsersList.unsubscribe()
    if (this.subRefreshUsers) this.subRefreshUsers.unsubscribe()
  }

}
