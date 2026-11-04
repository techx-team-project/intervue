package com.techx.intervue.modules.user.mappers;

import com.techx.intervue.modules.user.entities.User;
import com.techx.intervue.modules.user.resources.UserResource;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResource toResource(User user) {
        return UserResource.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .phone(user.getPhone())
                .status(user.getStatus())
                .emailVerified(user.isEmailVerified())
                .phoneVerified(user.getPhoneVerifiedAt() != null)
                .roles(user.activeRoleTypes())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
