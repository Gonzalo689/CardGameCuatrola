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
  enemys: User[] = [];
  midCards: Card[] = [];
  pinte: Card | null = null;


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
      if(this.game?.players.length === 4 ) {
        this.resetGame();
        this.asignedTeams();  // por ahora solo es esta inecesaria si hay mas hacer otra subcrición
        this.pinte = this.game!.pinte;
        this.getPlayer(this.game!);
        this.midCards= this.game!.midCards;

        setTimeout(() => {
          this.deleteElement();
        }, 5000);
        // setTimeout(() => {
        //   this.createElement();
        // }, 10000);
        this.winnerRound();
      }

    });

  }

  useCard(card: Card) {
    if(this.yourTurn()){
      const playerIndex: number = parseInt(this.playerID, 10);
      this.game?.midCards.push(card);
      this.game!.players[playerIndex].hand = this.game!.players[playerIndex].hand.filter((c) => c !== card);
    }else{
      alert('is not your turn!');
    }
    this.gameService.sendGameUpdate(this.game!);  
  }
  yourTurn(){
    const playerIndex: number = parseInt(this.game!.whoWin!.id, 10);
    const thisPlayerIndex: number = parseInt(this.playerID, 10);
    return thisPlayerIndex === (playerIndex + this.game!.midCards.length) % 4;
  }

  // TODO Calcular el jugador que gana la ronda mediante la mejor carta
  winnerRound(){
    if(this.game!.midCards.length === 4){
      var betterCard : Card = this.game!.midCards[0];
      var index = 0;
      for (let i = 1; i < this.game!.midCards.length; i++) {
        var card = this.game!.midCards[i];
        betterCard = this.compareCard(card, betterCard);
        if(betterCard === card){
          index = i;
        }
        
      }
      const whoWinIndex: number = parseInt(this.game!.whoWin!.id, 10);
      this.game!.whoWin = this.game!.players[( whoWinIndex + index ) % 4]; // mal y es difisi
      this.game!.midCards = [];
      
      
      this.gameService.sendGameUpdate(this.game!); 
      
      
    }
  }
  
  compareCard(card: Card, card2: Card): Card  {
    if (card.suit === this.game!.pinte!.suit && card2.suit !== this.game!.pinte!.suit ){
      return card;
    } 
    if (card.suit !== this.game!.pinte!.suit && card2.suit === this.game!.pinte!.suit ){
      return card2;
    }  
    if (card.suit === this.game!.midCards[0].suit && card2.suit !== this.game!.midCards[0].suit ){
      return card;
    } 
    if (card.suit !== this.game!.midCards[0].suit && card2.suit === this.game!.midCards[0].suit ){
      return card2;
    }    
    
    if (card.valor < card2.valor) {
      return card2;
    }
    return card;
    
  }


  deleteElement(){
    const elemento = document.getElementById('pinte');
    if (elemento) {
        elemento.remove();
    }
  }
  
  createElement() {
    
    const img = document.createElement('img');
    img.src = this.game!.pinte!.image; 
    img.classList.add('carta');
    img.id = 'pinte';
  
    
    const elemento = document.getElementById('midCards');
    if (elemento) {
      elemento.appendChild(img);
    }

  }
  asignedTeams(){
    const playerIndex: number = parseInt(this.playerID, 10);
    switch (playerIndex) {
      case 0:
        this.game!.players[playerIndex].ally = this.game!.players[2];
        this.enemys = [this.game!.players[1], this.game!.players[3]];
        break;
      case 1:
        this.game!.players[playerIndex].ally = this.game!.players[3];
        this.enemys = [this.game!.players[2], this.game!.players[0]];
        break;
      case 2:
        this.game!.players[playerIndex].ally = this.game!.players[0];
        this.enemys = [this.game!.players[3], this.game!.players[1]];
        break;
      case 3:
        this.game!.players[playerIndex].ally = this.game!.players[1];
        this.enemys = [this.game!.players[0], this.game!.players[2]];
        break;
    }
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
    this.player = {id : this.playerID, name: this.nameInput, hand: [], ally: null, scoreCard: [], score: 0};
    this.game.players.push(this.player);
    
    this.gameService.sendGameUpdate(this.game!);  
    this.visibilityStarted = true;
  }

  resetGame(): void {
    if(this.game!.ended === true){
      this.dealCards(this.game!.cards!);
      this.game!.ended = false;
      this.getPinte();
      this.game!.whoWin = this.game!.players[(this.game!.round) % 4]
      this.game!.midCards = [];
      this.gameService.sendGameUpdate(this.game!);  
    }
  }
  getPinte(): void {
    this.game!.pinte = this.game!.players[(this.game!.round+3) % 4].hand[4];
  }

  

 
  dealCards(Cards: Card[]): void { 
    var cardsTotals = this.gameService.shuffleDeck(Cards); 
    let cardIndex = 0; // Índice para llevar el control de las cartas repartidas

    this.player
    this.game!.players.forEach((player) => {
      player.hand = cardsTotals.slice(cardIndex, cardIndex + 5); 
      cardIndex += 5; 
    });
  }
  getPlayer(game: Game) {
    game.players.forEach((player) => {
      if(player.id === this.playerID) {
        this.player = player;
        return
      }
    })
  }
  ngOnDestroy(): void {
    this.gameService.disconnect();
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe(); // Desuscribirse para evitar fugas de memoria
    }
  }
  
}
