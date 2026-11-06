package com.techx.intervue.modules.content.resources;

public record BlogCategoryResource(
        Long id,
        String slug,
        String name,
        String description,
        String iconName,
        String accentColor,
        String bannerGradient,
        Integer displayOrder,
        Long articleCount) {}
