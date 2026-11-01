# Recruiter Flows and Company Verification

## Recruiter Role Overview
Any registered user on InterVue can represent an employer by accessing the Recruiter Workspace. A single user account can seamlessly transition between candidate job hunting and enterprise recruitment without managing multiple logins. Recruiters post job vacancies, manage applicants through hiring pipelines, schedule interviews, and leverage AI to evaluate candidate qualifications.

## How to Verify Your Company (Company Verification Process)
To maintain a safe, trusted IT hiring ecosystem and prevent fraudulent job listings, InterVue implements an employer verification system. Employers must verify their business before publishing public job listings and receiving candidate applications.

The verification process consists of 5 clear steps accessible at `/recruiter/company/verification`:
1. Verify Phone Number: Complete mobile SMS OTP authentication to secure the recruiter account.
2. Complete Company Profile: Provide registered corporate information, business tax identification number (MST), official headquarters address, and company website.
3. Submit Business License or Authorization: Upload an official Enterprise Registration Certificate (ERC / Giấy chứng nhận đăng ký doanh nghiệp) or an authorized Letter of Representation.
4. Accept Candidate Data Processing Agreement: Review and sign the legal data processing agreement ensuring lawful processing of candidate CVs and personal data in strict compliance with Vietnamese Decree No. 13/2023/ND-CP on Personal Data Protection.
5. Accept Platform Data Agreement: Confirm agreement to InterVue terms of service and recruitment exchange policies.

Once documents are submitted, platform administrators review and approve the verification request within 24 business hours.

## Company Verification Levels and Perks
InterVue offers three tiers of enterprise verification:

### Level 1: Basic Account
- Requirements: Work email verified.
- Capabilities: Explore the platform, configure recruitment requirements, and prepare up to 3 draft job listings.
- Restrictions: Cannot publish listings to the public job board; cannot receive candidate CVs.

### Level 2: Standard Employer
- Requirements: Phone OTP verified + Candidate & Platform Data Processing Agreements accepted.
- Capabilities: Publish up to 10 active job listings, review submitted candidate applications, and access basic AI match insights.
- Restrictions: Pending full enterprise verified trust badge.

### Level 3: Verified Enterprise
- Requirements: Official Business License (ERC) reviewed and approved by InterVue Administrators.
- Capabilities: Awarded the official Verified Employer green checkmark badge, priority search ranking for job listings, unlimited active job posts, and direct messaging outreach to top candidates.

## Job Posting and Campaign Management
Recruiters create job listings with clear, structured specifications:
- Core Information: Job title, position category, required experience level, and contract type (Full-time, Part-time, Internship).
- Workplace Mode: On-site office address, Hybrid, Remote, or Flexible.
- Transparent Compensation: Stated monthly salary range or marked as negotiable.
- Standardized Tech Stack: Tagging primary and secondary programming languages, frameworks, databases, and DevOps tools.
- Screening Questionnaires: Recruiters can configure up to 5 custom screening questions (single-choice, multiple-choice, or short technical text) to filter incoming applications.

## Applicant Management and Kanban Board
Recruiters track candidates through an interactive swimlane Kanban board:
- Pipeline Columns: New Applications (`APPLIED`), Under Review (`IN_REVIEW`), Scheduled for Interview (`INTERVIEW`), Offer Extended (`OFFER`), and Finalized (`HIRED` or `REJECTED`).
- AI Match Score Ring: AI automatically compares the candidate's CV against the job requirements, displaying a compatibility percentage (e.g., 85% match) alongside key matching strengths and missing keywords.
- Decision Control: AI provides advisory recommendations only. Recruiters make all final decisions to advance, interview, offer, or reject applicants.

