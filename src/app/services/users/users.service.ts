import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, catchError, map, Observable, of, tap} from "rxjs";
import {SignUpCommand} from "../../models/users/sign-up/sign-up-command";
import {SignUpResponse} from "../../models/users/sign-up/sign-up-response";
import {API_ENDPOINTS} from "../../constants/api-constants";
import {SignInCommand} from "../../models/users/sign-in/sign-in-command";
import {SignInResponse} from "../../models/users/sign-in/sign-in-response";
import {ChangeUserInformationCommand} from "../../models/users/change-user-information/change-user-information-command";
import {CurrentUserDetailsDto} from "../../models/users/get-current-user-details/current-user-details-dto";
import {JwtHelperService} from "@auth0/angular-jwt";
import {DOCUMENT} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);
  private document = inject(DOCUMENT);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  localStorage = this.document.defaultView?.localStorage;

  signIn(signInData: SignInCommand) {
    return this.http
      .post<SignInResponse>(API_ENDPOINTS.USERS.SIGN_IN, signInData)
      .pipe(
        map((response: SignInResponse) => {
          if (response?.token) {
              this.localStorage?.setItem('token', String(response.token));
              this.isAuthenticatedSubject.next(true);
              return true;
            }
          return false;
        }),
        catchError((error) => {
          console.error('Sign in error:', error);
          this.isAuthenticatedSubject.next(false);
          return of(false);
        })
      );
  }

  signUp(signUpData: SignUpCommand) {
    return this.http.post<SignUpResponse>(API_ENDPOINTS.USERS.SIGN_UP, signUpData);
  }

  getDetailsOfTheLoggedUser() {
    return this.http.get<CurrentUserDetailsDto>(API_ENDPOINTS.USERS.CURRENT_LOGGED_USER)
      .pipe(
        tap((result: any) => {
          this.localStorage?.setItem('userId', result.userId);
        })
      );
  }

  changeUserInformation(userData: ChangeUserInformationCommand) {
    return this.http.put<any>(`${API_ENDPOINTS.USERS.BASE}`, userData);
  }

  isLoggedIn(): boolean {
    const jwtHelper = new JwtHelperService();
    const localStorage = this.document.defaultView?.localStorage;
    const token = localStorage?.getItem('token');

    if (!token) {
      this.isAuthenticatedSubject.next(false);
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
