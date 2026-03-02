package com.collabspace.chat.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrivateMessageRequest {
    
    @NotBlank(message = "Receiver username is required")
    private String receiver;
    
    @NotBlank(message = "Message content is required")
    private String content;
}
