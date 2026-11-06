package com.techx.intervue.modules.ai.tools;

import java.util.Collection;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

@Component
public class ChatToolRegistry implements ChatToolRegistryInterface {

    private final Map<String, ChatTool> registry = new ConcurrentHashMap<>();

    @Override
    public void register(ChatTool tool) {
        if (tool != null && tool.getName() != null) {
            registry.put(tool.getName(), tool);
        }
    }

    @Override
    public Optional<ChatTool> find(String name) {
        if (name == null) {
            return Optional.empty();
        }
        return Optional.ofNullable(registry.get(name));
    }

    @Override
    public Collection<ChatTool> getAll() {
        return registry.values();
    }
}
