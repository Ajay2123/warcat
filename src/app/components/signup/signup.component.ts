import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    signupForm: FormGroup;
    errorMsg: any;
    constructor(private fb: FormBuilder, private authService: AuthService, private route: Router) { }
    isError = false;
    ngOnInit() {
        this.signupForm = this.fb.group({
            email: ['', [Validators.required]],
            password: ['', [Validators.required]],
            username: ['', [Validators.required]],
        });
    }
    submit() {
        const un = this.signupForm.get('username').value;
        const em = this.signupForm.get('email').value;
        const pwd = this.signupForm.get('password').value;

        this.authService.createUser(un, em, pwd)
            .then(x => this.route.navigate(['chat']))
            .catch(x => {
                this.errorMsg = x.message;
                this.isError = true;
            });
    }

}
