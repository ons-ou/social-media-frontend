import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private document = inject(DOCUMENT)

  setTheme(isDark: boolean){
    let theme = isDark? "dark.css" : "light.css"
    let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;

    if (themeLink) {
        themeLink.href = theme;
    }
  }

}
