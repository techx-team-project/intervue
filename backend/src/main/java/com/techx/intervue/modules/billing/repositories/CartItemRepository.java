package com.techx.intervue.modules.billing.repositories;

import com.techx.intervue.modules.billing.entities.CartItem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    @EntityGraph(attributePaths = "servicePackage")
    List<CartItem> findAllByCartIdOrderByCreatedAtAsc(Long cartId);

    Optional<CartItem> findByIdAndCartId(Long id, Long cartId);

    Optional<CartItem> findByCartIdAndServicePackageId(Long cartId, Long packageId);

    long countByCartId(Long cartId);

    void deleteByCartId(Long cartId);
}
