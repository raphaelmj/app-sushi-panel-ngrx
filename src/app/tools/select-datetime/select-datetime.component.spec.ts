import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDatetimeComponent } from './select-datetime.component';

describe('SelectDatetimeComponent', () => {
  let component: SelectDatetimeComponent;
  let fixture: ComponentFixture<SelectDatetimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectDatetimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDatetimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
