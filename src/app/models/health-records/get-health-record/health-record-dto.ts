import {Vaccination} from "../vaccination";
import {Appointment} from "../appointment";

export interface HealthRecordDto {
  healthRecordId: string;
  petId: string;
  notes: string;
  vaccinations: Vaccination[];
  appointments: Appointment[];
}
