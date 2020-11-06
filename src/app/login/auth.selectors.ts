import { AuthState } from './reducers/index';
import { createSelector, createFeatureSelector } from "@ngrx/store";
import { UserPerm } from '../models/user';

const selectAuthState = createFeatureSelector<AuthState>("auth")

export const isLogIn = createSelector(
  selectAuthState,
  auth => !!auth.userToken
);

export const isLogOut = createSelector(
  isLogIn,
  logIn => !logIn
)

export const isSuperLogIn = createSelector(
  selectAuthState,
  auth => {
    if (auth.userToken) {
      return auth.userToken.permission == UserPerm.super
    } else {
      return false
    }

  }
);

export const selectUserToken = createSelector(
  selectAuthState,
  auth => auth.userToken
);

export const selectUser = createSelector(
  selectAuthState,
  auth => auth.user
);
