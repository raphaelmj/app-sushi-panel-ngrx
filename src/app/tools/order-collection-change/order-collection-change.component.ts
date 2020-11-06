import { Sortable } from 'sortablejs';
import { Component, Input, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export enum PresentType {
  oneKey = "oneKey",
  manyKeys = "manyKeys",
  pure = "pure"
}

@Component({
  selector: 'app-order-collection-change',
  templateUrl: './order-collection-change.component.html',
  styleUrls: ['./order-collection-change.component.scss']
})
export class OrderCollectionChangeComponent implements OnInit {

  @Output() emitClose: EventEmitter<any> = new EventEmitter()
  @Output() emitChange: EventEmitter<any[]> = new EventEmitter<any[]>()
  @Input() elements: any[] = []
  @Input() nameKey: string | null = null
  @Input() nameKeys: Array<{ key: string, suffix: string }> = []
  @Input() presentType: PresentType = PresentType.pure
  presentTypes = PresentType
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
