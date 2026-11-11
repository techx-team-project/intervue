package com.techx.intervue.modules.billing.repositories;

import com.techx.intervue.modules.billing.entities.Cart;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findByRecruiterId(Long recruiterId);
}
