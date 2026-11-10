package com.techx.intervue.modules.billing.repositories;

import com.techx.intervue.modules.billing.entities.VoucherRedemption;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoucherRedemptionRepository extends JpaRepository<VoucherRedemption, Long> {

    Optional<VoucherRedemption> findByOrderId(Long orderId);

    long countByVoucherIdAndCompanyId(Long voucherId, Long companyId);
}
