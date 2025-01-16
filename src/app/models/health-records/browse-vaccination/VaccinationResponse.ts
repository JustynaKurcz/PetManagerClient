import {Vaccination} from "../vaccination";

export interface VaccinationResponse {
  items: Vaccination[];
  pageIndex: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
