package com.juego.juego.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

import jakarta.annotation.Nullable;

@Data
@AllArgsConstructor
public class Game {
    private String id;
    private List<Player> players;
    private Integer necesaryPlayers;
    private Boolean roundReset;
    private Boolean ended;
    private Integer round;
    private List<Card> cards;
    private Card cardBack;
    private List<Card> midCards;
    private @Nullable Card pinte;
    private @Nullable Player whoWin;
}
