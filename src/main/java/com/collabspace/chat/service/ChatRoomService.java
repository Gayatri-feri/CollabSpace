package com.collabspace.chat.service;

import com.collabspace.chat.entity.ChatRoom;
import com.collabspace.chat.repository.ChatRoomRepository;
import com.collabspace.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    @Transactional
    public ChatRoom createRoom(String name, String description, String createdBy) {
        ChatRoom room = ChatRoom.builder()
                .name(name)
                .description(description)
                .createdBy(createdBy)
                .build();
        
        ChatRoom saved = chatRoomRepository.save(room);
        log.info("Chat room created: {} by {}", name, createdBy);
        return saved;
    }

    @Transactional(readOnly = true)
    public List<ChatRoom> getAllRooms() {
        return chatRoomRepository.findAll();
    }

    @Transactional(readOnly = true)
    public ChatRoom getRoomById(String roomId) {
        return chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat room not found: " + roomId));
    }

    @Transactional(readOnly = true)
    public List<ChatRoom> searchRooms(String query) {
        return chatRoomRepository.findByNameContainingIgnoreCase(query);
    }

    @Transactional
    public void addMemberToRoom(String roomId, String username) {
        ChatRoom room = getRoomById(roomId);
        room.getMembers().add(username);
        chatRoomRepository.save(room);
        log.info("User {} added to room {}", username, roomId);
    }

    @Transactional
    public void removeMemberFromRoom(String roomId, String username) {
        ChatRoom room = getRoomById(roomId);
        room.getMembers().remove(username);
        chatRoomRepository.save(room);
        log.info("User {} removed from room {}", username, roomId);
    }

    @Transactional(readOnly = true)
    public Set<String> getRoomMembers(String roomId) {
        ChatRoom room = getRoomById(roomId);
        return room.getMembers();
    }

    @Transactional(readOnly = true)
    public boolean isUserInRoom(String roomId, String username) {
        ChatRoom room = getRoomById(roomId);
        return room.getMembers().contains(username);
    }

    @Transactional
    public void deleteRoom(String roomId, String requestingUser) {
        ChatRoom room = getRoomById(roomId);
        
        if (!room.getCreatedBy().equals(requestingUser)) {
            throw new RuntimeException("Only the room creator can delete the room");
        }
        
        chatRoomRepository.delete(room);
        log.info("Chat room deleted: {} by {}", roomId, requestingUser);
    }
}
