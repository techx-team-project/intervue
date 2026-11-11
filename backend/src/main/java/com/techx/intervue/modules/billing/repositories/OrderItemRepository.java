package com.techx.intervue.modules.billing.repositories;

import com.techx.intervue.modules.billing.entities.OrderItem;
import com.techx.intervue.modules.billing.enums.OrderStatus;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findAllByOrderIdOrderByIdAsc(Long orderId);

    List<OrderItem> findAllByOrderIdInOrderByIdAsc(Collection<Long> orderIds);

    @Query(
            """
            select count(item) > 0 from OrderItem item
            where item.order.companyId = :companyId
              and item.packageCode = :packageCode
              and item.order.status in :statuses
            """)
    boolean existsForCompanyAndPackage(
            @Param("companyId") Long companyId,
            @Param("packageCode") String packageCode,
            @Param("statuses") Collection<OrderStatus> statuses);
}
