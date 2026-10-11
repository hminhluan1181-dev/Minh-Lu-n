import React, { useState, useEffect } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Printer, 
  Sparkles, 
  BookOpen, 
  Layers, 
  RotateCcw,
  CheckCircle2,
  FileText,
  Presentation,
  Sliders,
  Grid,
  FileDown,
  Monitor
} from 'lucide-react';
import { SlideDeck, SlideItem, TeacherProfile, LessonPlan5512 } from '../types';
import { exportToPowerPointPPTX } from '../utils/pptxExport';
import { exportToWord } from '../utils/exportUtils';

interface SlideDeckViewProps {
  deck: SlideDeck;
  teacherProfile: TeacherProfile;
  lessonPlan: LessonPlan5512;
  onUpdateDeck?: (updated: SlideDeck) => void;
  onBackToKHBD?: () => void;
  onRegenerateWithCount: (count: number) => void;
}

export const SlideDeckView: React.FC<SlideDeckViewProps> = ({ 
  deck,
  teacherProfile,
  lessonPlan,
  onBackToKHBD,
  onRegenerateWithCount,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedSlideCount, setSelectedSlideCount] = useState<number>(deck.slides.length || 8);
  const [isExportingPPTX, setIsExportingPPTX] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');

  const activeSlide: SlideItem = deck.slides[currentIdx] || deck.slides[0];

  // Đồng bộ số slide được chọn khi deck thay đổi
  useEffect(() => {
    if (deck.slides.length > 0) {
      setSelectedSlideCount(deck.slides.length);
      if (currentIdx >= deck.slides.length) {
        setCurrentIdx(0);
      }
    }
  }, [deck.slides.length]);

  // Fullscreen keyboard navigation & ESC detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode === 'single') {
        if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
          if (currentIdx < deck.slides.length - 1) {
            setCurrentIdx(prev => prev + 1);
          }
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          if (currentIdx > 0) {
            setCurrentIdx(prev => prev - 1);
          }
        }
      }
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIdx, isFullscreen, deck.slides.length, viewMode]);

  const toggleFullscreen = () => {
    const elem = document.getElementById('slide-presentation-container');
    if (!isFullscreen) {
      if (elem && elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {
          setIsFullscreen(true);
        });
      } else {
        setIsFullscreen(true);
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // 1. TẢI FILE MICROSOFT POWERPOINT (.PPTX) CHUẨN 16:9 TĨNH
  const handleDownloadPPTX = async () => {
    try {
      setIsExportingPPTX(true);
      await exportToPowerPointPPTX(deck, teacherProfile, lessonPlan.lessonName);
      setExportNotice(`Đã tải xuống thành công tệp PowerPoint (.pptx) chuẩn 16:9 tĩnh gồm ${deck.slides.length} slide!`);
      setTimeout(() => setExportNotice(null), 4000);
    } catch (err) {
      console.error('Error generating PPTX', err);
      setExportNotice('Có lỗi khi tạo tệp PPTX. Vui lòng thử lại.');
    } finally {
      setIsExportingPPTX(false);
    }
  };

  // 2. TẢI FILE TRÌNH CHIẾU HTML TĨNH ĐỘC LẬP (.HTML)
  const handleDownloadStaticHtmlPresentation = () => {
    const slidesHtml = deck.slides.map((s, idx) => `
      <div class="slide-page" style="page-break-after: always; width: 100%; aspect-ratio: 16/9; background: ${idx === 0 ? '#0f172a' : '#ffffff'}; color: ${idx === 0 ? '#ffffff' : '#0f172a'}; border: 1px solid #cbd5e1; border-radius: 12px; margin-bottom: 24px; padding: 36px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
        <div style="border-bottom: 1px solid ${idx === 0 ? '#334155' : '#e2e8f0'}; padding-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
          <span style="background: ${idx === 0 ? '#1e3a8a' : '#eff6ff'}; color: ${idx === 0 ? '#93c5fd' : '#1e40af'}; padding: 4px 12px; border-radius: 6px; font-weight: bold; font-size: 13px; text-transform: uppercase;">
            ${s.stageLabel || 'HOẠT ĐỘNG DẠY HỌC'}
          </span>
          <span style="font-size: 13px; color: ${idx === 0 ? '#94a3b8' : '#64748b'}; font-weight: bold;">
            Slide ${idx + 1} / ${deck.slides.length}
          </span>
        </div>
        <div style="margin: 20px 0;">
          <h1 style="font-size: 24px; margin: 0 0 8px 0; color: ${idx === 0 ? '#ffffff' : '#0f172a'}; font-weight: bold;">${s.title}</h1>
          ${s.subtitle ? `<p style="font-size: 14px; margin: 0 0 16px 0; color: ${idx === 0 ? '#cbd5e1' : '#475569'}; font-style: italic;">${s.subtitle}</p>` : ''}
          <div style="display: flex; gap: 24px;">
            <div style="flex: 2; background: ${idx === 0 ? '#1e293b' : '#f8fafc'}; padding: 18px; border-radius: 8px; border: 1px solid ${idx === 0 ? '#334155' : '#e2e8f0'};">
              <strong style="display: block; font-size: 13px; text-transform: uppercase; color: ${idx === 0 ? '#60a5fa' : '#1e3a8a'}; margin-bottom: 10px;">Nội dung & Nhiệm vụ học sinh:</strong>
              <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                ${s.bulletPoints.map(b => `<li style="margin-bottom: 6px;">${b}</li>`).join('')}
              </ul>
            </div>
            ${s.calloutBox || s.formulaOrCode ? `
              <div style="flex: 1; display: flex; flex-direction: column; gap: 12px;">
                ${s.formulaOrCode ? `
                  <div style="background: #0f172a; color: #34d399; padding: 14px; border-radius: 8px; font-family: monospace; font-weight: bold; font-size: 13px; text-align: center;">
                    ${s.formulaOrCode}
                  </div>
                ` : ''}
                ${s.calloutBox ? `
                  <div style="background: ${idx === 0 ? '#064e3b' : '#ecfdf5'}; color: ${idx === 0 ? '#d1fae5' : '#065f46'}; padding: 14px; border-radius: 8px; border: 1px solid #a7f3d0; font-size: 13px; line-height: 1.5;">
                    <strong style="display: block; margin-bottom: 4px; text-transform: uppercase;">${s.calloutBox.title}</strong>
                    <p style="margin: 0;">${s.calloutBox.text}</p>
                  </div>
                ` : ''}
              </div>
            ` : ''}
          </div>
        </div>
        <div style="border-top: 1px solid ${idx === 0 ? '#334155' : '#e2e8f0'}; pt: 12px; display: flex; justify-content: space-between; font-size: 12px; color: ${idx === 0 ? '#94a3b8' : '#64748b'};">
          <span>${lessonPlan.lessonName} · GV: <b>${teacherProfile.name}</b> · ${teacherProfile.school}</span>
          <span>Năm học: ${teacherProfile.academicYear} · Trang ${idx + 1}</span>
        </div>
      </div>
    `).join('');

    const fullHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>${deck.title || lessonPlan.lessonName} - Slide Tĩnh 16:9</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #f1f5f9; margin: 0; padding: 24px; display: flex; flex-direction: column; align-items: center; }
    @media print { body { background: white; padding: 0; } .slide-page { box-shadow: none !important; margin-bottom: 0 !important; } }
  </style>
</head>
<body>
  <div style="max-width: 1080px; width: 100%;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h2 style="margin: 0; color: #0f172a;">${lessonPlan.lessonName}</h2>
      <p style="margin: 4px 0 0 0; color: #64748b; font-size: 14px;">Bộ slide tĩnh chuẩn 16:9 (${deck.slides.length} slide) · Giáo viên: ${teacherProfile.name}</p>
    </div>
    ${slidesHtml}
  </div>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lessonPlan.lessonName.replace(/\s+/g, '_')}_Slide_Tinh_16x9.html`;
    a.click();
    URL.revokeObjectURL(url);
    setExportNotice('Đã tải xuống bộ Slide HTML tĩnh độc lập thành công!');
    setTimeout(() => setExportNotice(null), 3500);
  };

  // 3. TẢI ĐỀ CƯƠNG SLIDE DẠNG WORD (.DOC)
  const handleDownloadWordOutline = () => {
    const htmlContent = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="font-size: 16pt; font-weight: bold; text-transform: uppercase;">ĐỀ CƯƠNG BÀI GIẢNG ĐIỆN TỬ 16:9</h1>
        <h2>${lessonPlan.lessonName}</h2>
        <p>Môn: <b>${lessonPlan.subject}</b> - Khối: <b>${lessonPlan.grade}</b> - Bộ sách: <b>${lessonPlan.curriculum}</b></p>
        <p>Giáo viên biên soạn: <b>${teacherProfile.name}</b> (${teacherProfile.school})</p>
      </div>
      ${deck.slides.map((s, idx) => `
        <div style="margin-bottom: 20pt; border-bottom: 1px solid #cccccc; padding-bottom: 15pt;">
          <h3 style="font-size: 13pt; color: #1e3a8a;">Slide ${idx + 1}: [${s.stageLabel || 'HOẠT ĐỘNG'}] ${s.title}</h3>
          ${s.subtitle ? `<p><i>${s.subtitle}</i></p>` : ''}
          <p><b>Nội dung trọng tâm:</b></p>
          <ul>
            ${s.bulletPoints.map(b => `<li>${b}</li>`).join('')}
          </ul>
          ${s.formulaOrCode ? `<p><b>Công thức trọng tâm:</b> <code>${s.formulaOrCode}</code></p>` : ''}
          ${s.calloutBox ? `<p><b>${s.calloutBox.title}:</b> ${s.calloutBox.text}</p>` : ''}
          ${s.speakerNotes ? `<p style="color: #555555;"><i>Ghi chú sư phạm: ${s.speakerNotes}</i></p>` : ''}
        </div>
      `).join('')}
    `;
    exportToWord(`${lessonPlan.lessonName}_De_Cuong_Slide`, htmlContent, 'ĐỀ CƯƠNG SLIDE BÀI GIẢNG');
    setExportNotice('Đã xuất thành công tệp Đề cương Slide Word (.doc)!');
    setTimeout(() => setExportNotice(null), 3500);
  };

  return (
    <div className={`p-4 md:p-6 max-w-6xl mx-auto space-y-5 ${isFullscreen ? 'fixed inset-0 z-50 p-4 bg-slate-950 flex flex-col justify-between max-w-none' : ''}`}>
      
      {/* Top Slide Control & Action Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs no-print">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-emerald-800 uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Slide Tĩnh Chuẩn 16:9 (GDPT 2018)
            </span>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Nguồn SGK: Kết Nối Tri Thức (hanhtrangso.nxbgd.vn)
            </span>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              {deck.slides.length} slide tĩnh
            </span>
            <span className="text-xs text-slate-500">
              Giáo viên: <strong className="text-slate-800">{teacherProfile.name}</strong>
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-900 mt-1">
            {deck.title || lessonPlan.lessonName}
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Toàn bộ nội dung hiển thị tĩnh 100%, không hiệu ứng ẩn - Đảm bảo tệp PPTX đầy đủ nội dung khi mở máy.
          </p>
        </div>

        {/* CỤM ĐIỀU KHIỂN: CHỌN SỐ SLIDE & TẢI VỀ MÁY */}
        <div className="flex items-center gap-2.5 flex-wrap">
          
          {/* 1. BỘ CHỌN SỐ SLIDE CẦN TẠO (Yêu cầu cốt lõi của người dùng) */}
          <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-300">
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap pl-1">
              Số slide:
            </span>
            <select
              value={selectedSlideCount}
              onChange={(e) => setSelectedSlideCount(Number(e.target.value))}
              className="text-xs font-bold text-blue-900 bg-white border border-slate-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value={4}>4 Slide (Ngắn gọn - 4 hoạt động 5512)</option>
              <option value={6}>6 Slide (Cơ bản - chuẩn mực)</option>
              <option value={8}>8 Slide (Chuẩn Bộ GD&ĐT - Khuyến nghị)</option>
              <option value={10}>10 Slide (Mở rộng - kèm ví dụ mẫu)</option>
              <option value={12}>12 Slide (Chuyên sâu - phân hóa)</option>
              <option value={16}>16 Slide (Toàn diện - đầy đủ bài tập)</option>
            </select>

            <button
              onClick={() => onRegenerateWithCount(selectedSlideCount)}
              title="Khởi tạo lại toàn bộ slide tĩnh theo đúng số lượng đã chọn"
              className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-xs flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>Tạo {selectedSlideCount} Slide</span>
            </button>
          </div>

          {/* 2. CHẾ ĐỘ XEM: SLIDE 16:9 HOẶC DÀN TRANG TOÀN BỘ TĨNH */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('single')}
              className={`px-2.5 py-1 rounded font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'single' ? 'bg-white text-blue-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Chế độ trình chiếu từng slide 16:9"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Trình Chiếu</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'grid' ? 'bg-white text-blue-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Chế độ xem toàn bộ slide tĩnh trên một trang"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dàn Trang Tĩnh</span>
            </button>
          </div>

          {/* 3. NÚT DOWNLOAD SLIDE VỀ MÁY (RẤT NỔI BẬT THEO YÊU CẦU NGƯỜI DÙNG) */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleDownloadPPTX}
              disabled={isExportingPPTX}
              title="Tải tệp Microsoft PowerPoint (.pptx) định dạng 16:9 tĩnh hoàn toàn"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg shadow-sm flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4" />
              <span>{isExportingPPTX ? 'Đang xuất PPTX...' : 'Tải File PowerPoint (.pptx)'}</span>
            </button>

            {/* Tải HTML Tĩnh Offline */}
            <button
              onClick={handleDownloadStaticHtmlPresentation}
              title="Tải file HTML tĩnh độc lập để mở trình chiếu mọi máy tính không cần cài Office"
              className="p-2 text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
            >
              <FileDown className="w-4 h-4" />
            </button>

            {/* In ấn / Lưu PDF */}
            <button
              onClick={() => window.print()}
              title="In ấn hoặc lưu dạng PDF A4 landscape"
              className="p-2 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Toàn màn hình */}
            <button
              onClick={toggleFullscreen}
              title="Chế độ trình chiếu toàn màn hình (Phím mũi tên để chuyển slide)"
              className="p-2 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* GIAO DIỆN 1: CHẾ ĐỘ TRÌNH CHIẾU TỪNG SLIDE (SINGLE 16:9) */}
      {/* ======================================================== */}
      {viewMode === 'single' ? (
        <>
          {/* KHUNG SLIDE DECK DẠNG TĨNH 100% (STATIC CONTENT 16:9) */}
          <div id="slide-presentation-container" className="w-full flex justify-center">
            <div 
              className="w-full max-w-5xl aspect-[16/9] min-h-[520px] relative bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-300 flex flex-col justify-between overflow-hidden"
              style={{
                backgroundImage: currentIdx === 0 
                  ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
                  : 'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)'
              }}
            >
              {/* SLIDE BÌA (Cover Slide: Index 0) */}
              {currentIdx === 0 ? (
                <div className="p-8 md:p-12 text-white flex flex-col justify-between h-full">
                  {/* Header Badge */}
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded bg-blue-500/20 text-blue-300 font-bold text-xs uppercase tracking-wider border border-blue-400/30">
                      {activeSlide.stageLabel || 'BÀI GIẢNG ĐIỆN TỬ GDPT 2018'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Slide {currentIdx + 1} / {deck.slides.length} (Dạng tĩnh)
                    </span>
                  </div>

                  {/* Title & Objectives */}
                  <div className="space-y-4 my-auto">
                    <div>
                      <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white uppercase leading-tight">
                        {activeSlide.title}
                      </h1>
                      <p className="text-sm md:text-base text-blue-200 mt-2 font-medium">
                        {activeSlide.subtitle}
                      </p>
                    </div>

                    {/* Static Objectives Card */}
                    <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-xl space-y-2 text-xs md:text-sm text-slate-200">
                      <span className="font-bold text-blue-300 block uppercase tracking-wide">
                        Mục Tiêu & Yêu Cầu Cần Đạt (Tĩnh):
                      </span>
                      <ul className="space-y-1.5 pl-4">
                        {activeSlide.bulletPoints.map((pt, i) => (
                          <li key={i} className="list-disc leading-relaxed">
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-200">Giáo viên: {teacherProfile.name}</span>
                      <span>·</span>
                      <span>{teacherProfile.school}</span>
                      <span>·</span>
                      <span>{teacherProfile.department}</span>
                    </div>
                    <span className="font-mono text-slate-400">Năm học: {teacherProfile.academicYear}</span>
                  </div>
                </div>
              ) : (
                /* CÁC SLIDE NỘI DUNG TĨNH (Index > 0) */
                <div className="p-6 md:p-8 flex flex-col justify-between h-full bg-slate-50/50">
                  
                  {/* Slide Top Ribbon */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 bg-white -mx-6 -mt-6 md:-mx-8 md:-mt-8 px-6 md:px-8 py-3.5 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded bg-blue-100 text-blue-900 font-bold text-xs uppercase border border-blue-200">
                        {activeSlide.stageLabel || 'HOẠT ĐỘNG'}
                      </span>
                      <h3 className="font-bold text-sm md:text-base text-slate-900 truncate max-w-xl">
                        {activeSlide.title}
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {currentIdx + 1} / {deck.slides.length}
                    </span>
                  </div>

                  {/* Slide Main Body (2 Columns Static Canvas) */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 my-auto pt-3">
                    
                    {/* Column 1 (Left 7 Cols): Kiến thức & Nhiệm vụ học sinh */}
                    <div className="md:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-xs font-bold uppercase tracking-wide text-blue-900">
                          Kiến Thức Cốt Lõi & Nhiệm Vụ (Tĩnh)
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">Bản trình chiếu</span>
                      </div>

                      {activeSlide.subtitle && (
                        <p className="text-xs text-slate-600 italic">
                          {activeSlide.subtitle}
                        </p>
                      )}

                      <ul className="space-y-2.5 text-xs md:text-sm text-slate-800">
                        {activeSlide.bulletPoints.map((pt, i) => (
                          <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Column 2 (Right 5 Cols): Khái niệm, Công thức & Ví dụ mẫu */}
                    <div className="md:col-span-5 space-y-3 flex flex-col justify-between">
                      
                      {/* Khung công thức nổi bật tĩnh */}
                      {activeSlide.formulaOrCode && (
                        <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl border border-slate-800 shadow-inner text-center font-mono font-bold text-xs md:text-sm leading-relaxed">
                          <span className="text-[10px] text-slate-400 block mb-1 font-sans uppercase">Công Thức Trọng Tâm</span>
                          {activeSlide.formulaOrCode}
                        </div>
                      )}

                      {/* Thẻ khái niệm / Hướng dẫn sư phạm tĩnh */}
                      {activeSlide.calloutBox && (
                        <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-xl space-y-1.5 text-xs text-emerald-950 flex-1">
                          <strong className="text-emerald-900 block font-bold text-xs uppercase tracking-wide">
                            {activeSlide.calloutBox.title}
                          </strong>
                          <p className="leading-relaxed whitespace-pre-line text-slate-700">
                            {activeSlide.calloutBox.text}
                          </p>
                        </div>
                      )}

                      {/* Speaker Notes hiển thị tĩnh ở góc giảng dạy */}
                      {activeSlide.speakerNotes && (
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-[11px] text-blue-900 leading-snug">
                          <strong>Ghi chú sư phạm:</strong> {activeSlide.speakerNotes}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Slide Static Footer */}
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-white -mx-6 -mb-6 md:-mx-8 md:-mb-8 px-6 md:px-8 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{lessonPlan.lessonName}</span>
                      <span>·</span>
                      <span>GV: <strong className="text-blue-700">{teacherProfile.name}</strong></span>
                      <span>·</span>
                      <span>{teacherProfile.school}</span>
                    </div>
                    <span className="font-mono text-xs">Trang {currentIdx + 1}</span>
                  </div>

                </div>
              )}
            </div>
          </div>

          {/* THANH ĐIỀU HƯỚNG DƯỚI (NAVIGATION CONTROLS) */}
          <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-xs no-print">
            <div className="flex items-center gap-2">
              {onBackToKHBD && (
                <button
                  onClick={onBackToKHBD}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
                >
                  ← Quay Lại KHBD 5512
                </button>
              )}
              <span className="text-xs text-slate-500 hidden sm:inline">
                Dùng phím mũi tên ◄ / ► hoặc phím Space để chuyển slide
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-white font-bold text-xs transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Trước</span>
              </button>

              <span className="font-mono text-xs font-bold text-slate-800 px-3 py-1 bg-slate-100 rounded-lg">
                {currentIdx + 1} / {deck.slides.length}
              </span>

              <button
                onClick={() => setCurrentIdx(prev => Math.min(deck.slides.length - 1, prev + 1))}
                disabled={currentIdx === deck.slides.length - 1}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 rounded-lg text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-xs"
              >
                <span>Tiếp</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SLIDE THUMBNAILS TRAY (DANH SÁCH TOÀN BỘ SLIDE TĨNH) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 no-print">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase">
                Danh Sách {deck.slides.length} Slide Tĩnh:
              </span>
              <span className="text-[11px] text-slate-500">
                Bấm vào từng slide để chuyển nhanh
              </span>
            </div>

            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {deck.slides.map((s, idx) => (
                <div
                  key={s.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all shrink-0 w-44 ${
                    idx === currentIdx
                      ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] mb-1">
                    <span className="font-mono font-bold text-blue-700">#{idx + 1}</span>
                    <span className="px-1.5 py-0.2 rounded bg-white text-slate-700 font-semibold uppercase text-[9px] border truncate max-w-[100px]">
                      {s.stageLabel?.slice(0, 15)}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {s.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* ======================================================== */
        /* GIAO DIỆN 2: CHẾ ĐỘ DÀN TRANG TOÀN BỘ SLIDE TĨNH (GRID)  */
        /* (Giúp giáo viên thấy 100% nội dung tĩnh nằm trong slide)   */
        /* ======================================================== */
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 p-3 rounded-xl text-xs text-blue-900">
            <div className="flex items-center gap-2">
              <Grid className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                Đang hiển thị toàn bộ <strong>{deck.slides.length} slide tĩnh</strong>. Tất cả nội dung nằm trọn vẹn trong các khung thẻ, sẵn sàng xuất sang PowerPoint (.pptx).
              </span>
            </div>
            <button
              onClick={handleDownloadPPTX}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shrink-0 flex items-center gap-1 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải PPTX Ngay</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deck.slides.map((s, idx) => (
              <div 
                key={s.id}
                className="bg-white rounded-xl border border-slate-300 shadow-sm p-5 flex flex-col justify-between space-y-4 hover:border-blue-400 transition-colors"
                style={{
                  background: idx === 0 ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : '#ffffff',
                  color: idx === 0 ? '#ffffff' : '#0f172a'
                }}
              >
                {/* Header */}
                <div className={`flex items-center justify-between pb-2 border-b ${idx === 0 ? 'border-slate-700' : 'border-slate-200'}`}>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                    idx === 0 ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-900'
                  }`}>
                    {s.stageLabel || 'HOẠT ĐỘNG'}
                  </span>
                  <span className="font-mono text-xs font-bold opacity-70">
                    Slide {idx + 1} / {deck.slides.length}
                  </span>
                </div>

                {/* Body */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm leading-snug">
                    {s.title}
                  </h4>
                  {s.subtitle && (
                    <p className={`text-xs italic ${idx === 0 ? 'text-slate-300' : 'text-slate-500'}`}>
                      {s.subtitle}
                    </p>
                  )}

                  <ul className="space-y-1.5 text-xs">
                    {s.bulletPoints.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${idx === 0 ? 'bg-blue-400' : 'bg-blue-600'}`}></span>
                        <span className="leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>

                  {s.formulaOrCode && (
                    <div className="bg-slate-900 text-emerald-400 p-2.5 rounded-lg text-center font-mono text-xs font-bold border border-slate-800">
                      {s.formulaOrCode}
                    </div>
                  )}

                  {s.calloutBox && (
                    <div className={`p-2.5 rounded-lg border text-xs leading-relaxed ${
                      idx === 0 ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    }`}>
                      <strong className="block text-[11px] uppercase mb-0.5">{s.calloutBox.title}</strong>
                      <p>{s.calloutBox.text}</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className={`pt-2 border-t text-[11px] flex justify-between items-center ${
                  idx === 0 ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-500'
                }`}>
                  <span>{teacherProfile.name} · {teacherProfile.school}</span>
                  <span className="font-mono">Trang {idx + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
