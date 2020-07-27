import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { ChatService } from 'src/app/services/chat.service';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
    usersList: User[];
    constructor(private chatService: ChatService) {
        this.chatService.allUsers.subscribe(x => this.usersList = x);
    }
    ngOnInit() {
    }
    private getValidChatRoomId(selectedUserId) {
        let chatRoomId = this.chatService
            .getAllChatRooms()
            .find((cid: string) =>
                cid === this.chatService.getChatRoomId(selectedUserId)
            );

        if (!chatRoomId) {
            chatRoomId = this.chatService.createChatRoom(selectedUserId);
        }
        return chatRoomId;
    }
    setChatRoomId(selectedUserId, selectedUserName) {
        this.chatService.setCurrentChatRoomName(selectedUserName);
        this.chatService.setCurrentChatRoom(this.getValidChatRoomId(selectedUserId));
    }
}
