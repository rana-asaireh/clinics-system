import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Clinic } from '../../../shared/models/clinic.model';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute } from '@angular/router';
import { ClinicService } from '../../../shared/services/clinic.service';

@Component({
  selector: 'app-add-clinic',
  standalone: false,
  templateUrl: './add-clinic.component.html',
  styleUrl: './add-clinic.component.scss'
})
export class AddClinicComponent {
  name: string = '';
  clinic!: Clinic;
  success: string = '';
  error: string = '';
  isTyping: boolean = false;
  id: string | null = '';
  formGroup: FormGroup = this.initFormGroup();

  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute,
    private clinicService: ClinicService
  ) { }
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';;
    if (this.id) {
      this.clinicService.getClinicById(this.id).subscribe(
        (data: Clinic) => {
          this.error = '';
          this.clinic = data;
          this.name = this.clinic.name
          this.formGroup.patchValue({
            name: this.clinic.name,
          });
        },
        (error: any) => {
          this.error = 'Failed to load clinic';
        }
      )
    }
  }

  initFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl('', Validators.required)
    })
  }
  addClinic(): void {
    this.success = '';
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.name = this.formGroup.controls['name']?.value;
      this.clinic = { name: this.name }
      this.adminService.addClinic(this.clinic).subscribe((data: any) => {
        this.success = 'Added Sucessfully'; setTimeout(() => {
          this.success = '';
        }, 3000); this.formGroup.reset();
      })
    }
  }
  updateClinic(): void {
    this.success = '';
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid && this.id !== null) {
      this.name = this.formGroup.controls['name']?.value;
      this.clinic = { name: this.name };
      this.clinicService.updateClinicById(this.id, this.clinic).subscribe((data: any) => {
        this.success = 'Updated Sucessfully'; setTimeout(() => {
          this.success = '';
        }, 3000); this.formGroup.reset();
      })
    } else {
      this.error = 'Clinic Id is missing';
    }
  }
}

