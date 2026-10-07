'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote, CheckCircle2, MessageSquareHeart, Sparkles } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  tag: string;
  tagColor: string;
  content: string;
  result: string;
  verification: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Nguyễn Hoàng Nam',
    role: 'Senior Frontend Engineer',
    company: 'Techcombank',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    tag: 'Luyện phỏng vấn AI',
    tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    content:
      'Nhờ tính năng luyện phỏng vấn AI với bộ câu hỏi chuyên sâu theo từng vị trí của InterVue, mình đã tự tin vượt qua 3 vòng phỏng vấn kỹ thuật và nhận offer mức lương kỳ vọng tại ngân hàng.',
    result: 'Tăng 40% thu nhập',
    verification: 'Ứng viên đã trúng tuyển',
  },
  {
    id: 2,
    name: 'Trần Thu Hà',
    role: 'Product Manager',
    company: 'Shopee Việt Nam',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    tag: 'Tạo CV chuẩn ATS',
    tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
    content:
      'Bộ tạo CV chuẩn ATS của InterVue thật sự rất xịn. Sau khi tối ưu điểm CV lên 94/100, số lượng nhà tuyển dụng chủ động liên hệ tăng vọt. Giao diện trực quan và cực kỳ tiện dụng!',
    result: 'Nhận 4 offer trong 2 tuần',
    verification: 'Ứng viên đã trúng tuyển',
  },
  {
    id: 3,
    name: 'Lê Minh Tuấn',
    role: 'Head of Talent Acquisition',
    company: 'FPT Software',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    tag: 'Tuyển dụng Pro',
    tagColor: 'bg-purple-50 text-purple-700 border-purple-200',
    content:
      'Với tư cách nhà tuyển dụng, tính năng đánh giá năng lực và phân tích hồ sơ ứng viên bằng AI của InterVue giúp team mình rút ngắn thời gian tuyển dụng từ hàng tuần xuống còn 3 ngày làm việc.',
    result: 'Tiết kiệm 60% thời gian',
    verification: 'Doanh nghiệp xác thực',
  },
  {
    id: 4,
    name: 'Phạm Quỳnh Trang',
    role: 'Senior Data Analyst',
    company: 'VNG Corporation',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    tag: 'Báo cáo thị trường lương',
    tagColor: 'bg-amber-50 text-amber-700 border-amber-200',
    content:
      'InterVue gợi ý việc làm chuẩn ngành Data với mức lương cực kỳ minh bạch. Báo cáo thị trường và bộ công cụ tính lương Gross-Net giúp mình tự tin đàm phán thành công mức đãi ngộ xứng đáng.',
    result: 'Offer ngay vòng đầu',
    verification: 'Ứng viên đã trúng tuyển',
  },
  {
    id: 5,
    name: 'Đặng Quốc Bảo',
    role: 'AI / Machine Learning Engineer',
    company: 'Viettel Solutions',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    tag: 'Mô phỏng phỏng vấn STAR',
    tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    content:
      'Trợ lý AI mô phỏng phỏng vấn hệt như gặp Technical Lead thật! AI chỉ ra đúng các lỗ hổng kiến thức và gợi ý cách trả lời chuẩn phương pháp STAR. 10/10 trải nghiệm!',
    result: 'Điểm AI 95/100',
    verification: 'Ứng viên đã trúng tuyển',
  },
  {
    id: 6,
    name: 'Vũ Hoàng My',
    role: 'Marketing Specialist',
    company: 'Masan Group',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    tag: 'Trắc nghiệm MBTI & MI',
    tagColor: 'bg-rose-50 text-rose-700 border-rose-200',
    content:
      'Hệ sinh thái công cụ từ tính lương đến trắc nghiệm tính cách và lộ trình sự nghiệp giúp mình định hình hướng đi dài hạn rõ ràng. InterVue là người đồng hành đáng tin cậy cho người đi làm.',
    result: 'Thăng tiến sự nghiệp',
    verification: 'Ứng viên đã trúng tuyển',
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, TESTIMONIALS.length - cardsPerView);

  // Auto-play sliding interval
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3800);

    return () => clearInterval(timer);
  }, [isPaused, maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Touch gesture support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <section id="customer-testimonials" className="container-topcv">
      {/* Header Bar */}
      <div className="relative mb-8 text-center">
        <div className="text-primary mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3.5 py-1 text-[12px] font-bold">
          <MessageSquareHeart className="h-3.5 w-3.5" />
          <span>ĐÁNH GIÁ TỪ NGƯỜI DÙNG</span>
        </div>
        <h2 className="text-navy text-2xl font-black tracking-tight md:text-3xl">
          Khách hàng <span className="text-primary">nói gì về chúng tôi?</span>
        </h2>
        <p className="mt-1 text-[14px] text-[#6f7882] sm:text-[15px]">
          Hơn 300,000+ ứng viên và doanh nghiệp đã bứt phá sự nghiệp và tuyển dụng thành công cùng InterVue.
        </p>

        {/* Navigation Controls */}
        <div className="mt-4 flex items-center justify-center gap-2 sm:absolute sm:right-0 sm:bottom-0 sm:mt-0">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous testimonial"
            className="text-navy hover:border-primary hover:bg-primary-tag hover:text-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#e9eaec] bg-white transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next testimonial"
            className="text-navy hover:border-primary hover:bg-primary-tag hover:text-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#e9eaec] bg-white transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Carousel Slider Window */}
      <div
        className="relative overflow-hidden py-3.5"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-600 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
          }}
        >
          {TESTIMONIALS.map((item) => (
            <div key={item.id} className="shrink-0 px-2.5" style={{ width: `${100 / cardsPerView}%` }}>
              <div className="group hover:border-primary flex h-full flex-col justify-between rounded-2xl border border-[#e9eaec] bg-white p-6 transition-all duration-300 hover:-translate-y-1">
                {/* Top: Stars, Tag & Quote Icon */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <Quote className="group-hover:text-primary h-7 w-7 text-emerald-200 transition-colors" />
                  </div>

                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${item.tagColor}`}>
                      {item.tag}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/60 px-2 py-0.5 text-[11px] font-semibold text-[#00873c]">
                      <Sparkles className="text-primary h-3 w-3" />
                      {item.result}
                    </span>
                  </div>

                  {/* Content */}
                  <p className="group-hover:text-navy line-clamp-4 text-[13.5px] leading-relaxed text-[#4d5965] transition-colors">
                    “{item.content}”
                  </p>
                </div>

                {/* Bottom: User Info & Verification */}
                <div className="mt-5 border-t border-[#f4f5f5] pt-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-emerald-400/30"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-navy truncate text-[14.5px] font-bold">{item.name}</h3>
                        <CheckCircle2 className="text-primary h-3.5 w-3.5 shrink-0" />
                      </div>
                      <p className="truncate text-[12px] font-medium text-[#6f7882]">
                        {item.role} • <span className="text-primary font-semibold">{item.company}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicator Dots */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === idx ? 'bg-primary w-8' : 'w-2 bg-[#d1d5db] hover:bg-[#9ca3af]'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
