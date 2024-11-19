export interface PetDetails {
  petId: string;
  name: string;
  species: string;
  breed?: string;
  gender: string;
  dateOfBirth: string;
  userId: string;
  healthRecordId?: string;
  photoUrl?: string;
}
