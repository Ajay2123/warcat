import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChatService } from 'src/app/services/chat.service';
@Component({
    selector: 'app-chat-form',
    templateUrl: './chat-form.component.html',
    styleUrls: ['./chat-form.component.scss']
})
export class ChatFormComponent implements OnInit {
    chatForm: FormGroup;
    chatRoomId: string;
    user: any;
    constructor(private fb: FormBuilder, private chatService: ChatService) {
        this.user = this.chatService.authUser();
        this.chatService.currentChatRoomId.subscribe(id => {
            this.chatRoomId = id;
        });
    }

    ngOnInit() {
        this.chatForm = this.fb.group({
            message: ['', [Validators.required]],
        });
    }

    handleSubmit(e) {
        if (e.key === 'Enter') { this.submit(); }
    }

    getMessage() {
        return this.chatForm.get('message').value;
    }

    submit() {
        this.chatService.sendMessage(this.chatRoomId, this.getMessage());
        this.chatForm.reset();
    }

}
