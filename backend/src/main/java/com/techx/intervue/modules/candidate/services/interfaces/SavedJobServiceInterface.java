package com.techx.intervue.modules.candidate.services.interfaces;

import com.techx.intervue.modules.candidate.resources.SavedJobResource;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SavedJobServiceInterface {

    Page<SavedJobResource> list(Long candidateId, Pageable pageable);

    List<Long> listIds(Long candidateId);

    void save(Long candidateId, Long jobId);

    void remove(Long candidateId, Long jobId);
}
