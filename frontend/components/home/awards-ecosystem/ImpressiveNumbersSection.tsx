export default function ImpressiveNumbersSection() {
  return (
    <section id="impressive-numbers" className="container-topcv">
      <div className="rounded-3xl border border-[#e9eaec] bg-white p-8 shadow-xs md:p-10">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-[#263a4d] md:text-3xl">Con số ấn tượng</h2>
          <p className="mt-1 text-[14.5px] text-[#6f7882]">
            Khẳng định vị thế nền tảng công nghệ nhân sự số 1 tại Việt Nam
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
          <div className="border-r border-[#f4f5f5] p-4 last:border-none">
            <div className="mb-1 text-3xl font-extrabold text-[#00b14f] lg:text-4xl">500.000+</div>
            <div className="text-[14px] font-semibold text-[#263a4d]">Nhà tuyển dụng uy tín</div>
          </div>

          <div className="border-[#f4f5f5] p-4 md:border-r">
            <div className="mb-1 text-3xl font-extrabold text-[#00b14f] lg:text-4xl">200.000+</div>
            <div className="text-[14px] font-semibold text-[#263a4d]">Doanh nghiệp tin dùng</div>
          </div>

          <div className="border-r border-[#f4f5f5] p-4 last:border-none">
            <div className="mb-1 text-3xl font-extrabold text-[#00b14f] lg:text-4xl">10.000.000+</div>
            <div className="text-[14px] font-semibold text-[#263a4d]">Việc làm đã kết nối</div>
          </div>

          <div className="p-4">
            <div className="mb-1 text-3xl font-extrabold text-[#00b14f] lg:text-4xl">6.000.000+</div>
            <div className="text-[14px] font-semibold text-[#263a4d]">Lượt tải ứng dụng</div>
          </div>
        </div>
      </div>
    </section>
  );
}
