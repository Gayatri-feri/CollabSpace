package com.collabspace.chat.repository;

import com.collabspace.chat.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for ChatRoom entity.
 */
@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    /**
     * Find chat room by unique room ID
     */
    Optional<ChatRoom> findByRoomId(String roomId);

    /**
     * Find all chat rooms where user is a member
     */
    @Query("SELECT cr FROM ChatRoom cr WHERE :username MEMBER OF cr.members ORDER BY cr.lastMessageAt DESC")
    List<ChatRoom> findByMemberOrderByLastMessageAtDesc(@Param("username") String username);

    /**
     * Check if chat room exists with given room ID
     */
    boolean existsByRoomId(String roomId);

    /**
     * Find all chat rooms created by a user
     */
    List<ChatRoom> findByCreatedByOrderByCreatedAtDesc(String createdBy);

    /**
     * Search chat rooms by name
     */
    List<ChatRoom> findByNameContainingIgnoreCase(String name);
}
