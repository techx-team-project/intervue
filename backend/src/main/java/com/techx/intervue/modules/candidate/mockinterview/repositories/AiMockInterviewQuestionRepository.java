package com.techx.intervue.modules.candidate.mockinterview.repositories;

import com.techx.intervue.modules.candidate.mockinterview.entities.AiMockInterviewQuestion;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AiMockInterviewQuestionRepository
        extends JpaRepository<AiMockInterviewQuestion, Long> {

    List<AiMockInterviewQuestion> findAllByMockInterviewIdOrderByQuestionOrderAsc(
            Long mockInterviewId);
}
