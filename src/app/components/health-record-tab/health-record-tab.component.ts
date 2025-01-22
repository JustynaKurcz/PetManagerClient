import { Component, Input } from '@angular/core';
import {AppointmentsHistoryComponent} from "../appointments-history/appointments-history.component";
import {TabViewModule} from "primeng/tabview";
import {VaccinationsHistoryComponent} from "../vaccinations-history/vaccinations-history.component";

@Component({
  selector: 'app-health-record-tab',
  standalone: true,
  imports: [
    AppointmentsHistoryComponent,
    TabViewModule,
    VaccinationsHistoryComponent
  ],
  templateUrl: './health-record-tab.component.html',
  styleUrl: './health-record-tab.component.css'
})
export class HealthRecordTabComponent {
  @Input() healthRecordId!: string;
}
