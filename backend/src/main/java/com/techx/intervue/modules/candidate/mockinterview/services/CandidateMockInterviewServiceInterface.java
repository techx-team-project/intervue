package com.techx.intervue.modules.candidate.mockinterview.services;

import com.techx.intervue.modules.candidate.mockinterview.requests.StartMockInterviewRequest;
import com.techx.intervue.modules.candidate.mockinterview.requests.SubmitMockAnswerRequest;
import com.techx.intervue.modules.candidate.mockinterview.requests.SubmitMockFollowUpRequest;
import com.techx.intervue.modules.candidate.mockinterview.resources.MockInterviewDetailResource;
import com.techx.intervue.modules.candidate.mockinterview.resources.MockInterviewSummaryResource;
import com.techx.intervue.modules.candidate.mockinterview.resources.SubmitAnswerResultResource;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface CandidateMockInterviewServiceInterface {

    MockInterviewDetailResource startSession(
            Long candidateId, StartMockInterviewRequest request, MultipartFile cvFile, String ip);

    List<MockInterviewSummaryResource> listHistory(Long candidateId);

    MockInterviewDetailResource getSessionDetail(Long candidateId, Long sessionId);

    SubmitAnswerResultResource submitAnswer(
            Long candidateId,
            Long sessionId,
            Long questionId,
            SubmitMockAnswerRequest request,
            String ip);

    SubmitAnswerResultResource submitFollowUp(
            Long candidateId,
            Long sessionId,
            Long questionId,
            SubmitMockFollowUpRequest request,
            String ip);
}
