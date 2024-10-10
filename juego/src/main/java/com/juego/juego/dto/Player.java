package com.juego.juego.dto;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Player {
    private String id;
    private String name;
    private List<Card> hand;
}
