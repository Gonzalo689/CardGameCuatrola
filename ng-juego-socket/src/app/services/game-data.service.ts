import { Injectable } from '@angular/core';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class GameDataService {
  // Ahora almacenamos múltiples juegos en un array
  private games: Game[] = [];

  constructor() { }

  // Obtener todos los juegos
  getGames(): Game[] {
    return this.games;
  }

  // Obtener un juego específico por su id
  getGameById(id: string): Game | undefined {
    return this.games.find(game => game.id === id);
  }

  // Crear un nuevo juego y añadirlo al array de juegos
  createGame(newGame: Game) {
    this.games.push(newGame);
  }


  // Actualizar un juego específico
  updateGame(id: string, updatedGame: Game): boolean {
    const index = this.games.findIndex(game => game.id === id);
    if (index !== -1) {
      this.games[index] = updatedGame;
      return true;
    }
    return false;
  }
  existsGame(id: string): boolean {
    return this.games.some(game => game.id === id);
  }

  // Eliminar un juego específico
  deleteGame(id: string): boolean {
    const index = this.games.findIndex(game => game.id === id);
    if (index !== -1) {
      this.games.splice(index, 1);
      return true;
    }
    return false;
  }
}

