import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClinicsListComponent } from './components/clinics-list/clinics-list.component';
import { DiagnosesListComponent } from './components/diagnosis-list/diagnoses-list.component';
import { DoctorsListComponent } from './components/doctors-list/doctors-list.component';
import { DrugsListComponent } from './components/drugs-list/drugs-list.component';
import { AddDoctorComponent } from './components/add-doctor/add-doctor.component';
import { AddDiagnosisComponent } from './components/add-diagnosis/add-diagnosis.component';
import { AddDrugComponent } from './components/add-drug/add-drug.component';
import { AddClinicComponent } from './components/add-clinic/add-clinic.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'clinics',
        pathMatch: 'full'
      },
      {
        path: 'clinics',
        component: ClinicsListComponent
      },
      {
        path: 'diagnoses',
        component: DiagnosesListComponent
      },
      {
        path: 'doctors',
        component: DoctorsListComponent
      },
      {
        path: 'drugs',
        component: DrugsListComponent
      },
      {
        path: 'add-doctor',
        component: AddDoctorComponent
      },
      {
        path: 'add-diagnosis',
        component: AddDiagnosisComponent
      },
      {
        path: 'add-drug',
        component: AddDrugComponent
      },
      {
        path: 'add-clinic',
        component: AddClinicComponent
      },
      {
        path: 'edit-drug/:id',
        component: AddDrugComponent
      },
      {
        path: 'edit-diagnosis/:id',
        component: AddDiagnosisComponent
      },
      {
        path: 'edit-clinic/:id',
        component: AddClinicComponent
      },
      {
        path: 'edit-doctor/:id',
        component: AddDoctorComponent
      }
    ]
  }
]
  ;
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
