package com.techx.intervue.modules.ai.services.interfaces;

import com.techx.intervue.modules.ai.resources.KnowledgeMatch;
import java.util.List;

public interface KnowledgeBaseServiceInterface {

    int indexAll(boolean forceReindex);

    List<KnowledgeMatch> retrieve(String query, int topK, double minScore);

    void reloadIntoMemory();
}
