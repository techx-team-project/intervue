package com.techx.intervue.common.persistence;

public final class SpecificationSupport {

    private static final String ESCAPE = "\\";

    private SpecificationSupport() {}

    public static String containsPattern(String keyword) {
        String escaped =
                keyword.trim()
                        .toLowerCase()
                        .replace(ESCAPE, ESCAPE + ESCAPE)
                        .replace("%", ESCAPE + "%")
                        .replace("_", ESCAPE + "_");
        return "%" + escaped + "%";
    }
}
