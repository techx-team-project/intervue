package com.techx.intervue.modules.application.requests;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record SaveApplicationRequest(
        @NotNull Long jobId,
        Long resumeId,
        @Size(max = 5000) String coverLetter,
        @Valid @Size(max = 5) List<@NotNull Answer> answers) {

    public record Answer(@NotNull Long questionId, @Size(max = 1000) String answer) {}
}
