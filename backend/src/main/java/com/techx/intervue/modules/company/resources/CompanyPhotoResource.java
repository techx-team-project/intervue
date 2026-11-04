package com.techx.intervue.modules.company.resources;

import lombok.Builder;

@Builder
public record CompanyPhotoResource(Long id, String url, int sortOrder) {}
