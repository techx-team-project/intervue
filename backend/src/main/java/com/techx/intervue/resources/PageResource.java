package com.techx.intervue.resources;

import java.util.List;
import org.springframework.data.domain.Page;

public record PageResource<T>(List<T> items, int page, int size, long totalItems, int totalPages) {

    public static <T> PageResource<T> of(Page<T> page) {
        return new PageResource<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages());
    }
}
