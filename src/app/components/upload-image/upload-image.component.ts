import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { ImagePipe } from '../../pipes/image.pipe';

@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [FileUploadModule, CommonModule, ImagePipe],
  templateUrl: './upload-image.component.html',
  styleUrl: './upload-image.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadImageComponent {
  images: any[] = [];
  
  @Input() placeholder = '';
  @Input() existingImages: any[] | null = null;
  @Input() multi = false;

  @Output()
  newImages = new EventEmitter();

  @Output()
  oldImages = new EventEmitter();

  onUpload(event: FileUploadEvent) {
    const newImages = [];
    for (let file of event.files) {
      newImages.push(file);
    }
    this.images = this.multi ? [...this.images, ...newImages] : [...newImages];
    this.newImages.emit(this.images);
  }

  removeImage(im: any) {
    this.images = this.images.filter((i) => i != im);
    this.images = [...this.images];
    this.newImages.emit(this.images);

    if (this.existingImages != null) {
      this.existingImages = this.existingImages.filter((i) => i != im);
      this.existingImages = [...this.existingImages];  
    }
    this.oldImages.emit(this.existingImages);
  }
}
