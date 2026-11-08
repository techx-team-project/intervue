package com.techx.intervue.modules.job.events;

public record JobPublishedEvent(Long jobId, Long companyId, String jobTitle, String companyName) {}
