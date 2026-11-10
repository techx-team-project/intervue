package com.techx.intervue.modules.ads.requests;

import jakarta.validation.constraints.Size;

public record ReviewAdCreativeRequest(@Size(max = 500) String rejectionReason) {}
