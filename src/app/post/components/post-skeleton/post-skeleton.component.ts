import { Component } from '@angular/core';
import {SkeletonModule} from 'primeng/skeleton';

@Component({
  selector: 'app-post-skeleton',
  standalone: true,
  imports: [SkeletonModule],
  templateUrl: './post-skeleton.component.html',
  styleUrl: './post-skeleton.component.css'
})
export class PostSkeletonComponent {

}
