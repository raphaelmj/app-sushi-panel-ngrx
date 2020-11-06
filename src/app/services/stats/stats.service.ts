import { HistogramCalendarInterval } from './../../models/histogram-calendar-interval';
import { HistogramQueryResponse } from './../../models/histogram-query-response';
import { QPRevenue } from './../../models/qp-revenue';
import { API_URL } from '../../config';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as dateTotal from "../../models/date-total"
import * as elSales from "../../models/elements-sales";
import { QPElementsSales } from 'src/app/models/qp-elements-sales';
import { calculateViewDimensions } from '@swimlane/ngx-charts';


@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private httpClient: HttpClient) { }

  getDateTotal(from: string, to: string, cI: HistogramCalendarInterval): Observable<HistogramQueryResponse<dateTotal.DateTotal.HistogramResponse, QPRevenue>> {
    let params = new HttpParams();
    params = params.set('from', from);
    params = params.set('to', to);
    params = params.set('cI', cI);
    return this.httpClient.get<HistogramQueryResponse<dateTotal.DateTotal.HistogramResponse, QPRevenue>>(API_URL + '/es/api/search/date/total/stats?' + params.toString())
  }


  getElementsSales(from: string, to: string, cI: HistogramCalendarInterval, cCIds: string = null): Observable<HistogramQueryResponse<elSales.ElementsSales.HistogramResponseElement[], QPElementsSales>> {
    let params = new HttpParams();
    params = params.set('from', from);
    params = params.set('to', to);
    params = params.set('cI', cI);
    if (calculateViewDimensions) {
      params = params.set('cCIds', cCIds)
    }
    return this.httpClient.get<HistogramQueryResponse<elSales.ElementsSales.HistogramResponseElement[], QPElementsSales>>(API_URL + '/es/api/search/elements/sales/stats?' + params.toString())
  }

}
