import { Routes } from '@angular/router';
import { SignupComponent } from './app/components/signup/signup.component';
import { LoginComponent } from './app/components/login/login.component';
import { ChatRoomComponent } from './app/components/chat-room/chat-room.component';

export const appRoutes: Routes = [
    { path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent },
    { path: 'chat', component: ChatRoomComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];
