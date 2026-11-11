package com.techx.intervue.modules.candidate.mockinterview.entities;

import com.techx.intervue.common.entities.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "ai_mock_interview_questions")
public class AiMockInterviewQuestion extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mock_interview_id", nullable = false)
    private AiMockInterview mockInterview;

    @Column(name = "question_order", nullable = false)
    private Integer questionOrder;

    @Column(name = "category", nullable = false, length = 50)
    private String category;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "candidate_answer", columnDefinition = "TEXT")
    private String candidateAnswer;

    @Column(name = "answered_at")
    private Instant answeredAt;

    @Column(name = "follow_up_question", columnDefinition = "TEXT")
    private String followUpQuestion;

    @Column(name = "follow_up_answer", columnDefinition = "TEXT")
    private String followUpAnswer;

    @Column(name = "follow_up_answered_at")
    private Instant followUpAnsweredAt;

    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "score")
    private Integer score;

    @Column(name = "ideal_answer", columnDefinition = "TEXT")
    private String idealAnswer;
}
