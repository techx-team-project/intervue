package com.techx.intervue.modules.ai.repositories;

import com.techx.intervue.modules.ai.entities.AiFaq;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AiFaqRepository extends JpaRepository<AiFaq, Long> {

    Optional<AiFaq> findByCodeAndActiveTrue(String code);

    List<AiFaq> findByActiveTrueOrderByDisplayOrderAsc();
}
