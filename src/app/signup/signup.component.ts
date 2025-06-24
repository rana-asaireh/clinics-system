import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PatientAuthService } from '../modules/patient/services/patient-auth.service';
import Swal from 'sweetalert2';
import { UserService } from '../modules/shared/services/user.service';

import { UserType } from '../modules/shared/enum/users.enum';
import { User } from '../modules/shared/models/user.model';

import { Router } from '@angular/router';



@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  loader : boolean = false ;
  //#region Variable Decl.
  //Flags
  isVisible = {
    password: false,
    confirmPassword: false
  };
  isConfirmPasswordVisible: boolean = false;

  //states
  passwordIconPath: string = ''
  inputType = {
    password: 'password',
    confirmPassword: 'password'
  };
  showPasswordRules: boolean = false;
  errors: string[] = [];




  passwordRules = {
    lowerCase: false,
    upperCase: false,
    digit: false,
    specialChar: false,
    minLength: false
  };


  constructor(private patientService: PatientAuthService,
    private userService: UserService,
    private route: Router
  ) {

  }


  //custom valdatord

  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value || '';

      if (password) {
        const validationResults: any = {
          lowerCase: /[a-z]/.test(password),
          upperCase: /[A-Z]/.test(password),
          digit: /[0-9]/.test(password),
          specialChar: /[^A-Za-z0-9]/.test(password),
          minLength: password.length >= 8,
        };

        const failedRules = Object.keys(validationResults).filter(key => !validationResults[key]);

        if (failedRules.length > 0) {
          return { passwordRules: validationResults };
        } else {
          return null;

        }
      }
      else {
        return null
      }
    }
  }


  //#region  Reactive Form  
  formNameMapping: { [key: string]: string } = {
     name: 'Username',
    email: 'Email',
    phone: 'Phone number',
    gender: 'Gender',
    password: 'Password',
    dob: 'Date Of Birthday',
    confirmPassword: 'Confirm Password',
    termsMsg: 'I agree to the terms and conditions',
    terms: 'Agreemnent the requirement'
  }
  registrationForm: FormGroup = this.initializeForm();
  initializeForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      gender: new FormControl('', Validators.required),
      dob: new FormControl('', [Validators.required, this.noFutureDateValidator]),
      password: new FormControl('', [Validators.required, this.passwordStrengthValidator()]),
      confirmPassword: new FormControl('', [Validators.required, this.passwordStrengthValidator()]),
      terms: new FormControl(false, Validators.requiredTrue)
    })
  }

  //check if dob is future date
  noFutureDateValidator(control: AbstractControl): any {
    const today = new Date();
    const inputDate = new Date(control.value);
    return inputDate > today ? { futureDate: true } : null;
  }


  //#region Password visiblity 
  toggleVisibility(field: 'password' | 'confirmPassword'): void {
    this.isVisible[field] = !this.isVisible[field];
    this.inputType[field] = this.isVisible[field] ? 'text' : 'password';
  }



  //#region submit 

  checkValidity(): void {
    this.registrationForm.markAllAsTouched();

    if (this.registrationForm.controls['password'].value && this.registrationForm.controls['confirmPassword'].value) {
      if (this.registrationForm.controls['password'].value != this.registrationForm.controls['confirmPassword'].value)
        this.errors.push("Password and Confirm Password do not match.");

    }


    if (!this.registrationForm.controls['terms'].value) {
      console.log("value", this.registrationForm.controls['terms'].value)
      this.registrationForm.controls['terms'].markAsTouched();
      this.registrationForm.controls['terms'].setValue(false)
    }


    if (this.registrationForm.valid) {
      this.loader = true ;

      //the fields all  are true 

      /*check email if exist*/
      this.patientService.checkEmailExist(this.registrationForm.controls['email'].value).subscribe(
        (exist) => {
          setTimeout(()=>{
          //using library sweetalert2 to alert the message
          if (exist) { //email exist => back you to signup page
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Email already exists!',
            });
            this.loader = false ;
          }
          else { //email not exist =>add patient to patientslist && usersList
            const { password: formPassword, confirmPassword, terms, ...newPatient }: any = this.registrationForm.value;

            this.patientService.addPatient(newPatient).subscribe(
              (patients) => {
                Swal.fire({
                  icon: 'success',
                  title: 'Successful submitted...',
                  text: 'You Registered successfully',
                });
                this.registrationForm.reset();
                console.log('patients List', patients)
                this.route.navigate(['login'])
                this.loader = false ;
              }
            )

            //destructing a name,email,password
            const {  name, email, password } = this.registrationForm.value;
            const newUser: User = {
              type: UserType.patient,
              name:  name,
              email: email,
              password: password,


            }
            this.userService.addUser(newUser).subscribe(
              (users) => {

                console.log('users List', users)
              }
            )
          }
          }, 1000);

        }
      )


    }
  }



}


