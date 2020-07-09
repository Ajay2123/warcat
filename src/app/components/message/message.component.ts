import { Component, OnInit, Input } from '@angular/core';
import { ChatMessage } from 'src/app/models/chat-message.model';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
    @Input() chatMessage: ChatMessage;
    userEmail: string;
    userName: string;
    messageContent: string;
    timeStamp: string;
    constructor() { }

    ngOnInit(chatMessage = this.chatMessage) {
        this.userName = chatMessage.userName;
        this.userEmail = chatMessage.email;
        this.messageContent = chatMessage.message;
        this.timeStamp = chatMessage.timeSent.split(' ')[1];
    }

}
