package com.juego.juego.dto;
import java.util.List;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Player {
    private String id;
    private String name;
    private List<Card> hand;
    private @Nullable Player ally;
    private List<Card> scoreCards;
    private Integer score;
}
