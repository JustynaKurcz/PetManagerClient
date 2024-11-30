import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PetResponse} from "../../models/pets/petResponse";
import {API_ENDPOINTS} from "../../constants/api-constants";
import {PetDetailsDto} from "../../models/pets/pet-details-dto";
import {GetSpeciesTypesResponse} from "../../models/pets/enums/get-species-types-response";
import {GetGenderTypesResponse} from "../../models/pets/enums/get-gender-types-response";

@Injectable({
  providedIn: 'root'
})
export class PetsService {

  private apiUrl = 'http://localhost:5062/api/v1/pets';

  constructor(private http: HttpClient) {
  }

  getPets(pageIndex: number, pageSize: number) {
    return this.http.get<PetResponse>((`${this.apiUrl}?PageNumber=${pageIndex}&PageSize=${pageSize}`));
  }

  createPet(petData: any) {
    return this.http.post<any>(`${API_ENDPOINTS.PETS.BASE}`, petData);
  }

  getPetDetails(petId: string) {
    return this.http.get<PetDetailsDto>((`${API_ENDPOINTS.PETS.BASE}/${petId}`));
  }

  getSpecies() {
    return this.http.get<GetSpeciesTypesResponse>(`${API_ENDPOINTS.PETS.BASE}/species-types`);
  }

  getGenders() {
    return this.http.get<GetGenderTypesResponse>(`${API_ENDPOINTS.PETS.BASE}/gender-types`);
  }

  deletePet(petId: string) {
    return this.http.delete((`${API_ENDPOINTS.PETS.BASE}/${petId}`));
  }

  changePetInformation(petId: string, petData: any) {
    return this.http.put<any>(`${API_ENDPOINTS.PETS.BASE}/${petId}`, petData);
  }
}
