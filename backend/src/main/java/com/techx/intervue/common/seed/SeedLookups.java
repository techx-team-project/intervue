package com.techx.intervue.common.seed;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("local")
@RequiredArgsConstructor
public class SeedLookups {

    public record SeedUser(long id, String name, String email, LocalDateTime createdAt) {}

    public record SeedSkill(long id, String name, String group) {}

    public record SeedRecruiter(
            long id, String name, long companyId, String companyName, String city) {}

    public record SeedJob(
            long id,
            long companyId,
            long recruiterId,
            String recruiterName,
            String companyName,
            String title,
            String status) {}

    private static final String USERS_WITH_ROLE =
            "SELECT u.id, u.name, u.email, u.created_at FROM users u"
                    + " JOIN user_roles ur ON ur.user_id = u.id"
                    + " JOIN roles r ON r.id = ur.role_id"
                    + " WHERE r.name = ? ORDER BY u.id";

    private final SeedDatabase database;

    public List<SeedUser> usersWithRole(String role) {
        return database.jdbc()
                .query(
                        USERS_WITH_ROLE,
                        (rs, rowNum) ->
                                new SeedUser(
                                        rs.getLong("id"),
                                        rs.getString("name"),
                                        rs.getString("email"),
                                        rs.getObject("created_at", LocalDateTime.class)),
                        role);
    }

    public long firstAdminId() {
        return usersWithRole("ADMIN").getFirst().id();
    }

    public List<SeedUser> verifiedCandidates() {
        return database.jdbc()
                .query(
                        "SELECT u.id, u.name, u.email, u.created_at FROM users u"
                                + " JOIN identity_verifications iv ON iv.user_id = u.id"
                                + " WHERE iv.status = 'APPROVED' ORDER BY u.id",
                        (rs, rowNum) ->
                                new SeedUser(
                                        rs.getLong("id"),
                                        rs.getString("name"),
                                        rs.getString("email"),
                                        rs.getObject("created_at", LocalDateTime.class)));
    }

    public Map<String, SeedSkill> skillsByName() {
        Map<String, SeedSkill> skills = new LinkedHashMap<>();
        database.jdbc()
                .query(
                        "SELECT id, name, skill_group FROM skills ORDER BY id",
                        (rs, rowNum) ->
                                new SeedSkill(
                                        rs.getLong("id"),
                                        rs.getString("name"),
                                        rs.getString("skill_group")))
                .forEach(skill -> skills.put(skill.name(), skill));
        return skills;
    }

    public List<SeedRecruiter> showcaseRecruiters() {
        return database.jdbc()
                .query(
                        "SELECT r.id, r.name, cm.company_id, cp.trading_name, r.province"
                                + " FROM recruiters r"
                                + " JOIN company_members cm ON cm.user_id = r.id"
                                + " JOIN company_profiles cp ON cp.company_member_id = cm.id"
                                + " WHERE cp.logo_public_id LIKE '/company-logos/%' ORDER BY r.id",
                        (rs, rowNum) ->
                                new SeedRecruiter(
                                        rs.getLong("id"),
                                        rs.getString("name"),
                                        rs.getLong("company_id"),
                                        rs.getString("trading_name"),
                                        rs.getString("province")));
    }

    public List<Long> recruiterIds() {
        return database.jdbc().queryForList("SELECT id FROM recruiters ORDER BY id", Long.class);
    }

    public List<SeedJob> jobsWithStatus(List<String> statuses) {
        String placeholders = String.join(", ", Collections.nCopies(statuses.size(), "?"));
        return database.jdbc()
                .query(
                        "SELECT j.id, j.company_id, j.recruiter_id, r.name, j.company_name,"
                                + " j.title, j.status FROM jobs j"
                                + " JOIN recruiters r ON r.id = j.recruiter_id"
                                + " WHERE j.status IN ("
                                + placeholders
                                + ") ORDER BY j.id",
                        (rs, rowNum) ->
                                new SeedJob(
                                        rs.getLong("id"),
                                        rs.getLong("company_id"),
                                        rs.getLong("recruiter_id"),
                                        rs.getString("name"),
                                        rs.getString("company_name"),
                                        rs.getString("title"),
                                        rs.getString("status")),
                        statuses.toArray());
    }
}
