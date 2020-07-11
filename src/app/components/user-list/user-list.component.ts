import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Observable } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
    usersList: Observable<User[]>;
    constructor(private chat: ChatService) {
        this.usersList = this.chat.getUsers();
    }
    ngOnInit() {
    }

}
