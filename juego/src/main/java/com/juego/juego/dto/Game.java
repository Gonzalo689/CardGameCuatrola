package com.juego.juego.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class Game {
    private String id;
    private List<Player> players;
    private Integer necesaryPlayers;
    private Boolean started;
    private Boolean ended;
    private Integer round;
    private List<Card> cards;
    private Card cardBack;
}
