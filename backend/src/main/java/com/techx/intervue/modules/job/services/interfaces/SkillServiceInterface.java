package com.techx.intervue.modules.job.services.interfaces;

import com.techx.intervue.modules.job.resources.SkillResource;
import java.util.List;

public interface SkillServiceInterface {

    List<SkillResource> suggest(String query);
}
