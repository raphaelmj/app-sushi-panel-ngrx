import { DOCUMENT } from '@angular/common';
import { Component, Input, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { Sortable } from 'sortablejs';

@Component({
  selector: 'app-change-strings-order',
  templateUrl: './change-strings-order.component.html',
  styleUrls: ['./change-strings-order.component.scss']
})
export class ChangeStringsOrderComponent implements OnInit {

  @Output() emitClose: EventEmitter<any> = new EventEmitter()
  @Output() emitChange: EventEmitter<string[]> = new EventEmitter<string[]>()
  @Input() elements: string[] = []
  sortable: Sortable

  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    this.createSortable()
  }

  createSortable() {

    this.sortable = new Sortable(this.document.getElementById('sort'), {

      // Element dragging ended
      onEnd: function (/**Event*/evt) {
        // console.log(evt.oldIndex, evt.newIndex)
        var element = this.elements[evt.oldIndex];
        this.elements.splice(evt.oldIndex, 1);
        this.elements.splice(evt.newIndex, 0, element);
      }.bind(this)

    })
  }


  changeOrder() {
    this.emitChange.emit(this.elements)
  }


  closeEdit() {
    this.emitClose.emit()
  }

}
