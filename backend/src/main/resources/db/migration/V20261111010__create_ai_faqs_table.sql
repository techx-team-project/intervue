CREATE TABLE ai_faqs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    embedding TEXT NULL,
    display_order INT UNSIGNED NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ai_faqs_active_order (is_active, display_order),
    INDEX idx_ai_faqs_code (code)
);

INSERT INTO ai_faqs (code, category, question, answer, display_order, is_active) VALUES
('sq-company-verification', 'RECRUITER', 'How do I verify a company?', 'To verify your company account and obtain the **Verified Blue Badge** on InterVue, follow these 4 steps:\n1. **Prepare documents:** A scanned copy of your valid Business Registration Certificate (ERC/BRC) and Letter of Authorization (if you are not the legal representative).\n2. **Navigate to verification:** Go to [Company Verification](/recruiter/company/verification) in your recruiter dashboard.\n3. **Submit details & Upload files:** Enter your tax identification number, legal company name, and upload your official PDF/image documents (under 5MB).\n4. **Review process:** Our compliance team validates your records with national business registries within **24 - 48 business hours**.', 1, 1),

('sq-ats-cv', 'CANDIDATE', 'How do I create and optimize an ATS-ready CV?', 'To craft and optimize an IT resume that passes Applicant Tracking Systems (ATS) on InterVue:\n1. **Use standard templates:** Browse [ATS Resume Templates](/cv-templates) to choose clean single-column layouts without complex tables or graphics.\n2. **Optimize technical keywords:** Include specific skills and frameworks (e.g., Java, Spring Boot, React, Docker, Kubernetes) throughout your Skills and Experience sections.\n3. **Quantify achievements:** Use the XYZ formula or STAR method (e.g., *Optimized database query performance, decreasing API latency by 30%*).\n4. **AI Resume Review:** Open [My Profile & Resumes](/candidate/profile) and click **Review Resume with AI** for instant, in-depth feedback.', 2, 1),

('sq-apply-status', 'CANDIDATE', 'How do applying and status tracking work?', 'Applying for jobs and tracking progress on InterVue is straightforward:\n1. **Discover opportunities:** Explore thousands of tech roles on the [All IT Jobs](/jobs) page.\n2. **Submit application:** Select your target position, click **Apply Now**, and choose your stored resume or upload a new one.\n3. **Track status:** Visit [My Profile & Application History](/candidate/profile) to track live stages: *Submitted*, *Under Review*, *Interview Scheduled*, *Offered*, or *Rejected*.', 3, 1),

('sq-two-factor', 'SECURITY', 'How do I turn on two-factor authentication (2FA)?', 'To protect your account with Two-Factor Authentication (2FA):\n1. **Open Security Settings:** Navigate to [Account Security](/account/security).\n2. **Enable 2FA:** Under **Two-Factor Authentication**, click **Activate**.\n3. **Scan QR Code:** Open Google Authenticator or Microsoft Authenticator on your phone and scan the displayed QR code.\n4. **Enter verification code:** Enter the 6-digit one-time code to complete setup.\n5. **Save recovery codes:** Store your backup codes safely to recover access if you lose your device.', 4, 1),

('sq-ai-interview', 'INTERVIEW', 'How does InterVue support AI interview practice?', 'InterVue offers a **1-on-1 AI Mock Technical Interview** simulator designed for IT professionals:\n- **Realistic question sets:** In-depth technical, system design, and behavioral questions tailored to your target position (Frontend, Backend, DevOps, Data...).\n- **STAR framework evaluation:** AI assesses your answer structure, highlights technical depth, and provides constructive feedback with model answers.\n- **Try it now at:** [AI Mock Interview](/candidate/mock-interviews).', 5, 1),

('sq-password-reset', 'SECURITY', 'How do I change or reset my password?', 'To update or recover your password:\n- **Change password (logged in):** Go to [Account Security](/account/security), enter your current password and choose a new one.\n- **Forgot password (logged out):** Visit the [Forgot Password](/forgot-password) page and submit your registered email. A password reset link valid for 15 minutes will be sent to your inbox.', 6, 1),

('sq-data-protection', 'POLICY', 'What is InterVue\'s personal data protection policy?', 'InterVue strictly complies with personal data privacy regulations (Decree 13/2023/ND-CP and international standards):\n- Your resume, phone number, and email are shared with recruiters only when you explicitly submit an application or consent to connect.\n- You have full rights to view, update, restrict processing, or permanently delete your account and personal data at any time.\n- Read our complete policy at: [Data Processing Agreement](/data-processing-agreement).', 7, 1);

