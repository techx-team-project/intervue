package com.techx.intervue.modules.billing.mappers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.billing.entities.Order;
import com.techx.intervue.modules.billing.entities.ServicePackage;
import com.techx.intervue.modules.billing.entities.Voucher;
import com.techx.intervue.modules.billing.entities.VoucherRedemption;
import com.techx.intervue.modules.billing.enums.VoucherAccentColor;
import com.techx.intervue.modules.billing.repositories.VoucherRepository;
import com.techx.intervue.modules.billing.resources.AdminVoucherResource;
import com.techx.intervue.modules.billing.resources.AvailableVoucherResource;
import com.techx.intervue.modules.billing.resources.UsedVoucherResource;
import com.techx.intervue.modules.billing.resources.VoucherPackageSummaryResource;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class VoucherMapper {

    private final ObjectMapper objectMapper;
    private final VoucherRepository voucherRepository;

    public String writeConditionsJson(List<String> rawConditions) {
        List<String> normalized = normalizeConditions(rawConditions);
        if (normalized.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(normalized);
        } catch (Exception cause) {
            throw new AppException(ErrorCode.INTERNAL_ERROR);
        }
    }

    public List<String> normalizeConditions(List<String> rawConditions) {
        if (rawConditions == null || rawConditions.isEmpty()) {
            return List.of();
        }
        Set<String> deduplicated = new LinkedHashSet<>();
        for (String item : rawConditions) {
            if (item == null) {
                continue;
            }
            String trimmed = item.trim();
            if (!trimmed.isEmpty()) {
                deduplicated.add(trimmed);
            }
        }
        return List.copyOf(deduplicated);
    }

    public List<String> readConditions(String conditionsJson) {
        if (conditionsJson == null || conditionsJson.isBlank()) {
            return List.of();
        }
        try {
            List<String> parsed = objectMapper.readValue(conditionsJson, new TypeReference<>() {});
            return normalizeConditions(parsed);
        } catch (Exception cause) {
            log.warn("Could not deserialize voucher conditions", cause);
            return List.of();
        }
    }

    public Map<Long, List<VoucherPackageSummaryResource>> loadApplicablePackagesMap(
            Collection<Long> voucherIds) {
        if (voucherIds == null || voucherIds.isEmpty()) {
            return Map.of();
        }
        Map<Long, List<VoucherPackageSummaryResource>> grouped = new HashMap<>();
        for (Object[] row : voucherRepository.findApplicablePackagesGrouped(voucherIds)) {
            Long voucherId = ((Number) row[0]).longValue();
            ServicePackage servicePackage = (ServicePackage) row[1];
            grouped.computeIfAbsent(voucherId, ignored -> new ArrayList<>())
                    .add(toPackageSummary(servicePackage));
        }
        return grouped;
    }

    public List<VoucherPackageSummaryResource> toPackageSummaries(
            Collection<ServicePackage> packages) {
        if (packages == null || packages.isEmpty()) {
            return List.of();
        }
        return packages.stream()
                .sorted(
                        Comparator.comparing(
                                        ServicePackage::getDisplayOrder,
                                        Comparator.nullsLast(Comparator.naturalOrder()))
                                .thenComparing(ServicePackage::getId))
                .map(this::toPackageSummary)
                .toList();
    }

    public AdminVoucherResource toAdminResource(
            Voucher voucher, List<VoucherPackageSummaryResource> applicablePackages) {
        return AdminVoucherResource.builder()
                .id(voucher.getId())
                .code(voucher.getCode())
                .label(voucher.getLabel())
                .description(voucher.getDescription())
                .ribbonLabel(voucher.getRibbonLabel())
                .accentColor(resolveAccentColor(voucher))
                .conditions(readConditions(voucher.getConditionsJson()))
                .applicablePackages(applicablePackages == null ? List.of() : applicablePackages)
                .discountType(voucher.getDiscountType())
                .discountValue(voucher.getDiscountValue())
                .maxDiscount(voucher.getMaxDiscount())
                .minOrderValue(voucher.getMinOrderValue())
                .startsAt(voucher.getStartsAt())
                .endsAt(voucher.getEndsAt())
                .usageLimit(voucher.getUsageLimit())
                .usedCount(voucher.getUsedCount())
                .perCompanyLimit(voucher.getPerCompanyLimit())
                .status(voucher.getStatus())
                .createdAt(voucher.getCreatedAt())
                .build();
    }

    public AvailableVoucherResource toAvailableResource(
            Voucher voucher,
            long usedByCompany,
            List<VoucherPackageSummaryResource> applicablePackages) {
        Integer remainingTotal =
                voucher.getUsageLimit() == null
                        ? null
                        : Math.max(0, voucher.getUsageLimit() - voucher.getUsedCount());
        return AvailableVoucherResource.builder()
                .code(voucher.getCode())
                .label(voucher.getLabel())
                .description(voucher.getDescription())
                .ribbonLabel(voucher.getRibbonLabel())
                .accentColor(resolveAccentColor(voucher))
                .conditions(readConditions(voucher.getConditionsJson()))
                .applicablePackages(applicablePackages == null ? List.of() : applicablePackages)
                .discountType(voucher.getDiscountType())
                .discountValue(voucher.getDiscountValue())
                .maxDiscount(voucher.getMaxDiscount())
                .minOrderValue(voucher.getMinOrderValue())
                .startsAt(voucher.getStartsAt())
                .endsAt(voucher.getEndsAt())
                .remainingUses(remainingTotal)
                .perCompanyLimit(voucher.getPerCompanyLimit())
                .usedByCompanyCount(usedByCompany)
                .build();
    }

    public UsedVoucherResource toUsedResource(
            VoucherRedemption redemption,
            Voucher voucher,
            Order order,
            List<VoucherPackageSummaryResource> applicablePackages) {
        return UsedVoucherResource.builder()
                .code(voucher.getCode())
                .label(voucher.getLabel())
                .description(voucher.getDescription())
                .ribbonLabel(voucher.getRibbonLabel())
                .accentColor(resolveAccentColor(voucher))
                .conditions(readConditions(voucher.getConditionsJson()))
                .applicablePackages(applicablePackages == null ? List.of() : applicablePackages)
                .discountType(voucher.getDiscountType())
                .discountValue(voucher.getDiscountValue())
                .maxDiscount(voucher.getMaxDiscount())
                .minOrderValue(voucher.getMinOrderValue())
                .orderCode(order.getCode())
                .orderStatus(order.getStatus())
                .discountAmount(redemption.getDiscountAmount())
                .usedAt(redemption.getCreatedAt())
                .build();
    }

    public VoucherAccentColor resolveAccentColor(Voucher voucher) {
        return voucher.getAccentColor() != null
                ? voucher.getAccentColor()
                : VoucherAccentColor.EMERALD;
    }

    private VoucherPackageSummaryResource toPackageSummary(ServicePackage servicePackage) {
        return VoucherPackageSummaryResource.builder()
                .id(servicePackage.getId())
                .code(servicePackage.getCode())
                .slug(servicePackage.getSlug())
                .name(servicePackage.getName())
                .build();
    }
}
