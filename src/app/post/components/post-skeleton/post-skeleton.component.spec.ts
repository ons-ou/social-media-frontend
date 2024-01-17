import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostSkeletonComponent } from './post-skeleton.component';

describe('PostSkeletonComponent', () => {
  let component: PostSkeletonComponent;
  let fixture: ComponentFixture<PostSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostSkeletonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
