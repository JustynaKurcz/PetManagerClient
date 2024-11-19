import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {PetResponse} from "../../models/pets/petResponse";
import {API_ENDPOINTS} from "../../constants/api-constants";
import {PetDetailsDto} from "../../models/pets/pet-details-dto";
import {GetSpeciesTypesResponse} from "../../models/get-species-types-response";
import {GetGenderTypesResponse} from "../../models/get-gender-types-response";

@Injectable({
    providedIn: 'root'
})
export class PetsService {

    private apiUrl = 'http://localhost:5062/api/v1/pets';

    constructor(private http: HttpClient) {
    }

    private createAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    getPets(pageIndex: number, pageSize: number) {
        const headers = this.createAuthHeaders();
        return this.http.get<PetResponse>((`${this.apiUrl}?PageNumber=${pageIndex}&PageSize=${pageSize}`), {headers});
    }

    createPet(petData: any) {
        const headers = this.createAuthHeaders();
        return this.http.post<any>(`${API_ENDPOINTS.PETS.BASE}`, petData, {headers});
    }

    getPetDetails(petId: string) {
        const headers = this.createAuthHeaders();
        return this.http.get<PetDetailsDto>((`${API_ENDPOINTS.PETS.BASE}/${petId}`), {headers});
    }

    getSpecies(){
        const headers = this.createAuthHeaders();
        return this.http.get<GetSpeciesTypesResponse>(`${API_ENDPOINTS.PETS.BASE}/species-types`, {headers});
    }

    getGenders() {
        const headers = this.createAuthHeaders();
        return this.http.get<GetGenderTypesResponse>(`${API_ENDPOINTS.PETS.BASE}/gender-types`, {headers});
    }

    deletePet(petId: string) {
        const headers = this.createAuthHeaders();
        return this.http.delete((`${API_ENDPOINTS.PETS.BASE}/${petId}`), {headers});
    }
}
