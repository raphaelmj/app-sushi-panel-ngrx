import { Observable } from 'rxjs';
import { API_URL } from './../../config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DescOptions } from '../../models/desc-options';

@Injectable({
  providedIn: 'root'
})
export class DescOptionsService {

  constructor(private httpClient: HttpClient) { }


  getAll(): Observable<DescOptions[]> {
    return this.httpClient.get<DescOptions[]>(API_URL + '/api/options-config/get/desc')
  }

  updateOption(option: DescOptions): Promise<any> {
    return this.httpClient.post(API_URL + '/api/options-config/update/desc/option', option).toPromise()
  }

  updateOrder(options: DescOptions[]): Promise<any> {
    return this.httpClient.post(API_URL + '/api/options-config/change/desc/order', options).toPromise()
  }

  create(option: DescOptions): Promise<any> {
    return this.httpClient.post(API_URL + '/api/options-config/create/desc/group', option).toPromise()
  }

  createOne(option: DescOptions): Observable<DescOptions> {
    return this.httpClient.post<DescOptions>(API_URL + '/api/options-config/create/desc/group', option)
  }

  delete(id: number): Promise<any> {
    return this.httpClient.delete(API_URL + '/api/options-config/delete/desc/' + id).toPromise()
  }

}
