import { first, concatMap, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { AuthState } from '../login/reducers';
import { AppState } from '../reducers';


@Injectable()
export class AppTokenInterceptor implements HttpInterceptor {

  exceptUrls: string[] = [
    '/api/auth/login'
  ]

  constructor(private store: Store<AppState>) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.checkExceptUrl(request.url)) {
      return this.store
        .pipe(
          first(),
          map(state => state['auth'].userToken.accessToken),
          concatMap(accessToken => {
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ` + accessToken
              }
            });
            return next.handle(request);
          })
        )
    } else {
      return next.handle(request);
    }

  }

  checkExceptUrl(url: string): boolean {
    var httpRoute = url.replace(environment.apiUrl, '')
    return this.exceptUrls.includes(httpRoute)
  }

}
