import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { User } from '../models/user';
import { Game } from '../models/game';
import { GameDataService } from './game-data.service';
import { Card } from '../models/card';
import {BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private stompClient: any;
  private roomID: string | null = null;
  private game: Game | null = null;
  private cardsBackList: Card[] = [];
  private gameSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public gameUpdates$: Observable<any> = this.gameSubject.asObservable();

  
   


  constructor(private gameData: GameDataService) {
    // Initialize the Stomp client
    this.initStompClient();
   }

  initStompClient() {
    const url = '//localhost:3000/game-socket';
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);
    
  }
  joinRoom(roomID: string) {
    this.roomID = roomID; // Store the roomID
    this.stompClient.connect({}, () => {
        console.log(`Connected to game room: ${roomID}`);
        this.subscribeToGameUpdates(roomID); 
        this.getGameServer(); 
    }, (error: any) => {
        console.error('Error connecting to WebSocket:', error);
        alert('Unable to connect to the server. Please try again later.'); // Notify the user
        this.disconnect();
        this.joinRoom(roomID); // Retry
    });
  } 


  private subscribeToGameUpdates(roomID: string) {
    this.stompClient.subscribe(`/topicc/${roomID}`, (message: any) => {
      const parsedMessage = JSON.parse(message.body); 
      this.game = parsedMessage;
      this.gameSubject.next(this.game!);

    });
  }
  getGameServer() {
    this.stompClient.subscribe(`/topicc/get/${this.roomID}`, (message: any) => {
      const parsedMessage = JSON.parse(message.body); 
      this.game = parsedMessage;
      this.gameSubject.next(this.game!);
    });
    const cardBack={numero: 'B', suit: 'joker', image: `image/back.png`, valor: -1};
    this.stompClient.send(`/app/game/get/${this.roomID}`, {}, JSON.stringify(cardBack));
  }

  sendGameUpdate(game: Game) {
    if (!this.stompClient || !this.stompClient.connected) {
      console.log('Not connected to WebSocket');
      this.disconnect();
      this.joinRoom(this.roomID!);
      return;
    }

    console.log('Sending game update:', game);
    this.stompClient.send(`/app/game/${this.roomID}`, {}, JSON.stringify(game));
    console.log('Message sent to the server:', game); 
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        console.log('Disconnected from WebSocket');
        
      });
    }
    
    window.location.reload();
  }
  loadCards(): Card[] {
    var valorr = 0;
    const cards: Card[] = [];
    for (let i = 10; i < 15; i++) {
      switch (i) {
        case 10:
          valorr = 2;
          break;
        case 11:
          valorr = 3;
          break;
        case 12:
          valorr = 4;
          break;
        case 13:
          valorr = 10;
          break;
        case 14:
          valorr = 11;
          break;
      }
      console.log(valorr);
      cards.push({numero: i.toString(), suit: 'espadas', image: `image/espadas_${i}.png`, valor: valorr});
      cards.push({numero: i.toString(), suit: 'bastos', image: `image/bastos_${i}.png`, valor: valorr});
      cards.push({numero: i.toString(), suit: 'copas', image: `image/copas_${i}.png`, valor: valorr});
      cards.push({numero: i.toString(), suit: 'oros', image: `image/oros_${i}.png`, valor: valorr});
    }
    
    
    return cards;
  }
  shuffleDeck(deck: Card[]): Card[] {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]]; // Intercambiar cartas
    }
    console.log("Deck shuffled:", deck);
    return deck;
  }

  getCardsBack(): Card[] {
    const card = this.game!.cardBack;
    console.log("Card back:", card);
    for (let i = 0; i < 5; i++) {
      this.cardsBackList.push(card!);
    }
    console.log("Card back list:", this.cardsBackList);
    return this.cardsBackList;
  }

  
}
