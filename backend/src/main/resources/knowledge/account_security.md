# Account Security and Privacy Controls

## Password Protection and Reset Flow
InterVue implements strict password security standards to protect user accounts:
- Password Complexity: Minimum 8 characters containing at least one uppercase letter, one lowercase letter, one number, and one special character. Passwords must not be identical to the email address.
- Changing Password: Users can update their password in Account Settings by verifying their current password. Completing a password change automatically terminates active sessions across all other devices.
- Forgotten Password Recovery:
  - Users enter their registered email address to receive a password reset link.
  - The reset link is valid for 15 minutes and can only be used once. Generating a new link immediately invalidates any prior link.
  - Rate limiting applies: maximum 3 requests within a 15-minute window per email/IP, with a mandatory 60-second cooldown between requests.
  - Once reset successfully, the user is logged out of all connected sessions across all devices.

## Brute-Force Login Protection and CAPTCHA
To defend against automated credential stuffing and dictionary attacks:
- Failed Attempt Tracking: The platform monitors consecutive unsuccessful login attempts combined across account email and client IP address.
- CAPTCHA Challenge: Entering incorrect credentials more than 3 consecutive times triggers a mandatory CAPTCHA challenge for all subsequent login attempts.
- Opaque Error Notifications: To prevent account enumeration attacks, the system returns a generic error message ("Invalid credentials") without revealing whether the email exists or which credential was erroneous.

## Two-Factor Authentication (2FA)
Users can bolster account security by enabling Two-Factor Authentication:
- Authentication Methods:
  - Authenticator App (Recommended): Compatible with Google Authenticator, Microsoft Authenticator, or Authy via QR code TOTP setup.
  - Email Verification Code: Delivers a 6-digit one-time code to the registered email address (valid for 5 minutes, invalidated after 5 incorrect entries).
- Backup Recovery Codes: Upon enabling 2FA, InterVue generates a set of 10 single-use emergency backup recovery codes (10 mã khôi phục dự phòng). If you lose access to your primary 2FA device, you can log in using one of these recovery codes. A new set can be regenerated at any time.

## Session and Device Management
Users retain full control over their active login sessions:
- Active Device Audit: Inspect active sessions showing device type, operating system, browser name, IP address, and last activity timestamp.
- Remote Session Revocation: Log out from individual suspicious devices or terminate all active sessions across all devices with a single click.

## Account Deletion and 7-Day Grace Period
Users have the legal right to request complete erasure of their personal data:
- Initiation: Request account deletion in Account Settings and confirm via a security verification code sent to your email.
- Pre-deletion Validation: Deletion is temporarily prevented if the account has pending financial transactions, unresolved fraud reports, or active refund disputes.
- 7-Day Grace Period: Once initiated, the account enters a 7-day grace period (thời gian ân hạn 7 ngày). Profiles and job postings are hidden from public view. Logging into your account at any point during these 7 days instantly cancels the deletion request (hủy yêu cầu xóa) and restores account access.
- Permanent Erasure: After 7 days, all personal identification records, CVs, eKYC biometric scans, applications, and chat logs are permanently deleted. Statutory financial transaction documents and invoices are archived strictly as required by accounting and tax laws.

