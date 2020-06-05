package com.daniel.websocketchat.client;

import com.daniel.websocketchat.model.ChatMessage;
import com.daniel.websocketchat.model.MessageType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandler;

import java.lang.reflect.Type;
import java.util.Calendar;

@Slf4j
public class MyStompSessionHandler implements StompSessionHandler {
    @Override
    public void afterConnected(StompSession session, StompHeaders connectedHeaders) {
        log.info("New session established: " + session.getSessionId());
        session.subscribe("/topic/public", this);
        log.info("Subscribed to /topic/messages");
        session.send("/app/chat.send", ChatMessage.builder()
                                        .sender("Dandeco")
                                        .content("Teste")
                                        .type(MessageType.CHAT)
                                        .time(Calendar.getInstance().getTime().toString()).build());
        log.info("Message sent to websocket server");
    }

    @Override
    public void handleException(StompSession stompSession, StompCommand stompCommand, StompHeaders stompHeaders, byte[] bytes, Throwable exception) {
        log.error("Got an exception", exception);
    }

    @Override
    public void handleTransportError(StompSession stompSession, Throwable throwable) {

    }

    @Override
    public Type getPayloadType(StompHeaders stompHeaders) {
        return ChatMessage.class;
    }

    @Override
    public void handleFrame(StompHeaders stompHeaders, Object payload) {
        ChatMessage msg = (ChatMessage) payload;
        log.info("Received: " + msg.getContent() + " from: " + msg.getSender());
    }
}
