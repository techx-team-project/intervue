package com.techx.intervue.modules.recruiter.services.interfaces;

import com.techx.intervue.modules.recruiter.resources.RecruiterResource;
import com.techx.intervue.modules.user.requests.SendPhoneOtpRequest;
import com.techx.intervue.modules.user.requests.VerifyPhoneOtpRequest;

public interface RecruiterPhoneVerificationServiceInterface {

    void sendOtp(Long recruiterId, SendPhoneOtpRequest request, String ip);

    RecruiterResource verifyOtp(Long recruiterId, VerifyPhoneOtpRequest request, String ip);
}
