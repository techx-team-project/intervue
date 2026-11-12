package com.techx.intervue.common.seed.steps;

import com.techx.intervue.common.seed.DemoSeedData;
import com.techx.intervue.common.seed.DemoSeedData.DemoCompany;
import com.techx.intervue.common.seed.DemoSeedData.OwnerAccount;
import com.techx.intervue.common.seed.DemoSeedStep;
import com.techx.intervue.common.seed.IdSequence;
import com.techx.intervue.common.seed.SeedDatabase;
import com.techx.intervue.common.seed.SeedLookups;
import com.techx.intervue.common.seed.SeedRandom;
import com.techx.intervue.common.seed.SeedText;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@Profile("local")
@Order(2)
@RequiredArgsConstructor
public class CompanySeedStep implements DemoSeedStep {

    private static final List<String> COMPANY_COLUMNS =
            List.of(
                    "id",
                    "name",
                    "tax_code",
                    "address",
                    "created_at",
                    "updated_at",
                    "featured_until",
                    "brand_page_until");

    private static final int FEATURED_COMPANIES = 18;
    private static final int BRAND_PAGE_COMPANIES = 10;
    private static final int FEATURED_DAYS = 120;

    private static final List<String> RECRUITER_COLUMNS =
            List.of(
                    "id",
                    "name",
                    "email",
                    "password",
                    "status",
                    "token_version",
                    "email_verified_at",
                    "terms_accepted_at",
                    "company_name",
                    "province",
                    "created_at",
                    "updated_at");

    private static final List<String> MEMBER_COLUMNS =
            List.of(
                    "id",
                    "company_id",
                    "user_id",
                    "status",
                    "joined_at",
                    "created_at",
                    "updated_at");

    private static final List<String> PROFILE_COLUMNS =
            List.of(
                    "id",
                    "company_member_id",
                    "trading_name",
                    "business_type",
                    "industry",
                    "website",
                    "size",
                    "email",
                    "phone",
                    "address",
                    "description",
                    "benefits",
                    "logo_public_id",
                    "created_at",
                    "updated_at");

    private static final List<String> DOCUMENT_COLUMNS =
            List.of(
                    "id",
                    "company_id",
                    "submitted_by",
                    "document_type",
                    "review_status",
                    "storage_public_id",
                    "original_file_name",
                    "file_size_bytes",
                    "content_type",
                    "checksum_sha256",
                    "submitted_at",
                    "reviewed_at",
                    "reviewed_by",
                    "expires_at",
                    "created_at",
                    "updated_at");

    private final SeedDatabase database;
    private final SeedLookups lookups;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void seed() {
        if (database.contains("recruiters", "email", DemoSeedData.OWNERS.get(0).email())) {
            return;
        }
        SeedRandom random = new SeedRandom(DemoSeedData.RANDOM_SEED + 2);
        String passwordHash = passwordEncoder.encode(DemoSeedData.PASSWORD);
        long adminId = lookups.firstAdminId();
        List<RecruiterSeed> recruiters = recruiterSeeds(random);

        IdSequence companyIds = database.sequence("companies");
        IdSequence recruiterIds = database.sequence("recruiters");
        IdSequence memberIds = database.sequence("company_members");
        IdSequence profileIds = database.sequence("company_profiles");
        IdSequence documentIds = database.sequence("business_documents");

        List<Object[]> companies = new ArrayList<>();
        List<Object[]> recruiterRows = new ArrayList<>();
        List<Object[]> members = new ArrayList<>();
        List<Object[]> profiles = new ArrayList<>();
        List<Object[]> documents = new ArrayList<>();

        for (int index = 0; index < DemoSeedData.COMPANIES.size(); index++) {
            DemoCompany company = DemoSeedData.COMPANIES.get(index);
            RecruiterSeed recruiter = recruiters.get(index);
            boolean approved = index < DemoSeedData.APPROVED_COMPANIES;
            LocalDateTime createdAt = random.ago(30, 80);
            long companyId = companyIds.next();
            long recruiterId = recruiterIds.next();
            long memberId = memberIds.next();
            String address =
                    random.between(1, 300)
                            + " "
                            + random.pick(DemoSeedData.COMPANY_STREETS)
                            + ", "
                            + company.city();

            companies.add(
                    new Object[] {
                        companyId,
                        company.tradingName().toUpperCase(Locale.ROOT) + " CO., LTD",
                        String.format("09%08d", companyId),
                        address,
                        createdAt,
                        createdAt,
                        index < FEATURED_COMPANIES
                                ? random.now().plusDays(FEATURED_DAYS - index)
                                : null,
                        index < BRAND_PAGE_COMPANIES
                                ? random.now().plusDays(FEATURED_DAYS - index)
                                : null
                    });
            recruiterRows.add(
                    new Object[] {
                        recruiterId,
                        recruiter.name(),
                        recruiter.email(),
                        passwordHash,
                        "ACTIVE",
                        1,
                        createdAt,
                        createdAt,
                        company.tradingName(),
                        company.city(),
                        createdAt,
                        createdAt
                    });
            members.add(
                    new Object[] {
                        memberId, companyId, recruiterId, "ACTIVE", createdAt, createdAt, createdAt
                    });
            profiles.add(
                    profileRow(profileIds.next(), memberId, company, address, createdAt, random));
            documents.add(
                    documentRow(
                            documentIds.next(),
                            companyId,
                            recruiterId,
                            approved,
                            adminId,
                            createdAt,
                            random));
        }

        database.insert("companies", COMPANY_COLUMNS, companies);
        database.insert("recruiters", RECRUITER_COLUMNS, recruiterRows);
        database.insert("company_members", MEMBER_COLUMNS, members);
        database.insert("company_profiles", PROFILE_COLUMNS, profiles);
        database.insert("business_documents", DOCUMENT_COLUMNS, documents);
        log.info("Seeded {} companies with recruiters", companies.size());
    }

    private List<RecruiterSeed> recruiterSeeds(SeedRandom random) {
        List<RecruiterSeed> recruiters = new ArrayList<>();
        DemoSeedData.OWNERS.forEach(
                owner -> recruiters.add(new RecruiterSeed(owner.name(), owner.email())));
        int fakeCount = DemoSeedData.COMPANIES.size() - DemoSeedData.OWNERS.size();
        List<String> names =
                DemoSeedData.fakeNames(
                        random,
                        fakeCount,
                        DemoSeedData.OWNERS.stream()
                                .map(OwnerAccount::name)
                                .collect(Collectors.toSet()));
        for (int index = 0; index < names.size(); index++) {
            String name = names.get(index);
            recruiters.add(
                    new RecruiterSeed(
                            name,
                            "hr."
                                    + SeedText.slug(name)
                                    + "."
                                    + (index + 1)
                                    + "@"
                                    + DemoSeedData.FAKE_EMAIL_DOMAIN));
        }
        return recruiters;
    }

    private Object[] profileRow(
            long id,
            long memberId,
            DemoCompany company,
            String address,
            LocalDateTime createdAt,
            SeedRandom random) {
        String domain = SeedText.compactSlug(company.tradingName());
        return new Object[] {
            id,
            memberId,
            company.tradingName(),
            "ENTERPRISE",
            company.industry(),
            "https://" + domain + ".example.com",
            random.pick(DemoSeedData.COMPANY_SIZES),
            "hr@" + domain + ".example.com",
            "0281234" + random.between(1000, 9999),
            address,
            company.tradingName()
                    + " is a technology company in the "
                    + company.industry().toLowerCase(Locale.ROOT)
                    + " space, growing its engineering team in Vietnam. We build products used by"
                    + " millions of people, invest in engineering quality and mentoring, and offer"
                    + " clear career paths for engineers, designers and data specialists at every"
                    + " level.",
            "13th-month salary, full insurance, project bonuses, flexible working, internal training.",
            company.logoFile(),
            createdAt,
            createdAt
        };
    }

    private Object[] documentRow(
            long id,
            long companyId,
            long recruiterId,
            boolean approved,
            long adminId,
            LocalDateTime createdAt,
            SeedRandom random) {
        LocalDateTime submittedAt = createdAt.plusHours(2);
        return new Object[] {
            id,
            companyId,
            recruiterId,
            "BUSINESS_LICENSE",
            approved ? "APPROVED" : "PENDING_REVIEW",
            "demo/business-license-" + id,
            "business-license.pdf",
            random.between(150_000, 900_000),
            "application/pdf",
            SeedText.sha256("business-document-" + id),
            submittedAt,
            approved ? submittedAt.plusDays(1) : null,
            approved ? adminId : null,
            approved ? random.now().plusDays(365) : null,
            submittedAt,
            submittedAt
        };
    }

    private record RecruiterSeed(String name, String email) {}
}
