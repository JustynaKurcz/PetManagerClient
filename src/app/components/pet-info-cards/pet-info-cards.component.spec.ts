import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetInfoCardsComponent } from './pet-info-cards.component';

describe('PetInfoCardsComponent', () => {
  let component: PetInfoCardsComponent;
  let fixture: ComponentFixture<PetInfoCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetInfoCardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PetInfoCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
