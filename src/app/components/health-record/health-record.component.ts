import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { HealthRecordsService } from "../../services/health-records/health-records.service";
import { HealthRecordDto } from "../../models/health-records/get-health-record/health-record-dto";
import { CommonModule, DatePipe, DOCUMENT } from "@angular/common";
import {
  AddVaccinationToHealthRecordCommand
} from "../../models/health-records/add-vaccination-to-health-record/add-vaccination-to-health-record-command";
import {FormsModule} from "@angular/forms";
import {
  AddAppointmentToHealthRecordCommand
} from "../../models/health-records/add-appointment-to-health-record/add-appointment-to-health-record-command";

@Component({
  selector: 'app-health-record',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    HealthRecordsService, DatePipe],
  templateUrl: './health-record.component.html',
  styleUrl: './health-record.component.css'
})
export class HealthRecordComponent implements OnInit {
  healthRecord?: HealthRecordDto;
  showVaccinations: boolean = true;
  showAppointments: boolean = true;
  expandedVaccinationDetails: { [key: string]: any } = {};
  expandedAppointmentDetails: { [key: string]: any } = {};
  showAddVaccinationForm = false;
  showAddAppointmentForm = false;
  newVaccination: AddVaccinationToHealthRecordCommand = {
    vaccinationName: '',
    vaccinationDate: '',
    nextVaccinationDate: ''
  };
  newAppointment: AddAppointmentToHealthRecordCommand = {
    title: '',
    diagnosis: '',
    appointmentDate: '',
    notes: ''
  };


  constructor(
    private healthRecordsService: HealthRecordsService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
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

  showMoreVaccination(vaccinationId: string) {
    this.healthRecordsService.getVaccinationDetails(this.healthRecord?.healthRecordId!, vaccinationId)
      .subscribe((vaccinationDetails) => {
        this.expandedVaccinationDetails[vaccinationId] = vaccinationDetails;
      });
  }

  showMoreAppointment(appointmentId: string) {
    this.healthRecordsService.getAppointmentDetails(this.healthRecord?.healthRecordId!, appointmentId)
      .subscribe((appointmentDetails) => {
        this.expandedAppointmentDetails[appointmentId] = appointmentDetails;
      });
  }
  hideMoreVaccination(vaccinationId: string) {
    delete this.expandedVaccinationDetails[vaccinationId];
  }

  hideMoreAppointment(appointmentId: string) {
    delete this.expandedAppointmentDetails[appointmentId];
  }

  formatDate(dateString: string): string | null {
    return this.datePipe.transform(dateString, 'dd.MM.yyyy, HH:mm');
  }

  toggleAddVaccinationForm(): void {
    this.showAddVaccinationForm = !this.showAddVaccinationForm;
  }

  addVaccination(): void {
    const formattedVaccinationDate = new Date(this.newVaccination.vaccinationDate).toISOString();
    const formattedNextVaccinationDate = new Date(this.newVaccination.nextVaccinationDate).toISOString();

    const vaccinationCommand: AddVaccinationToHealthRecordCommand = {
      vaccinationName: this.newVaccination.vaccinationName,
      vaccinationDate: formattedVaccinationDate,
      nextVaccinationDate: formattedNextVaccinationDate
    };

    const healthRecordId = this.healthRecord?.healthRecordId;

    if (healthRecordId) {
      this.healthRecordsService.addVaccinationToHealthRecord(healthRecordId, vaccinationCommand).subscribe(() => {
        this.getHealthRecord(healthRecordId);
        this.newVaccination = {
          vaccinationName: '',
          vaccinationDate: '',
          nextVaccinationDate: ''
        };
        this.showAddVaccinationForm = false;
      });
    }
  }

  toggleAddAppointmentForm(): void {
    this.showAddAppointmentForm = !this.showAddAppointmentForm;
  }

  addAppointment(): void {
    const formattedAppointmentDate = new Date(this.newAppointment.appointmentDate).toISOString();

    const appointmentCommand: AddAppointmentToHealthRecordCommand = {
      title: this.newAppointment.title,
      diagnosis: this.newAppointment.diagnosis,
      appointmentDate: formattedAppointmentDate,
      notes: this.newAppointment.notes
    };

    const healthRecordId = this.healthRecord?.healthRecordId;

    if (healthRecordId) {
      this.healthRecordsService.addAppointmentToHealthRecord(healthRecordId, appointmentCommand).subscribe(() => {
        this.getHealthRecord(healthRecordId);
        this.newAppointment = {
          title: '',
          diagnosis: '',
          appointmentDate: '',
          notes: ''
        };
        this.showAddAppointmentForm = false;
      });
    }
  }
}

