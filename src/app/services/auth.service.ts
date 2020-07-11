import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { resolve } from 'url';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private user: Observable<firebase.User>;
    private authState: any;
    constructor(private router: Router,
        private aDB: AngularFireDatabase,
        private aFAuth: AngularFireAuth,
    ) {
        this.user = this.aFAuth.authState;
    }
    get currentUserId(): string {
        return (this.authState === null || this.authState === undefined) ? false : this.authState.user.uid;
    }

    authUser() {
        return this.user;
    }
    logout() {
        // this.updateStatus(false);
        this.aFAuth.auth.signOut();
        this.router.navigate(['login']);
    }
    login(em, pwd) {
        return new Promise((res, rej) => {
            this.aFAuth.auth.signInWithEmailAndPassword(em, pwd)
                .then(user => {
                    this.authState = user;
                    this.updateStatus(true);
                    setTimeout(() => {
                        this.router.navigate(['chat']);
                        res();
                    }, 1500);
                }).catch(err => { rej(err); });
        });
    }
    createUser(un: string, em: string, pwd: string) {
        return new Promise((res, rej) => {
            this.aFAuth.auth.createUserWithEmailAndPassword(em, pwd)
                .then(user => {
                    console.log(user);
                    this.authState = user;
                    this.updateUserName(em, un);
                    this.updateStatus(true);
                    res();
                })
                .catch(error => rej(error));
        });
    }
    updateUserName(em: string, un: string) {
        const userDbPath = `user/${this.currentUserId}`;
        const data = {
            email: em,
            username: un
        };
        this.aDB.object(userDbPath)
            .update(data)
            .catch(e => console.log(e));

    }
    updateStatus(_status: boolean) {
        const userDbPath = `user/${this.currentUserId}`;
        const data = {
            status: _status
        };
        this.aDB.object(userDbPath)
            .update(data)
            .catch(e => console.log(e));
    }
}
