import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {HealthRecordsService} from "../../services/health-records/health-records.service";
import {HealthRecordDto} from "../../models/health-records/get-health-record/health-record-dto";
import {CommonModule, DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-health-record',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    HealthRecordsService],
  templateUrl: './health-record.component.html',
  styleUrl: './health-record.component.css'
})
export class HealthRecordComponent implements OnInit {
  healthRecord?: HealthRecordDto;
  showVaccinations: boolean = true;
  showAppointments: boolean = true;

  constructor(
    private healthRecordsService: HealthRecordsService,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit(): void {
    const healthRecordId = this.route.snapshot.paramMap.get('healthRecordId');
    if (healthRecordId) {
      this.getHealthRecord(healthRecordId);
    }
  }

  getHealthRecord(healthRecordId: string): void {
    this.healthRecordsService.getHealthRecordDetails(healthRecordId)
      .subscribe({
        next: (response) => {
          this.healthRecord = response;
        },
        error: (error) => {
          console.error('Error while fetching health record details:', error);
        }
      });
  }

  toggleVaccinations(): void {
    this.showVaccinations = !this.showVaccinations;
  }

  toggleAppointments(): void {
    this.showAppointments = !this.showAppointments;
  }

  deleteVaccination(vaccinationId: string): void {
    if (this.healthRecord) {
      const healthRecordId = this.healthRecord.healthRecordId;
      this.healthRecordsService.deleteVaccination(healthRecordId, vaccinationId)
        .subscribe({
          next: () => {
            this.healthRecord!.vaccinations = this.healthRecord!.vaccinations.filter(v => v.vaccinationId !== vaccinationId);
          },
          error: (error) => {
            console.error('Error while deleting vaccination:', error);
          }
        });
    }
  }

  deleteAppointment(appointmentId: string): void {
    if (this.healthRecord) {
      const healthRecordId = this.healthRecord.healthRecordId;
      this.healthRecordsService.deleteAppointment(healthRecordId, appointmentId)
        .subscribe({
          next: () => {
            this.healthRecord!.appointments = this.healthRecord!.appointments.filter(a => a.appointmentId !== appointmentId);
          },
          error: (error) => {
            console.error('Error while deleting appointment:', error);
          }
        });
    }
  }

  showMoreVaccination(vaccinationId: string): void {
    console.log('Showing more information about vaccination with ID:', vaccinationId);
  }

  showMoreAppointment(appointmentId: string): void {
    console.log('Showing more information about appointment with ID:', appointmentId);
  }
}
