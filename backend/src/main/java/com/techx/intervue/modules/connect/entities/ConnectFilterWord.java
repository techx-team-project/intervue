package com.techx.intervue.modules.connect.entities;

import com.techx.intervue.common.entities.BaseEntity;
import com.techx.intervue.modules.connect.enums.ConnectFilterSeverity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "connect_filter_words")
public class ConnectFilterWord extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String pattern;

    @Column(name = "is_regex", nullable = false)
    private boolean regex;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private ConnectFilterSeverity severity;

    @Column(name = "is_active", nullable = false)
    private boolean active;

    private String note;
}
