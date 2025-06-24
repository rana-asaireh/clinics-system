import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-auth-header',
  standalone: false,
  templateUrl: './auth-header.component.html',
  styleUrl: './auth-header.component.scss'
})
export class AuthHeaderComponent implements OnInit {
  constructor(private userService: UserService, private authService: AuthService) { }
  user!: User;
  error!: string;

  ngOnInit(): void {
    try {
      this.user = this.userService.getCurrentUser();
      this.error = '';
    } catch (error: any) {
      this.error = error.message;
    }
  }
  logout(): void {
    this.authService.logout();
  }
}
