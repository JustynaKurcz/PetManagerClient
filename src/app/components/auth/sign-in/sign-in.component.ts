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

    constructor(public usersService: UsersService, private router: Router) {
    }

    signIn() {
        return this.usersService
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
