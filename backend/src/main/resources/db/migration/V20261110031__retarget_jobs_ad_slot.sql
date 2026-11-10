UPDATE ad_slots
   SET code = 'JOBS_TOP',
       name = 'Trang tìm việc - Đầu danh sách',
       description = 'Dải ngang ngay trên danh sách kết quả, theo ứng viên suốt phiên tìm kiếm.',
       width = 1200,
       height = 160
 WHERE code = 'JOBS_SIDEBAR';

UPDATE service_packages
   SET short_description = 'Dải banner ngang đầu danh sách việc làm, hiển thị với ứng viên đang chủ động tìm kiếm. Giá tính theo tuần.'
 WHERE code = 'BANNER_JOBS_SIDE';
