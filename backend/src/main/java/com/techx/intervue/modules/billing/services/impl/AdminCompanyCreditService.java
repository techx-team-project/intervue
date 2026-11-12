package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.modules.billing.requests.AdjustCompanyCreditsRequest;
import com.techx.intervue.modules.billing.resources.AdminCompanyCreditDetailResource;
import com.techx.intervue.modules.billing.resources.AdminCompanyCreditLotResource;
import com.techx.intervue.modules.billing.resources.AdminCompanyCreditSummaryResource;
import com.techx.intervue.modules.billing.resources.CreditLedgerEntryResource;
import com.techx.intervue.modules.billing.services.interfaces.AdminCompanyCreditServiceInterface;
import com.techx.intervue.modules.company.requests.SearchCompaniesRequest;
import com.techx.intervue.modules.company.resources.CompanySummaryResource;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import com.techx.intervue.modules.entitlement.services.interfaces.EntitlementServiceInterface;
import com.techx.intervue.modules.entitlement.services.interfaces.EntitlementServiceInterface.CompanyStockSummary;
import com.techx.intervue.modules.entitlement.services.interfaces.EntitlementServiceInterface.EntitlementGrant;
import com.techx.intervue.modules.entitlement.services.interfaces.EntitlementServiceInterface.EntitlementLotView;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminCompanyCreditService implements AdminCompanyCreditServiceInterface {

    private final CompanyServiceInterface companyService;
    private final EntitlementServiceInterface entitlementService;
    private final AuditLogServiceInterface auditLogService;

    @Override
    @Transactional(readOnly = true)
    public Page<AdminCompanyCreditSummaryResource> listCompanies(String query, Pageable pageable) {
        Page<CompanySummaryResource> companies =
                companyService.search(new SearchCompaniesRequest(query), pageable);
        List<Long> companyIds =
                companies.getContent().stream().map(CompanySummaryResource::id).toList();
        Map<Long, CompanyStockSummary> stockByCompany =
                entitlementService.summarizeStockByCompanyIds(companyIds, EntitlementType.CREDIT);
        return companies.map(
                company -> {
                    CompanyStockSummary stock = stockByCompany.get(company.id());
                    return AdminCompanyCreditSummaryResource.builder()
                            .companyId(company.id())
                            .companyName(company.name())
                            .taxCode(company.taxCode())
                            .address(company.address())
                            .availableBalance(stock != null ? stock.availableBalance() : 0L)
                            .lifetimeGranted(stock != null ? stock.lifetimeGranted() : 0L)
                            .lifetimeSpent(stock != null ? stock.lifetimeSpent() : 0L)
                            .expiredBalance(stock != null ? stock.expiredBalance() : 0L)
                            .nearestExpiryAt(stock != null ? stock.nearestExpiry() : null)
                            .build();
                });
    }

    @Override
    @Transactional(readOnly = true)
    public AdminCompanyCreditDetailResource getCompanyWallet(Long companyId) {
        CompanySummaryResource company = companyService.findSummary(companyId);
        return buildDetail(company);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CreditLedgerEntryResource> companyLedger(Long companyId, Pageable pageable) {
        companyService.findSummary(companyId);
        return entitlementService
                .ledgerOf(companyId, EntitlementType.CREDIT, pageable)
                .map(
                        entry ->
                                new CreditLedgerEntryResource(
                                        entry.credit(),
                                        entry.quantity(),
                                        entry.label(),
                                        entry.at()));
    }

    @Override
    @Transactional
    public AdminCompanyCreditDetailResource adjustCredits(
            Long companyId, AdjustCompanyCreditsRequest request, RequestActor actor) {
        CompanySummaryResource company = companyService.findSummary(companyId);
        int amount = request.amount();
        if (amount == 0) {
            throw AppException.validation("amount", "Adjustment amount must not be zero.");
        }
        String reason = request.reason().trim();
        if (amount < 0 && request.validityDays() != null) {
            throw AppException.validation(
                    "validityDays", "Validity days only apply when granting positive credits.");
        }

        if (amount > 0) {
            Instant deadline =
                    request.validityDays() == null
                            ? null
                            : Instant.now().plus(Duration.ofDays(request.validityDays()));
            String label = "Admin điều chỉnh (+): " + reason;
            entitlementService.grant(
                    companyId,
                    actor.userId(),
                    List.of(
                            EntitlementGrant.direct(
                                    EntitlementType.CREDIT, amount, 1, null, label, deadline)));
        } else {
            int debit = Math.abs(amount);
            String label = "Admin điều chỉnh (-): " + reason;
            entitlementService.consumeUnits(
                    companyId, EntitlementType.CREDIT, debit, label, actor.userId());
        }

        auditLogService.record(
                AuditEntry.builder()
                        .actorType(AuditActorType.ADMIN)
                        .actorId(actor.userId())
                        .actorEmail(actor.email())
                        .action(AuditAction.COMPANY_CREDITS_ADJUSTED)
                        .targetType(AuditTargetType.COMPANY)
                        .targetId(companyId)
                        .detail(
                                "%+d credits: %s%s"
                                        .formatted(
                                                amount,
                                                reason,
                                                request.validityDays() != null
                                                        ? " ("
                                                                + request.validityDays()
                                                                + "d validity)"
                                                        : ""))
                        .ip(actor.ip())
                        .build());

        return buildDetail(company);
    }

    private AdminCompanyCreditDetailResource buildDetail(CompanySummaryResource company) {
        Map<Long, CompanyStockSummary> stockMap =
                entitlementService.summarizeStockByCompanyIds(
                        List.of(company.id()), EntitlementType.CREDIT);
        CompanyStockSummary stock = stockMap.get(company.id());
        List<AdminCompanyCreditLotResource> lots =
                entitlementService.lotsOf(company.id(), EntitlementType.CREDIT).stream()
                        .map(AdminCompanyCreditService::toLotResource)
                        .toList();
        return AdminCompanyCreditDetailResource.builder()
                .companyId(company.id())
                .companyName(company.name())
                .taxCode(company.taxCode())
                .address(company.address())
                .availableBalance(stock != null ? stock.availableBalance() : 0L)
                .lifetimeGranted(stock != null ? stock.lifetimeGranted() : 0L)
                .lifetimeSpent(stock != null ? stock.lifetimeSpent() : 0L)
                .expiredBalance(stock != null ? stock.expiredBalance() : 0L)
                .nearestExpiryAt(stock != null ? stock.nearestExpiry() : null)
                .lots(lots)
                .build();
    }

    private static AdminCompanyCreditLotResource toLotResource(EntitlementLotView lot) {
        return AdminCompanyCreditLotResource.builder()
                .id(lot.id())
                .sourceOrderItemId(lot.sourceOrderItemId())
                .label(lot.label())
                .totalQuantity(lot.totalQuantity())
                .remainingQuantity(lot.remainingQuantity())
                .bonus(lot.bonus())
                .status(lot.status())
                .activationDeadline(lot.activationDeadline())
                .createdAt(lot.createdAt())
                .build();
    }
}
