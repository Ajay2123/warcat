import { Component, OnInit, Input } from '@angular/core';
import { ChatMessage } from 'src/app/models/chat-message.model';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
    @Input() chatMessage: ChatMessage;
    userEmail: string;
    messageContent: string;
    timeStamp: string;
    ownEmail: string;
    isOwnMessage: boolean;
    constructor(private authService: AuthService) {
        this.authService.authUser().subscribe(user => {
            this.ownEmail = user.email;
            this.isOwnMessage = (this.ownEmail === this.userEmail);
        });
    }

    ngOnInit(chatMessage = this.chatMessage) {

        const bytes = CryptoJS.AES.decrypt(chatMessage.message, environment.encryptionKey);
        this.messageContent = bytes.toString(CryptoJS.enc.Utf8);
        this.timeStamp = chatMessage.timeSent.split(' ')[1];
        this.userEmail = chatMessage.email;
    }

}
