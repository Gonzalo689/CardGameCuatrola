import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../models/chat-message';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {

  messageInput: string = '';
  userId: string = '';
  mensajesList: any[] = [];


  constructor(private chatService: ChatService, private router: ActivatedRoute) {
    
  }
  ngOnInit(): void {
    this.userId = this.router.snapshot.params['userID'];
    console.log(this.userId);
    this.chatService.joinRoom('ABC');
    this.lisenerMessages();
  }

  sendMessage() {
    const chatMessage = {
      message: this.messageInput,
      user: this.userId
    }as ChatMessage;
    this.chatService.sendMessage('ABC', chatMessage);

    this.messageInput = '';
  }
  
  lisenerMessages() {
    this.chatService.getMessagesSubject().subscribe((message: any) => {
      console.log(message);
      // this.mensajesList = message;
      this.mensajesList = message.map((item: any)=> ({
        ...item,
        message_side: item.user === this.userId ? 'sender': 'receiver'
      }))


    });
  }
}
