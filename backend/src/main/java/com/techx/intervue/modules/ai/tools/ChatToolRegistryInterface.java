package com.techx.intervue.modules.ai.tools;

import java.util.Collection;
import java.util.Optional;

public interface ChatToolRegistryInterface {

    void register(ChatTool tool);

    Optional<ChatTool> find(String name);

    Collection<ChatTool> getAll();
}
