package com.daniel.websocketchat.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {
    private MessageType type;

    private String content;

    private String sender;

    private String time;

    private String color;
}
