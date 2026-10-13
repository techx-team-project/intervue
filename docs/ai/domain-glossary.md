# Domain Glossary

Use these terms consistently in code, DB, API and UI. English identifier first; Vietnamese UI label in parentheses.

## Actors

| Term | Meaning |
|---|---|
| **User / Account** | One email login. Can hold several roles. |
| **Candidate** (Ứng viên) | IT job seeker or intern. Must pass **identity verification** before applying. |
| **Recruiter** (Nhà tuyển dụng) | Person hiring for a company. A role, not a company. |
| **Admin** (Quản trị viên) | Platform operator: accounts, verification review, moderation, reports. |
| **Company** (Doanh nghiệp) | Entity a Recruiter represents. **Not a role.** Must be **verified** before posting jobs. |
| **Guest** (Khách) | Not logged in. |

## Hiring

| Term | Meaning |
|---|---|
| **Job / Job Post** (Tin tuyển dụng) | A vacancy created by a Recruiter for a Company. |
| **Contract type** | Full-time, part-time, internship. |
| **Working arrangement** | On-site, Hybrid, Remote, Flexible. |
| **Level** | Seniority (intern, junior, mid, senior, lead...). |
| **Salary** | `min`, `max`, `currency`, `period` (monthly) or **negotiable**. |
| **Application** (Hồ sơ ứng tuyển) | A Candidate's submission to one Job with a chosen CV. One per Candidate+Job. |
| **Application status** | `APPLIED → IN_REVIEW → INTERVIEW → OFFER → HIRED`; terminal alternatives `REJECTED`, `WITHDRAWN`, `NO_AGREEMENT`. Transitions are defined in one place. |
| **Screening question** | Optional questions a Recruiter attaches to a Job. |
| **Assessment** (Bài đánh giá) | Optional test the Candidate takes during screening (future: AI-assisted). |
| **Hire confirmation** | Both sides confirm the Candidate accepted the job. |

## Candidate data

| Term | Meaning |
|---|---|
| **Profile** | Personal info, intro, experience, skills, projects, education, certificates, languages, job expectations. |
| **CV** | Uploaded document file. A Candidate has several; one is the **default CV**. |
| **Job search status** | Whether the Candidate is open to work. |
| **Visibility** | Hide personal info from Recruiters / allow or disallow being found. |
| **Saved Job** | Bookmarked Job. |
| **Job Alert** | Saved search that notifies the Candidate about new matches. |
| **Follow** | Candidate follows a Company. |
| **Cover Letter** | Letter attached to an Application; can be AI-generated. |

## Trust & security

| Term | Meaning |
|---|---|
| **eKYC / Identity verification** | Candidate submits ID documents; statuses: pending, approved, rejected (with reason), manual review requested. |
| **Company verification** | Admin-reviewed proof that a Company is real. |
| **Two-factor authentication (2FA)** | TOTP + recovery codes. |
| **Device / Session** | A refresh-token record; can be logged out individually or all at once. |
| **Soft delete / Restore** | Account deletion is reversible within a retention window. |

## AI

| Term | Meaning |
|---|---|
| **CV feedback** | AI score and suggestions: general, by desired position, or fit against a Job. |
| **Mock interview** | AI-driven practice session with feedback and history. |
| **Job recommendation** | AI-ranked jobs for a Candidate. |
| **Profile auto-fill** | AI extracts profile fields from a CV; Candidate accepts or rejects each suggestion. |
| **Resume match** | AI compares an Application to a Job for the Recruiter: evidence-based, with "ask more about" hints. Missing info ≠ lacking skill. |
| **Help chatbot (RAG)** | Answers platform-usage questions from docs/FAQ; separate from screening AI. |
| **Human-in-the-loop** | AI never auto-accepts or auto-rejects; Recruiter decides; users are told when AI processes their data. |

## Technical terms used in this repo

| Term | Meaning |
|---|---|
| **Request / Resource** | Inbound DTO / outbound DTO (never entities). |
| **ApiResource** | Standard response envelope with `success, message, data, error, traceId, timestamp`. |
| **traceId** | Per-request id in MDC and in every response; quote it in bug reports. |
| **Module** | Feature package under `modules/` (user, candidate, company, job, application, ai, ...). |
