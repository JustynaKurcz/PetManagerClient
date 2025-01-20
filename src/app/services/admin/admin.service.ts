import {inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {API_ENDPOINTS} from "../../constants/api-constants";
import {HttpClient, HttpParams} from "@angular/common/http";
import {UsersResponse} from "../../models/admin/users-response";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(API_ENDPOINTS.ADMIN.DELETE_USER(userId));
  }

  browseUsers(pageIndex: number, pageSize: number, search: string): Observable<UsersResponse> {
    const queryParams = new HttpParams()
      .set('Search', search ?? '')
      .set('PageNumber', pageIndex)
      .set('PageSize', pageSize);

    return this.http.get<UsersResponse>(API_ENDPOINTS.ADMIN.BROWSE_USERS, {params: queryParams});
  }

}
