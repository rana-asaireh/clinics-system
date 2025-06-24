import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorRoutingModule } from './doctor-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { AppointmentDetailsComponent } from './components/appointment-details/appointment-details.component';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { PatientDetailsComponent } from './components/patient-details/patient-details.component';
import { ViewAppointmentListComponent } from './components/view-appointment-list/view-appointment-list.component';
import { DoctorLayoutComponent } from './components/doctor-layout/doctor-layout.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProfileComponent,
    AppointmentDetailsComponent,
    PatientListComponent,
    PatientDetailsComponent,
    ViewAppointmentListComponent,
    DoctorLayoutComponent
  ],
  imports: [
    CommonModule,
    DoctorRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers:[
    
  ]
})
export class DoctorModule { }
