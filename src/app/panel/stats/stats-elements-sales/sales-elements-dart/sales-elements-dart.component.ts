import { WindowService } from './../../../../services/window.service';
import { from, Subscription } from 'rxjs';
import { QPElementsSales } from './../../../../models/qp-elements-sales';
import { Component, HostListener, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import * as elSales from "../../../../models/elements-sales";
import { HistogramCalendarInterval } from 'src/app/models/histogram-calendar-interval';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-sales-elements-dart',
  templateUrl: './sales-elements-dart.component.html',
  styleUrls: ['./sales-elements-dart.component.scss']
})
export class SalesElementsDartComponent implements OnInit, OnChanges {

  @Input() collections: elSales.ElementsSales.HistogramResponseElement[]
  @Input() qp: QPElementsSales
  @Input() hideLineIndexes: number[] = []


  xLabelsMap: ReadonlyMap<HistogramCalendarInterval, string> = new Map<HistogramCalendarInterval, string>([
    [HistogramCalendarInterval.day, 'Dni'],
    [HistogramCalendarInterval.week, 'Tygodnie'],
    [HistogramCalendarInterval.month, 'Miesiące'],
    [HistogramCalendarInterval.quarter, 'Kwartały'],
    [HistogramCalendarInterval.year, 'Lata']
  ])


  stats: any[];
  view: any[] = [0, 0];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string;
  yAxisLabel: string = 'sztuk';
  timeline: boolean = true;
  subBreak599: Subscription


  // colorScheme = {
  //   domain: COLORS
  // };

  constructor(private windowService: WindowService) {
    this.setDartViewSize()
  }



  ngOnInit(): void {
    // this.stats = Object.assign([], this.collections)
    this.xAxisLabel = this.xLabelsMap.get(this.qp.cI)
    this.createStats()
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.collections) {
      if (!changes.collections.firstChange) {
        this.collections = changes.collections.currentValue
        this.createStats()
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

  setDartViewSize() {
    this.view[0] = this.windowService.windowRef.innerWidth - 20
    this.view[1] = this.windowService.windowRef.innerHeight - 160
  }


  createStats() {
    this.stats = []
    from(this.collections).pipe(
      filter((c, i) => {
        return !this.hideLineIndexes.includes(i)
      })
    ).subscribe(cs => {
      this.stats.push(cs)
    })
  }

  onSelect(event) {
    console.log(event)
  }

}
