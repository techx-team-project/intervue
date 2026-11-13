-- Translate service categories and packages to English (part 1: service catalog)
-- Note: CREDIT category, FLEX_BASIC/FLEX_PRO packages (V20261113003/004) and the
-- JOB_BOOST/JOB_LABEL_URGENT/JOB_RETOP benefits plus addon-urgent/addon-retop
-- packages (V20261113005) were already deleted by earlier migrations, so this
-- file does not reference them.

UPDATE service_categories SET
  headline = 'FREE TRIAL JOB POSTING',
  description = 'Experience effective job posting at optimal cost. Each company can purchase and activate only 1 trial package.'
WHERE code = 'TRIAL';

UPDATE service_categories SET
  headline = 'HIGH-PERFORMANCE JOB POSTING',
  description = 'Harness the power of technology for breakthrough results in your job postings.'
WHERE code = 'TOP_JOBS';

UPDATE service_categories SET
  headline = 'BUDGET-FRIENDLY JOB POSTING',
  description = 'Optimize costs while maintaining competitive advantages for recruiters.'
WHERE code = 'STANDARD';

UPDATE service_categories SET
  headline = 'ADD-ON SERVICES',
  description = 'Additional options to make your job posting stand out with candidates. Services apply only to jobs running Top Jobs packages.'
WHERE code = 'ADD_ON';

UPDATE service_categories SET
  headline = 'EMPLOYER BRANDING',
  description = 'Build a trusted employer brand and enhance your hiring effectiveness.'
WHERE code = 'BRANDING';

-- Translate service packages

UPDATE service_packages SET
  name = 'PRO TRIAL',
  short_description = 'Experience effective job posting with priority placement, backed by an attractive trial price.'
WHERE slug = 'pro-trial';

UPDATE service_packages SET
  name = 'ECO TRIAL',
  short_description = 'Experience budget-friendly job posting paired with other services, at an attractive trial price.'
WHERE slug = 'eco-trial';

UPDATE service_packages SET
  name = 'PRO MAX PLUS',
  short_description = 'Effective job posting with top-tier placement, 2x job boosts, AI Resume Match, and job replacement guarantee.'
WHERE slug = 'pro-max-plus';

UPDATE service_packages SET
  name = 'PRO MAX',
  short_description = 'Effective job posting with prominent placement, AI Resume Match, and priority benefits.'
WHERE slug = 'pro-max';

UPDATE service_packages SET
  name = 'ECO PLUS',
  short_description = 'Budget-friendly job posting with priority placement and AI Resume Match.'
WHERE slug = 'eco-plus';

UPDATE service_packages SET
  name = 'STANDARD COMBO',
  short_description = 'Budget-friendly job posting with priority placement over basic listings.'
WHERE slug = 'standard-combo';

UPDATE service_packages SET
  name = 'ADD-ON HOT LABEL',
  short_description = 'Tag your job posting with "HOT" label in the title.'
WHERE slug = 'addon-hot';

UPDATE service_packages SET
  name = 'ADD-ON FEATURED JOB',
  short_description = 'Display your job posting with a highlighted background in the job list.'
WHERE slug = 'addon-highlight';

UPDATE service_packages SET
  name = 'ADD-ON AI RESUME MATCH',
  short_description = 'Add 500 AI-powered candidate compatibility analyses for job postings.'
WHERE slug = 'addon-ai-match';

UPDATE service_packages SET
  name = 'BRAND PAGE',
  short_description = 'Upgrade your company profile with cover photo, photo album, video introduction, and priority listing in Featured Companies.'
WHERE slug = 'brand-page';

-- Translate service package benefits

UPDATE service_package_benefits SET label = '1 job posting for 14 days'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'pro-trial')
  AND entitlement_type = 'JOB_POST_SLOT';

UPDATE service_package_benefits SET label = '1 job posting for 14 days'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'eco-trial')
  AND entitlement_type = 'JOB_POST_SLOT';

UPDATE service_package_benefits SET label = '5 job postings for 30 days'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'pro-max-plus')
  AND entitlement_type = 'JOB_POST_SLOT';

UPDATE service_package_benefits SET label = 'Push jobs to alerts twice per week'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'pro-max-plus')
  AND entitlement_type = 'JOB_ALERT_PUSH';

UPDATE service_package_benefits SET label = '500 AI Resume Match analyses'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'pro-max-plus')
  AND entitlement_type = 'AI_RESUME_MATCH';

UPDATE service_package_benefits SET label = '4 job postings for 30 days'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'pro-max')
  AND entitlement_type = 'JOB_POST_SLOT';

UPDATE service_package_benefits SET label = 'Push jobs to alerts once per week'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'pro-max')
  AND entitlement_type = 'JOB_ALERT_PUSH';

UPDATE service_package_benefits SET label = '300 AI Resume Match analyses'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'pro-max')
  AND entitlement_type = 'AI_RESUME_MATCH';

UPDATE service_package_benefits SET label = '3 job postings for 30 days'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'eco-plus')
  AND entitlement_type = 'JOB_POST_SLOT';

UPDATE service_package_benefits SET label = '150 AI Resume Match analyses'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'eco-plus')
  AND entitlement_type = 'AI_RESUME_MATCH';

UPDATE service_package_benefits SET label = '3 job postings for 30 days'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'standard-combo')
  AND entitlement_type = 'JOB_POST_SLOT';

UPDATE service_package_benefits SET label = 'HOT label for 7 days'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'addon-hot')
  AND entitlement_type = 'JOB_LABEL_HOT';

UPDATE service_package_benefits SET label = 'Featured job background for 7 days'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'addon-highlight')
  AND entitlement_type = 'JOB_HIGHLIGHT';

UPDATE service_package_benefits SET label = '500 AI Resume Match analyses'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'addon-ai-match')
  AND entitlement_type = 'AI_RESUME_MATCH';

UPDATE service_package_benefits SET label = 'Premium company profile for 30 days'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'brand-page')
  AND entitlement_type = 'BRAND_PAGE';

UPDATE service_package_benefits SET label = 'Featured in top companies for 30 days'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'brand-page')
  AND entitlement_type = 'FEATURED_COMPANY';
