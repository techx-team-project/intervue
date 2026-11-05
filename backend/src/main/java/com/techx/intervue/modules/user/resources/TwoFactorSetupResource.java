package com.techx.intervue.modules.user.resources;

import java.util.List;

public record TwoFactorSetupResource(
        String secret, String totpUri, String qrCodeDataUrl, List<String> backupCodes) {}
