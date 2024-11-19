import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {PetResponse} from "../../models/pets/petResponse";
import {API_ENDPOINTS} from "../../constants/api-constants";
import {PetDetailsDto} from "../../models/pets/pet-details-dto";

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

    createPet(pet: any) {
        return this.http.post(`${this.apiUrl}`, {
            name: pet.name,
            species: pet.species,
            breed: pet.breed,
            gender: pet.gender,
            birthDate: pet.birthDate
        });
    }

    getPetDetails(petId: string) {
        const headers = this.createAuthHeaders();
        return this.http.get<PetDetailsDto>((`${API_ENDPOINTS.PETS.BASE}/${petId}`), {headers});
    }

    getSpecies() {
        const headers = this.createAuthHeaders();
        return this.http.get(`${this.apiUrl}/species-types`, {headers});
    }

    getGenders() {
        const headers = this.createAuthHeaders();
        return this.http.get(`${this.apiUrl}/gender-types`, {headers});
    }

    deletePet(petId: string) {
        const headers = this.createAuthHeaders();
        return this.http.delete((`${API_ENDPOINTS.PETS.BASE}/${petId}`), {headers});
    }
}
