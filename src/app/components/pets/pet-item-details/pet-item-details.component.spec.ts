import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetItemDetailsComponent } from './pet-item-details.component';

describe('PetItemDetailsComponent', () => {
  let component: PetItemDetailsComponent;
  let fixture: ComponentFixture<PetItemDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetItemDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PetItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
