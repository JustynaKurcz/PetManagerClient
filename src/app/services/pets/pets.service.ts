import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PetResponse} from "../../models/pets/pet-response";
import {API_ENDPOINTS} from "../../constants/api-constants";
import {PetDetailsDto} from "../../models/pets/pet-details-dto";
import {GetSpeciesTypesResponse} from "../../models/pets/enums/get-species-types-response";
import {GetGenderTypesResponse} from "../../models/pets/enums/get-gender-types-response";
import {tap} from "rxjs";
import {CreatePetDto} from "../../models/pets/create-pet-dto";


@Injectable({
  providedIn: 'root'
})
export class PetsService {
  private http = inject(HttpClient);


  createPet(petData: CreatePetDto) {
    return this.http.post<any>(`${API_ENDPOINTS.PETS.BASE}`, petData);
  }

  getSpecies() {
    return this.http.get<GetSpeciesTypesResponse>(`${API_ENDPOINTS.PETS.BASE}/species-types`);
  }

  getGenders() {
    return this.http.get<GetGenderTypesResponse>(`${API_ENDPOINTS.PETS.BASE}/gender-types`);
  }

  uploadPetImage(petId: string, imageFile: File) {
    const formData = new FormData();
    formData.append('file', imageFile, imageFile.name);
    const url = `${API_ENDPOINTS.PETS.BASE}/${petId}/images`;

    return this.http.post(url, formData)
      .pipe(
        tap({
          next: () => console.log('Image upload successful'),
          error: error => console.error('Image upload error:', error)
        })
      );
  }

  getPets(pageIndex: number, pageSize: number) {
    return this.http.get<PetResponse>((`${API_ENDPOINTS.PETS.BASE}?PageNumber=${pageIndex}&PageSize=${pageSize}`));
  }

  getPetDetails(petId: string) {
    return this.http.get<PetDetailsDto>((`${API_ENDPOINTS.PETS.BASE}/${petId}`));
  }

  deletePet(petId: string) {
    return this.http.delete((`${API_ENDPOINTS.PETS.BASE}/${petId}`));
  }

  changePetInformation(petId: string, petData: any) {
    return this.http.put<any>(`${API_ENDPOINTS.PETS.BASE}/${petId}`, petData);
  }
}
