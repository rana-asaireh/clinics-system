import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthHeaderComponent } from './components/auth-header/auth-header.component';
import { AuthFooterComponent } from './components/auth-footer/auth-footer.component';
import { AuthSideBarComponent } from './components/auth-side-bar/auth-side-bar.component';
import { PaginationComponent } from './components/pagination/pagination.component';




@NgModule({
  declarations: [
    AuthHeaderComponent,
    AuthFooterComponent,
    AuthSideBarComponent,
    PaginationComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    AuthHeaderComponent,
    AuthFooterComponent,
    AuthSideBarComponent,
    PaginationComponent
  ]

})
export class SharedModule {}
