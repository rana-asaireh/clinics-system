import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientRoutingModule } from './patient-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { PatientAuthService } from './services/patient-auth.service';
import { DoctorsListComponent } from './components/doctors-list/doctors-list.component';
import { PatientAppointmentListComponent } from './components/patient-appointment-list/patient-appointment-list.component';
import { PatientBookAppointmentsComponent } from './components/patient-book-appointments/patient-book-appointments.component';
import { PatientProfileComponent } from './components/patient-profile/patient-profile.component';
import { AppointmentDetailsComponent } from './components/appointment-details/appointment-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientLayoutComponent } from './components/patient-layout/patient-layout.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    DoctorsListComponent,
    PatientAppointmentListComponent,
    PatientBookAppointmentsComponent,
    PatientProfileComponent,
    AppointmentDetailsComponent,
    PatientLayoutComponent,

  ],
  imports: [
    CommonModule,
    PatientRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    HttpClientModule
  ],

  providers: [
    { provide: PatientAuthService, useClass: PatientAuthService }
  ]
})
export class PatientModule { }
