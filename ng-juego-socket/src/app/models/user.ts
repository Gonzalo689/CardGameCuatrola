import { Card } from "./card";

export interface User {
    id: string;
    name: string;
    hand: Card[];
    ally: null | User;
    scoreCard: Card[];
    score: number;
}