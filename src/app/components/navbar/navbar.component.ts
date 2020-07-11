import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    username: string;
    constructor(private authService: AuthService, private chatService: ChatService) { }

    ngOnInit() {
        const timeOut = setInterval(() => {
            this.username = this.chatService.getCurrentUserName();
            if (this.username !== undefined || this.username !== null) { clearTimeout(timeOut); }
        }, 500);

    }
    logout() {
        this.authService.logout();
    }
}
