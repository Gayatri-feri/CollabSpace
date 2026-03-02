package com.collabspace.chat.repository;

import com.collabspace.chat.entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for ChatMessage entity.
 */
@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    /**
     * Find messages between two users (one-to-one chat history) with pagination
     */
    @Query("SELECT m FROM ChatMessage m WHERE " +
           "((m.sender = :user1 AND m.receiver = :user2) OR " +
           "(m.sender = :user2 AND m.receiver = :user1)) " +
           "AND m.type = 'CHAT'")
    Page<ChatMessage> findPrivateMessagesBetweenUsers(
            @Param("user1") String user1,
            @Param("user2") String user2,
            Pageable pageable
    );

    /**
     * Find messages in a chat room (group chat history) with pagination
     */
    Page<ChatMessage> findByChatRoomIdOrderByTimestampDesc(String chatRoomId, Pageable pageable);

    /**
     * Find recent messages for a user (both sent and received) with pagination
     */
    @Query("SELECT m FROM ChatMessage m WHERE " +
           "(m.sender = :username OR m.receiver = :username) " +
           "AND m.type = 'CHAT'")
    Page<ChatMessage> findRecentMessagesForUser(@Param("username") String username, Pageable pageable);

    /**
     * Find last message in a chat room
     */
    ChatMessage findFirstByChatRoomIdOrderByTimestampDesc(String chatRoomId);

    /**
     * Count unread messages for a user
     */
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE " +
           "m.receiver = :username AND m.read = false")
    long countUnreadMessagesForUser(@Param("username") String username);

    /**
     * Mark messages as read in a chat room for a user
     */
    @Modifying
    @Query("UPDATE ChatMessage m SET m.read = true WHERE " +
           "m.chatRoomId = :chatRoomId AND m.receiver = :username AND m.read = false")
    void markMessagesAsRead(@Param("chatRoomId") String chatRoomId, @Param("username") String username);

    /**
     * Find messages in a chat room (group chat history)
     */
    List<ChatMessage> findByChatRoomIdAndTypeOrderByTimestampAsc(String chatRoomId, ChatMessage.MessageType type);

    /**
     * Find recent messages for a user (both sent and received)
     */
    @Query("SELECT m FROM ChatMessage m WHERE " +
           "(m.sender = :username OR m.receiver = :username) " +
           "AND m.type = 'CHAT' " +
           "ORDER BY m.timestamp DESC")
    List<ChatMessage> findRecentMessagesForUser(@Param("username") String username);
}
