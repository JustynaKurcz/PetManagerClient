import {UserDto} from "./user-dto";

export interface UsersResponse {
  items: UserDto[];
  pageIndex: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
