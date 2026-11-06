package com.techx.intervue.modules.job.resources;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record PublicJobCompanyResource(Long id, String name, String logoUrl, String address) {}
