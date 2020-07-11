import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterContentChecked, AfterViewChecked } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import { ChatMessage } from 'src/app/models/chat-message.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-chat-feed',
    templateUrl: './chat-feed.component.html',
    styleUrls: ['./chat-feed.component.scss']
})
export class ChatFeedComponent implements OnInit, AfterViewChecked {
    feed: Observable<ChatMessage[]>;
    @ViewChild('scroller', { static: false }) private feedContainer: ElementRef;
    constructor(private chat: ChatService, private authService: AuthService) {
        this.feed = this.chat.getMessages();
    }

    ngOnInit() {
    }
    ngAfterViewChecked() {
        this.scrollToBottom();
    }
    scrollToBottom() {
        try {
            this.feedContainer.nativeElement.scrollTop =
                this.feedContainer.nativeElement.scrollHeight;
        } catch (e) { console.log(e); }
    }

}
