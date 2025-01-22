import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationStatusComponent } from './notification-status.component';

describe('NotificationStatusComponent', () => {
  let component: NotificationStatusComponent;
  let fixture: ComponentFixture<NotificationStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotificationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
