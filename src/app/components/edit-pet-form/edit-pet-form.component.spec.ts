import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPetFormComponent } from './edit-pet-form.component';

describe('EditPetFormComponent', () => {
  let component: EditPetFormComponent;
  let fixture: ComponentFixture<EditPetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPetFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditPetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
