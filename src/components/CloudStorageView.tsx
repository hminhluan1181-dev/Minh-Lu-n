import React, { useState } from 'react';
import { 
  Cloud, 
  Download, 
  FileText, 
  Presentation, 
  CheckSquare, 
  CheckCircle2, 
  Trash2, 
  FolderDown, 
  Layers, 
  Printer, 
  Clock, 
  Sparkles,
  HardDrive,
  FileCheck2,
  RefreshCw,
  Plus
} from 'lucide-react';
import { SavedCloudProject, WorkspaceState } from '../types';
import { 
  exportToWord, 
  exportWorkspaceToJson, 
  exportStandaloneHtmlFile,
  exportMatrixSpecWord 
} from '../utils/exportUtils';
import { exportToPowerPointPPTX } from '../utils/pptxExport';

interface CloudStorageViewProps {
  state: WorkspaceState;
  onSaveCurrentAsSnapshot: (title: string, type: SavedCloudProject['type']) => void;
  onDeleteSnapshot: (id: string) => void;
  onLoadSnapshot: (snapshotId: string) => void;
}

export const CloudStorageView: React.FC<CloudStorageViewProps> = ({
  state,
  onSaveCurrentAsSnapshot,
  onDeleteSnapshot,
  onLoadSnapshot,
}) => {
  const [newSnapshotTitle, setNewSnapshotTitle] = useState('');
  const [newSnapshotType, setNewSnapshotType] = useState<SavedCloudProject['type']>('full_bundle');
  const [filterType, setFilterType] = useState<'all' | 'khbd' | 'slides' | 'exam'>('all');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  const teacher = state.teacherProfile;
  const lp = state.lessonPlan;

  const handleSaveSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newSnapshotTitle.trim() || `${lp.lessonName} (${newSnapshotType.toUpperCase()})`;
    onSaveCurrentAsSnapshot(title, newSnapshotType);
    setNewSnapshotTitle('');
    setIsSaving(false);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 2500);
  };

  const filteredProjects = state.savedProjects.filter(p => {
    if (filterType === 'all') return true;
    return p.type === filterType;
  });

  // Export handlers
  const handleExportKHBDWord = () => {
    const el = document.getElementById('lesson-plan-print-root') || document.getElementById('khbd-print-area');
    const content = el ? el.innerHTML : `<h1>KẾ HOẠCH BÀI DẠY: ${lp.lessonName}</h1><p>Môn: ${lp.subject} - ${lp.grade}</p>`;
    exportToWord(`KHBD_5512_${lp.subject}_${lp.grade}`, content, `KẾ HOẠCH BÀI DẠY - ${lp.lessonName}`);
  };

  const handleExportExamWord = () => {
    const el = document.getElementById('live-document-print-area');
    const content = el ? el.innerHTML : `<h1>ĐỀ KIỂM TRA ĐỊNH KÌ</h1><p>Môn: ${lp.subject} - ${lp.grade}</p>`;
    exportToWord(`DE_KIEM_TRA_7991_${lp.subject}_${lp.grade}`, content, `ĐỀ KIỂM TRA ĐỊNH KÌ`);
  };

  const handleExportSlideDeck = async () => {
    try {
      await exportToPowerPointPPTX(state.slides, state.teacherProfile, state.lessonPlan.lessonName);
    } catch (err) {
      console.error('Error exporting PPTX from cloud view', err);
      exportStandaloneHtmlFile(state);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      
      {/* CLOUD STATUS BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 rounded-2xl shadow-md border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Cloud Storage Sync Đang Hoạt Động</span>
              </span>
              <span className="text-xs text-slate-300 font-mono">
                {teacher.name} · {teacher.school}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white mt-1.5 flex items-center gap-2.5">
              <Cloud className="w-6 h-6 text-blue-400" />
              <span>Kho Lưu Trữ Đám Mây & Xuất File Đa Định Dạng</span>
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Tất cả sách tải lên (SGK, SGV, SBT) và các kết quả soạn thảo (KHBD 5512, Slide 16:9, Đề thi 7991) được lưu trữ an toàn trên đám mây trình duyệt và sẵn sàng tải về dưới dạng Word, PDF, Slide Presentation và JSON.
            </p>
          </div>

          <button
            onClick={() => setIsSaving(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all transform hover:-translate-y-0.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Lưu Bản Sao Hiện Tại Lên Cloud</span>
          </button>
        </div>

        {/* Storage Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-center">
            <span className="text-xs text-blue-200 block">Sách Nguồn (SGK/SGV/SBT)</span>
            <span className="text-lg font-black text-white font-mono">{state.uploadedDocuments.length} tệp</span>
          </div>

          <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-center">
            <span className="text-xs text-blue-200 block">KHBD 5512 Đã Lưu</span>
            <span className="text-lg font-black text-white font-mono">
              {state.savedProjects.filter(p => p.type === 'khbd' || p.type === 'full_bundle').length} bài
            </span>
          </div>

          <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-center">
            <span className="text-xs text-blue-200 block">Slide Deck 16:9</span>
            <span className="text-lg font-black text-white font-mono">{state.slides.slides.length} slides</span>
          </div>

          <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-center">
            <span className="text-xs text-blue-200 block">Đề Thi Chuẩn 7991</span>
            <span className="text-lg font-black text-white font-mono">
              {state.savedProjects.filter(p => p.type === 'exam' || p.type === 'full_bundle').length} đề
            </span>
          </div>
        </div>
      </div>

      {saveSuccessNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Đã lưu thành công bản sao bài học hiện tại lên Cloud Storage!</span>
        </div>
      )}

      {/* QUICK MULTI-FORMAT EXPORT LAUNCHPAD */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <FolderDown className="w-4 h-4 text-blue-600" />
              <span>Xuất Dữ Liệu Bài Học Đang Soạn Ra Các Định Dạng:</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Đang chọn: <strong>{lp.lessonName}</strong> ({lp.subject} · {lp.grade})
            </p>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
            Tác giả: {teacher.name}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* 1. Tải Word (.doc) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3 hover:border-blue-300 transition-colors">
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs mb-2">
                DOC
              </div>
              <h4 className="font-bold text-xs text-slate-900">Microsoft Word (.doc)</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Chuẩn thể thức công văn hành chính, bảng 4 hoạt động và font Times New Roman.
              </p>
            </div>
            <button
              onClick={handleExportKHBDWord}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải Word KHBD</span>
            </button>
          </div>

          {/* 2. In ấn / PDF (.pdf) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3 hover:border-blue-300 transition-colors">
            <div>
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs mb-2">
                PDF
              </div>
              <h4 className="font-bold text-xs text-slate-900">Tài Liệu PDF / In Ấn</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Định dạng trang A4 tiêu chuẩn có sẵn ngắt trang để lưu PDF hoặc in trực tiếp.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Ấn / Lưu PDF</span>
            </button>
          </div>

          {/* 3. Slide PPTX / HTML Presentation */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3 hover:border-blue-300 transition-colors">
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs mb-2">
                PPT
              </div>
              <h4 className="font-bold text-xs text-slate-900">Microsoft PowerPoint (.pptx)</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Tệp trình chiếu chuẩn 16:9 tĩnh 100%, bảo toàn trọn vẹn văn bản và công thức.
              </p>
            </div>
            <button
              onClick={handleExportSlideDeck}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải File PPTX (16:9)</span>
            </button>
          </div>

          {/* 4. JSON State Backup */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3 hover:border-blue-300 transition-colors">
            <div>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs mb-2">
                JSON
              </div>
              <h4 className="font-bold text-xs text-slate-900">Bản Sao Toàn Diện</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Lưu toàn bộ phiên làm việc (KHBD, slide, đề thi, ma trận) để nạp lại bất cứ khi nào.
              </p>
            </div>
            <button
              onClick={() => exportWorkspaceToJson(state)}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải Tệp Sao Lưu</span>
            </button>
          </div>

        </div>
      </div>

      {/* SAVED SNAPSHOTS LIST */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-blue-600" />
              <span>Lịch Sử Các Bản Đã Lưu Trên Đám Mây ({state.savedProjects.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Bấm "Nạp Lại" để khôi phục một bài học đã lưu vào bàn làm việc chính
            </p>
          </div>

          {/* Filter Types */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterType === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterType('khbd')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterType === 'khbd' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              KHBD
            </button>
            <button
              onClick={() => setFilterType('slides')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterType === 'slides' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Slides
            </button>
            <button
              onClick={() => setFilterType('exam')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterType === 'exam' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Đề thi
            </button>
          </div>
        </div>

        {/* Projects Table */}
        <div className="space-y-2.5">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg text-white font-bold shrink-0 ${
                  proj.type === 'khbd' ? 'bg-blue-600' : proj.type === 'slides' ? 'bg-emerald-600' : 'bg-indigo-600'
                }`}>
                  {proj.type === 'khbd' ? <FileText className="w-4 h-4" /> : proj.type === 'slides' ? <Presentation className="w-4 h-4" /> : <CheckSquare className="w-4 h-4" />}
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 leading-snug">
                    {proj.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                    <span>{proj.subject}</span>
                    <span>·</span>
                    <span>{proj.grade}</span>
                    <span>·</span>
                    <span className="font-mono">{proj.fileSize}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <Cloud className="w-3 h-3" />
                      <span>{proj.savedAt}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => onLoadSnapshot(proj.id)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-lg font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <RefreshCw className="w-3 h-3 text-blue-600" />
                  <span>Nạp Lại</span>
                </button>

                {proj.type === 'slides' ? (
                  <button
                    onClick={handleExportSlideDeck}
                    className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-semibold transition-colors flex items-center gap-1"
                    title="Tải tệp PowerPoint (.pptx)"
                  >
                    <Download className="w-3 h-3" />
                    <span>PPTX</span>
                  </button>
                ) : (
                  <button
                    onClick={proj.type === 'exam' ? handleExportExamWord : handleExportKHBDWord}
                    className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-semibold transition-colors flex items-center gap-1"
                    title="Tải file Word (.doc)"
                  >
                    <Download className="w-3 h-3" />
                    <span>Word</span>
                  </button>
                )}

                <button
                  onClick={() => onDeleteSnapshot(proj.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Xóa bản lưu này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="p-8 text-center bg-slate-50 rounded-xl text-slate-500 text-xs">
              Chưa có bản lưu nào trong danh mục này.
            </div>
          )}
        </div>
      </div>

      {/* MODAL LƯU BẢN SAO MỚI */}
      {isSaving && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in duration-150 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Cloud className="w-4 h-4 text-blue-600" />
                <span>Lưu Bản Sao Bài Học Lên Cloud Storage</span>
              </h3>
              <button onClick={() => setIsSaving(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveSnapshot} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">Đặt tên bản sao lưu:</label>
                <input
                  type="text"
                  value={newSnapshotTitle}
                  onChange={(e) => setNewSnapshotTitle(e.target.value)}
                  placeholder={`VD: ${lp.lessonName} - Phiên bản chuẩn`}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">Loại tài liệu lưu:</label>
                <select
                  value={newSnapshotType}
                  onChange={(e) => setNewSnapshotType(e.target.value as SavedCloudProject['type'])}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                >
                  <option value="full_bundle">Trọn Bộ (KHBD 5512 + Slide 16:9 + Đề thi 7991)</option>
                  <option value="khbd">Chỉ Kế Hoạch Bài Dạy (KHBD 5512)</option>
                  <option value="slides">Chỉ Slide Bài Giảng 16:9</option>
                  <option value="exam">Chỉ Đề Kiểm Tra Định Kì 7991</option>
                </select>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl text-blue-900 text-[11px] leading-relaxed">
                Tác giả lưu trữ: <strong>{teacher.name}</strong> ({teacher.school}). Dữ liệu sẽ sẵn sàng để tải về ở các định dạng Word, PDF, Slide và JSON.
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSaving(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs"
                >
                  Xác Nhận Lưu Lên Cloud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
