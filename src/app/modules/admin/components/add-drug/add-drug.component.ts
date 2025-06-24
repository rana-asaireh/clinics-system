import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Drug } from '../../../shared/models/drug.model';
import { AdminService } from '../../services/admin.service';
import { Clinic } from '../../../shared/models/clinic.model';
import { ActivatedRoute } from '@angular/router';
import { DrugService } from '../../../shared/services/drug.service';

@Component({
  selector: 'app-add-drug',
  standalone: false,
  templateUrl: './add-drug.component.html',
  styleUrls: ['./add-drug.component.scss']
})
export class AddDrugComponent {
  name: string = '';
  drug!: Drug;
  success: string = '';
  clinics!: Clinic[];
  error!: string;
  id: string | null = '';

  formGroup: FormGroup = this.initFormGroup();

  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute,
    private drugService: DrugService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';;
    if (this.id) {
      this.drugService.getDrugById(this.id).subscribe(
        (data: Drug) => {
          this.error = '';
          this.drug = data;
          this.name = this.drug.name
          this.formGroup.patchValue({
            name: this.drug.name,
          });
        },
        (error: any) => {
          this.error = 'Failed to load drug';
        }
      )
    }
  }

  initFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl('', Validators.required)
    })
  }
  addDrug(): void {
    this.success = '';
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.name = this.formGroup.controls['name']?.value;
      this.drug = { name: this.name }
      this.adminService.addDrug(this.drug).subscribe((data: any) => {
        this.success = 'Added Sucessfully'; setTimeout(() => {
          this.success = '';
        }, 3000); this.formGroup.reset();
      })
    }
  }
  updateDrug(): void {
    this.success = '';
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid && this.id !== null) {
      this.name = this.formGroup.controls['name']?.value;
      this.drug = { name: this.name };
      this.drugService.updateDrugById(this.id, this.drug).subscribe((data: any) => {
        this.success = 'Updated Sucessfully'; setTimeout(() => {
          this.success = '';
        }, 3000); this.formGroup.reset();
      })
    } else {
      this.error = 'Drug Id is missing';
    }
  }
}
