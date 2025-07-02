import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
 

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {


  //#region Variable Decl.
  //Flags
  isVisible: boolean = false;
  isNotMatchPassword: boolean = false
  //states
  passwordIconPath: string = ''
  inputType: string = 'password'
  showPasswordRules: boolean = false;

  


  passwordRules = {
    lowerCase: false,
    upperCase: false,
    digit: false,
    specialChar: false,
    minLength: false
  };



  checkPasswordStrength(password: string): void {
    this.passwordRules.lowerCase = /[a-z]/.test(password);
    this.passwordRules.upperCase = /[A-Z]/.test(password);
    this.passwordRules.digit = /[0-9]/.test(password);
    this.passwordRules.specialChar = /[^A-Za-z0-9]/.test(password);
    this.passwordRules.minLength = password.length >= 8;
  }



  //#region  Reactive Form  
  formNameMapping: { [key: string]: string } = {
    username: 'Username',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    terms: 'I agree to the terms and conditions'
  }
  registrationForm: FormGroup = this.initializeForm();
  initializeForm(): FormGroup {
    return new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)]),
      confirmPassword: new FormControl('', Validators.required),
      terms: new FormControl('')
    })
  }


  //#region Password visiblity 
  PasswordVisiblityHandler(): void {
    this.isVisible = !this.isVisible
    console.log(this.isVisible)
    if (this.isVisible === true) {
      this.inputType = 'text';
    }
    else {
      this.inputType = 'password'
    }
  }

  //#region submit 

  checkValidity(): void {
    if (this.registrationForm.controls['password'].value != this.registrationForm.controls['confirmPassword'].value) {
      this.isNotMatchPassword = true
    }
    // if()
    // else{
    //   if (!this.formGroupInstance.valid) {

    //   }
    // }
  }
}
