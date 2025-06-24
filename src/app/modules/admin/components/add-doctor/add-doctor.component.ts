import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Doctor } from '../../../shared/models/doctor.model';
import { AdminService } from '../../services/admin.service';
import { UserType } from '../../../shared/enum/users.enum';
import { Clinic } from '../../../shared/models/clinic.model';
import { ClinicService } from '../../../shared/services/clinic.service';
import { User } from '../../../shared/models/user.model';
import { UserService } from '../../../shared/services/user.service';
import { DoctorService } from '../../../doctor/services/doctor.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-add-doctor',
  standalone: false,
  templateUrl: './add-doctor.component.html',
  styleUrl: './add-doctor.component.scss'
})
export class AddDoctorComponent implements OnInit {
  name: string = '';
  email: string = '';
  phone: string = '';
  specification: string = '';
  doctor!: Doctor;
  gender!: string;
  password!: string;
  type: UserType = UserType.doctor;
  success: string = '';
  clinics!: Clinic[];
  error!: string;
  message!: string;
  selectedClinicId!: string;
  userDoctor!: User;
  id: string | null = '';
  showPassword: boolean = false;
  userData!: User;

  formGroup: FormGroup = this.initFormGroup();

  constructor(
    private adminService: AdminService,
    private clinicService: ClinicService,
    private userService: UserService,
    private doctorService: DoctorService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadClinics();
    this.id = this.route.snapshot.paramMap.get('id') || '';;
    if (this.id) {
      this.doctorService.getDoctorById(this.id).subscribe(
        (data: Doctor) => {
          this.error = '';
          this.doctor = data;
          this.name = this.doctor.name;
          this.email = this.doctor.email;
          this.phone = this.doctor.phone;
          this.specification = this.doctor.specification;
          this.password = this.doctor.password ?? '';
          this.selectedClinicId = this.doctor.clinic_id;
          this.formGroup.patchValue({
            name: this.doctor.name,
            email: this.doctor.email,
            phone: this.doctor.phone,
            specification: this.doctor.specification,
            selectClinic: this.doctor.clinic_id, 
            gender: this.doctor.gender
          });
          console.log("Form Group Value after patching:", this.formGroup.value);
        },
        (error: any) => {
          this.error = 'Failed to load doctor';
        }
      )
    }
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
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
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      gender: new FormControl('', Validators.required),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      specification: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      selectClinic: new FormControl('', Validators.required)
    })
  }

  addDoctor(): void {
    this.success = '';
    this.error = '';
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.adminService.checkEmailExist(this.formGroup.controls['email']?.value).subscribe(
        (exist) => {
          if (exist) {
            this.message = 'Email already exists'
          }
          else {
            this.name = this.formGroup.controls['name']?.value;
            this.email = this.formGroup.controls['email']?.value;
            this.phone = this.formGroup.controls['phone']?.value;
            this.specification = this.formGroup.controls['specification']?.value;
            this.password = this.formGroup.controls['password']?.value;
            this.selectedClinicId = this.formGroup.controls['selectClinic']?.value;
            this.gender = this.formGroup.controls['gender']?.value;
            this.doctor = {
              type: this.type,
              name: this.name,
              email: this.email,
              password: this.password,
              phone: this.phone,
              specification: this.specification,
              clinic_id: this.selectedClinicId,
              gender: this.gender
            }

            this.userDoctor = {
              type: this.type,
              name: this.name,
              email: this.email,
              password: this.password
            }

            this.adminService.addDoctor(this.doctor).subscribe((data: any) => {
              this.success = 'Added Sucessfully'; setTimeout(() => {
                this.success = '';
              }, 3000); this.formGroup.reset();
            }, (error: any) => { this.error = 'Failed to add doctor. Try again later!' });
            this.userService.addUserDoctor(this.userDoctor).subscribe((data: User) => { }, (error: any) => { this.error = 'Failed to add doctor as a user. Try again later!' })
          }
        })
    }
  }

  updateDoctor(): void {
    this.success = '';
    this.formGroup.markAllAsTouched();

    if (this.formGroup.valid && this.id !== null) {
      this.name = this.formGroup.controls['name']?.value;
      this.email = this.formGroup.controls['email']?.value;
      this.phone = this.formGroup.controls['phone']?.value;
      this.specification = this.formGroup.controls['specification']?.value;
      this.password = this.formGroup.controls['password']?.value;
      this.selectedClinicId = this.formGroup.controls['selectClinic']?.value;
      this.gender = this.formGroup.controls['gender']?.value;

      const updatedDoctor: Doctor = {
        type: this.type,
        name: this.name,
        email: this.email,
        password: this.password,
        phone: this.phone,
        specification: this.specification,
        clinic_id: this.selectedClinicId,
        gender: this.gender
      };

      const userPayload: User = {
        type: this.type,
        name: this.name,
        email: this.email,
        password: this.password
      };

      this.doctorService.updateDoctorById(this.id, updatedDoctor).subscribe({
        next: () => {
          this.userService.getUserDoctorByEmail(this.email).subscribe({
            next: (user: User) => {
              if (user && user.id) {
                console.log("User ID to update:", user.id);
                this.userService.updateUserDoctorByid(user.id.toString(), userPayload).subscribe({
                  next: () => {
                    this.success = 'Updated Successfully';
                    setTimeout(() => (this.success = ''), 3000);
                    this.formGroup.reset();
                  },
                  error: () => {
                    this.error = 'Failed to update user';
                  }
                });
              } else {
                this.error = 'User not found or missing ID';
                console.error("Invalid user returned:", user);
              }
            },
            error: () => {
              this.error = 'Failed to retrieve user by email';
            }
          });
        },
        error: () => {
          this.error = 'Failed to update doctor';
        }
      });
    } else {
      this.error = 'Doctor Id is missing or form is invalid';
    }
  }

}
