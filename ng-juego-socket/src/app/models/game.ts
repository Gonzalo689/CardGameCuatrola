import { Card } from "./card";
import { User } from "./user";

export interface Game {
    id: string;
    players: User[];
    necesaryPlayers: number;
    roundReset: boolean;
    ended: boolean;
    round: number;
    cards: Card[];
    cardBack: Card;
    midCards: Card[];
    pinte : Card | null;
    whoWin : User | null;
}