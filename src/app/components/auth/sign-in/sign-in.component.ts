import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {MatIconModule} from '@angular/material/icon';
import {UsersService} from "../../../services/users/users.service";
import {HttpClientModule} from "@angular/common/http";

@Component({
    selector: 'app-sign-in',
    standalone: true,
    imports: [
        FormsModule,
        RouterLink,
        MatIconModule,
        HttpClientModule
    ],
    providers: [UsersService],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.css'
})
export class SignInComponent {
    public SignInCommand = {
        email: '',
        password: ''
    };

    hidePassword: boolean = true;
    loginError: boolean = false;

    togglePasswordVisibility(): void {
        this.hidePassword = !this.hidePassword;
    }

    constructor(public usersService: UsersService, private router: Router) {
    }

    signIn() {
        return this.usersService
            .signIn(this.SignInCommand)
            .subscribe((result) => {
                if (result) {
                    this.router.navigate(['/']);
                } else {
                    this.SignInCommand = {
                        email: '',
                        password: ''
                    };
                    this.loginError = true;
                }
            })
    }
}
