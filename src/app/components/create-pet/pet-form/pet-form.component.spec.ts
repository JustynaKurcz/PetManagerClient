import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetFormComponent } from './pet-form.component';

describe('AddPetFormComponent', () => {
  let component: PetFormComponent;
  let fixture: ComponentFixture<PetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
