import React, { useState } from 'react';
import { 
  BookOpen, 
  Presentation, 
  CheckSquare, 
  Table, 
  Printer, 
  Download, 
  FileCheck2, 
  Settings, 
  Cloud, 
  FolderOpen, 
  FlaskConical, 
  Atom,
  Dna,
  Wrench,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { WorkspaceState } from '../types';
import { exportToWord, exportStandaloneHtmlFile } from '../utils/exportUtils';

interface SidebarProps {
  state: WorkspaceState;
  onTabChange: (tab: WorkspaceState['activeTab']) => void;
  onLoadPreset: (subject: 'khtn8_acid' | 'khtn9_kimloai' | 'khtn7_bth' | 'khtn6_tachchat' | 'khtn8_vatli' | 'khtn8_sinh' | 'khtn9_vatli' | 'khtn9_sinh' | 'khtn7_sinh' | 'congnghe7' | 'toan' | 'vatly') => void;
  onOpenHandoverModal: () => void;
  onOpenSettings: () => void;
  onOpenChemistry?: () => void;
  onPrint: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  state,
  onTabChange,
  onLoadPreset,
  onOpenHandoverModal,
  onOpenSettings,
  onOpenChemistry,
  onPrint,
}) => {
  const currentTab = state.activeTab;
  const teacher = state.teacherProfile;
  const [presetCategory, setPresetCategory] = useState<'all' | 'k8' | 'k9' | 'hoa' | 'ly' | 'sinh'>('all');

  const handleExportWordCurrent = () => {
    if (currentTab === 'khbd') {
      const el = document.getElementById('lesson-plan-print-root');
      if (el) {
        exportToWord(
          `KHBD_5512_${state.lessonPlan.subject}_${state.lessonPlan.grade}`,
          el.innerHTML,
          `KẾ HOẠCH BÀI DẠY - ${state.lessonPlan.lessonName}`
        );
      }
    } else if (currentTab === 'exam') {
      const el = document.getElementById('exam-live-document-root') || document.getElementById('live-document-print-area');
      if (el) {
        exportToWord(
          `DE_KIEM_TRA_7991_${state.lessonPlan.subject}_${state.lessonPlan.grade}`,
          el.innerHTML,
          `ĐỀ KIỂM TRA ĐỊNH KÌ`
        );
      }
    } else {
      exportStandaloneHtmlFile(state);
    }
  };

  const navItems = [
    {
      id: 'library' as const,
      label: 'Kho Sách & Học Liệu',
      sub: `${state.uploadedDocuments.length} tài liệu SGK, SGV, SBT`,
      icon: FolderOpen,
      accent: 'text-sky-600',
    },
    {
      id: 'khbd' as const,
      label: 'Soạn KHBD 5512',
      sub: 'Giáo án 4 hoạt động chuẩn GDPT 2018',
      icon: BookOpen,
      accent: 'text-emerald-600',
    },
    {
      id: 'slides' as const,
      label: 'Slide Trình Chiếu',
      sub: 'Bài giảng chuẩn 16:9 trực quan',
      icon: Presentation,
      accent: 'text-amber-600',
    },
    {
      id: 'matrix_spec' as const,
      label: 'Ma Trận & Bản Đặc Tả',
      sub: 'Phụ lục 1 & 2 theo CV 7991',
      icon: Table,
      accent: 'text-indigo-600',
    },
    {
      id: 'exam' as const,
      label: 'Đề Kiểm Tra 7991',
      sub: '3 dạng trắc nghiệm + tự luận chuẩn',
      icon: CheckSquare,
      accent: 'text-rose-600',
    },
    {
      id: 'cloud' as const,
      label: 'Lưu Trữ & Xuất File',
      sub: 'Đồng bộ đám mây và xuất đa định dạng',
      icon: Cloud,
      accent: 'text-teal-600',
    },
  ];

  const presets = [
    // --- KHTN 8 (LÍ - HÓA - SINH) ---
    {
      key: 'khtn8_acid' as const,
      category: 'hoa',
      gradeGroup: 'k8',
      tag: 'Hóa 8',
      title: 'Bài 8: Acid (Axit)',
      desc: 'Tính chất hóa học, quỳ tím & ứng dụng',
      active: state.lessonPlan.grade === 'Lớp 8' && state.lessonPlan.lessonName.toLowerCase().includes('acid'),
    },
    {
      key: 'khtn8_vatli' as const,
      category: 'ly',
      gradeGroup: 'k8',
      tag: 'Lí 8',
      title: 'Bài 14: Khối lượng riêng & Áp suất',
      desc: 'Công thức D = m/V, áp suất & Archimedes',
      active: state.lessonPlan.grade === 'Lớp 8' && state.lessonPlan.lessonName.includes('KHỐI LƯỢNG RIÊNG'),
    },
    {
      key: 'khtn8_sinh' as const,
      category: 'sinh',
      gradeGroup: 'k8',
      tag: 'Sinh 8',
      title: 'Bài 30: Máu & Hệ tuần hoàn',
      desc: 'Huyết tương, hồng cầu, tim & nhóm máu',
      active: state.lessonPlan.grade === 'Lớp 8' && state.lessonPlan.lessonName.includes('MÁU VÀ HỆ TUẦN HOÀN'),
    },
    // --- KHTN 9 (LÍ - HÓA - SINH) ---
    {
      key: 'khtn9_kimloai' as const,
      category: 'hoa',
      gradeGroup: 'k9',
      tag: 'Hóa 9',
      title: 'Bài 15: Dãy HĐHH kim loại',
      desc: 'Ý nghĩa & phản ứng hóa học kim loại',
      active: state.lessonPlan.grade === 'Lớp 9' && state.lessonPlan.lessonName.includes('DÃY HOẠT ĐỘNG'),
    },
    {
      key: 'khtn9_vatli' as const,
      category: 'ly',
      gradeGroup: 'k9',
      tag: 'Lí 9',
      title: 'Bài 1: Công & Cơ năng',
      desc: 'Công cơ học A = F.s, công suất & động năng',
      active: state.lessonPlan.grade === 'Lớp 9' && state.lessonPlan.lessonName.includes('CÔNG CƠ HỌC'),
    },
    {
      key: 'khtn9_sinh' as const,
      category: 'sinh',
      gradeGroup: 'k9',
      tag: 'Sinh 9',
      title: 'Bài 30: Di truyền Mendel & DNA',
      desc: 'Quy luật phân li & chuỗi xoắn kép DNA',
      active: state.lessonPlan.grade === 'Lớp 9' && state.lessonPlan.lessonName.includes('MENDEL'),
    },
    // --- KHỐI LỚP KHÁC ---
    {
      key: 'khtn7_sinh' as const,
      category: 'sinh',
      gradeGroup: 'other',
      tag: 'Sinh 7',
      title: 'Bài 22: Quang hợp ở thực vật',
      desc: 'Phương trình quang hợp & lục lạp',
      active: state.lessonPlan.grade === 'Lớp 7' && state.lessonPlan.lessonName.includes('QUANG HỢP'),
    },
    {
      key: 'khtn7_bth' as const,
      category: 'hoa',
      gradeGroup: 'other',
      tag: 'Hóa 7',
      title: 'Bài 4: Bảng tuần hoàn',
      desc: 'Ô, nhóm, chu kì theo IUPAC',
      active: state.lessonPlan.grade === 'Lớp 7' && state.lessonPlan.lessonName.includes('tuần hoàn'),
    },
    {
      key: 'congnghe7' as const,
      category: 'congnghe',
      gradeGroup: 'other',
      tag: 'C.Nghệ 7',
      title: 'Bài 1: Giới thiệu trồng trọt',
      desc: 'Vai trò, phương thức & nghề nghiệp',
      active: state.lessonPlan.subject === 'Công nghệ',
    },
  ];

  const filteredPresets = presets.filter(p => {
    if (presetCategory === 'all') return true;
    if (presetCategory === 'k8') return p.gradeGroup === 'k8';
    if (presetCategory === 'k9') return p.gradeGroup === 'k9';
    return p.category === presetCategory;
  });

  return (
    <aside className="w-[340px] shrink-0 border-r border-slate-200/80 bg-slate-50/50 flex flex-col h-full overflow-hidden select-none no-print">
      
      {/* 1. Header: Giáo viên & Công cụ bộ môn */}
      <div className="p-4 border-b border-slate-200/70 bg-white space-y-3">
        {/* User Card */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              <FlaskConical className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-slate-900 truncate">{teacher.name}</span>
                <span className="text-slate-400" aria-hidden="true">·</span>
                <span className="text-[11px] text-slate-500 truncate">{teacher.department}</span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">{teacher.school}</p>
            </div>
          </div>

          <button
            onClick={onOpenSettings}
            title="Cài đặt thông tin giáo viên"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Nút Tra cứu Hóa học THCS (Bộ môn đặc thù) */}
        {onOpenChemistry && (
          <button
            type="button"
            onClick={onOpenChemistry}
            className="w-full px-3 py-2 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-950 border border-emerald-200/80 rounded-xl flex items-center justify-between text-xs font-medium transition-colors"
          >
            <div className="flex items-center gap-2">
              <Atom className="w-4 h-4 text-emerald-700" />
              <span>Tra Cứu Hóa Học THCS</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-mono">BTH · pH · Tính tan</span>
          </button>
        )}
      </div>

      {/* 2. Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        
        {/* Menu Phân Hệ Sư Phạm */}
        <div>
          <div className="px-2 pb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Phân hệ sư phạm
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs font-semibold'
                      : 'hover:bg-slate-200/60 text-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.accent}`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs leading-tight">{item.label}</div>
                    <div className={`text-[11px] truncate mt-0.5 ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                      {item.sub}
                    </div>
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Nạp nhanh bài mẫu theo phân môn */}
        <div className="pt-2 border-t border-slate-200/70">
          <div className="flex items-center justify-between px-2 pb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Bài mẫu nạp nhanh
            </span>
            <span className="text-[11px] text-slate-400">KNTT 6-9</span>
          </div>

          {/* Segmented Filter Control */}
          <div className="grid grid-cols-6 gap-1 p-1 bg-slate-200/70 rounded-lg text-[10px] font-bold text-slate-600 mb-2">
            <button
              onClick={() => setPresetCategory('all')}
              className={`py-1 rounded-md text-center transition-colors ${presetCategory === 'all' ? 'bg-white text-slate-900 shadow-2xs font-black' : 'hover:text-slate-900'}`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setPresetCategory('k8')}
              className={`py-1 rounded-md text-center transition-colors ${presetCategory === 'k8' ? 'bg-amber-400 text-slate-950 shadow-2xs font-black' : 'hover:text-slate-900'}`}
            >
              K8
            </button>
            <button
              onClick={() => setPresetCategory('k9')}
              className={`py-1 rounded-md text-center transition-colors ${presetCategory === 'k9' ? 'bg-indigo-600 text-white shadow-2xs font-black' : 'hover:text-slate-900'}`}
            >
              K9
            </button>
            <button
              onClick={() => setPresetCategory('hoa')}
              className={`py-1 rounded-md text-center transition-colors ${presetCategory === 'hoa' ? 'bg-emerald-500 text-slate-950 shadow-2xs font-black' : 'hover:text-slate-900'}`}
            >
              Hóa
            </button>
            <button
              onClick={() => setPresetCategory('ly')}
              className={`py-1 rounded-md text-center transition-colors ${presetCategory === 'ly' ? 'bg-sky-500 text-slate-950 shadow-2xs font-black' : 'hover:text-slate-900'}`}
            >
              Lí
            </button>
            <button
              onClick={() => setPresetCategory('sinh')}
              className={`py-1 rounded-md text-center transition-colors ${presetCategory === 'sinh' ? 'bg-purple-500 text-white shadow-2xs font-black' : 'hover:text-slate-900'}`}
            >
              Sinh
            </button>
          </div>

          {/* Preset List */}
          <div className="space-y-1">
            {filteredPresets.map((p) => (
              <button
                key={p.key}
                onClick={() => onLoadPreset(p.key)}
                className={`w-full p-2 rounded-lg text-left text-xs transition-colors border ${
                  p.active
                    ? 'bg-white border-slate-300 text-slate-900 shadow-2xs'
                    : 'bg-white/60 hover:bg-white border-transparent hover:border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold truncate">{p.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-1.5">{p.tag}</span>
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Footer: Xuất nhanh & Kiểm chứng */}
      <div className="p-3 border-t border-slate-200/70 bg-white space-y-2">
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={handleExportWordCurrent}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất Word</span>
          </button>
          <button
            onClick={onPrint}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In / PDF</span>
          </button>
        </div>

        <button
          onClick={onOpenHandoverModal}
          className="w-full px-2.5 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-medium flex items-center justify-between transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <FileCheck2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Kiểm Chứng Bàn Giao</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">JSON</span>
        </button>
      </div>

    </aside>
  );
};
