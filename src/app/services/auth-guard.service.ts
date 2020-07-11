// src/app/auth/auth-guard.service.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { ChatService } from './chat.service';
@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(public authService: AuthService, private chatService: ChatService, public router: Router) { }
    canActivate(): boolean {
        const currentUser = this.authService.currentUserId;
        if (currentUser) {
            // authorised so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login']);
        return false;
    }
}