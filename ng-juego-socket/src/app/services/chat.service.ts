import { Injectable } from '@angular/core';
import{Stomp} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from '../models/chat-message';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private stompClient:any;
  private messageSubject:BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]); 

  constructor() {
    this.initStompClient();
   }

  initStompClient() {
    const url = '//localhost:3000/chat-socket';

    const socket = new SockJS(url);

    this.stompClient = Stomp.over(socket);
    
  }

  joinRoom(roomID: string) {
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe(`/topic/${roomID}`, (message:any) => {
        const messageConverted = JSON.parse(message.body); // Convertir el objeto JSON en un objeto de tipo ChatMessage y deverian ser todos los mensajes de una base de datos
        console.log(messageConverted);
        const currentMessages = this.messageSubject.getValue();
        currentMessages.push(messageConverted);
        
        this.messageSubject.next(currentMessages);
      });
    });
  }

  sendMessage(roomID: string, message: ChatMessage) {
    this.stompClient.send(`/app/chat/${roomID}`, {}, JSON.stringify(message));
  }

  getMessagesSubject() {
    return this.messageSubject.asObservable();
  }
}
