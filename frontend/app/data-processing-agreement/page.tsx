import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { ROUTES } from '@/constants/routes';
import { ArrowLeft, CheckCircle2, Download, FileText, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thỏa thuận về xử lý Dữ liệu cá nhân | InterVue',
  description:
    'Thỏa thuận về xử lý Dữ liệu cá nhân giữa InterVue và Nhà tuyển dụng tuân thủ Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Nghị định 13/2023/NĐ-CP.',
};

export default function DataProcessingAgreementPage() {
  const tableOfContents = [
    { id: 'preamble', title: 'Cơ sở xác lập thỏa thuận' },
    { id: 'dieu-1', title: 'Điều 1. Giải thích thuật ngữ' },
    { id: 'dieu-2', title: 'Điều 2. Mục đích xử lý dữ liệu cá nhân' },
    { id: 'dieu-3', title: 'Điều 3. Trách nhiệm của các bên' },
    { id: 'dieu-4', title: 'Điều 4. Lưu trữ dữ liệu cá nhân' },
    { id: 'dieu-5', title: 'Điều 5. Quyền yêu cầu' },
    { id: 'dieu-6', title: 'Điều 6. Kiểm tra tuân thủ' },
    { id: 'dieu-7', title: 'Điều 7. Nguyên tắc bồi thường' },
    { id: 'dieu-8', title: 'Điều 8. Giải quyết tranh chấp và đầu mối liên hệ' },
    { id: 'dieu-9', title: 'Điều 9. Hiệu lực' },
  ];

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#f4f5f5] font-sans text-slate-800 antialiased">
      {/* Official Header */}
      <Header portal="recruiter" />

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb & Actions Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-[#00b14f]">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href={ROUTES.RECRUITER_COMPANY} className="hover:text-[#00b14f]">
              Nhà tuyển dụng
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-800">Thỏa thuận xử lý dữ liệu cá nhân</span>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={ROUTES.RECRUITER_COMPANY_AGREEMENTS}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Quay lại Cài đặt tài khoản</span>
            </Link>
            <a
              href="/templates/intervue-candidate-data-processing-agreement-template.docx"
              download="intervue-candidate-data-processing-agreement-template.docx"
              className="inline-flex items-center gap-1.5 rounded-md border border-[#00b14f] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#00b14f] shadow-2xs transition hover:bg-emerald-50 active:scale-95"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Tải mẫu văn bản (.docx)</span>
            </a>
          </div>
        </div>

        {/* 2-Column Layout: Sidebar Table of Contents + Document Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Sticky Table of Contents (4 cols) */}
          <aside className="lg:col-span-4">
            <div className="sticky top-20 rounded-lg border border-slate-200/90 bg-white p-5 shadow-2xs">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <FileText className="h-4 w-4 text-[#00b14f]" />
                <h2 className="text-xs font-bold tracking-wider text-slate-800 uppercase">Mục lục văn bản</h2>
              </div>

              <nav className="mt-3 space-y-1 text-xs leading-relaxed">
                {tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block rounded-md px-2.5 py-2 font-medium text-slate-600 transition hover:bg-emerald-50 hover:text-[#00b14f]"
                  >
                    {item.title}
                  </a>
                ))}
              </nav>

              <div className="mt-6 space-y-1 border-t border-slate-100 pt-4 text-[11px] text-slate-500">
                <p>
                  <strong>Hiệu lực:</strong> Từ 17 tháng 06 năm 2026
                </p>
                <p>
                  <strong>Căn cứ:</strong> Luật số 91/2025/QH15 &amp; NĐ 13/2023/NĐ-CP
                </p>
                <p>
                  <strong>Đơn vị chủ quản:</strong> Công ty CP Công nghệ TechX Global
                </p>
              </div>
            </div>
          </aside>

          {/* Right Column: Full Document Body (8 cols) */}
          <article className="space-y-8 rounded-lg border border-slate-200/90 bg-white p-6 shadow-2xs sm:p-10 lg:col-span-8">
            {/* Title Section */}
            <div className="border-b border-slate-200 pb-6 text-center">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-[#00b14f]">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Bảo vệ dữ liệu cá nhân theo quy định pháp luật</span>
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase sm:text-2xl">
                THỎA THUẬN VỀ XỬ LÝ DỮ LIỆU CÁ NHÂN GIỮA INTERVUE VÀ NHÀ TUYỂN DỤNG
              </h1>
              <p className="mt-2 text-xs text-slate-500 italic sm:text-sm">Có hiệu lực từ 17 tháng 06 năm 2026</p>
            </div>

            {/* Preamble / Cơ sở xác lập */}
            <section id="preamble" className="space-y-3 text-xs leading-relaxed text-slate-700 sm:text-sm">
              <p>
                Thỏa thuận về xử lý dữ liệu cá nhân này (Sau đây gọi tắt là “Thỏa Thuận”) được thiết lập, giao kết giữa:
              </p>
              <div className="space-y-2 rounded-lg border border-slate-100 bg-slate-50/60 p-4 text-xs">
                <p>
                  <strong>1. CÔNG TY CỔ PHẦN CÔNG NGHỆ TECHX GLOBAL</strong>
                  <br />
                  <span className="text-slate-500">(Sau đây gọi tắt là &ldquo;InterVue&rdquo;)</span>
                </p>
                <p className="font-semibold text-slate-500">Và</p>
                <p>
                  <strong>2. ĐƠN VỊ TUYỂN DỤNG</strong> là tổ chức, doanh nghiệp hoặc cá nhân đăng ký, sử dụng tài khoản
                  Nhà tuyển dụng trên nền tảng InterVue
                  <br />
                  <span className="text-slate-500">(Sau đây gọi tắt là &ldquo;Đơn vị tuyển dụng&rdquo;)</span>
                </p>
              </div>

              <p className="text-slate-600 italic">
                InterVue và Đơn vị tuyển dụng sau đây được gọi chung là “Các Bên” / “Hai Bên” và được gọi riêng là
                “Bên”.
              </p>

              <div className="space-y-1.5 pt-2">
                <p className="font-bold text-slate-800">TRÊN CƠ SỞ:</p>
                <p>
                  (i). Đơn vị tuyển dụng là một pháp nhân được thành lập và hoạt động hợp pháp theo pháp luật Việt Nam,
                  có nhu cầu sử dụng các dịch vụ do InterVue cung cấp.
                </p>
                <p>
                  (ii). Trong quá trình thực hiện Điều khoản sử dụng dịch vụ và/hoặc hợp đồng dịch vụ tuyển dụng giữa
                  InterVue và Đơn vị tuyển dụng, nhằm thực hiện mục đích xử lý dữ liệu cá nhân phù hợp với quy định pháp
                  luật, InterVue cung cấp và duy trì cho Đơn vị tuyển dụng một không gian làm việc kỹ thuật số biệt lập
                  trên nền tảng của InterVue.
                </p>
                <p>
                  (iii). Nhằm bảo vệ quyền và lợi ích hợp pháp của mỗi Bên trong việc thực hiện các yêu cầu xử lý dữ
                  liệu cá nhân cần thiết cho giao dịch, Các Bên thỏa thuận và cam kết về việc xử lý dữ liệu cá nhân theo
                  quy định pháp luật Việt Nam hiện hành.
                </p>
              </div>

              <p className="pt-2 font-semibold text-slate-800">
                DO ĐÓ, Các Bên thống nhất ký kết Thỏa thuận về xử lý dữ liệu cá nhân này (&ldquo;Thỏa Thuận&rdquo;) với
                các điều khoản cụ thể như sau:
              </p>
            </section>

            {/* ĐIỀU 1 */}
            <section id="dieu-1" className="space-y-3 border-t border-slate-100 pt-4">
              <h3 className="text-base font-bold text-slate-900">ĐIỀU 1. GIẢI THÍCH THUẬT NGỮ</h3>
              <div className="space-y-2.5 text-xs leading-relaxed text-slate-700 sm:text-sm">
                <p>
                  <strong>1.1. &ldquo;Workplace&rdquo;</strong> là không gian làm việc kỹ thuật số biệt lập được
                  InterVue thiết lập và duy trì dành riêng cho Đơn vị tuyển dụng trên nền tảng của InterVue.
                </p>
                <p>
                  <strong>1.2. &ldquo;Dữ liệu cá nhân&rdquo;</strong> là dữ liệu số hoặc thông tin dưới dạng khác xác
                  định hoặc giúp xác định một con người cụ thể, bao gồm: dữ liệu cá nhân cơ bản và dữ liệu cá nhân nhạy
                  cảm theo quy định của Pháp luật bảo vệ dữ liệu cá nhân. Trong phạm vi Thỏa thuận này, Dữ liệu cá nhân
                  bao gồm:
                  <br />
                  (i) Các dữ liệu cá nhân được lưu trữ, hiển thị và xử lý trong phạm vi Workplace;
                  <br />
                  (ii) Các dữ liệu được xử lý thông qua các phương thức tích hợp, kết nối kỹ thuật khác với Workspace
                  thuộc phạm vi Dịch vụ do InterVue cung cấp cho Đơn vị tuyển dụng theo Hợp đồng;
                  <br />
                  (iii) Các dữ liệu thuộc quyền sở hữu hợp pháp của Đơn vị tuyển dụng hoặc do Đơn vị tuyển dụng tự thu
                  thập từ các nguồn khác phù hợp với quy định pháp luật và chuyển lên Workspace của InterVue để thực
                  hiện các thao tác kỹ thuật, lưu trữ hoặc xử lý theo chỉ thị (Nếu có).
                </p>
                <p>
                  <strong>1.3. &ldquo;Chủ thể dữ liệu&rdquo;</strong> là các ứng viên ứng tuyển và đồng ý kết nối với
                  Đơn vị tuyển dụng.
                </p>
                <p>
                  <strong>1.4. &ldquo;Pháp luật bảo vệ dữ liệu cá nhân&rdquo;</strong> là hệ thống các văn bản quy phạm
                  pháp luật của Việt Nam điều chỉnh các hoạt động liên quan đến dữ liệu cá nhân, bao gồm nhưng không
                  giới hạn ở Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (sau đây gọi là &ldquo;Luật số
                  91/2025/QH15&rdquo;); các Nghị định hướng dẫn thi hành; các quy định về an ninh mạng, an toàn thông
                  tin mạng và các văn bản sửa đổi, bổ sung hoặc thay thế các văn bản nêu trên tại từng thời điểm. Trong
                  phạm vi Thỏa thuận này, thuật ngữ này cũng bao gồm các tiêu chuẩn kỹ thuật và hướng dẫn chuyên môn của
                  cơ quan Nhà nước có thẩm quyền về việc bảo vệ quyền và lợi ích hợp pháp của Chủ thể dữ liệu.
                </p>
                <p>
                  <strong>1.5. &ldquo;Xử lý dữ liệu cá nhân&rdquo;</strong> là hoạt động tác động đến dữ liệu cá nhân,
                  bao gồm một hoặc nhiều hoạt động như sau: thu thập, phân tích, tổng hợp, mã hóa, giải mã, chỉnh sửa,
                  xóa, hủy, khử nhận dạng, cung cấp, công khai, chuyển giao dữ liệu cá nhân và hoạt động khác tác động
                  đến dữ liệu cá nhân.
                </p>
                <p>
                  <strong>1.6. &ldquo;Bảo vệ dữ liệu cá nhân&rdquo;</strong> là việc cơ quan, tổ chức, cá nhân sử dụng
                  lực lượng, phương tiện, biện pháp để phòng, chống hoạt động xâm phạm dữ liệu cá nhân.
                </p>
                <p>
                  <strong>1.7. &ldquo;Chủ thể dữ liệu&rdquo;</strong> là người được dữ liệu cá nhân phản ánh.
                </p>
                <p>
                  <strong>1.8. &ldquo;Bên Kiểm soát dữ liệu cá nhân&rdquo;</strong> là cơ quan, tổ chức, cá nhân quyết
                  định mục đích và phương tiện xử lý dữ liệu cá nhân.
                </p>
                <p>
                  <strong>1.9. &ldquo;Bên Xử lý dữ liệu cá nhân&rdquo;</strong> là cơ quan, tổ chức, cá nhân thực hiện
                  việc xử lý dữ liệu cá nhân theo yêu cầu của bên kiểm soát dữ liệu cá nhân hoặc bên kiểm soát và xử lý
                  dữ liệu cá nhân thông qua hợp đồng.
                </p>
                <p>
                  <strong>1.10. &ldquo;Bên thứ ba&rdquo;</strong> là tổ chức, cá nhân ngoài chủ thể dữ liệu cá nhân, bên
                  kiểm soát dữ liệu cá nhân, bên kiểm soát và xử lý dữ liệu cá nhân, bên xử lý dữ liệu cá nhân tham gia
                  vào việc xử lý dữ liệu cá nhân theo quy định của pháp luật.
                </p>
                <p>
                  <strong>1.11. &ldquo;Hợp đồng&rdquo;</strong> là các hợp đồng cung cấp dịch vụ, thỏa thuận hợp tác,
                  hoặc Điều khoản sử dụng dịch vụ đang có hiệu lực mà Đơn vị tuyển dụng đã ký kết, xác nhận hoặc đồng ý
                  giao kết với InterVue trước, trong, và sau thời điểm Thỏa thuận này có hiệu lực.
                </p>
              </div>
            </section>

            {/* ĐIỀU 2 */}
            <section id="dieu-2" className="space-y-3 border-t border-slate-100 pt-4">
              <h3 className="text-base font-bold text-slate-900">ĐIỀU 2. MỤC ĐÍCH XỬ LÝ DỮ LIỆU CÁ NHÂN</h3>
              <div className="space-y-2.5 text-xs leading-relaxed text-slate-700 sm:text-sm">
                <p>
                  <strong>2.1. Mục đích xử lý dữ liệu cá nhân:</strong> Các Bên ghi nhận và đồng ý rằng, để phục vụ mục
                  đích thực hiện hỗ trợ quá trình tuyển dụng của Đơn vị tuyển dụng, mỗi Bên có quyền Kiểm soát và Xử lý
                  dữ liệu cá nhân trong phạm vi quyền hạn, trách nhiệm riêng biệt của mình và có trách nhiệm thu thập sự
                  đồng ý từ Chủ thể dữ liệu tương ứng với phạm vi dữ liệu mà mình kiểm soát.
                </p>
                <p>
                  <strong>2.2.</strong> Các Bên phải (i) tôn trọng quyền của Chủ thể dữ liệu theo Pháp luật bảo vệ dữ
                  liệu cá nhân liên quan, (ii) chỉ thực hiện Xử lý dữ liệu cá nhân theo đúng mục đích, đối tượng Chủ thể
                  dữ liệu, loại Dữ liệu cá nhân, phạm vi, trong thời hạn quy định tại Thỏa thuận này, (iii) chủ động
                  phòng ngừa, ngăn chặn vi phạm về Dữ liệu cá nhân.
                </p>
              </div>
            </section>

            {/* ĐIỀU 3 */}
            <section id="dieu-3" className="space-y-3 border-t border-slate-100 pt-4">
              <h3 className="text-base font-bold text-slate-900">ĐIỀU 3. TRÁCH NHIỆM CỦA CÁC BÊN</h3>
              <div className="space-y-3 text-xs leading-relaxed text-slate-700 sm:text-sm">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800">
                    3.1. Đối với Dữ liệu cá nhân thuộc nền tảng chung của InterVue (Ngoài phạm vi Workplace của Đơn vị
                    tuyển dụng)
                  </h4>
                  <p>
                    Nhằm làm rõ và loại trừ trách nhiệm pháp lý cho Đơn vị tuyển dụng, Các Bên thống nhất rằng đối với
                    toàn bộ hồ sơ, thông tin ứng viên và các Dữ liệu cá nhân khác thuộc hệ sinh thái nền tảng tuyển dụng
                    chung của InterVue (nằm ngoài phạm vi Workplace của Đơn vị tuyển dụng), InterVue hoạt động độc lập
                    với tư cách là Bên Kiểm soát và Xử lý dữ liệu cá nhân. InterVue tự chịu hoàn toàn trách nhiệm trong
                    việc thu thập sự đồng ý hợp lệ của Chủ thể dữ liệu, đảm bảo an toàn thông tin và tuân thủ các quy
                    định của Pháp luật bảo vệ dữ liệu cá nhân đối với tệp dữ liệu này mà không có bất kỳ sự liên đới
                    trách nhiệm nào tới Đơn vị tuyển dụng.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-800">3.2. Trách nhiệm trong phạm vi Workplace</h4>
                  <p>
                    Đối với phạm vi Dữ liệu cá nhân tại khoản 1.2, Đơn vị tuyển dụng đóng vai trò là Bên Kiểm soát dữ
                    liệu cá nhân, chịu trách nhiệm quyết định mục đích và phương tiện xử lý dữ liệu phù hợp với quy định
                    của pháp luật về bảo vệ dữ liệu cá nhân nhằm phục vụ cho hoạt động tuyển dụng của mình. InterVue giữ
                    vai trò là Bên Xử lý dữ liệu cá nhân, thực hiện các hành vi xử lý dựa trên yêu cầu, chỉ thị kỹ thuật
                    của Đơn vị tuyển dụng.
                  </p>
                </div>

                <div className="space-y-2 rounded-lg border border-slate-200/80 bg-slate-50/40 p-4">
                  <h5 className="font-bold text-slate-800">3.2.1. InterVue có trách nhiệm:</h5>
                  <p>
                    <strong>a)</strong> Xử lý dữ liệu cá nhân theo đúng nguyên tắc bảo vệ dữ liệu cá nhân, quy định liên
                    quan đến bảo vệ dữ liệu cá nhân áp dụng cho Bên Xử lý dữ liệu cá nhân theo Luật số 91/2025/QH15, Hợp
                    đồng giữa hai bên và Thỏa thuận này.
                  </p>
                  <p>
                    <strong>b)</strong> Hỗ trợ cung cấp công cụ kỹ thuật để Đơn vị tuyển dụng hiển thị thông báo xử lý
                    dữ liệu cá nhân và/hoặc nội dung xin sự đồng ý của Chủ thể dữ liệu đối với các hoạt động xử lý nhằm
                    mục đích tuyển dụng do Đơn vị tuyển dụng thực hiện sau khi Dữ liệu cá nhân được chuyển vào Workspace
                    của Đơn vị tuyển dụng. Đồng thời, trong phạm vi khả năng kỹ thuật của hệ thống và khi có yêu cầu hợp
                    lệ từ Đơn vị tuyển dụng, InterVue sẽ cung cấp thông tin, log hệ thống và/hoặc bằng chứng ghi nhận sự
                    chấp thuận của Chủ thể dữ liệu được lưu trữ trên hệ thống nhằm phục vụ việc giải trình hoặc xử lý
                    yêu cầu theo quy định pháp luật.
                  </p>
                  <p>
                    <strong>c)</strong> Thực hiện chỉnh sửa dữ liệu cá nhân của Chủ thể dữ liệu theo đúng yêu cầu/chấp
                    thuận bằng văn bản của Bên Kiểm soát dữ liệu cá nhân và có quyền yêu cầu Bên Kiểm soát dữ liệu cá
                    nhân cung cấp bằng chứng về việc Chủ thể dữ liệu đã đồng ý việc chỉnh sửa dữ liệu cá nhân.
                  </p>
                  <p>
                    <strong>d)</strong> Trong phạm vi Workplace, InterVue có trách nhiệm thông báo ngay lập tức trong
                    vòng 24 giờ cho Đơn vị tuyển dụng về mọi khiếu nại, yêu cầu hoặc thắc mắc nhận được từ Chủ thể dữ
                    liệu. InterVue không được trực tiếp phản hồi hoặc thực hiện các thao tác xử lý theo yêu cầu của Chủ
                    thể dữ liệu trừ khi có chỉ thị hoặc sự chấp thuận cụ thể từ Đơn vị tuyển dụng.
                  </p>
                  <p>
                    <strong>e)</strong> Xóa, trả lại toàn bộ Dữ liệu cá nhân cho Bên Kiểm soát dữ liệu cá nhân sau khi
                    kết thúc xử lý dữ liệu hoặc có thông báo xóa, trả lại Dữ liệu cá nhân từ Bên Kiểm soát dữ liệu cá
                    nhân, trừ trường hợp Chủ thể dữ liệu có đồng ý/chấp thuận khác với Bên xử lý dữ liệu cá nhân hoặc
                    lưu giữ phục vụ cho mục đích giải trình với cơ quan nhà nước.
                  </p>
                  <p>
                    <strong>f)</strong> Các Bên hiểu và thống nhất rằng InterVue có quyền chủ động lựa chọn và chỉ định
                    các Bên thứ ba (bao gồm nhưng không giới hạn ở các nhà cung cấp hạ tầng điện toán đám mây, đơn vị
                    lưu trữ dữ liệu, đơn vị cung cấp giải pháp kỹ thuật) để duy trì hoạt động của nền tảng và thực hiện
                    các Dịch vụ theo Hợp đồng. InterVue cam kết chịu trách nhiệm hoàn toàn trước Đơn vị tuyển dụng về
                    việc thực hiện nghĩa vụ bảo vệ dữ liệu của các Bên thứ ba.
                  </p>
                  <p>
                    <strong>g)</strong> Thông báo ngay cho Đơn vị tuyển dụng một cách nhanh nhất có thể và không chậm
                    hơn 24 giờ trong các trường hợp: i) InterVue có lý do hợp lý để tin rằng không thể tiếp tục tuân thủ
                    các nghĩa vụ do thay đổi pháp luật; ii) phát hiện chỉ dẫn của Đơn vị tuyển dụng có dấu hiệu vi phạm;
                    iii) nhận được yêu cầu, lệnh kiểm tra từ cơ quan nhà nước; iv) phát hiện sự cố bảo mật hoặc vi phạm
                    dữ liệu cá nhân.
                  </p>
                  <p>
                    <strong>h)</strong> Các trách nhiệm khác phù hợp với quy định của Pháp luật bảo vệ dữ liệu cá nhân.
                  </p>
                </div>

                <div className="space-y-2 rounded-lg border border-slate-200/80 bg-slate-50/40 p-4">
                  <h5 className="font-bold text-slate-800">3.2.2. Đơn vị tuyển dụng có trách nhiệm:</h5>
                  <p>
                    <strong>a)</strong> Cam kết việc thu thập dữ liệu đã đạt được sự đồng ý hợp lệ của Chủ thể dữ liệu
                    về mục đích tuyển dụng và các hoạt động xử lý dữ liệu liên quan theo Pháp luật bảo vệ dữ liệu cá
                    nhân.
                  </p>
                  <p>
                    <strong>b)</strong> Chịu trách nhiệm thiết lập tiêu chí, mục đích tuyển dụng, thời hạn lưu trữ hồ sơ
                    và các chỉ thị kỹ thuật xử lý hồ sơ ứng viên trên Workplace. Đơn vị tuyển dụng cam kết các hoạt động
                    lọc, đánh giá và tương tác với Chủ thể dữ liệu không vi phạm điều cấm của pháp luật hoặc các quy
                    định về chống phân biệt đối xử trong lao động.
                  </p>
                  <p>
                    <strong>c)</strong> Bảo đảm các quyền của Chủ thể dữ liệu và yêu cầu InterVue phối hợp để bảo đảm
                    các quyền của Chủ thể dữ liệu theo quy định của pháp luật.
                  </p>
                  <p>
                    <strong>d)</strong> Đảm bảo nhân sự, đại diện hoặc người được chỉ định thực hiện công việc của Đơn
                    vị tuyển dụng tuân thủ các quy định về bảo vệ dữ liệu cá nhân; không sao chép, trích xuất hoặc tiếp
                    cận các dữ liệu nằm ngoài phạm vi Workplace của Đơn vị tuyển dụng.
                  </p>
                  <p>
                    <strong>e)</strong> Tiếp nhận, phản hồi các yêu cầu, khiếu nại từ Chủ thể dữ liệu và thông báo cho
                    InterVue để kịp thời xử lý, trong mọi trường hợp không muộn hơn 24 tiếng từ thời điểm nhận được yêu
                    cầu.
                  </p>
                  <p>
                    <strong>f)</strong> Tuân thủ nghiêm ngặt các quy định về bảo mật dữ liệu có liên quan đến Điều khoản
                    sử dụng và Chính sách vận hành nền tảng của InterVue.
                  </p>
                  <p>
                    <strong>g)</strong> Các trách nhiệm khác phù hợp với quy định tại Luật số 91/2025/QH15 và các văn
                    bản hướng dẫn có liên quan tại từng thời kỳ.
                  </p>
                </div>
              </div>
            </section>

            {/* ĐIỀU 4 */}
            <section id="dieu-4" className="space-y-3 border-t border-slate-100 pt-4">
              <h3 className="text-base font-bold text-slate-900">ĐIỀU 4. LƯU TRỮ DỮ LIỆU CÁ NHÂN</h3>
              <div className="space-y-2 text-xs leading-relaxed text-slate-700 sm:text-sm">
                <p>
                  <strong>4.1.</strong> Dữ liệu cá nhân sẽ được xử lý cho đến khi các mục đích xử lý dữ liệu đã được
                  hoàn thành.
                </p>
                <p>
                  <strong>4.2.</strong> Nhằm thực hiện các nghĩa vụ đảm bảo tuân thủ quy định pháp luật và đáp ứng yêu
                  cầu của cơ quan Nhà nước có thẩm quyền, các Bên có quyền tiếp tục lưu trữ Dữ liệu cá nhân ngay cả khi
                  Hợp đồng và Văn bản thỏa thuận này đã chấm dứt hiệu lực pháp luật, hoặc khi Chủ thể dữ liệu thực hiện
                  quyền rút lại sự đồng ý / quyền xóa dữ liệu.
                </p>
                <p>
                  <strong>4.3.</strong> Trường hợp một trong các Bên có thỏa thuận độc lập với Chủ thể dữ liệu về thời
                  hạn, mục đích hoặc phương thức lưu trữ khác với quy định tại Thỏa thuận này, Bên đó có trách nhiệm độc
                  lập trong việc thực hiện và lưu trữ dữ liệu theo đúng cam kết trực tiếp với Chủ thể dữ liệu, tuân thủ
                  quy định tại Pháp luật bảo vệ dữ liệu cá nhân.
                </p>
              </div>
            </section>

            {/* ĐIỀU 5 */}
            <section id="dieu-5" className="space-y-3 border-t border-slate-100 pt-4">
              <h3 className="text-base font-bold text-slate-900">ĐIỀU 5. QUYỀN YÊU CẦU</h3>
              <div className="space-y-2 text-xs leading-relaxed text-slate-700 sm:text-sm">
                <p>
                  <strong>5.1.</strong> Mỗi Bên (sau đây gọi là &ldquo;Bên Yêu Cầu&rdquo;) có quyền gửi văn bản yêu cầu
                  Bên còn lại (sau đây gọi là &ldquo;Bên Đáp Ứng&rdquo;) cung cấp bằng chứng, tài liệu tường trình hoặc
                  giải trình về các nội dung: i) Việc Bên Đáp Ứng đã có được sự đồng ý hợp lệ của Chủ thể dữ liệu; ii)
                  Việc Bên Đáp Ứng tuân thủ nghĩa vụ bảo vệ dữ liệu cá nhân; iii) Việc Bên Đáp Ứng đã áp dụng đầy đủ các
                  biện pháp bảo mật.
                </p>
                <p>
                  <strong>5.2.</strong> Bên Đáp Ứng có trách nhiệm thực hiện các yêu cầu nêu tại Điều 5.1 khi thuộc các
                  trường hợp: i) đáp ứng yêu cầu cơ quan Nhà nước; ii) phục vụ giải quyết tranh chấp, khiếu nại; iii)
                  hành động khẩn cấp giảm thiểu tổn thất; iv) đảm bảo tính tuân thủ pháp luật.
                </p>
                <p>
                  <strong>5.3.</strong> Bên Yêu Cầu có trách nhiệm cung cấp các bằng chứng hoặc lý do xác đáng cho yêu
                  cầu của mình.
                </p>
                <p>
                  <strong>5.4.</strong> Bên Đáp Ứng sẽ phản hồi và cung cấp tài liệu trong vòng 05 (năm) ngày làm việc
                  kể từ ngày nhận được yêu cầu hợp lệ. Trường hợp phức tạp, có thể gia hạn thêm nhưng không quá 15 (mười
                  lăm) ngày làm việc.
                </p>
                <p>
                  <strong>5.5.</strong> Trừ sự cố thực tế hoặc mệnh lệnh cơ quan nhà nước, quyền yêu cầu giải trình định
                  kỳ chỉ được thực hiện không quá 01 (một) lần trong mỗi chu kỳ 12 tháng.
                </p>
              </div>
            </section>

            {/* ĐIỀU 6 */}
            <section id="dieu-6" className="space-y-3 border-t border-slate-100 pt-4">
              <h3 className="text-base font-bold text-slate-900">ĐIỀU 6. KIỂM TRA TUÂN THỦ</h3>
              <div className="space-y-2 text-xs leading-relaxed text-slate-700 sm:text-sm">
                <p>
                  <strong>6.1.</strong> Mỗi Bên có quyền thực hiện việc kiểm tra, đánh giá nhằm xác nhận tính tuân thủ
                  các cam kết về bảo vệ dữ liệu cá nhân, ưu tiên thực hiện thông qua Bảng câu hỏi đánh giá bảo mật hoặc
                  các Chứng chỉ kiểm toán độc lập (như ISO/IEC 27001 hoặc tương đương).
                </p>
                <p>
                  <strong>6.2.</strong> Trường hợp cần thiết, có thể thuê Bên Thứ Ba độc lập đánh giá với điều kiện
                  thông báo trước 15 ngày, ký kết thỏa thuận bảo mật (NDA), không tiếp cận dữ liệu ngoài phạm vi
                  Workplace và bên thuê tự chịu chi phí.
                </p>
                <p>
                  <strong>6.3. Xử lý vi phạm và Thông báo không tuân thủ:</strong> Trường hợp một Bên vi phạm nghĩa vụ,
                  Bên còn lại có quyền tạm thời đình chỉ hoạt động xử lý dữ liệu liên quan. Nếu việc đình chỉ kéo dài
                  quá 30 ngày liên tục, Bên bị vi phạm có quyền đơn phương chấm dứt Hợp đồng và Thỏa thuận này ngay lập
                  tức mà không phải bồi thường.
                </p>
              </div>
            </section>

            {/* ĐIỀU 7 */}
            <section id="dieu-7" className="space-y-3 border-t border-slate-100 pt-4">
              <h3 className="text-base font-bold text-slate-900">ĐIỀU 7. NGUYÊN TẮC BỒI THƯỜNG</h3>
              <div className="space-y-2 text-xs leading-relaxed text-slate-700 sm:text-sm">
                <p>
                  <strong>7.1.</strong> Mỗi Bên (&ldquo;Bên Vi Phạm&rdquo;) có trách nhiệm bồi thường và giữ cho Bên còn
                  lại không bị thiệt hại trước mọi chi phí, tổn thất, tiền phạt vi phạm từ cơ quan Nhà nước phát sinh
                  trực tiếp từ hành vi vi phạm nghĩa vụ bảo mật hoặc xử lý vượt quá chỉ thị.
                </p>
                <p>
                  <strong>7.2.</strong> InterVue có trách nhiệm bồi thường và bảo vệ Đơn vị tuyển dụng khỏi các khiếu
                  nại liên quan đến hoạt động xử lý dữ liệu trên nền tảng chung ngoài phạm vi Workplace hoặc do lỗi kỹ
                  thuật của hạ tầng hệ thống của InterVue.
                </p>
                <p>
                  <strong>7.3.</strong> Đơn vị tuyển dụng có trách nhiệm bồi thường và bảo vệ InterVue khỏi mọi khiếu
                  nại phát sinh từ chỉ thị xử lý dữ liệu vi phạm pháp luật hoặc dữ liệu thu thập thiếu sự đồng ý hợp lệ
                  của Chủ thể dữ liệu.
                </p>
              </div>
            </section>

            {/* ĐIỀU 8 */}
            <section id="dieu-8" className="space-y-3 border-t border-slate-100 pt-4">
              <h3 className="text-base font-bold text-slate-900">
                ĐIỀU 8. CÁCH THỨC GIẢI QUYẾT TRANH CHẤP VÀ ĐẦU MỐI LIÊN HỆ
              </h3>
              <div className="space-y-3 text-xs leading-relaxed text-slate-700 sm:text-sm">
                <p>
                  <strong>8.1.</strong> Khi phát hiện sự cố vi phạm hoặc nhận được yêu cầu thực hiện quyền của Chủ thể
                  dữ liệu, Bên phát hiện phải thông báo bằng văn bản cho Bên còn lại trong vòng 24 (hai mươi tư) giờ.
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1 rounded-lg border border-slate-200 bg-slate-50/70 p-4">
                    <p className="font-bold text-slate-800">Đầu mối liên hệ của InterVue:</p>
                    <p className="text-xs text-slate-600">
                      <strong>Người nhận:</strong> Ban Bảo vệ dữ liệu cá nhân (Ban DPO)
                      <br />
                      <strong>Địa chỉ:</strong> Tầng 12, Keangnam Landmark 72, Mễ Trì, Nam Từ Liêm, Hà Nội, Việt Nam
                      <br />
                      <strong>Điện thoại:</strong> 1900 6868
                      <br />
                      <strong>Email:</strong> dpo@intervue.techx.vn
                    </p>
                  </div>

                  <div className="space-y-1 rounded-lg border border-slate-200 bg-slate-50/70 p-4">
                    <p className="font-bold text-slate-800">Đầu mối liên hệ của Đơn vị tuyển dụng:</p>
                    <p className="text-xs text-slate-600">
                      Được xác định theo thông tin định danh và thông tin liên hệ (Người nhận, Địa chỉ, Số điện thoại,
                      Email) mà Đơn vị tuyển dụng đã đăng ký và quản lý trên tài khoản Nhà tuyển dụng tại từng thời
                      điểm.
                    </p>
                  </div>
                </div>

                <p>
                  <strong>8.2.</strong> Mọi tranh chấp trước hết giải quyết thông qua thương lượng, hòa giải trong vòng
                  30 ngày. Nếu không thống nhất, mỗi Bên có quyền đưa vụ việc ra giải quyết tại Tòa án nhân dân có thẩm
                  quyền tại Việt Nam.
                </p>
              </div>
            </section>

            {/* ĐIỀU 9 */}
            <section id="dieu-9" className="space-y-3 border-t border-slate-100 pt-4">
              <h3 className="text-base font-bold text-slate-900">ĐIỀU 9. HIỆU LỰC</h3>
              <div className="space-y-2 text-xs leading-relaxed text-slate-700 sm:text-sm">
                <p>
                  <strong>9.1. Hợp đồng điện tử:</strong> Thỏa thuận này được thiết lập và giao kết dưới hình thức hợp
                  đồng điện tử. Giá trị pháp lý của Thỏa thuận không thể bị phủ nhận theo Luật Giao dịch điện tử. Bằng
                  việc nhấn chọn ô (checkbox) hoặc nút đồng ý trên hệ thống, Đơn vị tuyển dụng xác nhận đã đọc, hiểu rõ
                  và đồng ý toàn bộ các điều khoản.
                </p>
                <p>
                  <strong>9.2. Thẩm quyền đại diện:</strong> Cá nhân thực hiện thao tác trên hệ thống cam kết có đầy đủ
                  năng lực hành vi dân sự và đủ thẩm quyền đại diện hợp pháp cho Đơn vị tuyển dụng.
                </p>
                <p>
                  <strong>9.3. Điều khoản ưu tiên:</strong> Trường hợp có văn bản Thỏa thuận xử lý dữ liệu cá nhân ký
                  giấy / ký số riêng biệt giữa hai bên, văn bản đó sẽ được ưu tiên áp dụng nếu có sự mâu thuẫn.
                </p>
                <p>
                  <strong>9.4. Hiệu lực từng phần:</strong> Việc một điều khoản bị vô hiệu không làm ảnh hưởng đến hiệu
                  lực của các điều khoản còn lại.
                </p>
                <p>
                  <strong>9.5. Thời điểm hiệu lực:</strong> Có hiệu lực từ thời điểm Đơn vị tuyển dụng xác nhận đồng ý
                  trên hệ thống và tiếp tục có hiệu lực trong suốt thời gian Đơn vị tuyển dụng sử dụng dịch vụ của
                  InterVue.
                </p>
                <p>
                  <strong>9.6. Chấm dứt:</strong> Thỏa thuận chấm dứt khi Đơn vị tuyển dụng không còn quyền truy cập tài
                  khoản và toàn bộ dữ liệu cá nhân đã được xóa, ẩn danh hóa, hoàn trả hoặc tiếp tục lưu trữ theo luật
                  định.
                </p>
              </div>
            </section>

            {/* Signature Box Banner */}
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-5 text-emerald-950">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#00b14f]" />
                <p className="text-sm font-bold">Xác nhận giao kết hợp đồng điện tử</p>
              </div>
              <p className="mt-1 text-xs text-emerald-800">
                Thỏa thuận này là văn bản chính thức được quy định tại Mục 2 trong phần Cài đặt Bảo vệ Dữ liệu cá nhân
                của Nhà tuyển dụng. Thao tác xác nhận đồng ý trên hệ thống có giá trị pháp lý ràng buộc đầy đủ theo quy
                định của Luật Giao dịch điện tử và Luật Bảo vệ dữ liệu cá nhân Việt Nam.
              </p>
            </div>
          </article>
        </div>
      </main>

      {/* Official Footer */}
      <Footer />
    </div>
  );
}
