import {Inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DOCUMENT} from "@angular/common";
import {API_ENDPOINTS} from "../../constants/api-constants";
import {
  AddVaccinationToHealthRecordCommand
} from "../../models/health-records/add-vaccination-to-health-record/add-vaccination-to-health-record-command";
import {
  AddAppointmentToHealthRecordCommand
} from "../../models/health-records/add-appointment-to-health-record/add-appointment-to-health-record-command";
import {AppointmentResponse} from "../../models/health-records/browse-appointment/AppointmentResponse";
import {VaccinationResponse} from "../../models/health-records/browse-vaccination/VaccinationResponse";
import {AppointmentDto} from "../../models/health-records/AppointmentDto";
import {VaccinationDto} from "../../models/health-records/VaccinationDto";

@Injectable({
  providedIn: 'root'
})
export class HealthRecordsService {
  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document) {
  }

  getVaccinations(healthRecordId: string, pageIndex: number, pageSize: number) {
    return this.http.get<VaccinationResponse>((`${API_ENDPOINTS.HEALTH_RECORDS.BASE}/${healthRecordId}/vaccinations?PageNumber=${pageIndex}&PageSize=${pageSize}`));
  }

  addVaccinationToHealthRecord(healthRecordId: string, vaccinationData: AddVaccinationToHealthRecordCommand) {
    return this.http.post(`${API_ENDPOINTS.HEALTH_RECORDS.BASE}/${healthRecordId}/vaccinations`, vaccinationData);
  }

  getVaccinationDetails(healthRecordId: string, vaccinationId: string) {
    return this.http.get<VaccinationDto>(`${API_ENDPOINTS.HEALTH_RECORDS.BASE}/${healthRecordId}/vaccinations/${vaccinationId}`);
  }

  deleteVaccination(healthRecordId: string, vaccinationId: string) {
    return this.http.delete(`${API_ENDPOINTS.HEALTH_RECORDS.BASE}/${healthRecordId}/vaccinations/${vaccinationId}`);
  }

  getAppointments(healthRecordId: string, pageIndex: number, pageSize: number) {
    return this.http.get<AppointmentResponse>((`${API_ENDPOINTS.HEALTH_RECORDS.BASE}/${healthRecordId}/appointments?PageNumber=${pageIndex}&PageSize=${pageSize}`));
  }

  addAppointmentToHealthRecord(healthRecordId: string, appointmentData: AddAppointmentToHealthRecordCommand) {
    return this.http.post(`${API_ENDPOINTS.HEALTH_RECORDS.BASE}/${healthRecordId}/appointments`, appointmentData);
  }

  getAppointmentDetails(healthRecordId: string, appointmentId: string) {
    return this.http.get<AppointmentDto>(`${API_ENDPOINTS.HEALTH_RECORDS.BASE}/${healthRecordId}/appointments/${appointmentId}`);
  }

  deleteAppointment(healthRecordId: string, appointmentId: string) {
    return this.http.delete(`${API_ENDPOINTS.HEALTH_RECORDS.BASE}/${healthRecordId}/appointments/${appointmentId}`);
  }
}
