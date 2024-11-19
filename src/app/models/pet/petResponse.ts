import {Pet} from "./pet";

export interface PetResponse {
  items: Pet[];
  pageIndex: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
