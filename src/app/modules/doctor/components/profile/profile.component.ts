import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DoctorService } from '../../services/doctor.service';
import { UserService } from '../../../shared/services/user.service';
import { Doctor } from '../../../shared/models/doctor.model';

import { User } from '../../../shared/models/user.model';
import { ClinicService } from '../../../shared/services/clinic.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  doctorId: string | null = null;
  doctorFormData: Doctor | null = null;
  success: string = '';
  error!: string;

  isVisible: { [key: string]: boolean } = {
    password: false
};
inputType: { [key: string]: string } = {
    password: 'password'
};
loader: boolean = false;
  constructor(private doctorService: DoctorService,
    private userService:UserService,
    private clinicsService:ClinicService
  ) { }
ngOnInit(): void {
  const doctorEmail =this.userService.getCurrentUser()?.email; 
 
  if(doctorEmail){
      this.loader = true;
      setTimeout(() => {
    this.userService.getDoctorByEmail(doctorEmail).subscribe(
      (doctors)=>{
          this.loader = false;
        if(doctors && doctors.length>0){
          this.doctorId=doctors[0].id;
          this.getDoctorData();
        }else{
          this.error = 'Doctor data not found.';
        }
      },
      (errors)=>{
        this.loader = false;
        this.error = 'Error getting doctor data';
      }
    );
      }, 1000);
  }else{
    this.error = 'User email not found.'
  }
  this.profileForm =new FormGroup({
    name:new FormControl('', Validators.required),
    specifications:new FormControl('', Validators.required),
    email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
    phone:new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]),
    gender:new FormControl('', Validators.required),
    clinicName:new FormControl({ value: '', disabled: true }, Validators.required),
    password: new FormControl('', Validators.minLength(6))
  });
}
getDoctorData(){
  this.success = '';
  this.error = '';

  if(this.doctorId){
    this.loader = true;
      setTimeout(() => {
          this.doctorService.getDoctorsById(this.doctorId!).subscribe(
            (doctorFormData) => {
            this.loader = false;
              this.doctorFormData = doctorFormData as Doctor;
               
              this.doctorFormData = this.doctorFormData as Doctor;
              this.profileForm.patchValue({
                name: this.doctorFormData?.name,
                email: this.doctorFormData?.email,
                phone: this.doctorFormData?.phone,
                gender: this.doctorFormData?.gender,
                specifications: this.doctorFormData?.specification,
                clinicName: this.doctorFormData?.clinic_id,
                password: this.doctorFormData?.password
              });
              if (this.doctorFormData?.clinic_id) {
                this.clinicsService.getClinicNameById(this.doctorFormData.clinic_id).subscribe(
                  (clinicName) => {
                    this.profileForm.patchValue({ clinicName: clinicName });
                  },
                  (error) => {
                  
                    this.error = 'Error getting clinic name';
                    this.profileForm.patchValue({ clinicName: 'not found' });
                  }
                );
              }
            },
            (error) => {
              this.loader = false;
            
              this.error = 'Error getting doctor data';
            }
            
          );}, 1000);
  }
}

onSubmit() {
  this.success = '';
  this.error = '';
  
  if(this.profileForm.valid && this.doctorId && this.doctorFormData){
    this.loader = true;
    const updatedData={...this.doctorFormData,...this.profileForm.value,id : this.doctorId};
    const newPassword = this.profileForm.get('password')?.value;
    setTimeout(() => {
    this.doctorService.updateDoctor(updatedData).subscribe(
      (success) => {
        this.loader = false;
        this.updateUserDataForDoctor(updatedData,newPassword);
        this.success = 'Doctor profile updated successfully';
        setTimeout(() => { this.success = ''; }, 1000);
        
        this.getDoctorData();
      },
      (error) => {
        this.error = 'Error updating doctor profile';
        setTimeout(() => { this.error = ''; }, 1000);
      }
    );}, 1000);
  }else{
    this.profileForm.markAllAsTouched();
    this.error = 'Please fill in all required fields.';
    setTimeout(() => { this.error = ''; }, 1000);
  }
 }

  updateUserDataForDoctor(doctorData: Doctor, newPassword: string) {
    this.loader = true;
    setTimeout(() => {
      this.userService.getUserByEmail(doctorData.email).subscribe(
        (users) => {
          this.loader = false;
          if (users && users.length > 0) {
            const user = users[0];
            const updatedUserData: User = {
              ...user,
              name: doctorData.name,
              email: doctorData.email,
            };
            if (newPassword && newPassword !== '') {
              updatedUserData.password = newPassword;
            }
            this.userService.updateUser(updatedUserData).subscribe(
              (userUpdateSuccess) => {
                console.log(
                  'User data updated successfully for doctor:',
                  userUpdateSuccess
                );
                this.success = 'Account data updated successfully for details';
              },
              (userUpdateError) => {
                console.error(
                  'Error updating user data for doctor:',
                  userUpdateError
                );
                this.error = 'Error updating Account data for details';
              }
            );
          } else {
            console.log('No matching user found for this doctor email.');
          }
        },
        (error) => {
          console.error('Error fetching user data for doctor:', error);
        }
      );
    }, 1000);
  }

  toggleVisibility(fieldName: string) {
    this.isVisible[fieldName] = !this.isVisible[fieldName];
    this.inputType[fieldName] = this.isVisible[fieldName] ? 'text' : 'password';
  }
}
