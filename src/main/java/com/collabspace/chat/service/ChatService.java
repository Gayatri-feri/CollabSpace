package com.collabspace.chat.service;

import com.collabspace.chat.dto.WebSocketChatMessage;
import com.collabspace.chat.entity.ChatMessage;
import com.collabspace.chat.entity.ChatRoom;
import com.collabspace.chat.repository.ChatMessageRepository;
import com.collabspace.chat.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service class for handling chat-related business logic.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;

    /**
     * Save a chat message to the database.
     */
    @Transactional
    public ChatMessage saveMessage(WebSocketChatMessage message) {
        ChatMessage entity = message.toEntity();
        entity.setTimestamp(LocalDateTime.now());

        ChatMessage saved = chatMessageRepository.save(entity);
        log.info("Message saved with ID: {}", saved.getId());

        // Update room's last message time if it's a group message
        if (message.getChatRoomId() != null) {
            updateRoomLastMessageTime(message.getChatRoomId());
        }

        return saved;
    }

    /**
     * Get conversation history between two users.
     */
    @Transactional(readOnly = true)
    public List<WebSocketChatMessage> getConversationHistory(String user1, String user2) {
        List<ChatMessage> messages = chatMessageRepository.findConversationBetweenUsers(user1, user2);
        return messages.stream()
                .map(WebSocketChatMessage::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get chat history for a specific room.
     */
    @Transactional(readOnly = true)
    public List<WebSocketChatMessage> getRoomHistory(String roomId) {
        List<ChatMessage> messages = chatMessageRepository
                .findByChatRoomIdAndTypeOrderByTimestampAsc(roomId, ChatMessage.MessageType.CHAT);
        return messages.stream()
                .map(WebSocketChatMessage::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Create a new chat room.
     */
    @Transactional
    public ChatRoom createChatRoom(String name, String description, String createdBy) {
        String roomId = UUID.randomUUID().toString();

        ChatRoom room = ChatRoom.builder()
                .roomId(roomId)
                .name(name)
                .description(description)
                .createdBy(createdBy)
                .build();

        // Add creator as member
        room.getMembers().add(createdBy);

        ChatRoom saved = chatRoomRepository.save(room);
        log.info("Chat room created: {} with ID: {}", name, roomId);

        return saved;
    }

    /**
     * Add a member to a chat room.
     */
    @Transactional
    public void addMemberToRoom(String roomId, String username) {
        Optional<ChatRoom> roomOpt = chatRoomRepository.findByRoomId(roomId);
        if (roomOpt.isPresent()) {
            ChatRoom room = roomOpt.get();
            room.getMembers().add(username);
            chatRoomRepository.save(room);
            log.info("User {} added to room {}", username, roomId);
        }
    }

    /**
     * Remove a member from a chat room.
     */
    @Transactional
    public void removeMemberFromRoom(String roomId, String username) {
        Optional<ChatRoom> roomOpt = chatRoomRepository.findByRoomId(roomId);
        if (roomOpt.isPresent()) {
            ChatRoom room = roomOpt.get();
            room.getMembers().remove(username);
            chatRoomRepository.save(room);
            log.info("User {} removed from room {}", username, roomId);
        }
    }

    /**
     * Get all rooms where user is a member.
     */
    @Transactional(readOnly = true)
    public List<ChatRoom> getUserRooms(String username) {
        return chatRoomRepository.findByMemberOrderByLastMessageAtDesc(username);
    }

    /**
     * Find room by ID.
     */
    @Transactional(readOnly = true)
    public Optional<ChatRoom> findRoomById(String roomId) {
        return chatRoomRepository.findByRoomId(roomId);
    }

    /**
     * Update room's last message timestamp.
     */
    private void updateRoomLastMessageTime(String roomId) {
        Optional<ChatRoom> roomOpt = chatRoomRepository.findByRoomId(roomId);
        if (roomOpt.isPresent()) {
            ChatRoom room = roomOpt.get();
            room.setLastMessageAt(LocalDateTime.now());
            chatRoomRepository.save(room);
        }
    }
}
