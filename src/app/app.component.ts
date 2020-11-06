import { login } from './login/auth.actions';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { AuthState } from './login/reducers';
;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'ngadmin';
  constructor(private store: Store<AuthState>) {
    // localStorage.removeItem('userToken')
    // localStorage.removeItem('user')
  }

  ngOnInit(): void {

    const userTokenJson = localStorage.getItem('userToken')
    const userJson = localStorage.getItem('user')
    if (userTokenJson && userJson) {
      this.store.dispatch(login({ userToken: JSON.parse(userTokenJson), user: JSON.parse(userJson) }))
    }
  }

}
