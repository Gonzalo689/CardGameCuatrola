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
  // ally: string = 'none';
  enemys: string[] = [];

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
        this.getPlayer(this.game!);// obtiene el player actual con todas sus actualizaciones
      }
    });

  }

  useCard(){
    if(this.yourTurn()){
      alert('Is your turn!');
    }else{
      alert('is not your turn!');
    }
    this.gameService.sendGameUpdate(this.game!);  
  }
  yourTurn(){
    return this.playerID === this.game!.round.toString();
  }
  asignedTeams(){
    switch (this.playerID) {
      case '0':
        this.game!.players[0].ally = this.game!.players[2];
        // this.ally = this.game!.players[2].name;
        this.enemys = [this.game!.players[1].name, this.game!.players[3].name];
        break;
      case '1':
        this.game!.players[1].ally = this.game!.players[3];
        // this.ally = this.game!.players[3].name;
        this.enemys = [this.game!.players[2].name, this.game!.players[0].name];
        break;
      case '2':
        this.game!.players[2].ally = this.game!.players[0];
        // this.ally = this.game!.players[0].name;
        this.enemys = [this.game!.players[3].name, this.game!.players[1].name];
        break;
      case '3':
        this.game!.players[3].ally = this.game!.players[1];
        // this.ally = this.game!.players[1].name;
        this.enemys = [this.game!.players[0].name, this.game!.players[2].name];
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
      this.cardsBackList = this.gameService.getCardsBack();  // recarga las 5 cardBack
      this.asignedTeams();
      this.dealCards(this.game!.cards!);
      this.game!.ended = false;
      this.game!.round = 1;
      this.gameService.sendGameUpdate(this.game!);  
    }
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
