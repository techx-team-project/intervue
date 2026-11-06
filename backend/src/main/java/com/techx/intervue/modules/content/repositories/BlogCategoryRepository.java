package com.techx.intervue.modules.content.repositories;

import com.techx.intervue.modules.content.entities.BlogCategory;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogCategoryRepository extends JpaRepository<BlogCategory, Long> {

    Optional<BlogCategory> findBySlug(String slug);

    List<BlogCategory> findAllByIsActiveTrueOrderByDisplayOrderAsc();
}
