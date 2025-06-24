import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserTypeGuard } from './guards/user-type.guard';
import { HomePageComponent } from './page/home-page/home-page.component';
import { SignupComponent } from './signup/signup.component';
import { HomePageLayoutComponent } from './homePage/components/home-page-layout/home-page-layout.component';
import { MainHomePageComponent } from './homePage/components/main-home-page/main-home-page.component';
import { DoctorComponent } from './homePage/components/doctor/doctor.component';
import { ContactUsComponent } from './homePage/components/contact-us/contact-us.component';
import { ClinicsComponent } from './homePage/components/clinics/clinics.component';
import { SplashScreenComponent } from './homePage/components/splash-screen/splash-screen.component';

const routes: Routes = [
  { path: '', component: SplashScreenComponent },

  {
    path: 'home',
    component: HomePageLayoutComponent,
    children: [
      { path: '', component: MainHomePageComponent },
      { path: 'doctors', component: DoctorComponent },
      {
        path: 'contact-us',
        component: ContactUsComponent,
      },
      { path: 'clinic', component: ClinicsComponent },
    ],
  },
  {
    path: 'login',
    component:LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path:'admin',
    loadChildren:()=> import('./modules/admin/admin.module').then(m => m.AdminModule),
    canMatch:[UserTypeGuard],
    data:{expectedType:'admin'}
  },
  {
    path:'doctor',
    loadChildren:()=> import('./modules/doctor/doctor.module').then(m => m.DoctorModule),
    canMatch:[UserTypeGuard],
    data:{expectedType:'doctor'}
  },
  {
    path:'patient',
    loadChildren:()=> import('./modules/patient/patient.module').then(m => m.PatientModule),
    canMatch:[UserTypeGuard],
    data:{expectedType:'patient'}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
