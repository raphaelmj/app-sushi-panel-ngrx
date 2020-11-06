import { isSuperLogIn } from './../login/auth.selectors';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserToken } from '../models/token-user';
import { UserPerm } from '../models/user';
import { AuthState } from '../login/reducers';
import { selectUserToken } from '../login/auth.selectors';


@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit {

  userToken: UserToken
  showIfSuper: Observable<boolean>

  constructor(private activatedRoute: ActivatedRoute, private store: Store<AuthState>) {

    this.showIfSuper = this.store
      .pipe(
        select(isSuperLogIn)
      )

  }

  ngOnInit(): void {

  }
}
