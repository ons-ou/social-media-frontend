import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-hero-page',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './hero-page.component.html',
  styleUrl: './hero-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroPageComponent {

}
