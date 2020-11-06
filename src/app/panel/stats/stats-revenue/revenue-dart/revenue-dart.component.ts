import { HistogramCalendarInterval } from './../../../../models/histogram-calendar-interval';
import { Subscription } from 'rxjs';
import { QPRevenue } from './../../../../models/qp-revenue';
import { BreakpointObserver } from '@angular/cdk/layout';
import { WindowService } from './../../../../services/window.service';
import { Component, HostListener, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as dateTotal from "../../../../models/date-total"

@Component({
  selector: 'app-revenue-dart',
  templateUrl: './revenue-dart.component.html',
  styleUrls: ['./revenue-dart.component.scss']
})
export class RevenueDartComponent implements OnInit, OnDestroy, OnChanges {

  @Input() collection: dateTotal.DateTotal.HistogramResponse
  @Input() qp: QPRevenue

  xLabelsMap: ReadonlyMap<HistogramCalendarInterval, string> = new Map<HistogramCalendarInterval, string>([
    [HistogramCalendarInterval.day, 'Dni'],
    [HistogramCalendarInterval.week, 'Tygodnie'],
    [HistogramCalendarInterval.month, 'Miesiące'],
    [HistogramCalendarInterval.quarter, 'Kwartały'],
    [HistogramCalendarInterval.year, 'Lata']
  ])


  stats: any[] = []
  view: any[] = [0, 0];

  // options
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string;
  yAxisLabel: string = 'PLN';
  timeline: boolean = true;
  subBreak599: Subscription

  colorScheme = {
    domain: ['#FF0000']
  };

  constructor(
    private windowService: WindowService,
    private observer: BreakpointObserver
  ) {
    this.setDartViewSize()
  }
  ngOnChanges(changes: SimpleChanges): void {

    if (changes.collection) {
      if (!changes.collection.firstChange) {
        this.stats = [changes.collection.currentValue]
      }
    }
    if (changes.qp) {
      if (!changes.qp.firstChange) {
        this.xAxisLabel = this.xLabelsMap.get(changes.qp.currentValue.cI)
      }
    }
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setDartViewSize()
  }

  ngOnInit(): void {
    // this.observer.observe('(max-width: 599.98px)').subscribe(result => {
    //   if (result.matches) {
    //     this.view[0] = 700
    //   } else {
    //     this.view[0] = this.windowService.windowRef.innerWidth
    //   }
    // })
    this.stats = [this.collection]
    this.xAxisLabel = this.xLabelsMap.get(this.qp.cI)
  }

  setDartViewSize() {
    this.view[0] = this.windowService.windowRef.innerWidth - 20
    this.view[1] = this.windowService.windowRef.innerHeight - 160
  }

  onSelect(data): void {
    // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    // console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  ngOnDestroy(): void {
    if (this.subBreak599) this.subBreak599.unsubscribe()
  }

}
