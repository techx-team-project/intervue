package com.techx.intervue.modules.content.repositories;

import com.techx.intervue.modules.content.entities.BlogTag;
import java.util.Collection;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogTagRepository extends JpaRepository<BlogTag, Long> {

    Optional<BlogTag> findBySlug(String slug);

    Optional<BlogTag> findByNameIgnoreCase(String name);

    Set<BlogTag> findBySlugIn(Collection<String> slugs);

    Set<BlogTag> findByNameIn(Collection<String> names);
}
