import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientBookAppointmentsComponent } from './patient-book-appointments.component';

describe('PatientBookAppointmentsComponent', () => {
  let component: PatientBookAppointmentsComponent;
  let fixture: ComponentFixture<PatientBookAppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientBookAppointmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientBookAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
