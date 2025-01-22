import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaccinationsHistoryComponent } from './vaccinations-history.component';

describe('VaccinationsHistoryComponent', () => {
  let component: VaccinationsHistoryComponent;
  let fixture: ComponentFixture<VaccinationsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VaccinationsHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VaccinationsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
