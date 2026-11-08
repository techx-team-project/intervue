package com.techx.intervue.modules.application.repositories;

import com.techx.intervue.modules.application.entities.ApplicationNote;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicationNoteRepository extends JpaRepository<ApplicationNote, Long> {

    List<ApplicationNote> findByApplicationIdOrderByCreatedAtAsc(Long applicationId);

    Optional<ApplicationNote> findByIdAndApplicationId(Long id, Long applicationId);
}
