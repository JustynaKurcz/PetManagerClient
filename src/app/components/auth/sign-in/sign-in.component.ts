import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {AuthService} from "../../../services/auth/auth.service";
import {HttpClientModule} from "@angular/common/http";

@Component({
    selector: 'app-sign-in',
    standalone: true,
    imports: [
        FormsModule,
        RouterLink,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        HttpClientModule
    ],
    providers: [AuthService],
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
    public credentials = {
        email: '',
        password: ''
    };

    public logged?: boolean;
    public logout?: boolean;
    hidePassword: boolean = true;

    togglePasswordVisibility(): void {
        this.hidePassword = !this.hidePassword;
    }

    constructor(public authService: AuthService, private router: Router) {
    }

    signIn() {
        return this.authService
            .signIn(this.credentials)
            .subscribe((result) => {
                if (!result) {
                    this.logged = false
                } else {
                    this.logout = false
                    this.credentials = {
                        email: '',
                        password: ''
                    }
                    this.router.navigate(['/'])
                }
            })
    }
}
