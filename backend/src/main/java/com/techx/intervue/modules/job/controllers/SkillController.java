package com.techx.intervue.modules.job.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.job.resources.SkillResource;
import com.techx.intervue.modules.job.services.interfaces.SkillServiceInterface;
import com.techx.intervue.resources.ApiResource;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/skills")
@RequiredArgsConstructor
public class SkillController extends BaseController {

    private final SkillServiceInterface skillService;

    @GetMapping
    public ResponseEntity<ApiResource<List<SkillResource>>> suggest(
            @RequestParam(required = false) String query) {
        return ok(skillService.suggest(query), "Skills retrieved successfully!");
    }
}
