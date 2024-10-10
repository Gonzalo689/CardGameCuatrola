export interface Card {
    numero: string;    
    suit: 'oros' | 'copas' | 'espadas' | 'bastos' | 'joker';  
    image: string;
    valor: number;
}