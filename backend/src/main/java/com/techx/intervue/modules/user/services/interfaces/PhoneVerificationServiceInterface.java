package com.techx.intervue.modules.user.services.interfaces;

import com.techx.intervue.modules.user.requests.SendPhoneOtpRequest;
import com.techx.intervue.modules.user.requests.VerifyPhoneOtpRequest;
import com.techx.intervue.modules.user.resources.UserResource;

public interface PhoneVerificationServiceInterface {

    void sendOtp(Long userId, SendPhoneOtpRequest request, String ip);

    UserResource verifyOtp(Long userId, VerifyPhoneOtpRequest request, String ip);
}
