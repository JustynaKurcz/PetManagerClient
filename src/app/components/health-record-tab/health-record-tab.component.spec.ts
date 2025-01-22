import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthRecordTabComponent } from './health-record-tab.component';

describe('HealthRecordTabComponent', () => {
  let component: HealthRecordTabComponent;
  let fixture: ComponentFixture<HealthRecordTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthRecordTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HealthRecordTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
