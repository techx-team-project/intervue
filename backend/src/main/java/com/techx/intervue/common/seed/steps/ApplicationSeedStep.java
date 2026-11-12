package com.techx.intervue.common.seed.steps;

import com.techx.intervue.common.seed.DemoSeedData;
import com.techx.intervue.common.seed.DemoSeedData.OwnerAccount;
import com.techx.intervue.common.seed.DemoSeedData.ScreeningQuestion;
import com.techx.intervue.common.seed.DemoSeedStep;
import com.techx.intervue.common.seed.IdSequence;
import com.techx.intervue.common.seed.SeedDatabase;
import com.techx.intervue.common.seed.SeedLookups;
import com.techx.intervue.common.seed.SeedLookups.SeedJob;
import com.techx.intervue.common.seed.SeedLookups.SeedUser;
import com.techx.intervue.common.seed.SeedRandom;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@Profile("local")
@Order(5)
@RequiredArgsConstructor
public class ApplicationSeedStep implements DemoSeedStep {

    private static final List<String> APPLICATION_COLUMNS =
            List.of(
                    "id",
                    "job_id",
                    "candidate_id",
                    "company_id",
                    "candidate_name",
                    "candidate_email",
                    "job_title",
                    "company_name",
                    "status",
                    "cover_letter",
                    "cv_storage_public_id",
                    "cv_file_name",
                    "cv_content_type",
                    "cv_file_size_bytes",
                    "submitted_at",
                    "viewed_at",
                    "created_at",
                    "updated_at");

    private static final List<String> HISTORY_COLUMNS =
            List.of(
                    "id",
                    "application_id",
                    "from_status",
                    "to_status",
                    "actor_type",
                    "actor_id",
                    "note",
                    "created_at",
                    "updated_at");

    private static final List<String> ANSWER_COLUMNS =
            List.of(
                    "id",
                    "application_id",
                    "question_id",
                    "question_prompt",
                    "answer_text",
                    "created_at",
                    "updated_at");

    private static final List<String> NOTE_COLUMNS =
            List.of(
                    "id",
                    "application_id",
                    "author_id",
                    "author_name",
                    "content",
                    "created_at",
                    "updated_at");

    private static final List<String> INTERVIEW_COLUMNS =
            List.of(
                    "id",
                    "application_id",
                    "candidate_id",
                    "company_id",
                    "scheduled_by",
                    "starts_at",
                    "duration_minutes",
                    "format",
                    "location",
                    "note",
                    "status",
                    "proposed_starts_at",
                    "candidate_message",
                    "cancel_reason",
                    "reminder_24h_sent",
                    "reminder_1h_sent",
                    "created_at",
                    "updated_at");

    private static final Map<String, List<String>> PIPELINES = pipelines();
    private static final Map<String, Integer> STATUS_WEIGHTS = statusWeights();
    private static final Map<String, Integer> OPEN_INTERVIEW_WEIGHTS = openInterviewWeights();
    private static final List<String> OWNER_STATUSES =
            List.of(
                    "INTERVIEW",
                    "INTERVIEW",
                    "OFFER",
                    "IN_REVIEW",
                    "VIEWED",
                    "REJECTED",
                    "APPLIED",
                    "APPLIED");
    private static final List<String> APPLICABLE_JOB_STATUSES =
            List.of("PUBLISHED", "PAUSED", "CLOSED");
    private static final Set<String> INTERVIEWED_STATUSES = Set.of("INTERVIEW", "OFFER", "HIRED");
    private static final Set<String> NOTED_STATUSES =
            Set.of("IN_REVIEW", "INTERVIEW", "OFFER", "HIRED");
    private static final int MAX_CANDIDATES_PER_JOB = 6;

    private final SeedDatabase database;
    private final SeedLookups lookups;

    @Override
    public void seed() {
        if (!database.allEmpty("applications")) {
            return;
        }
        List<SeedJob> jobs = lookups.jobsWithStatus(APPLICABLE_JOB_STATUSES);
        List<SeedUser> verified = lookups.verifiedCandidates();
        if (jobs.isEmpty() || verified.isEmpty()) {
            return;
        }
        Batch batch = new Batch(new SeedRandom(DemoSeedData.RANDOM_SEED + 5), jobs);
        List<SeedJob> openJobs =
                jobs.stream().filter(job -> "PUBLISHED".equals(job.status())).toList();

        Set<String> ownerEmails =
                DemoSeedData.OWNERS.stream().map(OwnerAccount::email).collect(Collectors.toSet());
        for (SeedUser owner :
                verified.stream().filter(user -> ownerEmails.contains(user.email())).toList()) {
            List<SeedJob> picks = batch.random.sample(openJobs, OWNER_STATUSES.size());
            for (int index = 0; index < picks.size(); index++) {
                addApplication(batch, owner, picks.get(index), OWNER_STATUSES.get(index));
            }
        }
        for (SeedJob job : jobs) {
            int count = batch.random.between(0, MAX_CANDIDATES_PER_JOB);
            for (SeedUser candidate : batch.random.sample(verified, count)) {
                addApplication(batch, candidate, job, null);
            }
        }

        database.insert("applications", APPLICATION_COLUMNS, batch.applications);
        database.insert("application_status_history", HISTORY_COLUMNS, batch.history);
        database.insert("application_answers", ANSWER_COLUMNS, batch.answers);
        database.insert("application_notes", NOTE_COLUMNS, batch.notes);
        database.insert("interviews", INTERVIEW_COLUMNS, batch.interviews);
        log.info(
                "Seeded {} applications and {} interviews",
                batch.applications.size(),
                batch.interviews.size());
    }

    private void addApplication(Batch batch, SeedUser candidate, SeedJob job, String forcedStatus) {
        if (!batch.used.add(job.id() + ":" + candidate.id())) {
            return;
        }
        SeedRandom random = batch.random;
        String status = forcedStatus != null ? forcedStatus : statusFor(job, random);
        List<String> pipeline = PIPELINES.get(status);
        LocalDateTime submittedAt = random.ago(1, 30);
        long applicationId = batch.applicationIds.next();
        Resume resume = batch.resumes.get(candidate.id());

        LocalDateTime lastChange =
                addHistory(batch, applicationId, candidate, job, pipeline, submittedAt);
        batch.applications.add(
                new Object[] {
                    applicationId,
                    job.id(),
                    candidate.id(),
                    job.companyId(),
                    candidate.name(),
                    candidate.email(),
                    job.title(),
                    job.companyName(),
                    status,
                    random.chance(0.5) ? DemoSeedData.COVER_LETTER : null,
                    resume == null ? null : resume.storagePublicId(),
                    resume == null ? null : resume.fileName(),
                    resume == null ? null : resume.contentType(),
                    resume == null ? null : resume.fileSizeBytes(),
                    submittedAt,
                    pipeline.size() > 1 ? submittedAt.plusHours(8) : null,
                    submittedAt,
                    lastChange
                });
        addAnswers(batch, applicationId, job, submittedAt);
        if (NOTED_STATUSES.contains(status) && random.chance(0.4)) {
            batch.notes.add(
                    new Object[] {
                        batch.noteIds.next(),
                        applicationId,
                        job.recruiterId(),
                        job.recruiterName(),
                        random.pick(DemoSeedData.RECRUITER_NOTES),
                        lastChange,
                        lastChange
                    });
        }
        if (INTERVIEWED_STATUSES.contains(status)) {
            batch.interviews.add(
                    interviewRow(batch, applicationId, candidate, job, status, lastChange));
        }
    }

    private String statusFor(SeedJob job, SeedRandom random) {
        return "CLOSED".equals(job.status()) ? "JOB_CLOSED" : random.pickWeighted(STATUS_WEIGHTS);
    }

    private LocalDateTime addHistory(
            Batch batch,
            long applicationId,
            SeedUser candidate,
            SeedJob job,
            List<String> pipeline,
            LocalDateTime submittedAt) {
        String previous = null;
        LocalDateTime at = submittedAt;
        for (int step = 0; step < pipeline.size(); step++) {
            String name = pipeline.get(step);
            at = submittedAt.plusHours(step * 9L);
            String actorType = actorType(name);
            Long actorId =
                    switch (actorType) {
                        case "CANDIDATE" -> candidate.id();
                        case "RECRUITER" -> job.recruiterId();
                        default -> null;
                    };
            batch.history.add(
                    new Object[] {
                        batch.historyIds.next(),
                        applicationId,
                        previous,
                        name,
                        actorType,
                        actorId,
                        "INTERVIEW".equals(name) ? "Interview scheduled" : null,
                        at,
                        at
                    });
            previous = name;
        }
        return at;
    }

    private String actorType(String status) {
        if ("APPLIED".equals(status) || "WITHDRAWN".equals(status)) {
            return "CANDIDATE";
        }
        return "JOB_CLOSED".equals(status) ? "SYSTEM" : "RECRUITER";
    }

    private void addAnswers(
            Batch batch, long applicationId, SeedJob job, LocalDateTime submittedAt) {
        for (Question question : batch.questionsByJob.getOrDefault(job.id(), List.of())) {
            ScreeningQuestion template = batch.templates.get(question.prompt());
            String answer =
                    template != null && !template.options().isEmpty()
                            ? batch.random.pick(template.options())
                            : DemoSeedData.SHORT_TEXT_ANSWER;
            batch.answers.add(
                    new Object[] {
                        batch.answerIds.next(),
                        applicationId,
                        question.id(),
                        question.prompt(),
                        answer,
                        submittedAt,
                        submittedAt
                    });
        }
    }

    private Object[] interviewRow(
            Batch batch,
            long applicationId,
            SeedUser candidate,
            SeedJob job,
            String status,
            LocalDateTime lastChange) {
        SeedRandom random = batch.random;
        boolean online = random.chance(0.6);
        boolean open = "INTERVIEW".equals(status);
        String interviewStatus = open ? random.pickWeighted(OPEN_INTERVIEW_WEIGHTS) : "CONFIRMED";
        LocalDateTime startsAt = open ? random.ahead(1, 14) : random.ago(2, 10);
        boolean rescheduling = "RESCHEDULE_REQUESTED".equals(interviewStatus);
        return new Object[] {
            batch.interviewIds.next(),
            applicationId,
            candidate.id(),
            job.companyId(),
            job.recruiterId(),
            startsAt,
            random.pick(List.of(30, 45, 60)),
            online ? "ONLINE" : "OFFLINE",
            online
                    ? "https://meet.google.com/"
                            + random.pick(List.of("abc", "xyz", "hjk"))
                            + "-"
                            + random.between(1000, 9999)
                            + "-"
                            + random.pick(List.of("uvw", "qrs"))
                    : "Floor 5, " + random.pick(DemoSeedData.STREETS),
            "Technical interview covering past project experience.",
            interviewStatus,
            rescheduling ? startsAt.plusDays(2) : null,
            rescheduling ? "Could we move the interview to the next afternoon, please?" : null,
            "CANCELLED".equals(interviewStatus) ? "The company adjusted its hiring schedule" : null,
            true,
            true,
            lastChange,
            lastChange
        };
    }

    private static Map<String, List<String>> pipelines() {
        Map<String, List<String>> map = new LinkedHashMap<>();
        map.put("APPLIED", List.of("APPLIED"));
        map.put("VIEWED", List.of("APPLIED", "VIEWED"));
        map.put("IN_REVIEW", List.of("APPLIED", "VIEWED", "IN_REVIEW"));
        map.put("INTERVIEW", List.of("APPLIED", "VIEWED", "IN_REVIEW", "INTERVIEW"));
        map.put("OFFER", List.of("APPLIED", "VIEWED", "IN_REVIEW", "INTERVIEW", "OFFER"));
        map.put("HIRED", List.of("APPLIED", "VIEWED", "IN_REVIEW", "INTERVIEW", "OFFER", "HIRED"));
        map.put("REJECTED", List.of("APPLIED", "VIEWED", "REJECTED"));
        map.put("WITHDRAWN", List.of("APPLIED", "WITHDRAWN"));
        map.put("JOB_CLOSED", List.of("APPLIED", "JOB_CLOSED"));
        return map;
    }

    private static Map<String, Integer> statusWeights() {
        Map<String, Integer> weights = new LinkedHashMap<>();
        weights.put("APPLIED", 25);
        weights.put("VIEWED", 20);
        weights.put("IN_REVIEW", 20);
        weights.put("INTERVIEW", 14);
        weights.put("OFFER", 5);
        weights.put("HIRED", 3);
        weights.put("REJECTED", 10);
        weights.put("WITHDRAWN", 3);
        return weights;
    }

    private static Map<String, Integer> openInterviewWeights() {
        Map<String, Integer> weights = new LinkedHashMap<>();
        weights.put("PROPOSED", 35);
        weights.put("CONFIRMED", 40);
        weights.put("RESCHEDULE_REQUESTED", 10);
        weights.put("DECLINED", 5);
        weights.put("CANCELLED", 10);
        return weights;
    }

    private record Question(long id, String prompt) {}

    private record Resume(
            String storagePublicId, String fileName, String contentType, long fileSizeBytes) {}

    private final class Batch {

        final SeedRandom random;
        final Set<String> used = new HashSet<>();
        final Map<Long, List<Question>> questionsByJob = new HashMap<>();
        final Map<Long, Resume> resumes = new HashMap<>();
        final Map<String, ScreeningQuestion> templates = new HashMap<>();
        final IdSequence applicationIds = database.sequence("applications");
        final IdSequence historyIds = database.sequence("application_status_history");
        final IdSequence answerIds = database.sequence("application_answers");
        final IdSequence noteIds = database.sequence("application_notes");
        final IdSequence interviewIds = database.sequence("interviews");
        final List<Object[]> applications = new ArrayList<>();
        final List<Object[]> history = new ArrayList<>();
        final List<Object[]> answers = new ArrayList<>();
        final List<Object[]> notes = new ArrayList<>();
        final List<Object[]> interviews = new ArrayList<>();

        Batch(SeedRandom random, List<SeedJob> jobs) {
            this.random = random;
            DemoSeedData.QUESTION_SETS.forEach(
                    set -> set.forEach(question -> templates.put(question.prompt(), question)));
            loadQuestions(jobs);
            loadResumes();
        }

        private void loadQuestions(List<SeedJob> jobs) {
            Set<Long> jobIds = jobs.stream().map(SeedJob::id).collect(Collectors.toSet());
            database.jdbc()
                    .query(
                            "SELECT id, job_id, prompt FROM job_screening_questions"
                                    + " ORDER BY job_id, position",
                            rs -> {
                                long jobId = rs.getLong("job_id");
                                if (jobIds.contains(jobId)) {
                                    questionsByJob
                                            .computeIfAbsent(jobId, key -> new ArrayList<>())
                                            .add(
                                                    new Question(
                                                            rs.getLong("id"),
                                                            rs.getString("prompt")));
                                }
                            });
        }

        private void loadResumes() {
            database.jdbc()
                    .query(
                            "SELECT cp.user_id, cr.storage_public_id, cr.file_name, cr.content_type,"
                                    + " cr.file_size_bytes FROM candidate_resumes cr"
                                    + " JOIN candidate_profiles cp ON cp.id = cr.candidate_profile_id"
                                    + " WHERE cr.is_default = 1",
                            rs -> {
                                resumes.put(
                                        rs.getLong("user_id"),
                                        new Resume(
                                                rs.getString("storage_public_id"),
                                                rs.getString("file_name"),
                                                rs.getString("content_type"),
                                                rs.getLong("file_size_bytes")));
                            });
        }
    }
}
