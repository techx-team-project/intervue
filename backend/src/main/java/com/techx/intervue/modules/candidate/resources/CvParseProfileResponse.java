package com.techx.intervue.modules.candidate.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.candidate.enums.CvUnreadableReason;
import java.util.List;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record CvParseProfileResponse(
        boolean readable,
        CvUnreadableReason unreadableReason,
        String reasonMessage,
        boolean profileEmpty,
        ParsedProfileData parsedData,
        List<ProfileDiffItem> diffs) {}
