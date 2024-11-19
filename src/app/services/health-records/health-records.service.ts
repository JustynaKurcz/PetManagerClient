import {Inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DOCUMENT} from "@angular/common";
import {Vaccination} from "../../models/vaccination";
import {Appointment} from "../../models/appointment";

@Injectable({
  providedIn: 'root'
})
export class HealthRecordsService {
  private url = 'http://localhost:5062/api/v1/health-records';

  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document) {
  }

  addVaccinationToHealthRecord(healthRecordId: string, vaccination: Vaccination) {
    return this.http.post(`${this.url}/${healthRecordId}/vaccinations`, vaccination);
  }

  getVaccinationDetails(healthRecordId: string, vaccinationId: string) {
    return this.http.get(`${this.url}/${healthRecordId}/vaccinations/${vaccinationId}`);
  }

  deleteVaccination(healthRecordId: string, vaccinationId: string) {
    return this.http.delete(`${this.url}/${healthRecordId}/vaccinations/${vaccinationId}`);
  }

  addAppointmentToHealthRecord(healthRecordId: string, appointment: Appointment) {
    return this.http.post(`${this.url}/${healthRecordId}/appointments`, appointment);
  }

  getAppointmentDetails(healthRecordId: string, appointmentId: string) {
    return this.http.get(`${this.url}/${healthRecordId}/appointments/${appointmentId}`);
  }

  deleteAppointment(healthRecordId: string, appointmentId: string) {
    return this.http.delete(`${this.url}/${healthRecordId}/appointments/${appointmentId}`);
  }
}
