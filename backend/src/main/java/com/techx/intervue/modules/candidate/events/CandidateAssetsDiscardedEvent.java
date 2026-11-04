package com.techx.intervue.modules.candidate.events;

import java.util.List;

public record CandidateAssetsDiscardedEvent(List<String> publicIds) {}
