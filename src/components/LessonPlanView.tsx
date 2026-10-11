import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Edit3, 
  CheckCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Presentation,
  Sparkles,
  Layers,
  Zap,
  Search,
  BookOpen,
  Copy,
  Check,
  RotateCcw,
  Plus,
  Image,
  Maximize2,
  Trash2,
  ExternalLink,
  Bookmark,
  PenTool,
  Globe,
  X
} from 'lucide-react';
import { LessonPlan5512, TeachingActivity, UploadedDocument, RagChunkResult, LessonIllustration } from '../types';
import { exportToWord } from '../utils/exportUtils';
import { 
  searchTextbookRag, 
  enrichLessonPlanFromRag, 
  insertRagSnippetToActivity, 
  RAG_SUGGESTED_QUERIES,
  SUGGESTED_ILLUSTRATIONS_LIBRARY
} from '../utils/ragEngine';
import { HTS_DIGITAL_ILLUSTRATIONS } from '../data/digitalMaterials';

interface LessonPlanViewProps {
  lessonPlan: LessonPlan5512;
  documents?: UploadedDocument[];
  onUpdateLessonPlan: (updated: LessonPlan5512) => void;
  onConvertToSlides: (slideCount?: number) => void;
}

export const LessonPlanView: React.FC<LessonPlanViewProps> = ({
  lessonPlan,
  documents = [],
  onUpdateLessonPlan,
  onConvertToSlides,
}) => {
  const [isEditing, setIsEditing] = useState(true); // Default inline editable
  const [expandedActivity, setExpandedActivity] = useState<string>('act-1');
  const [targetSlideCount, setTargetSlideCount] = useState<number>(8);

  // Trạng thái modal Thêm ảnh minh họa & Xem phóng to ảnh
  const [activeAddIllActId, setActiveAddIllActId] = useState<string | null>(null);
  const [previewIll, setPreviewIll] = useState<LessonIllustration | null>(null);
  const [modalTab, setModalTab] = useState<'library' | 'hanhtrangso' | 'custom'>('hanhtrangso');
  const [libraryFilter, setLibraryFilter] = useState<string>('all');
  const [htsSearchKeyword, setHtsSearchKeyword] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [customCaption, setCustomCaption] = useState<string>('');
  const [customDesc, setCustomDesc] = useState<string>('');
  const [customType, setCustomType] = useState<LessonIllustration['type']>('diagram');
  const [customSource, setCustomSource] = useState<string>('Học liệu số Hành Trang Số - NXB GDVN');

  // Trạng thái Phân Hệ RAG Assistant trong KHBD 5512
  const [isRagDrawerOpen, setIsRagDrawerOpen] = useState(false);
  const [ragQuery, setRagQuery] = useState(lessonPlan.lessonName.replace(/BÀI\s+\d+:?\s*/i, ''));
  const [ragContentType, setRagContentType] = useState<'all' | 'definition' | 'activity' | 'exercise' | 'core'>('all');
  const [ragToast, setRagToast] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Tự động tắt Toast thông báo sau 4 giây
  useEffect(() => {
    if (ragToast) {
      const t = setTimeout(() => setRagToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [ragToast]);

  // Kết quả truy vấn RAG theo thời gian thực
  const ragResults = useMemo(() => {
    if (!ragQuery.trim()) return [];
    return searchTextbookRag(ragQuery, documents, {
      contentType: ragContentType,
      minScore: 25
    });
  }, [ragQuery, documents, ragContentType]);

  // Xử lý làm giàu toàn bộ KHBD 5512 từ RAG SGK
  const handleAutoEnrichKHBD = () => {
    const { enrichedPlan, summaryMessage } = enrichLessonPlanFromRag(lessonPlan, documents);
    onUpdateLessonPlan(enrichedPlan);
    setRagToast(summaryMessage);
  };

  // Xử lý chèn một đoạn trích RAG vào hoạt động cụ thể
  const handleInsertChunkToAct = (chunk: RagChunkResult, actCode: 'ACT_1' | 'ACT_2' | 'ACT_3' | 'ACT_4') => {
    const updated = insertRagSnippetToActivity(lessonPlan, actCode, chunk);
    onUpdateLessonPlan(updated);
    setRagToast(`Đã chèn trích dẫn từ ${chunk.docName} (${chunk.pageNumber}) vào ${actCode}!`);
  };

  // Xử lý sao chép trích dẫn
  const handleCopyChunk = (chunk: RagChunkResult) => {
    const text = `[Trích xuất từ ${chunk.docName} - ${chunk.pageNumber}]:\n"${chunk.contentSnippet}"\n(Độ khớp RAG: ${chunk.relevanceScore}%)`;
    navigator.clipboard.writeText(text);
    setCopiedId(chunk.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportWord = () => {
    const el = document.getElementById('lesson-plan-print-root');
    if (el) {
      exportToWord(
        `KHBD_5512_${lessonPlan.subject}_${lessonPlan.grade}`,
        el.innerHTML,
        `KẾ HOẠCH BÀI DẠY (PHỤ LỤC I) - ${lessonPlan.lessonName}`
      );
    }
  };

  const handleUpdateActivityStep = (
    actId: string, 
    stepKey: 'step1_assign' | 'step2_execute' | 'step3_report' | 'step4_conclude', 
    val: string
  ) => {
    const updatedActivities = lessonPlan.activities.map(act => {
      if (act.id === actId) {
        return {
          ...act,
          implementation: {
            ...act.implementation,
            [stepKey]: val
          }
        };
      }
      return act;
    });

    onUpdateLessonPlan({
      ...lessonPlan,
      activities: updatedActivities
    });
  };

  const handleUpdateActivityField = (actId: string, field: 'goal' | 'content' | 'product', val: string) => {
    const updatedActivities = lessonPlan.activities.map(act => {
      if (act.id === actId) {
        return {
          ...act,
          [field]: val
        };
      }
      return act;
    });

    onUpdateLessonPlan({
      ...lessonPlan,
      activities: updatedActivities
    });
  };

  // Cập nhật nội dung ghi bài cho học sinh
  const handleUpdateActivityStudentNotes = (actId: string, val: string) => {
    const updatedActivities = lessonPlan.activities.map(act => {
      if (act.id === actId) {
        return {
          ...act,
          studentNotes: val
        };
      }
      return act;
    });

    onUpdateLessonPlan({
      ...lessonPlan,
      activities: updatedActivities
    });
  };

  // Thêm ảnh minh họa vào hoạt động
  const handleAddIllustration = (actId: string, ill: LessonIllustration) => {
    const updatedActivities = lessonPlan.activities.map(act => {
      if (act.id === actId) {
        const existing = act.illustrations || [];
        return {
          ...act,
          illustrations: [...existing, ill]
        };
      }
      return act;
    });

    onUpdateLessonPlan({
      ...lessonPlan,
      activities: updatedActivities
    });
    setActiveAddIllActId(null);
    setRagToast(`Đã thêm ảnh minh họa "${ill.caption}" vào kế hoạch bài dạy!`);
  };

  // Xóa ảnh minh họa khỏi hoạt động
  const handleRemoveIllustration = (actId: string, illId: string) => {
    const updatedActivities = lessonPlan.activities.map(act => {
      if (act.id === actId) {
        return {
          ...act,
          illustrations: (act.illustrations || []).filter(i => i.id !== illId)
        };
      }
      return act;
    });

    onUpdateLessonPlan({
      ...lessonPlan,
      activities: updatedActivities
    });
  };

  // Thêm ảnh tùy chỉnh từ form
  const handleAddCustomIllustration = () => {
    if (!activeAddIllActId) return;
    if (!customUrl.trim() || !customCaption.trim()) {
      alert('Vui lòng nhập đường link ảnh và chú thích ảnh!');
      return;
    }

    const newIll: LessonIllustration = {
      id: `ill-custom-${Date.now()}`,
      url: customUrl.trim(),
      caption: customCaption.trim(),
      description: customDesc.trim() || undefined,
      type: customType,
      source: customSource.trim() || 'Tài liệu SGK'
    };

    handleAddIllustration(activeAddIllActId, newIll);
    setCustomUrl('');
    setCustomCaption('');
    setCustomDesc('');
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Banner Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded">
              Công văn 5512/BGDĐT-GDTrH
            </span>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Nguồn SGK: Kết Nối Tri Thức GDPT 2018 (hanhtrangso.nxbgd.vn)
            </span>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Phụ lục I: Khung kế hoạch bài dạy
            </span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 mt-1">
            Kế Hoạch Bài Dạy (Phụ Lục I - Công Văn 5512)
          </h1>
        </div>

        {/* NÚT BẤM "CHUYỂN ĐỔI NHANH KHBD THÀNH SLIDE" CÓ BỘ CHỌN SỐ SLIDE */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 p-1.5 rounded-lg shadow-2xs">
            <span className="text-xs font-bold text-emerald-900 pl-1">Chọn số slide cần tạo:</span>
            <select
              value={targetSlideCount}
              onChange={(e) => setTargetSlideCount(Number(e.target.value))}
              className="text-xs font-bold text-emerald-950 bg-white border border-emerald-300 rounded px-2 py-1 cursor-pointer focus:ring-1 focus:ring-emerald-500"
            >
              <option value={4}>4 slide (Ngắn gọn - 4 hoạt động)</option>
              <option value={6}>6 slide (Cơ bản - chuẩn mực)</option>
              <option value={8}>8 slide (Chuẩn Bộ GD&ĐT - Đầy đủ)</option>
              <option value={10}>10 slide (Mở rộng - Kèm ví dụ mẫu)</option>
              <option value={12}>12 slide (Chuyên sâu - Phân hóa)</option>
              <option value={16}>16 slide (Toàn diện - Đầy đủ bài tập)</option>
            </select>
            <button
              onClick={() => onConvertToSlides(targetSlideCount)}
              title="Tự động đồng bộ 4 hoạt động KHBD sang Slide Deck tĩnh 16:9 theo đúng số lượng đã chọn"
              className="px-3.5 py-1.5 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-xs flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Presentation className="w-4 h-4 text-emerald-100" />
              <span>Xuất {targetSlideCount} Slide Bài Giảng (16:9)</span>
            </button>
          </div>

          {/* Nút Phân Hệ RAG SGK kết nối 5512 */}
          <button
            type="button"
            onClick={() => setIsRagDrawerOpen(!isRagDrawerOpen)}
            className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 ${
              isRagDrawerOpen 
                ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-300 shadow-sm' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500 shadow-xs'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>{isRagDrawerOpen ? 'Đóng Bảng RAG' : '⚡ Tra Cứu RAG SGK'}</span>
          </button>

          <button
            type="button"
            onClick={handleAutoEnrichKHBD}
            title="Tự động đồng bộ toàn bộ 4 hoạt động 5512 và mục tiêu từ SGK chuẩn"
            className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 rounded-lg shadow-xs flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>⚡ Làm Giàu KHBD Từ RAG SGK</span>
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
              isEditing 
                ? 'bg-blue-50 text-blue-800 border-blue-200' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Đang Chế Độ Sửa Nhanh' : 'Chế Độ Xem In'}</span>
          </button>

          <button
            onClick={handleExportWord}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải File Word (.doc)</span>
          </button>
        </div>
      </div>

      {/* RAG TOAST THÔNG BÁO KẾT NỐI */}
      {ragToast && (
        <div className="p-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl shadow-md text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in duration-200 no-print">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>{ragToast}</span>
          </div>
          <button 
            onClick={() => setRagToast(null)}
            className="text-xs text-white/80 hover:text-white px-2 py-0.5 bg-white/20 rounded"
          >
            Đóng
          </button>
        </div>
      )}

      {/* PHÂN HỆ RAG ASSISTANT CHO KHBD 5512 (KẾT NỐI NGỮ LIỆU SGK) */}
      {isRagDrawerOpen && (
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/80 rounded-2xl p-5 text-white shadow-xl space-y-4 animate-in fade-in duration-200 no-print">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black shadow-md">
                <Zap className="w-4 h-4 fill-slate-950" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <span>TRỢ LÝ RAG NGỮ LIỆU SGK CHO KẾ HOẠCH BÀI DẠY 5512</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                    GDPT 2018
                  </span>
                </h3>
                <p className="text-[11px] text-indigo-200">
                  Tra cứu trực tiếp định nghĩa, công thức, hoạt động và bài tập trong SGK {lessonPlan.subject} {lessonPlan.grade} để nạp vào 4 hoạt động KHBD 5512.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsRagDrawerOpen(false)}
              className="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 self-start sm:self-center"
            >
              ✕ Đóng bảng RAG
            </button>
          </div>

          {/* Ô tìm kiếm RAG */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-indigo-300 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={ragQuery}
                onChange={(e) => setRagQuery(e.target.value)}
                placeholder="Nhập nội dung cần tra cứu trong SGK..."
                className="w-full pl-9 pr-20 py-2 bg-white/10 border border-indigo-400/40 rounded-xl text-xs text-white placeholder-indigo-300/60 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
              />
              {ragQuery && (
                <button
                  onClick={() => setRagQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-indigo-300 hover:text-white"
                >
                  ✕ Xóa
                </button>
              )}
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-indigo-300 text-[11px] font-bold shrink-0">Loại:</span>
              <button
                type="button"
                onClick={() => setRagContentType('all')}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                  ragContentType === 'all' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-white/10 text-indigo-200 hover:bg-white/20'
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setRagContentType('definition')}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                  ragContentType === 'definition' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-white/10 text-indigo-200 hover:bg-white/20'
                }`}
              >
                📐 Khái niệm & Định lý
              </button>
              <button
                type="button"
                onClick={() => setRagContentType('activity')}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                  ragContentType === 'activity' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-white/10 text-indigo-200 hover:bg-white/20'
                }`}
              >
                ⚡ Hoạt động & Thí nghiệm
              </button>
              <button
                type="button"
                onClick={() => setRagContentType('exercise')}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                  ragContentType === 'exercise' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-white/10 text-indigo-200 hover:bg-white/20'
                }`}
              >
                ❓ Bài tập SGK
              </button>
            </div>

            {/* Gợi ý nhanh */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="text-amber-300 font-bold shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Gợi ý:</span>
              </span>
              {RAG_SUGGESTED_QUERIES.slice(0, 4).map((sq, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => setRagQuery(sq.query)}
                  className="px-2 py-0.5 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 rounded text-[11px] whitespace-nowrap border border-indigo-700/50"
                >
                  {sq.label}
                </button>
              ))}
            </div>
          </div>

          {/* RAG Snippets Results */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between text-xs text-indigo-200 font-semibold border-t border-indigo-900 pt-2">
              <span>Tìm thấy {ragResults.length} đoạn trích SGK phù hợp:</span>
              <span className="text-[11px] text-amber-300">Nhấn nút bên dưới để chèn thẳng vào Hoạt động tương ứng</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {ragResults.map((chunk) => (
                <div
                  key={chunk.id}
                  className="bg-white/10 backdrop-blur-xs border border-indigo-400/30 hover:border-amber-400/80 rounded-xl p-3 space-y-2 text-xs flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/40 text-indigo-100 font-bold text-[10px]">
                        {chunk.contentType}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-amber-300 bg-amber-400/20 px-1.5 py-0.2 rounded">
                          {chunk.relevanceScore}% Khớp
                        </span>
                        <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-1.5 py-0.2 rounded">
                          📖 {chunk.pageNumber}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-indigo-200 font-semibold">
                      {chunk.docName} › Bài {chunk.lessonNumber}: {chunk.lessonName}
                    </p>

                    <p className="text-xs text-slate-100 bg-black/20 p-2 rounded border border-white/10 italic leading-relaxed">
                      "{chunk.contentSnippet}"
                    </p>
                  </div>

                  {/* Nút hành động chèn RAG vào hoạt động */}
                  <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => handleCopyChunk(chunk)}
                      className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-semibold flex items-center gap-1"
                    >
                      {copiedId === chunk.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === chunk.id ? 'Đã chép' : 'Chép'}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleInsertChunkToAct(chunk, 'ACT_1')}
                        title="Chèn đoạn trích này vào Hoạt động 1 (Khởi động)"
                        className="px-1.5 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded"
                      >
                        + HĐ 1
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertChunkToAct(chunk, 'ACT_2')}
                        title="Chèn đoạn trích này vào Hoạt động 2 (Hình thành KT)"
                        className="px-1.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded"
                      >
                        + HĐ 2
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertChunkToAct(chunk, 'ACT_3')}
                        title="Chèn đoạn trích này vào Hoạt động 3 (Luyện tập)"
                        className="px-1.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded"
                      >
                        + HĐ 3
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertChunkToAct(chunk, 'ACT_4')}
                        title="Chèn đoạn trích này vào Hoạt động 4 (Vận dụng)"
                        className="px-1.5 py-1 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold rounded"
                      >
                        + HĐ 4
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Document Paper */}
      <div 
        id="lesson-plan-print-root" 
        className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200 space-y-8"
      >
        {/* National Header & School Name */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-200 pb-6">
          <div>
            <p className="font-bold text-sm uppercase tracking-wide text-slate-800">
              {lessonPlan.schoolName}
            </p>
            <p className="text-xs font-semibold text-slate-600 uppercase mt-0.5">
              {lessonPlan.department}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Giáo viên: <span className="font-medium text-slate-700">{lessonPlan.teacherName}</span>
            </p>
          </div>

          <div className="text-right sm:text-right w-full sm:w-auto">
            <p className="font-bold text-xs uppercase tracking-wide text-slate-800">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </p>
            <p className="text-xs font-medium text-slate-700 underline decoration-1 underline-offset-4 mt-0.5">
              Độc lập - Tự do - Hạnh phúc
            </p>
            <p className="text-xs text-slate-500 italic mt-2">
              Năm học: {lessonPlan.academicYear}
            </p>
          </div>
        </div>

        {/* Lesson Title Banner */}
        <div className="text-center space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
            {lessonPlan.appendixTitle || 'KẾ HOẠCH BÀI DẠY (PHỤ LỤC I - CÔNG VĂN SỐ 5512/BGDĐT-GDTrH)'}
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
            {lessonPlan.lessonName}
          </h2>
          <div className="flex items-center justify-center gap-3 text-xs text-slate-600 pt-1">
            <span>Môn: <strong>{lessonPlan.subject}</strong></span>
            <span>·</span>
            <span>Khối lớp: <strong>{lessonPlan.grade}</strong></span>
            <span>·</span>
            <span>Bộ sách: <strong>{lessonPlan.curriculum}</strong></span>
            <span>·</span>
            <span>Thời lượng: <strong>{lessonPlan.durationInPeriods} tiết</strong></span>
          </div>
        </div>

        {/* I. MỤC TIÊU */}
        <section className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 uppercase border-b-2 border-slate-900 pb-1 flex items-center gap-2">
            <span>I. MỤC TIÊU DẠY HỌC</span>
          </h3>

          <div className="space-y-3 pl-2 text-sm text-slate-700 leading-relaxed">
            <div>
              <h4 className="font-bold text-slate-900">1. Về kiến thức:</h4>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                {lessonPlan.objectives.knowledge.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900">2. Về năng lực:</h4>
              <div className="pl-4 mt-1 space-y-2">
                <div>
                  <p className="font-semibold text-slate-800 italic">a) Năng lực chung:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    {lessonPlan.objectives.competencies.general.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-slate-800 italic">b) Năng lực đặc thù:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    {lessonPlan.objectives.competencies.specific.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900">3. Về phẩm chất:</h4>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                {lessonPlan.objectives.qualities.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU */}
        <section className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 uppercase border-b-2 border-slate-900 pb-1">
            II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-2">1. Chuẩn bị của Giáo viên:</h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                {lessonPlan.equipments.teacher.map((eq, idx) => (
                  <li key={idx}>{eq}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-2">2. Chuẩn bị của Học sinh:</h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                {lessonPlan.equipments.students.map((eq, idx) => (
                  <li key={idx}>{eq}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* III. TIẾN TRÌNH DẠY HỌC (BẢNG TIẾN TRÌNH 4 HOẠT ĐỘNG INLINE EDITABLE) */}
        <section className="space-y-6">
          <div className="border-b-2 border-slate-900 pb-1 flex justify-between items-end">
            <h3 className="text-base font-bold text-slate-900 uppercase">
              III. TIẾN TRÌNH DẠY HỌC (4 HOẠT ĐỘNG CHUẨN CÔNG VĂN 5512)
            </h3>
            <span className="text-xs text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">
              Chỉnh sửa trực tiếp (Inline Editable)
            </span>
          </div>

          <div className="space-y-6">
            {lessonPlan.activities.map((act, index) => {
              const isOpen = expandedActivity === act.id || isEditing;

              return (
                <div 
                  key={act.id} 
                  className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs"
                >
                  {/* Activity Header */}
                  <div 
                    onClick={() => setExpandedActivity(isOpen ? '' : act.id)}
                    className="p-4 bg-slate-50 hover:bg-slate-100 flex items-center justify-between cursor-pointer border-b border-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{act.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span>Thời lượng ước tính: {act.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        4 Bước Chuẩn Bộ
                      </span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    </div>
                  </div>

                  {/* Activity Content: Inline Editable */}
                  {isOpen && (
                    <div className="p-5 space-y-4 text-sm text-slate-700">
                      {/* RAG Citation Badge */}
                      {act.ragCitation && (
                        <div className="p-3 bg-indigo-50/90 border border-indigo-200 rounded-xl flex items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-bold text-[10px] flex items-center gap-1 shadow-2xs">
                              <BookOpen className="w-3 h-3" />
                              <span>Ngữ Liệu RAG SGK</span>
                            </span>
                            <span className="font-bold text-slate-900">{act.ragCitation.docName}</span>
                            <span className="text-indigo-700 font-semibold font-mono">({act.ragCitation.pageNumber})</span>
                            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                              {act.ragCitation.relevanceScore}% Khớp
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 italic hidden sm:inline-block truncate max-w-xs">
                            "{act.ragCitation.snippet.slice(0, 90)}..."
                          </span>
                        </div>
                      )}

                      {/* a. Mục tiêu */}
                      <div>
                        <p className="font-bold text-slate-900 mb-1">a) Mục tiêu hoạt động:</p>
                        {isEditing ? (
                          <textarea
                            value={act.goal}
                            onChange={(e) => handleUpdateActivityField(act.id, 'goal', e.target.value)}
                            rows={2}
                            placeholder="Nhập mục tiêu hoạt động..."
                            className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-slate-50/50 focus:bg-white focus:ring-1 focus:ring-blue-500 leading-relaxed"
                          />
                        ) : (
                          <p className="pl-4 text-slate-700">{act.goal}</p>
                        )}
                      </div>

                      {/* b. Nội dung */}
                      <div>
                        <p className="font-bold text-slate-900 mb-1">b) Nội dung nhiệm vụ:</p>
                        {isEditing ? (
                          <textarea
                            value={act.content}
                            onChange={(e) => handleUpdateActivityField(act.id, 'content', e.target.value)}
                            rows={2}
                            placeholder="Nhập nội dung nhiệm vụ học tập..."
                            className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-slate-50/50 focus:bg-white focus:ring-1 focus:ring-blue-500 leading-relaxed"
                          />
                        ) : (
                          <p className="pl-4 text-slate-700">{act.content}</p>
                        )}
                      </div>

                      {/* c. Sản phẩm */}
                      <div>
                        <p className="font-bold text-slate-900 mb-1">c) Sản phẩm học tập của học sinh:</p>
                        {isEditing ? (
                          <textarea
                            value={act.product}
                            onChange={(e) => handleUpdateActivityField(act.id, 'product', e.target.value)}
                            rows={2}
                            placeholder="Nhập sản phẩm học tập kỳ vọng..."
                            className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-slate-50/50 focus:bg-white focus:ring-1 focus:ring-blue-500 leading-relaxed"
                          />
                        ) : (
                          <p className="pl-4 text-slate-700">{act.product}</p>
                        )}
                      </div>

                      {/* d. Tổ chức thực hiện: Đủ 4 bước */}
                      <div className="pt-2">
                        <p className="font-bold text-slate-900 mb-3">
                          d) Tổ chức thực hiện (Đúng 4 bước quy định Công văn 5512):
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-1">
                          {/* Bước 1 */}
                          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                            <strong className="text-blue-900 block font-semibold text-xs">
                              Bước 1: Chuyển giao nhiệm vụ học tập
                            </strong>
                            {isEditing ? (
                              <textarea
                                value={act.implementation.step1_assign}
                                onChange={(e) => handleUpdateActivityStep(act.id, 'step1_assign', e.target.value)}
                                rows={3}
                                className="w-full p-2 border border-slate-300 rounded text-xs bg-white focus:ring-1 focus:ring-blue-500"
                              />
                            ) : (
                              <p className="text-xs leading-relaxed text-slate-700">
                                {act.implementation.step1_assign}
                              </p>
                            )}
                          </div>

                          {/* Bước 2 */}
                          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                            <strong className="text-blue-900 block font-semibold text-xs">
                              Bước 2: Thực hiện nhiệm vụ học tập
                            </strong>
                            {isEditing ? (
                              <textarea
                                value={act.implementation.step2_execute}
                                onChange={(e) => handleUpdateActivityStep(act.id, 'step2_execute', e.target.value)}
                                rows={3}
                                className="w-full p-2 border border-slate-300 rounded text-xs bg-white focus:ring-1 focus:ring-blue-500"
                              />
                            ) : (
                              <p className="text-xs leading-relaxed text-slate-700">
                                {act.implementation.step2_execute}
                              </p>
                            )}
                          </div>

                          {/* Bước 3 */}
                          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                            <strong className="text-blue-900 block font-semibold text-xs">
                              Bước 3: Báo cáo kết quả và thảo luận
                            </strong>
                            {isEditing ? (
                              <textarea
                                value={act.implementation.step3_report}
                                onChange={(e) => handleUpdateActivityStep(act.id, 'step3_report', e.target.value)}
                                rows={3}
                                className="w-full p-2 border border-slate-300 rounded text-xs bg-white focus:ring-1 focus:ring-blue-500"
                              />
                            ) : (
                              <p className="text-xs leading-relaxed text-slate-700">
                                {act.implementation.step3_report}
                              </p>
                            )}
                          </div>

                          {/* Bước 4 */}
                          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                            <strong className="text-blue-900 block font-semibold text-xs">
                              Bước 4: Đánh giá kết quả, kết luận, nhận định
                            </strong>
                            {isEditing ? (
                              <textarea
                                value={act.implementation.step4_conclude}
                                onChange={(e) => handleUpdateActivityStep(act.id, 'step4_conclude', e.target.value)}
                                rows={3}
                                className="w-full p-2 border border-slate-300 rounded text-xs bg-white focus:ring-1 focus:ring-blue-500"
                              />
                            ) : (
                              <p className="text-xs leading-relaxed text-slate-700">
                                {act.implementation.step4_conclude}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* e. NỘI DUNG GHI BÀI CHO HỌC SINH (Kiến thức cốt lõi HS chép vào vở / Bảng ghi của GV) */}
                      <div className="pt-3">
                        <div className="border border-emerald-300 rounded-xl overflow-hidden shadow-2xs">
                          <div className="flex items-center justify-between bg-gradient-to-r from-emerald-800 to-teal-800 text-white px-3.5 py-2.5">
                            <div className="flex items-center gap-2">
                              <PenTool className="w-4 h-4 text-emerald-300" />
                              <span className="text-xs font-bold uppercase tracking-wide">
                                e) Nội dung ghi bài cho học sinh (Ghi chép vào vở / Bảng ghi của GV):
                              </span>
                            </div>
                            <span className="text-[10px] bg-emerald-950/70 text-emerald-200 px-2 py-0.5 rounded font-mono border border-emerald-700/60 hidden sm:inline-block">
                              Bám sát SGK Kết Nối Tri Thức GDPT 2018
                            </span>
                          </div>

                          <div className="p-3.5 bg-emerald-50/40">
                            {isEditing ? (
                              <textarea
                                value={act.studentNotes || ''}
                                onChange={(e) => handleUpdateActivityStudentNotes(act.id, e.target.value)}
                                rows={5}
                                placeholder="Nhập nội dung cốt lõi học sinh chép vào vở (Khái niệm, công thức, quy tắc, phương trình, ví dụ mẫu)..."
                                className="w-full p-3 border border-emerald-300/80 rounded-lg text-xs font-sans leading-relaxed bg-white text-emerald-950 focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                              />
                            ) : (
                              <div className="text-xs leading-relaxed text-emerald-950 font-sans whitespace-pre-wrap pl-1">
                                {act.studentNotes || (
                                  <span className="italic text-slate-400">
                                    Chưa có nội dung ghi bài. Hãy bấm nút "⚡ Làm Giàu KHBD Từ RAG SGK" ở phía trên để tự động đồng bộ từ sách giáo khoa.
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* f. HÌNH ẢNH MINH HỌA BÀI HỌC SGK (Sơ đồ, Thí nghiệm, Bảng số liệu, Mô hình phân tử) */}
                      <div className="pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between pb-2 flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <Image className="w-4 h-4 text-indigo-600" />
                            <span className="text-xs font-bold text-slate-900">
                              f) Hình ảnh minh họa bài học SGK ({act.illustrations?.length || 0} hình ảnh):
                            </span>
                          </div>

                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveAddIllActId(act.id);
                                setModalTab('hanhtrangso');
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                            >
                              <Plus className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Thêm hình ảnh minh họa</span>
                            </button>
                          )}
                        </div>

                        {act.illustrations && act.illustrations.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                            {act.illustrations.map((ill) => (
                              <div 
                                key={ill.id} 
                                className="group relative border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-all flex flex-col"
                              >
                                <div 
                                  className="relative aspect-video w-full bg-slate-100 overflow-hidden cursor-pointer"
                                  onClick={() => setPreviewIll(ill)}
                                  title="Bấm để xem ảnh phóng to"
                                >
                                  <img 
                                    src={ill.url} 
                                    alt={ill.caption} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                      // Fallback nếu link ảnh ngoại vi lỗi
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold">
                                    <Maximize2 className="w-4 h-4" />
                                    <span>Xem phóng to</span>
                                  </div>
                                  {ill.type && (
                                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[9px] font-bold bg-slate-900/85 text-white backdrop-blur-xs uppercase border border-white/20">
                                      {ill.type === 'experiment' ? '🧪 Thí nghiệm' : 
                                       ill.type === 'molecule' ? '🔬 Phân tử' : 
                                       ill.type === 'diagram' ? '📐 Sơ đồ' : 
                                       ill.type === 'chart' ? '📊 Biểu đồ' : '📷 Ảnh SGK'}
                                    </span>
                                  )}
                                </div>

                                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                                  <div>
                                    <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                                      {ill.caption}
                                    </p>
                                    {ill.description && (
                                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                                        {ill.description}
                                      </p>
                                    )}
                                  </div>

                                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                                    <span className="truncate max-w-[170px] font-medium text-slate-600 italic">
                                      {ill.source || 'SGK KNTT 2018'}
                                    </span>
                                    {isEditing && (
                                      <button 
                                        type="button" 
                                        onClick={() => handleRemoveIllustration(act.id, ill.id)}
                                        className="text-rose-600 hover:text-rose-800 font-bold p-1 rounded hover:bg-rose-50 transition-colors"
                                        title="Xóa hình ảnh này"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-3 bg-slate-50/70 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                            <span>Chưa có hình ảnh minh họa cho hoạt động này.</span>
                            {isEditing && (
                              <button 
                                type="button"
                                onClick={() => {
                                  setActiveAddIllActId(act.id);
                                  setModalTab('library');
                                }}
                                className="text-indigo-600 font-bold hover:underline"
                              >
                                + Thêm ảnh từ Thư viện SGK
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* IV. NỘI DUNG GHI BẢNG / SỔ TAY KIẾN THỨC CỐT LÕI CỦA HỌC SINH */}
        <section className="space-y-4 pt-4 border-t-2 border-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-1 gap-1">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Sổ tay ghi chép / Bảng lớp học sinh
              </span>
              <h3 className="text-base font-bold text-slate-900 uppercase mt-1">
                IV. NỘI DUNG GHI BẢNG / VỞ GHI CỐT LÕI CỦA HỌC SINH (CHUẨN KNTT GDPT 2018)
              </h3>
            </div>
            <span className="text-xs text-slate-500 italic">
              Nội dung chuẩn học sinh chép vào vở ghi
            </span>
          </div>

          {lessonPlan.boardPlanSummary ? (
            <div className="bg-slate-900 text-white p-5 md:p-6 rounded-2xl shadow-sm space-y-4 font-sans border border-slate-800">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between flex-wrap gap-2">
                <h4 className="font-bold text-emerald-400 text-sm tracking-wide">
                  {lessonPlan.boardPlanSummary.title}
                </h4>
                <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">
                  {lessonPlan.subject} · {lessonPlan.grade}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lessonPlan.boardPlanSummary.sections.map((sec, sIdx) => (
                  <div key={sIdx} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                    <h5 className="font-bold text-amber-300 text-xs uppercase flex items-center gap-1.5">
                      <Bookmark className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{sec.heading}</span>
                    </h5>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">{sec.content}</p>
                    {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                      <ul className="list-disc pl-4 text-[11px] text-slate-300 space-y-1 pt-1">
                        {sec.bulletPoints.map((bp, bIdx) => (
                          <li key={bIdx}>{bp}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-950 font-sans">
              <p className="font-bold text-emerald-900">Nội dung ghi chép trọng tâm toàn bài:</p>
              <p>Học sinh hoàn thành ghi chép các định nghĩa, quy tắc, sơ đồ minh họa và bài tập mẫu của từng hoạt động ở Mục III vào vở học cá nhân.</p>
            </div>
          )}
        </section>

        {/* Footer Signature */}
        <div className="pt-8 border-t border-slate-200 flex justify-between items-start text-xs text-slate-600">
          <div className="text-center">
            <p className="font-bold uppercase text-slate-800">TỔ TRƯỞNG CHUYÊN MÔN</p>
            <p className="italic text-slate-500 mt-0.5">(Ký và ghi rõ họ tên)</p>
            <div className="h-16"></div>
          </div>
          <div className="text-center">
            <p className="italic text-slate-500">..., ngày ..... tháng ..... năm 202...</p>
            <p className="font-bold uppercase text-slate-800 mt-0.5">GIÁO VIÊN SOẠN BÀI</p>
            <p className="italic text-slate-500">(Ký và ghi rõ họ tên)</p>
            <div className="h-16"></div>
            <p className="font-semibold text-slate-900">{lessonPlan.teacherName}</p>
          </div>
        </div>
      </div>

      {/* MODAL: THÊM HÌNH ẢNH MINH HỌA VÀO HOẠT ĐỘNG */}
      {activeAddIllActId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <Image className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Thêm hình ảnh minh họa bài học (Chuẩn SGK Kết Nối Tri Thức GDPT 2018)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveAddIllActId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-200 px-5 pt-3 gap-2 bg-slate-50 flex-wrap">
              <button
                type="button"
                onClick={() => setModalTab('hanhtrangso')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  modalTab === 'hanhtrangso'
                    ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-lg'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                🌐 Kho Học Liệu Số (hanhtrangso.nxbgd.vn)
              </button>
              <button
                type="button"
                onClick={() => setModalTab('library')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  modalTab === 'library'
                    ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-lg'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 text-indigo-600" />
                📚 Thư viện SGK GDPT 2018
              </button>
              <button
                type="button"
                onClick={() => setModalTab('custom')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  modalTab === 'custom'
                    ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                🔗 Nhập link web / URL tùy chỉnh
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 flex-1">
              {modalTab === 'hanhtrangso' ? (
                <div className="space-y-4">
                  {/* Thanh tìm kiếm & lọc nhanh theo bài học */}
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-bold text-emerald-950">
                          Học liệu số trực tuyến bám sát SGK Kết Nối Tri Thức GDPT 2018
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded font-mono">
                        Nguồn: hanhtrangso.nxbgd.vn
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 text-emerald-700 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={htsSearchKeyword}
                          onChange={(e) => setHtsSearchKeyword(e.target.value)}
                          placeholder="Tìm hình ảnh theo bài (ví dụ: acid, base, parabol, mạch điện, tế bào)..."
                          className="w-full pl-8 pr-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      {htsSearchKeyword && (
                        <button
                          type="button"
                          onClick={() => setHtsSearchKeyword('')}
                          className="text-xs text-emerald-700 hover:text-emerald-900 px-2 py-1 bg-white border border-emerald-200 rounded-lg"
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Danh sách hình ảnh từ Hành Trang Số */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[50vh] overflow-y-auto pr-1">
                    {HTS_DIGITAL_ILLUSTRATIONS
                      .filter(item => {
                        if (!htsSearchKeyword.trim()) {
                          // Tự động ưu tiên ảnh cùng môn học hoặc cùng tên bài
                          const matchSub = item.subject.toLowerCase().includes(lessonPlan.subject.toLowerCase()) ||
                            lessonPlan.subject.toLowerCase().includes(item.subject.toLowerCase()) ||
                            (lessonPlan.subject.includes('Khoa học') && ['Khoa học tự nhiên', 'Vật lí', 'Hoá học', 'Sinh học'].includes(item.subject));
                          return matchSub || true;
                        }
                        const kw = htsSearchKeyword.toLowerCase();
                        return (
                          item.caption.toLowerCase().includes(kw) ||
                          item.description.toLowerCase().includes(kw) ||
                          item.lessonName.toLowerCase().includes(kw) ||
                          item.chapterTitle.toLowerCase().includes(kw) ||
                          item.tags.some(t => t.includes(kw))
                        );
                      })
                      .map((item) => (
                        <div
                          key={item.id}
                          className="border border-emerald-200 rounded-xl overflow-hidden bg-white hover:border-emerald-500 hover:shadow-md transition-all flex flex-col group"
                        >
                          <div className="aspect-video w-full bg-slate-100 overflow-hidden relative">
                            <img
                              src={item.url}
                              alt={item.caption}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute top-1.5 left-1.5 flex gap-1">
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-900/90 text-emerald-100 uppercase">
                                {item.type}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-900/80 text-white">
                                {item.grade}
                              </span>
                            </div>
                          </div>
                          <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                            <div>
                              <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider line-clamp-1">
                                {item.chapterTitle} • {item.lessonName}
                              </div>
                              <p className="text-xs font-bold text-slate-900 line-clamp-2 mt-0.5">
                                {item.caption}
                              </p>
                              {item.description && (
                                <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                                  {item.description}
                                </p>
                              )}
                            </div>
                            <div className="pt-2 border-t border-emerald-100 flex items-center justify-between gap-2">
                              <span className="text-[10px] text-emerald-700 truncate max-w-[150px]" title={item.source}>
                                {item.source}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleAddIllustration(activeAddIllActId, {
                                  id: `ill-${item.id}-${Date.now()}`,
                                  caption: item.caption,
                                  url: item.url,
                                  description: item.description,
                                  type: item.type,
                                  source: item.source
                                })}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                              >
                                + Chọn ảnh này
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : modalTab === 'library' ? (
                <div className="space-y-4">
                  {/* Category filters */}
                  <div className="flex items-center gap-1.5 flex-wrap text-xs">
                    <span className="font-semibold text-slate-600 mr-1">Phân loại:</span>
                    {[
                      { id: 'all', label: 'Tất cả' },
                      { id: 'experiment', label: '🧪 Thí nghiệm' },
                      { id: 'diagram', label: '📐 Sơ đồ' },
                      { id: 'molecule', label: '🔬 Phân tử' },
                      { id: 'chart', label: '📊 Biểu đồ' },
                      { id: 'photo', label: '📷 Ảnh thực tế' }
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setLibraryFilter(f.id)}
                        className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                          libraryFilter === f.id
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Grid of suggested library items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[50vh] overflow-y-auto pr-1">
                    {SUGGESTED_ILLUSTRATIONS_LIBRARY
                      .filter(item => libraryFilter === 'all' || item.type === libraryFilter)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-indigo-500 hover:shadow-md transition-all flex flex-col group"
                        >
                          <div className="aspect-video w-full bg-slate-100 overflow-hidden relative">
                            <img
                              src={item.url}
                              alt={item.caption}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[9px] font-bold bg-slate-900/80 text-white uppercase">
                              {item.type}
                            </span>
                          </div>
                          <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                            <div>
                              <p className="text-xs font-bold text-slate-900 line-clamp-2">{item.caption}</p>
                              {item.description && (
                                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{item.description}</p>
                              )}
                            </div>
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-[10px] text-slate-400 truncate max-w-[140px]">{item.source}</span>
                              <button
                                type="button"
                                onClick={() => handleAddIllustration(activeAddIllActId, {
                                  ...item,
                                  id: `ill-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
                                })}
                                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                              >
                                + Chọn ảnh này
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Đường dẫn ảnh (URL) *
                    </label>
                    <input
                      type="text"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="https://example.com/hinh-anh-thi-nghiem.jpg"
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tiêu đề / Chú thích ảnh *
                    </label>
                    <input
                      type="text"
                      value={customCaption}
                      onChange={(e) => setCustomCaption(e.target.value)}
                      placeholder="Hình: Sơ đồ thí nghiệm đo lực kế hoặc mô hình phân tử..."
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phân loại
                      </label>
                      <select
                        value={customType}
                        onChange={(e) => setCustomType(e.target.value as LessonIllustration['type'])}
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 bg-white"
                      >
                        <option value="experiment">🧪 Thí nghiệm</option>
                        <option value="diagram">📐 Sơ đồ</option>
                        <option value="molecule">🔬 Cấu trúc phân tử</option>
                        <option value="chart">📊 Biểu đồ</option>
                        <option value="photo">📷 Ảnh chụp thực tế</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nguồn tài liệu
                      </label>
                      <input
                        type="text"
                        value={customSource}
                        onChange={(e) => setCustomSource(e.target.value)}
                        placeholder="SGK Kết Nối Tri Thức GDPT 2018"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mô tả ngắn sư phạm
                    </label>
                    <textarea
                      value={customDesc}
                      onChange={(e) => setCustomDesc(e.target.value)}
                      rows={2}
                      placeholder="Mô tả hiện tượng thí nghiệm, các bước quan sát hoặc ý nghĩa của hình vẽ..."
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {customUrl && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <span className="text-xs font-semibold text-slate-600 block">Xem trước ảnh:</span>
                      <div className="aspect-video max-h-48 rounded-lg overflow-hidden bg-slate-200">
                        <img
                          src={customUrl}
                          alt="Preview"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveAddIllActId(null)}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="button"
                      onClick={handleAddCustomIllustration}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs"
                    >
                      Xác nhận thêm ảnh
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: XEM PHÓNG TO HÌNH ẢNH */}
      {previewIll && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewIll(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image className="w-5 h-5 text-indigo-400" />
                <h4 className="font-bold text-sm text-slate-100 truncate max-w-lg">
                  {previewIll.caption}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setPreviewIll(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 flex items-center justify-center flex-1 max-h-[65vh] overflow-hidden">
              <img
                src={previewIll.url}
                alt={previewIll.caption}
                className="max-h-[60vh] max-w-full object-contain rounded-lg"
              />
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-900">{previewIll.caption}</p>
              {previewIll.description && (
                <p className="text-slate-600 leading-relaxed">{previewIll.description}</p>
              )}
              <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500">
                <span>Nguồn: <strong>{previewIll.source || 'SGK Kết Nối Tri Thức GDPT 2018'}</strong></span>
                <span className="font-mono bg-slate-200 px-2 py-0.5 rounded text-slate-700 uppercase">
                  {previewIll.type}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonPlanView;
