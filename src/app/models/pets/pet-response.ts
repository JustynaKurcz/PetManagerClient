import {PetDto} from "./pet-dto";

export interface PetResponse {
  items: PetDto[];
  pageIndex: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
