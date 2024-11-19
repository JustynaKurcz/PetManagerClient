import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {PetDetails} from "../../models/pet/PetDetails";
import {PetResponse} from "../../models/pet/petResponse";

@Injectable({
  providedIn: 'root'
})
export class PetsService {

  private apiUrl = 'http://localhost:5062/api/v1/pets';

  constructor(private http: HttpClient) {
  }

  getPets(pageIndex: number, pageSize: number){
    return this.http.get<PetResponse>(`${this.apiUrl}?PageNumber=${pageIndex}&PageSize=${pageSize}`);
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
    return this.http.get<PetDetails>(`${this.apiUrl}/${petId}`);
  }

  getSpecies() {
    return this.http.get(`${this.apiUrl}/species`);
  }

  getGenders() {
    return this.http.get(`${this.apiUrl}/genders`);
  }

  changePetInformation(pet: any) {
    return this.http.put(`${this.apiUrl}/${pet.id}`, {
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      gender: pet.gender,
      birthDate: pet.birthDate
    });
  }

  deletePet(petId: string) {
    return this.http.delete(`${this.apiUrl}/${petId}`);
  }
}
