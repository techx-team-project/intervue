package com.techx.intervue.modules.application.events;

import com.techx.intervue.modules.application.enums.InterviewEventType;

public record InterviewEvent(Long interviewId, InterviewEventType type) {}
