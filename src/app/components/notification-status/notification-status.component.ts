import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-notification-status',
  standalone: true,
  imports: [],
  templateUrl: './notification-status.component.html',
  styleUrl: './notification-status.component.css'
})
export class NotificationStatusComponent {
  @Input() isNotificationSent!: boolean;
}
