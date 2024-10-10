package com.juego.juego.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class Card {
    private String numero;
    private String suit;
    private String image;
    private int valor;
    
}
