import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { NavPage } from './model/nav-page';
import { count } from 'rxjs/operators';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {

  @Input() pages: number;
  @Input() current: number;
  @Input() theme: 'dark' | 'light' = 'dark'
  @Output() emitChange: EventEmitter<NavPage> = new EventEmitter<NavPage>()
  pagination: NavPage[];

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.pages) {
      this.createPaginationViewData();
    }
    if (changes.current) {
      if (!changes.current.firstChange) {
        this.createPaginationViewData();
      }
    }
  }


  createPaginationViewData() {

    var pgs = [];

    for (var i = 0; i < this.pages; i++) {

      var act = false;
      if ((i + 1) == this.current) {
        act = true;
      }

      pgs.push({
        nr: (i + 1),
        active: act
      })
    }

    this.pagination = pgs;

  }


  changePag(event, p: NavPage) {
    event.preventDefault()
    this.emitChange.emit(p);
  }

}
