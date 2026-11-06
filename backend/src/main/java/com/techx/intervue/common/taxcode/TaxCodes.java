package com.techx.intervue.common.taxcode;

public final class TaxCodes {

    private static final int REGISTRY_CODE_LENGTH = 10;

    private TaxCodes() {}

    public static String normalize(String taxCode) {
        return taxCode.replaceAll("[\\s-]", "");
    }

    public static String registryCode(String taxCode) {
        String normalized = normalize(taxCode);
        return normalized.substring(0, Math.min(REGISTRY_CODE_LENGTH, normalized.length()));
    }
}
