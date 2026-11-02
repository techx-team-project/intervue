package com.techx.intervue.modules.ai.services.interfaces;

import com.techx.intervue.modules.ai.resources.PromptTemplate;

public interface PromptServiceInterface {

    PromptTemplate load(String name, int version);
}
