import { Router } from '@angular/router';
import { QPRevenue } from 'src/app/models/qp-revenue';
import { Component, Input, OnInit } from '@angular/core';
import { QPElementsSales } from 'src/app/models/qp-elements-sales';

@Component({
  selector: 'app-stats-menu',
  templateUrl: './stats-menu.component.html',
  styleUrls: ['./stats-menu.component.scss']
})
export class StatsMenuComponent implements OnInit {

  @Input() qp: QPRevenue | QPElementsSales

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

}
