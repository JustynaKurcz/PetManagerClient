import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentDetailsDialogComponentComponent } from './appointment-details-dialog.component';

describe('AppointmentDetailsDialogComponentComponent', () => {
  let component: AppointmentDetailsDialogComponentComponent;
  let fixture: ComponentFixture<AppointmentDetailsDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentDetailsDialogComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentDetailsDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
