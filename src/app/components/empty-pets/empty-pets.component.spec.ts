import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyPetsComponent } from './empty-pets.component';

describe('EmptyPetsComponent', () => {
  let component: EmptyPetsComponent;
  let fixture: ComponentFixture<EmptyPetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyPetsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmptyPetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
