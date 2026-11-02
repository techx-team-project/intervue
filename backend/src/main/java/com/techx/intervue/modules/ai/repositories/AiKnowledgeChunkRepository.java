package com.techx.intervue.modules.ai.repositories;

import com.techx.intervue.modules.ai.entities.AiKnowledgeChunk;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AiKnowledgeChunkRepository extends JpaRepository<AiKnowledgeChunk, Long> {

    List<AiKnowledgeChunk> findByDocumentName(String documentName);

    void deleteByDocumentName(String documentName);
}
