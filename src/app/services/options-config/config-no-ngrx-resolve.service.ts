import { AppConfigService } from './app-config.service';
import { Observable } from 'rxjs';
import { AppConfig } from './../../models/app-config';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigNoNgrxResolveService implements Resolve<AppConfig>  {

  constructor(private appConfigService: AppConfigService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): AppConfig | Observable<AppConfig> | Promise<AppConfig> {
    return this.appConfigService.getFirst()
  }
}
