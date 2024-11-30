import {Inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DOCUMENT} from "@angular/common";
import {API_ENDPOINTS} from "../../constants/api-constants";
import {HealthRecordDto} from "../../models/health-records/get-health-record/health-record-dto";
import {
  AddVaccinationToHealthRecordCommand
} from "../../models/health-records/add-vaccination-to-health-record/add-vaccination-to-health-record-command";
import {
  AddAppointmentToHealthRecordCommand
} from "../../models/health-records/add-appointment-to-health-record/add-appointment-to-health-record-command";

@Injectable({
  providedIn: 'root'
})
export class HealthRecordsService {
  private url = 'http://localhost:5062/api/v1/health-records';

  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document) {
  }

  getHealthRecordDetails(healthRecordId: string) {
    return this.http.get<HealthRecordDto>(`${API_ENDPOINTS.HEALTH_RECORDS.BASE}/${healthRecordId}`);
  }

  addVaccinationToHealthRecord(healthRecordId: string, vaccinationData: AddVaccinationToHealthRecordCommand) {
    return this.http.post(`${this.url}/${healthRecordId}/vaccinations`, vaccinationData);
  }

  getVaccinationDetails(healthRecordId: string, vaccinationId: string) {
    return this.http.get(`${this.url}/${healthRecordId}/vaccinations/${vaccinationId}`);
  }

  deleteVaccination(healthRecordId: string, vaccinationId: string) {
    return this.http.delete(`${this.url}/${healthRecordId}/vaccinations/${vaccinationId}`);
  }

  addAppointmentToHealthRecord(healthRecordId: string, appointmentData: AddAppointmentToHealthRecordCommand) {
    return this.http.post(`${this.url}/${healthRecordId}/appointments`, appointmentData);
  }

  getAppointmentDetails(healthRecordId: string, appointmentId: string) {
    return this.http.get(`${this.url}/${healthRecordId}/appointments/${appointmentId}`);
  }

  deleteAppointment(healthRecordId: string, appointmentId: string) {
    return this.http.delete(`${this.url}/${healthRecordId}/appointments/${appointmentId}`);
  }
}
