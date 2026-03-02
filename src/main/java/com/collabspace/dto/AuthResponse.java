package com.collabspace.dto;

import com.collabspace.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String refreshToken;
    private String type;
    private Long id;
    private String name;
    private String email;
    private Role role;
    private String message;
}
