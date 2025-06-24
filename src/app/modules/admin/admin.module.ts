import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AddClinicComponent } from './components/add-clinic/add-clinic.component';
import { AddDoctorComponent } from './components/add-doctor/add-doctor.component';
import { AddDrugComponent } from './components/add-drug/add-drug.component';
import { AddDiagnosisComponent } from './components/add-diagnosis/add-diagnosis.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ClinicsListComponent } from './components/clinics-list/clinics-list.component';
import { DoctorsListComponent } from './components/doctors-list/doctors-list.component';
import { DrugsListComponent } from './components/drugs-list/drugs-list.component';
import { DiagnosesListComponent } from './components/diagnosis-list/diagnoses-list.component';
import { SharedModule } from '../shared/shared.module';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';


@NgModule({
  declarations: [
    AddClinicComponent,
    AddDoctorComponent,
    AddDrugComponent,
    AddDiagnosisComponent,
    ClinicsListComponent,
    DoctorsListComponent,
    DrugsListComponent,
    DiagnosesListComponent,
    AdminLayoutComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SharedModule
  ]
})
export class AdminModule { }
