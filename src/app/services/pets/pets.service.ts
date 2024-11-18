import {Inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DOCUMENT} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class PetsService {

  private url = 'http://localhost:5062/api/v1/pets';

  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document) {
  }

  createPet(pet: any) {
    return this.http.post(`${this.url}`, {
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      gender: pet.gender,
      birthDate: pet.birthDate
    });
  }

  getPetDetails(petId: string) {
    return this.http.get(`${this.url}/${petId}`);
  }

  getSpecies() {
    return this.http.get(`${this.url}/species`);
  }

  getGenders() {
    return this.http.get(`${this.url}/genders`);
  }

  changePetInformation(pet: any) {
    return this.http.put(`${this.url}/${pet.id}`, {
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      gender: pet.gender,
      birthDate: pet.birthDate
    });
  }

  deletePet(petId: string) {
    return this.http.delete(`${this.url}/${petId}`);
  }
}
