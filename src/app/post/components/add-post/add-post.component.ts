import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { PostService } from '../../post.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Post } from '../../models/post';
import { Observable, map, of } from 'rxjs';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputComponent } from '../../../components/input/input.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { ChipsModule } from 'primeng/chips';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Tag } from '../../models/tag';
import { ImagePipe } from '../../../pipes/image.pipe';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { UploadImageComponent } from '../../../components/upload-image/upload-image.component';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [
    RadioButtonModule,
    RouterModule,
    ToastModule,
    ChipsModule,
    ButtonModule,
    InputComponent,
    ReactiveFormsModule,
    CheckboxModule,
    InputTextareaModule,
    ConfirmDialogModule,
    UploadImageComponent,
    FileUploadModule,
    CommonModule,
    ImagePipe,
  ],
  providers: [ConfirmationService],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPostComponent {
  confirmationService = inject(ConfirmationService);
  postService = inject(PostService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  form!: FormGroup;

  images: any[] = [];
  existingImages: any[] = [];
  text = '';

  id: string;


  constructor() {
    const c = this.route.snapshot.data['data'] ?? new Post();
    this.id = this.route.snapshot.params['id'];
    this.text = this.id ? 'Update' : 'New';

    if (this.id && this.route.snapshot.data['data'] == null){
      this.router.navigate(['/posts/add'])
    }

    this.form = new FormGroup({
      content: new FormControl(c.content, Validators.required),
      viewedByAll: new FormControl(c.viewedByAll, Validators.required),
      tags: new FormControl<string[]>(c.tags.map((t: Tag) => t.content)),
    });

    this.existingImages = c.images ?? [];

    this.images = [];
  }

  newImages(event: any) {
    this.images = event
  }

  updateExisting(im: any) {
    this.existingImages = im
  }

  onSubmit() {
    let formData = new FormData();
    formData.append('content', this.form.get('content')?.value);

    formData.append('tags', this.form.get('tags')?.value);
    formData.append('viewedByAll', this.form.get('viewedByAll')?.value);

    if (this.existingImages != null) {
      for (let i = 0; i < this.existingImages.length; i++) {
        formData.append('images', this.existingImages[i].data);
      }
    }

    for (let i = 0; i < this.images.length; i++) {
      formData.append('newImages', this.images[i]);
    }
    this.form.reset()

    let api: Observable<Post>;
    if (this.id) api = this.postService.updatePost(this.id, formData);
    else api = this.postService.createPost(formData);

    api.subscribe(() => {
      this.router.navigate(['/feed']);
    });
  }

}
