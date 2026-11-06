package com.techx.intervue.modules.job.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.job.entities.Skill;
import com.techx.intervue.modules.job.mappers.SkillMapper;
import com.techx.intervue.modules.job.repositories.SkillRepository;
import com.techx.intervue.modules.job.repositories.SkillSpecifications;
import com.techx.intervue.modules.job.requests.AdminSearchSkillsRequest;
import com.techx.intervue.modules.job.requests.SaveSkillRequest;
import com.techx.intervue.modules.job.resources.AdminSkillResource;
import com.techx.intervue.modules.job.services.interfaces.AdminSkillServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminSkillService implements AdminSkillServiceInterface {

    private final SkillRepository skillRepository;
    private final SkillMapper skillMapper;
    private final SkillCatalogCache catalogCache;

    @Override
    @Transactional(readOnly = true)
    public Page<AdminSkillResource> search(AdminSearchSkillsRequest request, Pageable pageable) {
        return skillRepository
                .findAll(SkillSpecifications.matching(request), pageable)
                .map(skillMapper::toAdminResource);
    }

    @Override
    @Transactional
    public AdminSkillResource create(SaveSkillRequest request) {
        String name = request.name().trim();
        if (skillRepository.existsByNameIgnoreCase(name)) {
            throw new AppException(ErrorCode.SKILL_NAME_ALREADY_USED);
        }
        Skill saved =
                skillRepository.save(Skill.builder().name(name).group(request.group()).build());
        catalogCache.evict();
        return skillMapper.toAdminResource(saved);
    }

    @Override
    @Transactional
    public AdminSkillResource update(Long id, SaveSkillRequest request) {
        Skill skill = requireSkill(id);
        String name = request.name().trim();
        if (skillRepository.existsByNameIgnoreCaseAndIdNot(name, id)) {
            throw new AppException(ErrorCode.SKILL_NAME_ALREADY_USED);
        }
        skill.setName(name);
        skill.setGroup(request.group());
        catalogCache.evict();
        return skillMapper.toAdminResource(skill);
    }

    @Override
    @Transactional
    public AdminSkillResource setActive(Long id, boolean active) {
        Skill skill = requireSkill(id);
        skill.setActive(active);
        catalogCache.evict();
        return skillMapper.toAdminResource(skill);
    }

    private Skill requireSkill(Long id) {
        return skillRepository
                .findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }
}
