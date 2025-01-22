import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaccinationDetailsDialogComponent } from './vaccination-details-dialog.component';

describe('VaccinationDetailsDialogComponent', () => {
  let component: VaccinationDetailsDialogComponent;
  let fixture: ComponentFixture<VaccinationDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VaccinationDetailsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VaccinationDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
