import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    isError = false;
    errorMsg: any;
    constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) { }

    ngOnInit() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required]],
            password: ['', [Validators.required]],
        });
    }
    submit() {
        const em = this.loginForm.get('email').value;
        const pwd = this.loginForm.get('password').value;

        this.authService.login(em, pwd)
            .catch(x => {
                this.errorMsg = x.message;
                this.isError = true;
            });

    }

}
