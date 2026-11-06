package com.techx.intervue.modules.job.repositories;

import com.techx.intervue.modules.job.entities.Skill;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface SkillRepository
        extends JpaRepository<Skill, Long>, JpaSpecificationExecutor<Skill> {

    List<Skill> findByActiveTrueOrderByNameAsc();

    List<Skill> findAllByIdInAndActiveTrue(Collection<Long> ids);

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}
