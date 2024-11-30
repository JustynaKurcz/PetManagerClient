import {Inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DOCUMENT} from "@angular/common";
import {map} from "rxjs";
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

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document) {
  }

  signIn(signInData
         :
         SignInCommand
  ) {
    const localStorage = this.document.defaultView?.localStorage;

    return this.http.post<SignInResponse>(API_ENDPOINTS.USERS.SIGN_IN, signInData).pipe(
      map((result) => {
        if (result && result.token) {
          localStorage?.setItem('token', result.token);
          return true;
        }
        return false;
      })
    )
  }

  signUp(signUpData
         :
         SignUpCommand
  ) {
    return this.http.post<SignUpResponse>(API_ENDPOINTS.USERS.SIGN_UP, signUpData);
  }

  getDetailsOfTheLoggedUser() {
    return this.http.get<CurrentUserDetailsDto>(API_ENDPOINTS.USERS.CURRENT_LOGGED_USER);
  }

  changeUserInformation(userData
                        :
                        ChangeUserInformationCommand
  ) {
    return this.http.put<any>(`${API_ENDPOINTS.USERS.BASE}`, userData);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    const jwtHelper = new JwtHelperService();

    return !jwtHelper.isTokenExpired(token);
  }
}
