package com.techx.intervue.modules.company.requests;

import java.time.Instant;

public record ApproveDocumentRequest(Instant expiresAt) {}
