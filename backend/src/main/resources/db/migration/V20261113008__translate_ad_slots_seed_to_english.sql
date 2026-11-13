-- Translate ad slots and banner service packages to English (part 3: ads module)

-- Update BANNER service category
UPDATE service_categories SET
  headline = 'PLATFORM ADVERTISING DISPLAYS',
  description = 'Place your brand banner at high-traffic locations, sold by week with exclusive placement per week.'
WHERE code = 'BANNER';

-- Update ad banner service packages
UPDATE service_packages SET
  name = 'BANNER HOMEPAGE - TOP',
  short_description = 'Homepage top position banner, one company per week. Priced per week.'
WHERE slug = 'banner-home-top';

UPDATE service_packages SET
  name = 'BANNER HOMEPAGE - MIDDLE',
  short_description = 'Homepage middle position between featured jobs and top companies sections. Priced per week.'
WHERE slug = 'banner-home-mid';

UPDATE service_packages SET
  name = 'BANNER JOB LISTINGS',
  short_description = 'Banner strip at top of job search results, displayed to candidates actively job hunting. Priced per week.'
WHERE slug = 'banner-jobs-side';

-- Update ad slot benefit labels
UPDATE service_package_benefits SET
  label = '1 week of homepage top banner display'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'banner-home-top')
  AND entitlement_type = 'AD_SLOT_WEEK';

UPDATE service_package_benefits SET
  label = '1 week of homepage middle banner display'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'banner-home-mid')
  AND entitlement_type = 'AD_SLOT_WEEK';

UPDATE service_package_benefits SET
  label = '1 week of job listings banner display'
WHERE package_id = (SELECT id FROM service_packages WHERE slug = 'banner-jobs-side')
  AND entitlement_type = 'AD_SLOT_WEEK';

-- Update ad_slots names and descriptions
UPDATE ad_slots SET
  name = 'Homepage - Top',
  description = 'Right below the homepage search bar, prime above-the-fold position.'
WHERE code = 'HOME_TOP';

UPDATE ad_slots SET
  name = 'Homepage - Middle',
  description = 'Between featured jobs section and top companies section.'
WHERE code = 'HOME_MID';

UPDATE ad_slots SET
  name = 'Job listings - Top',
  description = 'Banner strip right above job search results, displayed to actively searching candidates throughout their session.'
WHERE code = 'JOBS_TOP';
