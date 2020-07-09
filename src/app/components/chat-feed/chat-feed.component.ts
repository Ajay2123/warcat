import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import { ChatMessage } from 'src/app/models/chat-message.model';

@Component({
    selector: 'app-chat-feed',
    templateUrl: './chat-feed.component.html',
    styleUrls: ['./chat-feed.component.scss']
})
export class ChatFeedComponent implements OnInit {
    feed: Observable<ChatMessage[]>;
    constructor(private chat: ChatService) {
        this.feed = this.chat.getMessages();
    }

    ngOnInit() {
    }

}
