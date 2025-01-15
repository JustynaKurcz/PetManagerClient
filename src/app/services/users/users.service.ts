import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, map, Observable, of, tap, throwError} from "rxjs";
import {SignUpCommand} from "../../models/users/sign-up/sign-up-command";
import {SignUpResponse} from "../../models/users/sign-up/sign-up-response";
import {API_ENDPOINTS} from "../../constants/api-constants";
import {SignInCommand} from "../../models/users/sign-in/sign-in-command";
import {SignInResponse} from "../../models/users/sign-in/sign-in-response";
import {ChangeUserInformationCommand} from "../../models/users/change-user-information/change-user-information-command";
import {CurrentUserDetailsDto} from "../../models/users/get-current-user-details/current-user-details-dto";
import {JwtHelperService} from "@auth0/angular-jwt";
import {DOCUMENT} from "@angular/common";
import { throwError as observableThrowError } from 'rxjs';
import {ResetPassword} from "../../models/users/resetpassword/ResetPassword";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);
  private document = inject(DOCUMENT);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  private jwtHelper = new JwtHelperService();

  localStorage = this.document.defaultView?.localStorage;

  signIn(signInData: SignInCommand): Observable<boolean> {
    return this.http.post<SignInResponse>(API_ENDPOINTS.USERS.SIGN_IN, signInData)
      .pipe(
        map((response: SignInResponse) => {
          if (response?.token) {
            queueMicrotask(() => {
              this.localStorage?.setItem('token', String(response.token));
              this.setAuthenticatedState(response.token);
            });
            return true;
          }
          return false;
        }),
        catchError((error) => {
          this.clearAuthenticatedState();
          return of(false);
        })
      );
  }

  private setAuthenticatedState(token: string): void {
    try {
      this.isAuthenticatedSubject.next(true);
    } catch (error) {
      this.clearAuthenticatedState();
    }
  }

  private clearAuthenticatedState(): void {
    this.isAuthenticatedSubject.next(false);
  }

  signUp(signUpData: SignUpCommand) {
    return this.http.post<SignUpResponse>(API_ENDPOINTS.USERS.SIGN_UP, signUpData);
  }

  getDetailsOfTheLoggedUser(): Observable<CurrentUserDetailsDto> {
    return this.http.get<CurrentUserDetailsDto>(API_ENDPOINTS.USERS.CURRENT_LOGGED_USER);
  }

  changeUserInformation(userData: ChangeUserInformationCommand) {
    return this.http.put<any>(`${API_ENDPOINTS.USERS.BASE}`, userData);
  }

  isLoggedIn(): boolean {
    const token = this.localStorage?.getItem('token');

    if (!token) {
      this.clearAuthenticatedState();
      return false;
    }

    const isNotExpired = !this.jwtHelper.isTokenExpired(token);
    if (isNotExpired) {
      this.setAuthenticatedState(token);
    } else {
      this.clearAuthenticatedState();
    }

    return isNotExpired;
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

  resetPassword(resetPasswordData: ResetPassword): Observable<void> {
    return this.http.post<void>(API_ENDPOINTS.USERS.RESET_PASSWORD, resetPasswordData);
  }
}
