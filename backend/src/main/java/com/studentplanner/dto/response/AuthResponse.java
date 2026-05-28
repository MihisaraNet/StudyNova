package com.studentplanner.dto.response;

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
    private String type;
    private String id;
    private String name;
    private String email;
    private String role;

    public static AuthResponse of(String token, String id, String name, String email, String role) {
        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(id)
                .name(name)
                .email(email)
                .role(role)
                .build();
    }
}
