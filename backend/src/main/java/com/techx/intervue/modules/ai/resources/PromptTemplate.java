package com.techx.intervue.modules.ai.resources;

public record PromptTemplate(String id, int version, String text) {

    public PromptTemplate withPreamble(PromptTemplate preamble) {
        return new PromptTemplate(id, version, preamble.text() + "\n\n" + text);
    }
}
