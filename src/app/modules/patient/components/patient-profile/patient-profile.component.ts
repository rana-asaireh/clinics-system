import { Component, OnInit } from '@angular/core';

import { PatientAuthService } from '../../services/patient-auth.service';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Patient } from '../../../shared/models/patients.model';
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/models/user.model';

;


@Component({
  selector: 'app-patient-profile',
  standalone: false,
  templateUrl: './patient-profile.component.html',
  styleUrl: './patient-profile.component.scss'
})
export class PatientProfileComponent implements OnInit {

  patientProfileForm!: FormGroup;
  patientId: string | null = null;
  patientData: Patient | null = null;
  success: string = '';
  error!: string;

  isVisible: { [key: string]: boolean } = {
    password: false
  };
  inputType: { [key: string]: string } = {
    password: 'password'
  };
  loader: boolean = false;
  constructor(private patientAuthService: PatientAuthService,
    private userService: UserService
  ) { }
  ngOnInit(): void {
    const userEmail = this.userService.getCurrentUser()?.email;
    if (userEmail) {
      this.loader = true;
      setTimeout(() => {
        this.userService.getPatientByEmail(userEmail).subscribe(
          (patients) => {
            this.loader = false;
            if (patients && patients.length > 0) {

              this.patientId = patients[0].id;
              this.getPatientData();
            } else {
              this.error = 'Patient data not found.'
            }
          },
          (error) => {
            this.loader = false;
            this.error = 'Error getting patient data';
          });
      }, 1000);

    } else {
      this.error = 'User email not found.'
    }
    this.patientProfileForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]),
      gender: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      password: new FormControl('', Validators.minLength(6))
    });
  }

  // get patient data
  getPatientData() {
    if (this.patientId) {
      this.loader = true;
      setTimeout(() => {
      this.patientAuthService.getPatientById(this.patientId!).subscribe(
        (patientData) => {
          this.loader = false;
          console.log('Patient data:', patientData);
          this.patientData = patientData as Patient;


          this.patientProfileForm.patchValue({
            name: this.patientData?.name,
            email: this.patientData?.email,
            phone: this.patientData?.phone,
            gender: this.patientData?.gender,
            dob: this.patientData?.dob,
            password: this.patientData?.password
          });
        },
        (error) => {
          this.loader = false;
          this.error = 'Error getting patient data';
        }

      );}, 1000);
    }
  }
  updateProfile() {
    this.success = '';
    this.error = '';

    if (this.patientProfileForm.valid && this.patientId && this.patientData) {
      this.loader = true;
      const updatedData = {
        ...this.patientData,
        ...this.patientProfileForm.value,
        id: this.patientId
      };
      const newPassword = this.patientProfileForm.get('password')?.value;
setTimeout(() => {
      this.patientAuthService.updatePatient(updatedData).subscribe(
        (success) => {
          
          this.loader = false;
          this.updateUserData(updatedData, newPassword);
          this.success = 'Profile updated successfully';
          setTimeout(() => { this.success = ''; }, 1000);

          this.getPatientData();
        },
        (error) => {
          this.error = 'Error updating  profile';
          setTimeout(() => { this.error = ''; }, 1000);
        }
      );}, 1000);
    } else {
      this.patientProfileForm.markAllAsTouched();
      this.error = 'Please fill in all required fields.';
      setTimeout(() => { this.error = ''; }, 1000);
    }
  }

  updateUserData(patientData: Patient, newPassword: string) {
    this.userService.getUserByEmail(patientData.email).subscribe(
      (users) => {
        if (users && users.length > 0) {
          const user = users[0];
          const updatedUserData: User = {
            ...user,
            name: patientData.name,
            email: patientData.email
          };
          if (newPassword && newPassword !== user.password) {
            updatedUserData.password = newPassword;
          }
          this.userService.updateUser(updatedUserData).subscribe(
            (userUpdateSuccess) => {
            this.success = 'User data updated successfully';
            },
            (userUpdateError) => {
            
              this.error = 'Error updating user data';
            }
          );
        } else {
          this.error = 'No matching user found for this patient email.';

        }
      },
      (error) => {
        this.error = 'Error fetching user data';
      }
    );
  }
  toggleVisibility(fieldName: string) {
    this.isVisible[fieldName] = !this.isVisible[fieldName];
    this.inputType[fieldName] = this.isVisible[fieldName] ? 'text' : 'password';
  }
}