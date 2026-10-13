package com.techx.intervue.modules.user.entities;

import com.techx.intervue.modules.user.enums.RoleType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RoleType name = RoleType.CANDIDATE;

    private String description;

    @Column(name = "is_system", nullable = false)
    @Builder.Default
    private boolean isSystem = false;
}
