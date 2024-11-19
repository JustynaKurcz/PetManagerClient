import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DOCUMENT} from "@angular/common";
import {Vaccination} from "../../models/health-records/vaccination";
import {Appointment} from "../../models/health-records/appointment";
import {API_ENDPOINTS} from "../../constants/api-constants";
import {HealthRecordDto} from "../../models/health-records/get-health-record/health-record-dto";

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

  addVaccinationToHealthRecord(healthRecordId: string, vaccination: Vaccination) {
    const headers = this.createAuthHeaders();
    return this.http.post(`${this.url}/${healthRecordId}/vaccinations`, vaccination, {headers});
  }

  getVaccinationDetails(healthRecordId: string, vaccinationId: string) {
    const headers = this.createAuthHeaders();
    return this.http.get(`${this.url}/${healthRecordId}/vaccinations/${vaccinationId}`, {headers});
  }

  deleteVaccination(healthRecordId: string, vaccinationId: string) {
    const headers = this.createAuthHeaders();
    return this.http.delete(`${this.url}/${healthRecordId}/vaccinations/${vaccinationId}`, {headers});
  }

  addAppointmentToHealthRecord(healthRecordId: string, appointment: Appointment) {
    const headers = this.createAuthHeaders();
    return this.http.post(`${this.url}/${healthRecordId}/appointments`, appointment, {headers});
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
