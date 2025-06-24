import { Component, OnInit } from '@angular/core';
import { TranslationService } from './services/translation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: false,
})
export class AppComponent implements OnInit {
  title = 'clinics-management-system';
  dir = 'ltr';
  lang = 'en';

  constructor(private translationService: TranslationService) {}

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang') || 'en';
    this.setDirection(savedLang);

    this.translationService.langChange$.subscribe((newLang) => {
      this.setDirection(newLang);
    });
  }

  private setDirection(lang: string): void {
    this.lang = lang;
    this.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }
}