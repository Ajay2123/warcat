import { Injectable, ɵConsole } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireAction, AngularFireList } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import * as CryptoJS from 'crypto-js';

import { ChatMessage } from '../models/chat-message.model';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    user: any;
    username: Observable<string>;
    chatMessage: ChatMessage;
    currentUserName: Subject<string> = new Subject<string>();
    allChatRooms: string[];
    currentChatRoomId: Subject<string> = new Subject<string>();
    allUsers: Subject<User[]> = new Subject<User[]>();
    currentChatRoomName: Subject<string> = new Subject<string>();

    constructor(private af: AngularFireDatabase, private afAuth: AngularFireAuth, private authService: AuthService) {
        this.afAuth.authState.subscribe(auth => {
            if (auth !== undefined && auth !== null) {
                this.user = auth;
            }
            const userDetails = this.getUser();
            if (userDetails !== null) {
                userDetails.valueChanges()
                    .subscribe((x: any) => {
                        this.currentUserName.next(x.username);
                    });
            }

            this.getAllAllowedChatRooms(this.user.uid)
                .subscribe((cids: string[]) =>
                    this.allChatRooms = cids);

            this.getUsers();
        });
    }
    authUser() {
        return this.user;
    }
    getAllUsers() {
        return this.af.object('/user');
    }
    getUsers() {
        this.af.list('user', ref => ref.orderByKey().limitToLast(10))
            .valueChanges()
            .subscribe((userlist: any) =>
                this.allUsers.next(
                    userlist.filter(
                        (user: any) =>
                            user.uid !== this.user.uid)));
    }

    getUser() {
        if (this.user && this.user.uid) {
            const userId = this.user.uid;
            const path = `/user/${userId}`;
            return this.af.object(path);
        }
        return null;
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

    setCurrentChatRoom(cid) {
        this.currentChatRoomId.next(cid);
    }

    getAllChatRooms() {
        return this.allChatRooms;
    }

    getChatRoomId(selectedUserId) {
        return (this.user.uid > selectedUserId) ?
            this.user.uid + selectedUserId
            : selectedUserId + this.user.uid;
    }

    setCurrentChatRoomName(chatRoomName: string) {
        this.currentChatRoomName.next(chatRoomName);
    }

    createChatRoom(selectedUserId) {
        const roomName = this.getChatRoomId(selectedUserId);
        const roomRef = this.af.list(`chatRooms/${roomName}/members`);
        roomRef.push(selectedUserId);
        roomRef.push(this.user.uid);
        return roomName;
    }

    private getAllAllowedChatRooms(uid) {
        if (uid) {
            const path = `/user/${uid}/allowedChatRooms`;
            return this.af.list(path)
                .valueChanges();
        }
    }
    /*     updateChatRoomPermissions(selectedUserId, chatRoomId) {
            const userList = [this.user.uid, selectedUserId];
            userList.forEach(userID => {
                this.getAllAllowedChatRooms(userID)
                    .subscribe(allowedID => {
                        const permitted = allowedID.filter(id => {
                            return id === chatRoomId
                        });
                    });
            });
        } */
    getMessages(chatRoomId) {
        return this.af.list(`chatRooms/${chatRoomId}/messages`,
            ref => ref.orderByKey()
                .limitToLast(10))
            .valueChanges();
    }

    sendMessage(chatRoomId, message) {
        if (this.isValidMsg(message)) {
            const timeStamp = this.getTimeStamp();
            const userEmail = this.user.email;
            const ciphertext = CryptoJS.AES.encrypt(message, environment.encryptionKey).toString();
            console.log(ciphertext);
            this.chatMessage = {
                email: userEmail,
                message: ciphertext,
                timeSent: timeStamp,
            };
            this.af.list(`chatRooms/${chatRoomId}/messages`)
                .push(this.chatMessage);
        }
    }

    getLastMessage(chatRoomId) {
        return this.af.list(`chatRooms/${chatRoomId}/messages`, ref => ref.limitToLast(1));
    }

}
