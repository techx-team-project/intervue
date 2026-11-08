package com.techx.intervue.modules.recruiter.services.interfaces;

public interface LocalRecruiterSeedServiceInterface {
    boolean createIfAbsent(String name, String email, String rawPassword);

    void markContactVerified(Long recruiterId);
}
