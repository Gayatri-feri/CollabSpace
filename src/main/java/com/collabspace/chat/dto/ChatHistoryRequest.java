package com.collabspace.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatHistoryRequest {
    private String chatRoomId;
    private String otherUser;
    private LocalDateTime since;
    private Integer page;
    private Integer size;
}
