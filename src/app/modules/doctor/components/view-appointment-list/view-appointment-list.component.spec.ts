import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAppointmentListComponent } from './view-appointment-list.component';

describe('ViewAppointmentListComponent', () => {
  let component: ViewAppointmentListComponent;
  let fixture: ComponentFixture<ViewAppointmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAppointmentListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAppointmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
