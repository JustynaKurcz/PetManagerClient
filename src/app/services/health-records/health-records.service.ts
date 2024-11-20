import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DOCUMENT} from "@angular/common";
import {Vaccination} from "../../models/health-records/vaccination";
import {Appointment} from "../../models/health-records/appointment";
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

  private createAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getHealthRecordDetails(healthRecordId: string) {
    const headers = this.createAuthHeaders();
    return this.http.get<HealthRecordDto>(`${API_ENDPOINTS.HEALTH_RECORDS.BASE}/${healthRecordId}`, {headers});
  }

  addVaccinationToHealthRecord(healthRecordId: string, vaccinationData: AddVaccinationToHealthRecordCommand) {
    const headers = this.createAuthHeaders();
    return this.http.post(`${this.url}/${healthRecordId}/vaccinations`, vaccinationData, {headers});
  }

  getVaccinationDetails(healthRecordId: string, vaccinationId: string) {
    const headers = this.createAuthHeaders();
    return this.http.get(`${this.url}/${healthRecordId}/vaccinations/${vaccinationId}`, {headers});
  }

  deleteVaccination(healthRecordId: string, vaccinationId: string) {
    const headers = this.createAuthHeaders();
    return this.http.delete(`${this.url}/${healthRecordId}/vaccinations/${vaccinationId}`, {headers});
  }

  addAppointmentToHealthRecord(healthRecordId: string, appointmentData: AddAppointmentToHealthRecordCommand) {
    const headers = this.createAuthHeaders();
    return this.http.post(`${this.url}/${healthRecordId}/appointments`, appointmentData, {headers});
  }

  getAppointmentDetails(healthRecordId: string, appointmentId: string) {
    const headers = this.createAuthHeaders();
    return this.http.get(`${this.url}/${healthRecordId}/appointments/${appointmentId}`, {headers});
  }

  deleteAppointment(healthRecordId: string, appointmentId: string) {
    const headers = this.createAuthHeaders();
    return this.http.delete(`${this.url}/${healthRecordId}/appointments/${appointmentId}`, {headers});
  }
}
