import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DOCUMENT} from "@angular/common";
import {BehaviorSubject, map, Observable, tap} from "rxjs";
import {SignUpCommand} from "../../models/users/sign-up/sign-up-command";
import {SignUpResponse} from "../../models/users/sign-up/sign-up-response";
import {API_ENDPOINTS} from "../../constants/api-constants";
import {SignInCommand} from "../../models/users/sign-in/sign-in-command";
import {SignInResponse} from "../../models/users/sign-in/sign-in-response";
import {ChangeUserInformationCommand} from "../../models/users/change-user-information/change-user-information-command";
import {CurrentUserDetailsDto} from "../../models/users/get-current-user-details/current-user-details-dto";
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);
  private document = inject(DOCUMENT);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  private localStorage = this.document.defaultView?.localStorage;

  signIn(signInData: SignInCommand) {
    return this.http
      .post<SignInResponse>(API_ENDPOINTS.USERS.SIGN_IN, signInData)
      .pipe(
        map((result: SignInResponse) => {
          if (result?.token) {
            this.localStorage?.setItem('token', result.token);
            this.isAuthenticatedSubject.next(true);
            return this.getDetailsOfTheLoggedUser().pipe(
              map(() => true)
            );
          }
          return false;
        })
      )
  }

  signUp(signUpData: SignUpCommand) {
    return this.http.post<SignUpResponse>(API_ENDPOINTS.USERS.SIGN_UP, signUpData);
  }

  getDetailsOfTheLoggedUser() {
    return this.http.get<CurrentUserDetailsDto>(API_ENDPOINTS.USERS.CURRENT_LOGGED_USER)
      .pipe(
        tap((result: any) => {
          localStorage.setItem('userId', result.id);
        })
      );
  }

  changeUserInformation(userData: ChangeUserInformationCommand) {
    return this.http.put<any>(`${API_ENDPOINTS.USERS.BASE}`, userData);
  }

  isLoggedIn(): boolean {
    const jwtHelper = new JwtHelperService();
    const token = localStorage?.getItem('token');
    if (!token) {
      this.isAuthenticatedSubject.next(false);
      localStorage?.removeItem('token');
      return false;
    }
    const isExpired = !jwtHelper.isTokenExpired(token);
    this.isAuthenticatedSubject.next(isExpired);
    return isExpired;
  }

  getAuthState(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(API_ENDPOINTS.USERS.BASE);
  }

  async signOut() {
    this.localStorage?.removeItem('token');
    this.isAuthenticatedSubject.next(false);
  }

}
