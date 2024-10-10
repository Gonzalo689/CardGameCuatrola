import {Component, Input, OnInit, OnChanges } from '@angular/core';
import {Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { GameService } from '../../services/game.service';
import { Game } from '../../models/game';
import { Card } from '../../models/card';
import { PlayComponent } from "../play/play.component";
import { User } from '../../models/user';
import {Subscription } from 'rxjs';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [PlayComponent,PlayComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})



export class GameComponent implements OnInit, OnChanges {
  @Input() roomID: string = '';
  nameInput: string = '';
  game: Game | null = null;
  visibilityStarted: boolean = false;
  player: User | null = null;
  playerID: string = '';
  cardsBackList: Card[] = [];

  private gameSubscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private dataService: DataService, 
    private gameService: GameService, 
    ) { }

  ngOnChanges(): void {
    console.log('El estado del juego ha cambiado:', this.game);
  }
  ngOnInit(): void {
    this.nameInput = this.dataService.getData();
    if (this.nameInput === '') { // poner que si son mas de 4 se vuelva al inicio y se desconecte
      this.router.navigate(['']);
      
    }
  
    this.gameService.joinRoom(this.roomID)!;
    console.log('Room ID:', this.roomID);
    console.log('Name Input:', this.nameInput);
    
    this.gameSubscription = this.gameService.gameUpdates$.subscribe(updatedGame => {

      this.game = updatedGame;
      console.log('Game updated:', this.game); 
      if(this.game?.players.length === 4) {
        this.getPlayer(this.game!);
      }
    });

  }


  sendUpdatetoStart(): void {
    if(this.game!.cards!.length <= 1) {
      this.game?.cards.push(...this.gameService.loadCards());
    }
    
    if (this.game === null  || this.game === undefined) {
      console.log('Error: Game not found');
      return;
    }
    this.playerID = this.game.players.length.toString();
    this.player = {id : this.playerID, name: this.nameInput, hand: []};
    this.game.players.push(this.player);
    this.resetGame();
    this.gameService.sendGameUpdate(this.game!);  
    this.visibilityStarted = true;
  }
  resetGame(): void {
    if(this.game!.players.length === 4) {
      this.game!.started = true;
      this.dealCards(this.game!.cards!);
    }
  }
  ngOnDestroy(): void {
    this.gameService.disconnect();
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe(); // Desuscribirse para evitar fugas de memoria
    }
  }
  getPlayer(game: Game) {
    game.players.forEach((player) => {
      if(player.id === this.playerID) {
        this.player = player;
        return
      }
    })
  }

  dealCards(Cards: Card[]): void { 
    var cardsTotals = this.gameService.shuffleDeck(Cards); 
    let cardIndex = 0; // Índice para llevar el control de las cartas repartidas

    this.player
    this.game!.players.forEach((player) => {
      player.hand = cardsTotals.slice(cardIndex, cardIndex + 5); 
      cardIndex += 5; 
    });

    this.cardsBackList = this.gameService.getCardsBack(); // cargar una lista de cartas para que no se vea visualmente y usarla mas adelante

  }
  
}
