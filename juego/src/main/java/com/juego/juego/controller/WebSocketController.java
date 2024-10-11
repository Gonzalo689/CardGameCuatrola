package com.juego.juego.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.juego.juego.dto.Card;
import com.juego.juego.dto.ChatMessage;
import com.juego.juego.dto.Game;

import java.util.ArrayList;
import java.util.List;

@Controller
public class WebSocketController {
    private List<Game> games= new ArrayList();

    @MessageMapping("/chat/{roomID}")
    @SendTo("/topic/{roomID}")
    public ChatMessage chat(@DestinationVariable String roomID, ChatMessage message) {
        System.out.println("Message received: " + message);
        return new ChatMessage( message.getMessage(), message.getUser() );
    }

    @MessageMapping("/game/{roomID}")
    @SendTo("/topicc/{roomID}")
    public Game game(@DestinationVariable String roomID, Game game) {
        System.out.println("Message received: " + game);
        for (int i = 0; i < games.size(); i++) {
            if (game.getId().equals(roomID)) {
                games.set(i, game);
            }
        }
        return game ;
    }

    @MessageMapping("/game/get/{roomID}")
    @SendTo("/topicc/get/{roomID}")
    public Game getGame(@DestinationVariable String roomID, Card card) {
        Card c = new Card(card.getNumero(), card.getSuit(), card.getImage(), card.getValor());
        System.out.println("Message received: " + card);
        for (Game game : games ) {
            if (game.getId().equals(roomID)) {
                return game;
            }
        }
        Game newGame = new Game(roomID, new ArrayList(), 4, false, true, 0, new ArrayList(), c );
        games.add(newGame);
        return newGame;
        
    }


    
}
