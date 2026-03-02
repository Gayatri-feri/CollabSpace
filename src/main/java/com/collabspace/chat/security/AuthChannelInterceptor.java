package com.collabspace.chat.security;

import com.collabspace.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import java.util.Collections;

/**
 * Channel interceptor for authenticating WebSocket connections using JWT.
 * Validates JWT token during WebSocket handshake and STOMP CONNECT.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AuthChannelInterceptor implements ChannelInterceptor {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    /**
     * Intercept messages to validate JWT token on CONNECT command.
     */
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            // Extract token from header
            String authHeader = accessor.getFirstNativeHeader(AUTHORIZATION_HEADER);

            if (authHeader != null && authHeader.startsWith(BEARER_PREFIX)) {
                String jwt = authHeader.substring(BEARER_PREFIX.length());

                try {
                    // Extract username from token
                    String username = jwtUtil.extractUsername(jwt);

                    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        // Load user details
                        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                        // Validate token
                        if (jwtUtil.validateToken(jwt, userDetails)) {
                            // Create authentication token
                            UsernamePasswordAuthenticationToken authentication =
                                    new UsernamePasswordAuthenticationToken(
                                            userDetails,
                                            null,
                                            userDetails.getAuthorities()
                                    );

                            // Set authentication in accessor
                            accessor.setUser(authentication);
                            log.info("WebSocket authenticated for user: {}", username);
                        } else {
                            log.error("Invalid JWT token for WebSocket connection");
                            throw new RuntimeException("Invalid JWT token");
                        }
                    }
                } catch (Exception e) {
                    log.error("JWT validation failed: {}", e.getMessage());
                    throw new RuntimeException("JWT validation failed: " + e.getMessage());
                }
            } else {
                log.error("No valid Authorization header found in WebSocket connection");
                throw new RuntimeException("Authorization header required");
            }
        }

        return message;
    }
}
