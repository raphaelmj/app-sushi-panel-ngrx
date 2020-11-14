import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationAsyncComponent } from './pagination-async.component';

describe('PaginationAsyncComponent', () => {
  let component: PaginationAsyncComponent;
  let fixture: ComponentFixture<PaginationAsyncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginationAsyncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationAsyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
