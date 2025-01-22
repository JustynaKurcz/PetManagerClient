import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetAvatarComponent } from './pet-avatar.component';

describe('PetAvatarComponent', () => {
  let component: PetAvatarComponent;
  let fixture: ComponentFixture<PetAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetAvatarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PetAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
