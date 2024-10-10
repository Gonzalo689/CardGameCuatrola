import { Component, OnInit  } from '@angular/core';
import { GameComponent } from '../game/game.component';

import { Card } from '../../models/card';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [GameComponent],
  templateUrl: './play.component.html',
  styleUrl: './play.component.css'
})
export class PlayComponent implements OnInit {

  cards: Card[] = [];
  cardBack: Card | null = null;
  name: string[] = [];
  urlBackground: string = 'image/background.jpg';

  ngOnInit(): void {
    this.cards = this.loadCards();
    this.cardBack = {numero: 'B', suit: 'joker', image: `image/back.png`, valor: -1}
    this.name.push('Bastos', 'Copas', 'Espadas', 'Oros');
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
      // cards.push({numero: i.toString(), suit: 'bastos', image: `image/bastos_${i}.png`, valor: valorr});
      // cards.push({numero: i.toString(), suit: 'copas', image: `image/copas_${i}.png`, valor: valorr});
      // cards.push({numero: i.toString(), suit: 'oros', image: `image/oros_${i}.png`, valor: valorr});
    }
    
    
    return cards;
  }

}


