UPDATE service_package_benefits
    SET label = 'Ưu tiên xuất hiện trong email gợi ý việc làm (8 lượt)'
    WHERE entitlement_type = 'JOB_ALERT_PUSH' AND quantity = 8;

UPDATE service_package_benefits
    SET label = 'Ưu tiên xuất hiện trong email gợi ý việc làm (4 lượt)'
    WHERE entitlement_type = 'JOB_ALERT_PUSH' AND quantity = 4;
