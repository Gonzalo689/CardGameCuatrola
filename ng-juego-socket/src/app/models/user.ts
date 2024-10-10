import { Card } from "./card";

export interface User {
    id: string;
    name: string;
    hand: Card[];
}