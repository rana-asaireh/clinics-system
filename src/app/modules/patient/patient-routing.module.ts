import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientAppointmentListComponent } from './components/patient-appointment-list/patient-appointment-list.component';
import { AppointmentDetailsComponent } from './components/appointment-details/appointment-details.component';
import { DoctorsListComponent } from './components/doctors-list/doctors-list.component';
import { PatientLayoutComponent } from './components/patient-layout/patient-layout.component';
import { PatientProfileComponent } from './components/patient-profile/patient-profile.component';
import { PatientBookAppointmentsComponent } from './components/patient-book-appointments/patient-book-appointments.component';

const routes: Routes = [
  {
    path: '',
    component: PatientLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
      },
      {
        path: 'profile',
        component: PatientProfileComponent
      },
      {
        path: 'appointment-list',
        component: PatientAppointmentListComponent

      },
      {
        path: 'book-appointment',
        component: PatientBookAppointmentsComponent
      },
      {
        path: 'edit-appointment/:id',
        component: PatientBookAppointmentsComponent
      },
      {
        path: 'appointment-details/:id',
        component: AppointmentDetailsComponent
      },
      {
        path: 'doctor-list',
        component: DoctorsListComponent
      },

    ]
  },







];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }
