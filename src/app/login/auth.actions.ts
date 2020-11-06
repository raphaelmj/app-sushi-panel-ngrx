import { User } from './../models/user';
import { UserToken } from '../models/token-user';
import { createAction, props } from "@ngrx/store"

export const login = createAction('[Login Page] User login', props<{ userToken: UserToken, user: User }>());

export const logout = createAction(
  "[Top Menu] Logout"
);
