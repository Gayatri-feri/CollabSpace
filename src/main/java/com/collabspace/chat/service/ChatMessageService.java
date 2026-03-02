package com.collabspace.chat.service;

import com.collabspace.chat.dto.WebSocketChatMessage;
import com.collabspace.chat.entity.ChatMessage;
import com.collabspace.chat.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;

    @Transactional
    public ChatMessage saveMessage(WebSocketChatMessage messageDTO) {
        ChatMessage message = ChatMessage.builder()
                .sender(messageDTO.getSender())
                .receiver(messageDTO.getReceiver())
                .chatRoomId(messageDTO.getChatRoomId())
                .content(messageDTO.getContent())
                .type(ChatMessage.MessageType.CHAT)
                .timestamp(LocalDateTime.now())
                .build();
        
        ChatMessage saved = chatMessageRepository.save(message);
        log.info("Message saved: id={}, from={}, to={}", saved.getId(), saved.getSender(), 
                saved.getReceiver() != null ? saved.getReceiver() : "group:" + saved.getChatRoomId());
        return saved;
    }

    @Transactional
    public ChatMessage saveSystemMessage(String content, String chatRoomId, ChatMessage.MessageType type) {
        ChatMessage message = ChatMessage.builder()
                .sender("SYSTEM")
                .chatRoomId(chatRoomId)
                .content(content)
                .type(type)
                .timestamp(LocalDateTime.now())
                .build();
        
        return chatMessageRepository.save(message);
    }

    @Transactional(readOnly = true)
    public List<WebSocketChatMessage> getPrivateChatHistory(String user1, String user2, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        Page<ChatMessage> messages = chatMessageRepository.findPrivateMessagesBetweenUsers(user1, user2, pageable);
        
        return messages.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<WebSocketChatMessage> getChatRoomHistory(String chatRoomId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        Page<ChatMessage> messages = chatMessageRepository.findByChatRoomIdOrderByTimestampDesc(chatRoomId, pageable);
        
        return messages.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<WebSocketChatMessage> getRecentMessagesForUser(String username, int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by("timestamp").descending());
        Page<ChatMessage> messages = chatMessageRepository.findRecentMessagesForUser(username, pageable);
        
        return messages.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadMessageCount(String username) {
        return chatMessageRepository.countUnreadMessagesForUser(username);
    }

    @Transactional
    public void markMessagesAsRead(String chatRoomId, String username) {
        chatMessageRepository.markMessagesAsRead(chatRoomId, username);
    }

    @Transactional
    public void deleteMessage(Long messageId, String requestingUser) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        
        if (!message.getSender().equals(requestingUser)) {
            throw new RuntimeException("You can only delete your own messages");
        }
        
        chatMessageRepository.delete(message);
        log.info("Message deleted: id={} by user={}", messageId, requestingUser);
    }

    private WebSocketChatMessage convertToDTO(ChatMessage message) {
        return WebSocketChatMessage.builder()
                .id(message.getId())
                .sender(message.getSender())
                .receiver(message.getReceiver())
                .chatRoomId(message.getChatRoomId())
                .content(message.getContent())
                .type(message.getType().name())
                .timestamp(message.getTimestamp())
                .build();
    }
}
