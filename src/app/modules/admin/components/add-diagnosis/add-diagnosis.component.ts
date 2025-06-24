import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Diagnosis } from '../../../shared/models/diagnosis.model';
import { AdminService } from '../../services/admin.service';
import { Clinic } from '../../../shared/models/clinic.model';
import { ClinicService } from '../../../shared/services/clinic.service';
import { DiagnosisService } from '../../../shared/services/diagnosis.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-add-diagnosis',
  standalone: false,
  templateUrl: './add-diagnosis.component.html',
  styleUrl: './add-diagnosis.component.scss'
})
export class AddDiagnosisComponent {
  name: string = '';
  diagnosis!: Diagnosis;
  success: string = '';
  clinics!: Clinic[];
  error!: string;
  selectedClinicId!: string;
  id: string | null = '';
  formGroup: FormGroup = this.initFormGroup();

  constructor(
    private adminService: AdminService,
    private clinicService: ClinicService,
    private diagnosisService: DiagnosisService,
    private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.loadClinics();
    this.id = this.route.snapshot.paramMap.get('id') || '';;
    if (this.id) {
      this.diagnosisService.getDiagnosisById(this.id).subscribe(
        (data: Diagnosis) => {
          this.error = '';
          this.diagnosis = data;
          this.name = this.diagnosis.name
          this.formGroup.patchValue({
            name: this.diagnosis.name,
          });
        },
        (error: any) => {
          this.error = 'Failed to load diagnosis';
        }
      )


    }
  }
  loadClinics(): void {

    this.clinicService.getClinics().subscribe(
      (data: Clinic[]) => {
        this.error = '';
        this.clinics = data;
      },
      (error: any) => {
        this.error = 'Failed to load clinics';
      }
    );
  }

  initFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl('', Validators.required)
    })
  }
  addDiagnosis(): void {
    this.success = '';
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.name = this.formGroup.controls['name']?.value;
      this.diagnosis = { name: this.name }
      this.adminService.addDiagnosis(this.diagnosis).subscribe((data: any) => {
        this.success = 'Added Sucessfully'; setTimeout(() => {
          this.success = '';
        }, 3000); this.formGroup.reset();
      })
    }
  }
  updateDiagnosis(): void {
    this.success = '';
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid && this.id !== null) {
      this.name = this.formGroup.controls['name']?.value;
      this.diagnosis = { name: this.name };
      this.diagnosisService.updateDiagnosisById(this.id, this.diagnosis).subscribe((data: any) => {
        this.success = 'Updated Sucessfully'; setTimeout(() => {
          this.success = '';
        }, 3000); this.formGroup.reset();
      })
    } else {
      this.error = 'Diagnosis Id is missing';
    }
  }
}
