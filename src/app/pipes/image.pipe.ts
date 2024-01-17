import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'image',
  standalone: true
})
export class ImagePipe implements PipeTransform {

  transform(image: any): string {
    return image? 'data:image/jpeg;base64,' + image.data : "assets/profile.jpg";
  }

}
