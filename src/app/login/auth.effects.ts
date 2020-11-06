import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as AuthActions from "./auth.actions"

@Injectable()
export class AuthEffects {

  login$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.login),
      tap(action => {
        localStorage.setItem('userToken', JSON.stringify(action.userToken))
        localStorage.setItem('user', JSON.stringify(action.user))
      })
    ),
    { dispatch: false }
  )

  logout$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.logout),
      tap(action => {
        localStorage.removeItem('userToken')
        localStorage.removeItem('user')
        this.router.navigate(['/login'])
      })
    ),
    { dispatch: false }
  )

  constructor(private actions$: Actions, private router: Router) {

  }
}
