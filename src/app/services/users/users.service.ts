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

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);
  private document = inject(DOCUMENT);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  private userRolesSubject = new BehaviorSubject<string[]>([]);
  private readonly ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
  private authStateSubject = new BehaviorSubject<boolean>(false);
  private jwtHelper = new JwtHelperService();

  localStorage = this.document.defaultView?.localStorage;

  signIn(signInData: SignInCommand): Observable<boolean> {
    return this.http.post<SignInResponse>(API_ENDPOINTS.USERS.SIGN_IN, signInData)
      .pipe(
        map((response: SignInResponse) => {
          if (response?.token) {
            queueMicrotask(() => {
              this.localStorage?.setItem('token', String(response.token));
              this.updateAuthState(response.token);
            });
            return true;
          }
          return false;
        }),
        catchError((error) => {
          console.error('Sign in error:', error);
          this.resetAuthState();
          return of(false);
        })
      );
  }

  private updateAuthState(token: string): void {
    try {
      const decodedToken = this.jwtHelper.decodeToken(token) as any;
      const role = decodedToken[this.ROLE_CLAIM];

      this.authStateSubject.next(true);
      this.userRolesSubject.next(role ? [role] : []);
    } catch (error) {
      this.resetAuthState();
    }
  }

  private resetAuthState(): void {
    this.authStateSubject.next(false);
    this.userRolesSubject.next([]);
  }




  signUp(signUpData: SignUpCommand) {
    return this.http.post<SignUpResponse>(API_ENDPOINTS.USERS.SIGN_UP, signUpData);
  }

  // getDetailsOfTheLoggedUser() {
  //   const token = this.localStorage?.getItem('token');
  //   console.log('SERWIS: Token dla żądania:', token);
  //   console.log('SERWIS: Endpoint:', API_ENDPOINTS.USERS.CURRENT_LOGGED_USER);
  //
  //   return this.http.get<CurrentUserDetailsDto>(API_ENDPOINTS.USERS.CURRENT_LOGGED_USER
  //     // , { headers: {'Authorization': `Bearer ${token}`}}
  //   )
  //     .pipe(
  //       tap((result: any) => {
  //         console.log('SERWIS: Odpowiedź serwera:', result);
  //         this.localStorage?.setItem('userId', result.userId);
  //       })
  //       , catchError((error) => {
  //         console.error('SERWIS: Pełny błąd:', error);
  //         console.error('SERWIS: Status błędu:', error.status);
  //         console.error('SERWIS: Nagłówki błędu:', error.headers);
  //         console.error('SERWIS: Ciało błędu:', error.error);
  //         return observableThrowError(() => error);
  //       })
  //     );
  // }

  getDetailsOfTheLoggedUser(): Observable<CurrentUserDetailsDto> {
    return this.http.get<CurrentUserDetailsDto>(API_ENDPOINTS.USERS.CURRENT_LOGGED_USER);
  }

  changeUserInformation(userData: ChangeUserInformationCommand) {
    return this.http.put<any>(`${API_ENDPOINTS.USERS.BASE}`, userData);
  }

  isLoggedIn(): boolean {
    const token = this.localStorage?.getItem('token');

    if (!token) {
      this.resetAuthState();
      return false;
    }

    const isNotExpired = !this.jwtHelper.isTokenExpired(token);
    if (isNotExpired) {
      this.updateAuthState(token);
    } else {
      this.resetAuthState();
    }

    return isNotExpired;
  }

  // isLoggedIn(): boolean {
  //   const jwtHelper = new JwtHelperService();
  //   const localStorage = this.document.defaultView?.localStorage;
  //   const token = localStorage?.getItem('token');
  //
  //   console.log('isLoggedIn - wywołana');
  //   console.log('isLoggedIn - token:', token);
  //
  //   if (!token) {
  //     console.log('isLoggedIn - brak tokenu');
  //     this.isAuthenticatedSubject.next(false);
  //     return false;
  //   }
  //
  //   const isNotExpired = !jwtHelper.isTokenExpired(token);
  //   console.log('Token ważność:', isNotExpired);
  //   this.isAuthenticatedSubject.next(isNotExpired);
  //   return isNotExpired;
  // }

  getAuthState(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(API_ENDPOINTS.USERS.BASE);
  }

  async signOut() {
    this.localStorage?.removeItem('token');
    // this.localStorage?.removeItem('userId');
    this.isAuthenticatedSubject.next(false);
  }

  async getAuthToken() {
    return this.localStorage?.getItem('token');
  }
}
