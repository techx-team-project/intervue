package com.techx.intervue.modules.user.services.impl;

import com.techx.intervue.exceptions.AppException;

final class PasswordPolicy {
    private PasswordPolicy() {}

    static void verify(String password, String confirmPassword, String email) {
        if (!password.equals(confirmPassword)) {
            throw AppException.validation("confirmPassword", "Confirm password does not match!");
        }
        if (password.equalsIgnoreCase(email)) {
            throw AppException.validation(
                    "password", "Password must not be the same as the email!");
        }
    }
}
