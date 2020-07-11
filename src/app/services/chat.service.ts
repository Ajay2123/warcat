import { Injectable, ɵConsole } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireAction, AngularFireList } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import * as CryptoJS from 'crypto-js';

import { ChatMessage } from '../models/chat-message.model';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    user: any;
    username: Observable<string>;
    chatMessage: ChatMessage;
    currentUserName: string;
    constructor(private af: AngularFireDatabase, private afAuth: AngularFireAuth, private authService: AuthService) {
        this.afAuth.authState.subscribe(auth => {
            if (auth !== undefined && auth !== null) {
                this.user = auth;
            }
            this.getUser()
                .valueChanges()
                .subscribe((x: any) => {
                    this.currentUserName = x.username;
                });
        });
    }

    getUsers() {
        return this.af.list('user', ref => ref.orderByKey().limitToLast(10)).valueChanges();
    }

    getUser() {
        const userId = this.user.uid;
        const path = `/user/${userId}`;
        return this.af.object(path);
    }

    getCurrentUserName(): string {
        return this.currentUserName;
    }

    getMessages() {
        return this.af.list('messages', ref => ref.orderByKey().limitToLast(10)).valueChanges();
    }

    sendMessage(msg: string) {
        if (this.isValidMsg(msg)) {
            const timeStamp = this.getTimeStamp();
            const userEmail = this.user.email;
            const ciphertext = CryptoJS.AES.encrypt(msg, environment.encryptionKey).toString();
            console.log(ciphertext);
            this.chatMessage = {
                email: userEmail,
                username: this.currentUserName,
                message: ciphertext,
                timeSent: timeStamp,
            };
            const messagesRef = this.af.list('messages');
            messagesRef.push(this.chatMessage);
        }
    }

    isValidMsg(msg: string) {
        return (msg !== undefined && msg !== null && msg !== '' && msg !== ' ') ? true : false;
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
