import { UserToken } from './../../models/token-user';
import { User, UserPerm } from 'src/app/models/user';
import { Observable } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class UserService {
  apiUrl: string;

  constructor(private httpClient: HttpClient) {

  }

  // checkLoginAndMakeToken(nick: string, password: string, role: string): Promise<any> {
  //   const options = {
  //     headers: new HttpHeaders({ 'Content-type': 'application/json' }),
  //   };
  //   return this.httpClient
  //     .post(
  //       environment.apiUrl + '/api/auth/login',
  //       { nick: nick, password: password, role },
  //       options,
  //     )
  //     .toPromise()
  //     .then((res: Response) => {
  //       return res || {};
  //     });
  // }

  checkLoginAndMakeToken(nick: string, password: string, role: string, uuid: string): Observable<{ success: boolean; access_token: string; user?: User, userData?: User, exp?: number, uuid?: string }> {
    const options = {
      headers: new HttpHeaders({ 'Content-type': 'application/json' }),
    };
    return this.httpClient
      .post<{ success: boolean; access_token: string; user?: User; userData?: User, uuid: string }>(
        environment.apiUrl + '/api/auth/login',
        { nick: nick, password: password, role, uuid },
        options
      )
  }

  isAuth(): Promise<any> {
    return this.httpClient
      .get(environment.apiUrl + '/api/auth/check')
      .toPromise()
      .then((res: Response) => {
        return res || { success: false };
      });
  }

  logout() {
    return this.httpClient
      .post(environment.apiUrl + '/api/auth/logout', {})
      .toPromise();
  }

  getCurrentUserTokenData(): Observable<UserToken | null> {
    return this.httpClient.get<User | null>(environment.apiUrl + '/api/auth/get/current/user/token');
  }

  getCurrentAuthUser(): Observable<User | null> {
    return this.httpClient.get<User | null>(environment.apiUrl + '/api/auth/get/current/user');
  }

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(environment.apiUrl + '/api/auth-super/get/all/users');
  }

  createUser(user: User): Promise<any> {
    return this.httpClient.post(environment.apiUrl + '/api/auth-super/create/user', { user }).toPromise()
  }

  updateUser(user: User): Promise<any> {
    return this.httpClient.post(environment.apiUrl + '/api/auth-super/update/user', { user }).toPromise()
  }


  deleteUser(id: number): Promise<any> {
    return this.httpClient.delete(environment.apiUrl + '/api/auth-super/remove/user/' + id).toPromise()
  }

  checkUserPassword(id: number, password: string): Promise<{ confirm: boolean }> {
    return this.httpClient.post<{ confirm: boolean }>(environment.apiUrl + '/api/auth/check/user/password', { id, password }).toPromise()
  }

  checkIsUserNameFreeExcept(id: number, nick: string): Observable<boolean> {
    return this.httpClient.post<boolean>(environment.apiUrl + '/api/auth-super/is/nick/free/except', { id, nick })
  }

  makeEmpty(): User {
    return {
      nick: '',
      permission: UserPerm.normal,
      status: false
    }
  }

}
