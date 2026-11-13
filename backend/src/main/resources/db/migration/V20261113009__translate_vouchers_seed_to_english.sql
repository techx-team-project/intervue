-- Translate vouchers to English (part 4: voucher seed data)
-- Note: vouchers are identified by the `code` column (not `slug`). ribbon_label values
-- in the seed data are already English and are left untouched.

UPDATE vouchers SET
  label = '25% off total order value',
  description = 'Save up to 2,500,000 VND on service orders from 2,000,000 VND.'
WHERE code = 'INTERVUE25';

UPDATE vouchers SET
  label = '20% off total order value',
  description = 'Save up to 2,000,000 VND on service orders from 1,500,000 VND.'
WHERE code = 'INTERVUE20';

UPDATE vouchers SET
  label = '15% off for new recruiters',
  description = '15% off total order, up to 1,500,000 VND, applies to all service packages.'
WHERE code = 'NEWBIE15';

UPDATE vouchers SET
  label = 'Save 500,000 VND on orders from 3,000,000 VND',
  description = 'Direct discount of 500,000 VND on service orders from 3,000,000 VND or more.'
WHERE code = 'SAVE500K';

UPDATE vouchers SET
  label = '15% off flexible Credit packages',
  description = 'Save up to 1,500,000 VND when buying Flex Credit packages (Flex Basic, Flex Pro).',
  conditions_json = '["Applies only to Flex Basic and Flex Pro packages (pre-VAT price)","Orders from 6,000,000 VND, maximum discount 1,500,000 VND","Each company can use up to 2 times in this program"]'
WHERE code = 'FLEX15';

UPDATE vouchers SET
  label = 'Save 800,000 VND on Brand Page upgrade',
  description = 'Direct discount of 800,000 VND for employer branding with Brand Page package.',
  conditions_json = '["Applies only to Brand Page package (pre-VAT price)","Minimum order value 5,000,000 VND","Each company can use only 1 time in this program"]'
WHERE code = 'BRAND800K';

UPDATE vouchers SET
  label = 'Save 1,000,000 VND on Pro Max & Plus',
  description = '1,000,000 VND discount when signing up for Pro Max or Pro Max Plus packages.',
  conditions_json = '["Applies only to Pro Max and Pro Max Plus packages (pre-VAT price)","Minimum order value 7,500,000 VND","Each company can use up to 2 times in this program"]'
WHERE code = 'PROMAX1M';

UPDATE vouchers SET
  label = '20% off add-on services',
  description = '20% off (up to 400,000 VND) on URGENT label, HOT label, featured job, and boost to top.',
  conditions_json = '["Applies to URGENT label, HOT label, Featured Job, and Boost to Top add-ons","Orders from 1,000,000 VND, maximum discount 400,000 VND","Each company can use up to 3 times"]'
WHERE code = 'ADDON20';

UPDATE vouchers SET
  label = 'Save 500,000 VND on banner ads placement',
  description = 'Applies to all banner packages on homepage and job listings, sold by week.',
  conditions_json = '["Applies to Banner Homepage (Top/Middle) and Banner Job Listings packages","Orders from 2,000,000 VND or more (pre-VAT)","Each company can use up to 2 times"]'
WHERE code = 'BANNER500K';

UPDATE vouchers SET
  label = 'Save 1,500,000 VND on large orders',
  description = 'Special offer for large-scale hiring orders from 10,000,000 VND or more (pre-VAT).',
  conditions_json = '["Applies to all service package list prices (pre-VAT)","Total order value from 10,000,000 VND or more","Cannot be combined with other discount codes"]'
WHERE code = 'ENTERPRISE1M5';

UPDATE vouchers SET
  label = '20% off AI tools packages',
  description = 'Save up to 500,000 VND when buying AI Resume Match or AI JD Generator add-ons.',
  conditions_json = '["Applies to AI Resume Match and AI JD Generator add-on packages","Orders from 1,200,000 VND, maximum discount 500,000 VND","Each company can use up to 2 times"]'
WHERE code = 'AITOOLS20';

UPDATE vouchers SET
  label = 'Save 200,000 VND on trial packages',
  description = 'Direct discount of 200,000 VND when signing up for Eco Trial or Pro Trial packages.',
  conditions_json = '["Applies only to Eco Trial and Pro Trial packages (pre-VAT price)","Minimum order value 890,000 VND","Each company can use only 1 time"]'
WHERE code = 'TRIAL200K';

UPDATE vouchers SET
  label = '18% off growth hiring orders',
  description = 'Save up to 3,000,000 VND on any service package worth 5,000,000 VND or more.',
  conditions_json = '["Applies on list price of all service packages (pre-VAT)","Minimum order value 5,000,000 VND, maximum discount 3,000,000 VND","Each company can use up to 2 times"]'
WHERE code = 'GROWTH18';

UPDATE vouchers SET
  label = 'Save 1,000,000 VND on Top Jobs packages',
  description = 'Applies when signing up for Eco Plus, Pro Max, or Pro Max Plus packages.',
  conditions_json = '["Applies to Eco Plus, Pro Max, and Pro Max Plus packages","Minimum order value 4,400,000 VND (pre-VAT price)","Each company can use up to 2 times"]'
WHERE code = 'TOPJOB1M';

UPDATE vouchers SET
  label = 'Save 300,000 VND on Standard Combo',
  description = 'Save 300,000 VND when buying the budget-friendly Standard Combo job posting package.',
  conditions_json = '["Applies only to Standard Combo package (pre-VAT price)","Minimum order value 2,550,000 VND","Each company can use up to 3 times"]'
WHERE code = 'STD300K';

UPDATE vouchers SET
  label = 'Save 500,000 VND on Eco Plus',
  description = 'Direct discount of 500,000 VND for companies signing up for the 30-day Eco Plus package.',
  conditions_json = '["Applies only to Eco Plus package (pre-VAT price)","Minimum order value 4,400,000 VND","Each company can use up to 2 times"]'
WHERE code = 'ECO500K';

UPDATE vouchers SET
  label = 'Save 250,000 VND on Boost to Top add-on',
  description = '250,000 VND discount to keep your job posting at the top of the job list.',
  conditions_json = '["Applies only to the Boost to Top add-on package","Minimum order value 1,500,000 VND (pre-VAT price)","Each company can use up to 3 times"]'
WHERE code = 'RETOP250K';

UPDATE vouchers SET
  label = 'Save 600,000 VND on Flex Pro upgrade',
  description = 'Save 600,000 VND when buying the 9,000-credit Flex Pro package for long-term flexible use.',
  conditions_json = '["Applies only to Flex Pro package (pre-VAT price)","Minimum order value 8,000,000 VND","Each company can use up to 2 times"]'
WHERE code = 'CREDIT600K';

UPDATE vouchers SET
  label = 'Save 700,000 VND on Homepage Top banner',
  description = '700,000 VND discount on the Banner Homepage Top package for maximum homepage visibility.',
  conditions_json = '["Applies only to the Banner Homepage - Top package","Minimum order value 4,000,000 VND (pre-VAT price)","Each company can use up to 2 times"]'
WHERE code = 'HOMEPAGE700K';

UPDATE vouchers SET
  label = 'Save 150,000 VND on URGENT & HOT labels',
  description = 'Direct discount of 150,000 VND to help your job posting attract faster applications.',
  conditions_json = '["Applies to the URGENT label and HOT label add-on packages","Orders from 1,000,000 VND or more","Each company can use up to 4 times"]'
WHERE code = 'URGENT150K';

UPDATE vouchers SET
  label = 'Flash Sale 12% off orders from 3,500,000 VND',
  description = '12% off, up to 2,000,000 VND, on any recruitment service package during the Flash Sale.',
  conditions_json = '["Applies to all service packages for orders from 3,500,000 VND","Maximum discount 2,000,000 VND per order","Each company can use up to 2 times"]'
WHERE code = 'FLASH12';

UPDATE vouchers SET
  label = 'Save 250,000 VND on Pro Trial signup',
  description = 'Special offer for the Pro Trial package with 50 bonus credits and 14 days of priority placement.',
  conditions_json = '["Applies only to Pro Trial package (pre-VAT price)","Minimum order value 1,490,000 VND","Each company can use only 1 time"]'
WHERE code = 'PROTRIAL250';

UPDATE vouchers SET
  label = '12% off employer branding packages',
  description = '12% off (up to 1,200,000 VND) on the Brand Page package and banner ad placements.',
  conditions_json = '["Applies to Brand Page package and banner ad packages","Minimum order value 2,000,000 VND, maximum discount 1,200,000 VND","Each company can use up to 2 times"]'
WHERE code = 'BRAND12';

UPDATE vouchers SET
  label = '15% off peak hiring campaigns',
  description = 'Save up to 2,200,000 VND on service orders from 4,000,000 VND during peak hiring season.',
  conditions_json = '["Applies on list price of all service packages (pre-VAT)","Minimum order value 4,000,000 VND, maximum discount 2,200,000 VND","Each company can use up to 2 times"]'
WHERE code = 'Q4HIRING15';
