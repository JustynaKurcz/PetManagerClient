import {Inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DOCUMENT} from "@angular/common";
import {map} from "rxjs";
import {Token} from "@angular/compiler";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'http://localhost:5062/api/v1/users';

  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document) {
  }

  signUp(credentials: any) {
    return this.http.post(`${this.url}/sign-up`, {
      email: credentials.email,
      password: credentials.password
    });
  }

  signIn(credentials: any) {
    const localStorage = this.document.defaultView?.localStorage;
    return this.http.post(`${this.url}/sign-in`, {
      email: credentials.email,
      password: credentials.password
    }).pipe(
      map((result: Token | any) => {
        if (result && result.token) {
          localStorage?.setItem('token', result.token);
          return true;
        }
        return false;
      })
    )
  }

  getDetailsOfTheLoggedUser() {
    return this.http.get(`${this.url}`);
  }

}
