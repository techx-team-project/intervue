package com.techx.intervue.modules.user.mappers;

import com.techx.intervue.modules.user.entities.User;
import com.techx.intervue.modules.user.entities.UserRestriction;
import com.techx.intervue.modules.user.resources.AdminUserDetailResource;
import com.techx.intervue.modules.user.resources.AdminUserListResource;
import com.techx.intervue.modules.user.resources.AdminUserRestrictionResource;
import com.techx.intervue.modules.user.resources.AdminUserRoleGrantResource;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class AdminUserMapper {

    public AdminUserListResource toListResource(
            User user, long activeSessionCount, UserRestriction restriction) {
        return AdminUserListResource.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .image(user.getImage())
                .status(user.getStatus())
                .emailVerifiedAt(user.getEmailVerifiedAt())
                .roles(toRoleResources(user))
                .activeSessionCount(activeSessionCount)
                .createdAt(user.getCreatedAt())
                .lastSignInAt(user.getLastLoginAt())
                .restriction(toRestrictionResource(restriction))
                .build();
    }

    public AdminUserDetailResource toDetailResource(
            User user, long activeSessionCount, UserRestriction restriction) {
        return AdminUserDetailResource.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .image(user.getImage())
                .address(user.getAddress())
                .status(user.getStatus())
                .emailVerifiedAt(user.getEmailVerifiedAt())
                .termsAcceptedAt(user.getTermsAcceptedAt())
                .roles(toRoleResources(user))
                .activeSessionCount(activeSessionCount)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .lastSignInAt(user.getLastLoginAt())
                .restriction(toRestrictionResource(restriction))
                .build();
    }

    private List<AdminUserRoleGrantResource> toRoleResources(User user) {
        return user.getUserRoles().stream()
                .map(
                        grant ->
                                new AdminUserRoleGrantResource(
                                        grant.getRole().getName(),
                                        grant.getGrantedAt(),
                                        grant.getGrantedBy() == null
                                                ? null
                                                : grant.getGrantedBy().getName(),
                                        grant.getExpiresAt()))
                .sorted(Comparator.comparing(resource -> resource.role().name()))
                .toList();
    }

    private AdminUserRestrictionResource toRestrictionResource(UserRestriction restriction) {
        if (restriction == null) {
            return null;
        }
        return new AdminUserRestrictionResource(
                restriction.getKind(),
                restriction.getReason(),
                restriction.getDetail(),
                restriction.getCreatedAt(),
                restriction.getCreatedBy() == null ? null : restriction.getCreatedBy().getName(),
                restriction.getExpiresAt());
    }
}
