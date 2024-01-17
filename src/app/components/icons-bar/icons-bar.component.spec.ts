import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconsBarComponent } from './icons-bar.component';

describe('IconsBarComponent', () => {
  let component: IconsBarComponent;
  let fixture: ComponentFixture<IconsBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconsBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IconsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
