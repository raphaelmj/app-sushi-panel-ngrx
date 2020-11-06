import { API_URL } from 'src/app/config';
import { AppConfig } from './../../models/app-config';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  constructor(private httpClient: HttpClient) { }

  getFirst(): Observable<AppConfig> {
    return this.httpClient.get<AppConfig>(API_URL + '/api/options-config/config/first')
  }

  update(appConfig: AppConfig | Partial<AppConfig>): Promise<any> {
    return this.httpClient.post(API_URL + '/api/options-config/config/update', appConfig).toPromise()
  }

}
