import { Injectable } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLangSubject = new BehaviorSubject<string>('en');

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['en', 'ar']);
    const savedLang = localStorage.getItem('lang') || 'en';
    this.setLanguage(savedLang);
  }

  setLanguage(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    this.updateDir(lang);
    this.currentLangSubject.next(lang);
  }

  private updateDir(lang: string) {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.classList.remove('rtl', 'ltr');
    document.documentElement.classList.add(dir);
  }

  get currentLang(): string {
    return this.translate.currentLang || 'en';
  }

  get availableLangs(): string[] {
    return this.translate.getLangs();
  }

  get onLangChange(): Observable<LangChangeEvent> {
    return this.translate.onLangChange;
  }

  get langChange$(): Observable<string> {
    return this.currentLangSubject.asObservable();
  }
}