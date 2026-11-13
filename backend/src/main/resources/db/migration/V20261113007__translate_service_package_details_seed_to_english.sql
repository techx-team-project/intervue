-- Translate service package benefits labels and detailed sections to English (part 2: package details)
-- Note: JOB_BOOST/JOB_LABEL_URGENT/JOB_RETOP benefits and the addon-urgent/addon-retop
-- packages (and their cascaded sections) were already deleted by V20261113005, so this
-- file does not reference them.

-- Update benefit labels for all packages
UPDATE service_package_benefits b
JOIN service_packages p ON p.id = b.package_id
SET b.label = CASE
    WHEN p.slug = 'pro-trial' AND b.entitlement_type = 'JOB_POST_SLOT' THEN '1 standard IT job posting displayed for 14 days'
    WHEN p.slug = 'eco-trial' AND b.entitlement_type = 'JOB_POST_SLOT' THEN '1 standard IT job posting displayed for 14 days'
    WHEN p.slug = 'pro-max-plus' AND b.entitlement_type = 'JOB_POST_SLOT' THEN '5 job postings displayed for 30 days'
    WHEN p.slug = 'pro-max-plus' AND b.entitlement_type = 'JOB_ALERT_PUSH' THEN '8 job pushes to email & alerts (2 times/week)'
    WHEN p.slug = 'pro-max-plus' AND b.entitlement_type = 'AI_RESUME_MATCH' THEN '500 AI Resume Match analyses'
    WHEN p.slug = 'pro-max' AND b.entitlement_type = 'JOB_POST_SLOT' THEN '4 job postings displayed for 30 days'
    WHEN p.slug = 'pro-max' AND b.entitlement_type = 'JOB_ALERT_PUSH' THEN '4 job pushes to email & alerts (1 time/week)'
    WHEN p.slug = 'pro-max' AND b.entitlement_type = 'AI_RESUME_MATCH' THEN '300 AI Resume Match analyses'
    WHEN p.slug = 'eco-plus' AND b.entitlement_type = 'JOB_POST_SLOT' THEN '3 job postings displayed for 30 days'
    WHEN p.slug = 'eco-plus' AND b.entitlement_type = 'AI_RESUME_MATCH' THEN '150 AI Resume Match analyses'
    WHEN p.slug = 'standard-combo' AND b.entitlement_type = 'JOB_POST_SLOT' THEN '3 standard job postings displayed for 30 days'
    WHEN p.slug = 'addon-hot' AND b.entitlement_type = 'JOB_LABEL_HOT' THEN 'HOT label for 7 days'
    WHEN p.slug = 'addon-highlight' AND b.entitlement_type = 'JOB_HIGHLIGHT' THEN 'Featured job background for 7 days'
    WHEN p.slug = 'addon-ai-match' AND b.entitlement_type = 'AI_RESUME_MATCH' THEN '500 AI Resume Match analyses'
    WHEN p.slug = 'brand-page' AND b.entitlement_type = 'BRAND_PAGE' THEN 'Premium company profile for 30 days (up to 10 photos)'
    WHEN p.slug = 'brand-page' AND b.entitlement_type = 'FEATURED_COMPANY' THEN 'Featured in top companies for 30 days'
    ELSE b.label
END,
b.updated_at = NOW()
WHERE p.slug IN (
    'pro-trial', 'eco-trial', 'pro-max-plus', 'pro-max', 'eco-plus', 'standard-combo',
    'addon-hot', 'addon-highlight', 'addon-ai-match', 'brand-page'
);

-- Translate service package sections (detailed descriptions)

-- PRO_TRIAL: Priority placement section
UPDATE service_package_sections SET
  heading = 'Priority placement on IT Jobs page (Tier 2)',
  body = 'The **PRO TRIAL** package helps your company''s first job posting stand out in the **Featured IT Jobs** section and top search results at an optimal trial cost.

- Includes **1 job posting** displayed continuously for **14 days**.
- Applies **Tier 2 priority placement** throughout 14 days immediately after activation on your published job.
- Track views, applications, and manage resumes centrally in your Job Management dashboard.'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'pro-trial') AND display_order = 1;

UPDATE service_package_sections SET
  heading = 'Bonus 50 Credits to try AI tools & job boosts',
  body = 'Once your order is paid, the system automatically adds **50 Credits** to your company wallet to try intelligent hiring tools:

- Convert to up to **12 AI Resume Match uses** (4 credits each) for AI to score CV compatibility with your job description.
- Or use for **3 AI-generated professional job descriptions** (15 credits each).
- Accumulate more Credits through **Flex** packages to unlock job boosts, **URGENT/HOT** labels, or **Brand Page**.'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'pro-trial') AND display_order = 2;

UPDATE service_package_sections SET
  heading = 'Terms & activation guide',
  body = '1. Each company can **purchase and activate only 1 trial package** from the trial group.
2. Post your job in **Post a Job**, then go to **My Services** to activate **Tier 2 priority** directly on your published job.
3. After 14 days, your job posting remains archived with full applicant history.'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'pro-trial') AND display_order = 3;

-- ECO_TRIAL
UPDATE service_package_sections SET
  heading = 'Budget-friendly job posting experience for 14 days',
  body = 'The **ECO TRIAL** package is designed for companies new to InterVue who need to verify IT candidate quality with the most budget-friendly option.

- Own **1 job posting** displayed fully on the job list for **14 days**.
- Shows clear compensation, tech stack requirements, and lets candidates apply instantly online.
- Easily upgrade with **URGENT/HOT labels** or **Featured Job** add-ons if you need faster hiring.'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'eco-trial') AND display_order = 1;

UPDATE service_package_sections SET
  heading = 'Bonus 30 Credits to try AI tools & trial policy',
  body = '- Get **30 Credits** directly added to your wallet, equivalent to up to **7 AI Resume Match uses** or **2 AI-generated job descriptions**.
- Apply **only 1 trial package per company** policy.'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'eco-trial') AND display_order = 2;

-- PRO_MAX_PLUS
UPDATE service_package_sections SET
  heading = 'Top-tier placement — Featured IT Jobs box (Tier 3)',
  body = '**PRO MAX PLUS** is our most comprehensive package for large-scale hiring campaigns or growing engineering teams with multiple senior positions.

- Pre-loaded with **5 job postings** valid for **30 days** each.
- Ranked at **Tier 3 priority (highest)** in IT job listings and homepage, significantly boosting views and quality application rates.'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'pro-max-plus') AND display_order = 1;

UPDATE service_package_sections SET
  heading = 'Push jobs to Email & Alerts (8 times)',
  body = 'Your job postings get priority placement in **Job Alerts** sent via email and push notifications to IT candidates with matching skills and locations.

- Total of **8 job alert pushes** over 30 days (equivalent to **2 times/week**).
- Reach passive candidates with relevant experience matched to your programming language and seniority requirements.'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'pro-max-plus') AND display_order = 2;

UPDATE service_package_sections SET
  heading = 'Screen resumes fast with 500 AI Resume Matches',
  body = '- Get **500 AI Resume Match credits** to automatically compare candidate CVs against your job''s technical requirements.
- Instantly see **compatibility %**, matching skills, missing skills, and a summary score to prioritize top candidates for interviews.'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'pro-max-plus') AND display_order = 3;

UPDATE service_package_sections SET
  heading = 'Bonus URGENT label for all 5 postings (7 days)',
  body = '- Built-in **5 URGENT label activations** (each runs **7 days**) — no need to buy add-ons separately.
- Activate **URGENT** label at peak hiring times for each role in your **My Services** dashboard.'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'pro-max-plus') AND display_order = 4;

-- PRO_MAX
UPDATE service_package_sections SET
  heading = 'High priority placement (Tier 2) for 4 postings',
  body = 'The **PRO MAX** package balances excellent visibility, active candidate outreach via Job Alerts, and AI-powered CV screening tools.

- Includes **4 job postings** displayed for **30 days**.
- Activates **Tier 2 priority placement** for 30 days to keep your posting in top job list sections.'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'pro-max') AND display_order = 1;

UPDATE service_package_sections SET
  heading = 'Push jobs to alerts (4 times / 30 days)',
  body = '- Includes **4 job alert pushes** (average **1 time/week**), sent directly to IT candidates with matching skills and work locations.
- Boosts views and applications in the first week of posting.'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'pro-max') AND display_order = 2;

UPDATE service_package_sections SET
  heading = '300 AI Resume Matches for auto CV screening',
  body = '- Use **300 AI Resume Match credits** to automatically score, analyze strengths and skill gaps in every application.
- Save time on initial screening for Frontend, Backend, Mobile, QA, and Data roles.'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'pro-max') AND display_order = 3;

-- ECO_PLUS
UPDATE service_package_sections SET
  heading = 'Standard priority placement (Tier 1) for 3 postings',
  body = 'The **ECO PLUS** package suits companies hiring multiple positions at once with reasonable cost while ensuring strong coverage in search results.

- Own **3 job postings** valid for **30 days** each.
- Comes with **3 Tier 1 priority placements** for **30 days**, helping your posting rank above basic listings.'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'eco-plus') AND display_order = 1;

UPDATE service_package_sections SET
  heading = 'Built-in 150 AI Resume Matches to evaluate candidates',
  body = '- Get **150 AI Resume Match credits** to auto-evaluate candidate compatibility with your job requirements.
- Can combine with **URGENT**, **HOT** labels or **Boost to Top** add-ons as needed for urgency.'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'eco-plus') AND display_order = 2;

-- STANDARD_COMBO
UPDATE service_package_sections SET
  heading = 'Combo of 3 standard postings — budget-efficient',
  body = '**STANDARD COMBO** is our optimal budget choice for companies maintaining steady hiring across multiple engineering departments.

- Provides **3 job postings** displayed with standard placement for **30 days** each.
- Shows full salary, IT skill tags, work location, and company profile to help candidates find you easily through search filters.'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'standard-combo') AND display_order = 1;

UPDATE service_package_sections SET
  heading = 'Flexibly upgrade effects as needed',
  body = '- Unused posting credits are safely stored in your company service wallet within your plan validity period.
- When you need to boost hiring for an urgent role, you can activate **URGENT/HOT labels**, **Featured Job**, or **flexible Credits** on your active posting right away.'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'standard-combo') AND display_order = 2;

-- ADDON_HOT
UPDATE service_package_sections SET
  heading = 'HOT label — highlight your job posting',
  body = 'Adding **HOT label** puts a high-contrast **HOT** badge on your posting title across the platform for 7 days, capturing candidate attention.

- Label displays continuously for **7 days** from activation.'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'addon-hot') AND display_order = 1;

-- ADDON_HIGHLIGHT
UPDATE service_package_sections SET
  heading = 'Featured job background — stand out in lists',
  body = 'The **Featured Job** add-on displays your posting with a prominent highlighted background in the job list for the entire period.

- Highlighted background displays for **7 days** from activation.'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'addon-highlight') AND display_order = 1;

-- ADDON_AI_MATCH
UPDATE service_package_sections SET
  heading = 'AI Resume Matching — smart candidate evaluation',
  body = '- Get **500 additional AI Resume Match credits** to evaluate candidate compatibility.
- Each use automatically compares a CV against your job description and provides compatibility scoring.'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'addon-ai-match') AND display_order = 1;

-- BRAND_PAGE
UPDATE service_package_sections SET
  heading = 'Premium company profile — build your employer brand',
  body = 'The **BRAND PAGE** package upgrades your company profile with:

- Cover photo, photo gallery (up to 10 culturally-relevant images), and company introduction video
- Priority listing in the Featured Companies section for 30 days
- Stronger employer branding to attract top talent'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'brand-page') AND display_order = 1;

UPDATE service_package_sections SET
  heading = 'Featured in top companies — increased visibility',
  body = '- Your company gets **priority placement** in the Featured Companies section for **30 days**.
- Increased visibility helps attract senior candidates actively looking for great places to work.'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'brand-page') AND display_order = 2;
