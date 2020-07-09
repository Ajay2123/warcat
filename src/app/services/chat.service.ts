import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireAction, AngularFireList } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

import { ChatMessage } from '../models/chat-message.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    user: any;
    userName: Observable<string>;
    chatMessage: ChatMessage;
    chatMessages: any = null;


    constructor(private af: AngularFireDatabase,) {
        /*      this.afAuth.authState.subscribe(auth => {
                 if (auth !== undefined && auth !== null) {
                     this.user = auth;
                 }
             }); */
    }

    getMessages() {
        return this.af.list('/messages');
    }
    sendMessage(msg: string) {
        const timeStamp = this.getTimeStamp();
        //const userEmail = this.user.email;
        this.chatMessages = this.getMessages();
        this.chatMessage = {
            email: 'ajay',
            userName: 'ajay',
            message: msg,
            timeSent: timeStamp,
        };
        console.log(this.chatMessage);
        this.chatMessages.push(this.chatMessage);
    }

    getTimeStamp() {
        const now = new Date();
        const date = now.getUTCFullYear() + '/' +
            (now.getUTCMonth() + 1) + '/' +
            now.getUTCDate();
        const time = now.getUTCHours() + ':' +
            now.getUTCMinutes() + ':' +
            now.getUTCSeconds();
        return (date + ' ' + time);
    }


}
/* , ref =>
            ref.orderByKey().equalTo(25) */