import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../modules/shared/services/user.service';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  langs: string[] = [];
  currentLang: string = 'en';

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private translationService: TranslationService
  ) { }

  ngOnInit(): void {
    this.langs = this.translationService.availableLangs;
    this.currentLang = this.translationService.currentLang;
  }
  langLabels: { [key: string]: string } = {
    en: 'English',
    ar: 'العربية'
  };

  get otherLang(): string {
    return this.currentLang === 'en' ? 'ar' : 'en';
  }

  get otherLangLabel(): string {
    return this.langLabels[this.otherLang];
  }
  switchLang(lang: string) {
    this.translationService.setLanguage(lang);
    this.currentLang = lang;
  }

  loginButton(): void {
    const isLogged = this.authService.isLoggedIn();
    const type = this.userService.getCurrentUserType();
    if (isLogged) {
      if (type === 'admin') {
        this.router.navigate(['admin']);
      } else if (type === 'doctor') {
        this.router.navigate(['doctor']);
      } else {
        this.router.navigate(['patient']);
      }
    } else {
      this.router.navigate(['login']);
    }
  }
}
