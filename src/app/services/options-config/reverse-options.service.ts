import { API_URL } from './../../config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ReverseOptions } from '../../models/reverse-options';

@Injectable({
  providedIn: 'root'
})
export class ReverseOptionsService {

  constructor(private httpClient: HttpClient) { }


  getAll(): Observable<ReverseOptions[]> {
    return this.httpClient.get<ReverseOptions[]>(API_URL + '/api/options-config/get/reverse')
  }

  updateOption(option: ReverseOptions): Promise<any> {
    return this.httpClient.post(API_URL + '/api/options-config/update/reverse/option', option).toPromise()
  }

  updateOrder(options: ReverseOptions[]): Promise<any> {
    return this.httpClient.post(API_URL + '/api/options-config/change/reverse/order', options).toPromise()
  }

  create(option: ReverseOptions): Promise<any> {
    return this.httpClient.post(API_URL + '/api/options-config/create/reverse/group', option).toPromise()
  }
  createOne(option: ReverseOptions): Observable<ReverseOptions> {
    return this.httpClient.post<ReverseOptions>(API_URL + '/api/options-config/create/reverse/group', option)
  }

  delete(id: number): Promise<any> {
    return this.httpClient.delete(API_URL + '/api/options-config/delete/reverse/' + id).toPromise()
  }

}
