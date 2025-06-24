import { Injectable } from '@angular/core';
import { CanMatch, GuardResult, MaybeAsync, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../modules/shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserTypeGuard implements CanMatch{
  constructor(private authService:AuthService, private userService:UserService, private router:Router) { }

  canMatch(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
    const expectedType = route.data?.['expectedType'];
    const isLoggedIn = this.authService.isLoggedIn();
    const userType = this.userService.getCurrentUserType();
    if(!isLoggedIn && userType !== expectedType){
      this.router.navigate(['login']);
      return false
    }
    return true
  };
}

