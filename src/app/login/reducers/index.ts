import { User } from './../../models/user';
import { UserToken } from 'src/app/models/token-user';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createReducer,
  createSelector,
  MetaReducer,
  on
} from '@ngrx/store';
import * as AuthActions from "../auth.actions"
// import { environment } from '../../../environments/environment';

export const authFeatureKey = 'auth';

export interface AuthState {
  userToken: UserToken
  user: User
}

export const initialAuthState: AuthState = {
  userToken: undefined,
  user: undefined
}


export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, (state, action) => {
    return {
      userToken: action.userToken,
      user: action.user
    }
  }),
  on(AuthActions.logout, (state, action) => {
    return {
      userToken: undefined,
      user: undefined
    }
  })

)

// export const currentUserReducer = createReducer(


// )

export const reducers: ActionReducerMap<any> = {

};




// export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
