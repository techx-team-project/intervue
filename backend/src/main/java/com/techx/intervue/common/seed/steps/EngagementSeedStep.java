package com.techx.intervue.common.seed.steps;

import com.techx.intervue.common.seed.DemoSeedData;
import com.techx.intervue.common.seed.DemoSeedStep;
import com.techx.intervue.common.seed.IdSequence;
import com.techx.intervue.common.seed.SeedDatabase;
import com.techx.intervue.common.seed.SeedLookups;
import com.techx.intervue.common.seed.SeedLookups.SeedJob;
import com.techx.intervue.common.seed.SeedLookups.SeedUser;
import com.techx.intervue.common.seed.SeedRandom;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
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
@Order(6)
@RequiredArgsConstructor
public class EngagementSeedStep implements DemoSeedStep {

    private static final List<String> SAVED_JOB_COLUMNS =
            List.of("id", "candidate_id", "job_id", "created_at", "updated_at");

    private static final List<String> FOLLOW_COLUMNS =
            List.of("id", "candidate_id", "company_id", "created_at", "updated_at");

    private static final List<String> NOTIFICATION_COLUMNS =
            List.of(
                    "id",
                    "kind",
                    "type",
                    "audience",
                    "category",
                    "severity",
                    "title",
                    "summary",
                    "action_url",
                    "action_label",
                    "status",
                    "scheduled_at",
                    "sent_at",
                    "created_by_admin_id",
                    "created_at",
                    "updated_at");

    private static final List<String> RECIPIENT_COLUMNS =
            List.of(
                    "id",
                    "notification_id",
                    "recipient_type",
                    "recipient_id",
                    "read_at",
                    "seen_at",
                    "created_at",
                    "updated_at");

    private static final int BROADCAST_CANDIDATES = 20;
    private static final int RECRUITERS_WITH_EVENTS = 6;

    private final SeedDatabase database;
    private final SeedLookups lookups;

    @Override
    public void seed() {
        SeedRandom random = new SeedRandom(DemoSeedData.RANDOM_SEED + 6);
        List<SeedUser> candidates = lookups.usersWithRole("CANDIDATE");
        List<SeedJob> openJobs = lookups.jobsWithStatus(List.of("PUBLISHED"));
        if (candidates.isEmpty() || openJobs.isEmpty()) {
            return;
        }
        if (database.allEmpty("saved_jobs")) {
            seedSavedJobs(random, candidates, openJobs);
        }
        if (database.allEmpty("company_follows")) {
            seedFollows(random, candidates, openJobs);
        }
        if (database.allEmpty("notifications")) {
            seedNotifications(random, candidates);
        }
    }

    private void seedSavedJobs(SeedRandom random, List<SeedUser> candidates, List<SeedJob> jobs) {
        IdSequence ids = database.sequence("saved_jobs");
        List<Object[]> rows = new ArrayList<>();
        for (SeedUser candidate : candidates) {
            for (SeedJob job : random.sample(jobs, random.between(2, 8))) {
                LocalDateTime at = random.ago(0.5, 25);
                rows.add(new Object[] {ids.next(), candidate.id(), job.id(), at, at});
            }
        }
        database.insert("saved_jobs", SAVED_JOB_COLUMNS, rows);
        log.info("Seeded {} saved jobs", rows.size());
    }

    private void seedFollows(SeedRandom random, List<SeedUser> candidates, List<SeedJob> jobs) {
        IdSequence ids = database.sequence("company_follows");
        List<Long> companyIds =
                jobs.stream()
                        .map(SeedJob::companyId)
                        .distinct()
                        .sorted()
                        .collect(Collectors.toList());
        List<Object[]> rows = new ArrayList<>();
        for (SeedUser candidate : candidates) {
            for (Long companyId : random.sample(companyIds, random.between(1, 5))) {
                LocalDateTime at = random.ago(0.5, 40);
                rows.add(new Object[] {ids.next(), candidate.id(), companyId, at, at});
            }
        }
        database.insert("company_follows", FOLLOW_COLUMNS, rows);
        log.info("Seeded {} company follows", rows.size());
    }

    private void seedNotifications(SeedRandom random, List<SeedUser> candidates) {
        NotificationBatch batch = new NotificationBatch(random, lookups.firstAdminId());
        List<Long> recruiterIds = lookups.recruiterIds();
        Set<String> ownerEmails =
                DemoSeedData.OWNERS.stream()
                        .map(DemoSeedData.OwnerAccount::email)
                        .collect(Collectors.toSet());

        for (SeedUser candidate : candidates) {
            if (ownerEmails.contains(candidate.email())) {
                batch.candidateEvents(candidate.id());
            }
        }
        recruiterIds.stream().limit(RECRUITERS_WITH_EVENTS).forEach(batch::recruiterEvents);
        lookups.usersWithRole("ADMIN").forEach(admin -> batch.adminEvent(admin.id()));
        batch.broadcastToCandidates(
                candidates.stream().limit(BROADCAST_CANDIDATES).map(SeedUser::id).toList());
        batch.broadcastToRecruiters(recruiterIds);

        database.insert("notifications", NOTIFICATION_COLUMNS, batch.notifications);
        database.insert("notification_recipients", RECIPIENT_COLUMNS, batch.recipients);
        log.info("Seeded {} notifications", batch.notifications.size());
    }

    private final class NotificationBatch {

        final SeedRandom random;
        final long adminId;
        final IdSequence notificationSequence = database.sequence("notifications");
        final IdSequence recipientSequence = database.sequence("notification_recipients");
        final List<Object[]> notifications = new ArrayList<>();
        final List<Object[]> recipients = new ArrayList<>();

        NotificationBatch(SeedRandom random, long adminId) {
            this.random = random;
            this.adminId = adminId;
        }

        void candidateEvents(long userId) {
            event(
                    "IDENTITY_VERIFIED",
                    "ACCOUNT",
                    "INFO",
                    "Danh tính đã được xác thực",
                    "Bạn có thể ứng tuyển ngay bây giờ.",
                    "/candidate/identity-verification",
                    "Xem chi tiết",
                    "USER",
                    userId);
            event(
                    "INTERVIEW_INVITED",
                    "APPLICATIONS",
                    "INFO",
                    "Lời mời phỏng vấn mới",
                    "Một nhà tuyển dụng vừa mời bạn phỏng vấn, hãy xác nhận thời gian.",
                    "/candidate/interviews",
                    "Xem lịch",
                    "USER",
                    userId);
            event(
                    "APPLICATION_STATUS_CHANGED",
                    "APPLICATIONS",
                    "INFO",
                    "Hồ sơ của bạn được cập nhật",
                    "Nhà tuyển dụng vừa chuyển hồ sơ sang bước tiếp theo.",
                    "/candidate/applications",
                    "Xem hồ sơ",
                    "USER",
                    userId);
            event(
                    "FOLLOWED_COMPANY_NEW_JOB",
                    "JOBS",
                    "INFO",
                    "Công ty bạn theo dõi có việc mới",
                    "Có tin tuyển dụng mới phù hợp với hồ sơ của bạn.",
                    "/jobs",
                    "Xem việc làm",
                    "USER",
                    userId);
        }

        void recruiterEvents(long recruiterId) {
            event(
                    "APPLICATION_RECEIVED",
                    "APPLICATIONS",
                    "INFO",
                    "Có hồ sơ ứng tuyển mới",
                    "Một ứng viên vừa ứng tuyển vào tin của bạn.",
                    "/recruiter/applications",
                    "Xem hồ sơ",
                    "RECRUITER",
                    recruiterId);
            event(
                    "COMPANY_VERIFIED",
                    "COMPANY",
                    "SUCCESS",
                    "Công ty đã được xác minh",
                    "Bạn có thể đăng tin tuyển dụng.",
                    "/recruiter/company",
                    "Xem công ty",
                    "RECRUITER",
                    recruiterId);
        }

        void adminEvent(long adminUserId) {
            event(
                    "ADMIN_REVIEW_QUEUE_ITEM",
                    "MODERATION",
                    "INFO",
                    "Hồ sơ chờ duyệt",
                    "Có hồ sơ xác thực danh tính và xác minh công ty đang chờ bạn xử lý.",
                    "/admin/verification/identity",
                    "Mở hàng chờ",
                    "USER",
                    adminUserId);
        }

        void broadcastToCandidates(List<Long> userIds) {
            broadcast(
                    "CANDIDATE",
                    "Chào mừng đến với InterVue",
                    "Nền tảng tuyển dụng IT có AI hỗ trợ đã sẵn sàng. Hoàn thiện hồ sơ để nhận gợi ý"
                            + " việc làm phù hợp.",
                    "/candidate/profile",
                    "Cập nhật hồ sơ",
                    "USER",
                    userIds,
                    random.ago(5, 6));
        }

        void broadcastToRecruiters(List<Long> recruiterIds) {
            broadcast(
                    "RECRUITER",
                    "Bảo trì hệ thống cuối tuần",
                    "Hệ thống sẽ bảo trì ngắn vào 23:00 Chủ nhật, mong bạn thông cảm.",
                    null,
                    null,
                    "RECRUITER",
                    recruiterIds,
                    random.ago(2, 3));
        }

        private void event(
                String type,
                String category,
                String severity,
                String title,
                String summary,
                String actionUrl,
                String actionLabel,
                String recipientType,
                long recipientId) {
            LocalDateTime at = random.ago(0.1, 10);
            long id = notificationSequence.next();
            notifications.add(
                    new Object[] {
                        id,
                        "EVENT",
                        type,
                        null,
                        category,
                        severity,
                        title,
                        summary,
                        actionUrl,
                        actionLabel,
                        null,
                        null,
                        null,
                        null,
                        at,
                        at
                    });
            addRecipient(id, recipientType, recipientId, at);
        }

        private void broadcast(
                String audience,
                String title,
                String summary,
                String actionUrl,
                String actionLabel,
                String recipientType,
                List<Long> recipientIds,
                LocalDateTime at) {
            long id = notificationSequence.next();
            notifications.add(
                    new Object[] {
                        id,
                        "BROADCAST",
                        "ANNOUNCEMENT",
                        audience,
                        "SYSTEM",
                        "INFO",
                        title,
                        summary,
                        actionUrl,
                        actionLabel,
                        "SENT",
                        at,
                        at,
                        adminId,
                        at,
                        at
                    });
            recipientIds.forEach(recipientId -> addRecipient(id, recipientType, recipientId, at));
        }

        private void addRecipient(
                long notificationId, String recipientType, long recipientId, LocalDateTime at) {
            boolean read = random.chance(0.4);
            LocalDateTime readAt = read ? at.plusHours(2) : null;
            LocalDateTime seenAt = read || random.chance(0.6) ? at : null;
            recipients.add(
                    new Object[] {
                        recipientSequence.next(),
                        notificationId,
                        recipientType,
                        recipientId,
                        readAt,
                        seenAt,
                        at,
                        at
                    });
        }
    }
}
