package com.techx.intervue.modules.job.services.interfaces;

import com.techx.intervue.modules.job.requests.AdminSearchSkillsRequest;
import com.techx.intervue.modules.job.requests.SaveSkillRequest;
import com.techx.intervue.modules.job.resources.AdminSkillResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminSkillServiceInterface {

    Page<AdminSkillResource> search(AdminSearchSkillsRequest request, Pageable pageable);

    AdminSkillResource create(SaveSkillRequest request);

    AdminSkillResource update(Long id, SaveSkillRequest request);

    AdminSkillResource setActive(Long id, boolean active);
}
