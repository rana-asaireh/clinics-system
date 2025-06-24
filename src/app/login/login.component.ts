import { Component, ElementRef, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { DoctorService } from '../modules/doctor/services/doctor.service';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  showPassword: boolean = false;
  password: string = '';
  email: string = '';
  error: string = '';
  loader: boolean = false;
  isRtl: boolean = false;
  backgroundImageUrl = "url('/bg-login.PNG')";
  backgroundPosition = 'left center';

  formGroup: FormGroup = this.initFormGroup();

  constructor(
    private authService: AuthService,
    private router: Router,
    private doctorService: DoctorService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private translate: TranslateService,
    private el: ElementRef
  ) {
    this.setBackgroundImage(translate.currentLang);
    translate.onLangChange.subscribe(event => {
      this.setBackgroundImage(event.lang);
    });
  }
  setBackgroundImage(lang: string) {
    if (lang === 'ar') {
      this.isRtl = true;
      this.backgroundImageUrl = "url('login.jpeg')";
      this.backgroundPosition = 'left center';
    } else {
      this.isRtl = false;
      this.backgroundImageUrl = "url('/bg-login.PNG')";
      this.backgroundPosition = 'right center';
    }
    const dir = this.isRtl ? 'rtl' : 'ltr';
    this.renderer.setAttribute(document.documentElement, 'dir', dir);
  }
  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentLang = localStorage.getItem('language') || this.translate.currentLang || 'en';
        this.updateDirectionAndBackground(currentLang);
      }
    });

    this.translate.onLangChange.subscribe(event => {
      this.updateDirectionAndBackground(event.lang);
      localStorage.setItem('language', event.lang);
    });
    this.formGroup.get('email')?.valueChanges.subscribe(() => {
      if (this.error) { this.error = ''; }
    });

    this.formGroup.get('password')?.valueChanges.subscribe(() => {
      if (this.error) { this.error = ''; }
    });
  }
  updateDirectionAndBackground(lang: string) {
    if (lang === 'ar') {
      this.isRtl = true;
      this.backgroundImageUrl = "url('login.jpeg')";
      this.backgroundPosition = 'left center';

      this.renderer.setAttribute(this.document.documentElement, 'dir', 'rtl');

      this.renderer.addClass(this.document.body, 'rtl');
      this.renderer.removeClass(this.document.body, 'ltr');
    } else {
      this.isRtl = false;
      this.backgroundImageUrl = "url('/bg-login.PNG')";
      this.backgroundPosition = 'right center';

      this.renderer.setAttribute(this.document.documentElement, 'dir', 'ltr');

      this.renderer.addClass(this.document.body, 'ltr');
      this.renderer.removeClass(this.document.body, 'rtl');
    }
  }
  initFormGroup(): FormGroup {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    })
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) return;
    this.error = '';
    this.loader = true;
    this.password = this.formGroup.controls['password']?.value;
    this.email = this.formGroup.controls['email']?.value;
    const encodedPassword = encodeURIComponent(this.password);

    setTimeout(() => {
      this.authService.login(this.email, encodedPassword).subscribe(
        (user: any) => {
          this.loader = false;
          if (user.type === 'admin') {

            this.router.navigate(['admin']);
          } else if (user.type === 'doctor') {
            this.doctorService.getDoctorByEmail(this.email).subscribe((user: any) => {
              localStorage.setItem('typeUser', JSON.stringify(user));
              this.router.navigate(['doctor']);
            });
          } else if (user.type === 'patient') {
            this.router.navigate(['patient']);
          }
        },
        (error: any) => {
          this.loader = false;
          this.translate.get(error.message).subscribe(translated => {
            this.error = translated;
          });
        })
    }, 3000)
  };
}
