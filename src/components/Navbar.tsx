import React from 'react';
import { 
  Download, 
  FileText, 
  Settings, 
  BookOpen, 
  User, 
  Cloud,
  FlaskConical,
  Atom
} from 'lucide-react';
import { WorkspaceState, Subject, GradeLevel, CurriculumSeries } from '../types';
import { exportStandaloneHtmlFile } from '../utils/exportUtils';

interface NavbarProps {
  state: WorkspaceState;
  onUpdateMetadata: (metadata: {
    subject?: Subject;
    grade?: GradeLevel;
    curriculum?: CurriculumSeries;
    lessonName?: string;
  }) => void;
  onOpenHandoverModal: () => void;
  onOpenSettings: () => void;
  onOpenLibrary: () => void;
  onOpenCloud: () => void;
  onOpenChemistry?: () => void;
}

const SUBJECT_OPTIONS: Subject[] = [
  // Môn học cấp THCS theo GDPT 2018
  'Khoa học tự nhiên',
  'Lịch sử & Địa lí',
  'Công nghệ',
  'Giáo dục công dân',
  'Tin học',
  'Toán học',
  'Ngữ văn',
  'Tiếng Anh',
  'Giáo dục thể chất',
  'Nghệ thuật (Âm nhạc, Mĩ thuật)',
  'Hoạt động trải nghiệm, hướng nghiệp',
  'Giáo dục địa phương',
  // Phân môn cấp THPT
  'Vật lí',
  'Hoá học',
  'Sinh học',
  'Lịch sử',
  'Địa lí',
  'Giáo dục kinh tế và pháp luật',
];

const GRADE_OPTIONS: GradeLevel[] = [
  'Lớp 10',
  'Lớp 11',
  'Lớp 12',
  'Lớp 9',
  'Lớp 8',
  'Lớp 7',
  'Lớp 6',
];

export const Navbar: React.FC<NavbarProps> = ({
  state,
  onUpdateMetadata,
  onOpenHandoverModal,
  onOpenSettings,
  onOpenLibrary,
  onOpenCloud,
  onOpenChemistry,
}) => {
  const teacher = state.teacherProfile;

  return (
    <header className="h-16 px-4 md:px-6 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 select-none z-20 gap-3">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a href="/" className="text-base md:text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-900 via-blue-800 to-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs border border-indigo-500/40">
            <Atom className="w-4 h-4 text-amber-300" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-black text-xs sm:text-sm text-slate-950 flex items-center gap-1.5">
              <span>KHTN EduStandard</span>
              <span className="text-[10px] font-black bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 px-2 py-0.5 rounded-md border border-amber-400/80 shadow-2xs">
                KHTN 8 & 9 (Lí · Hóa · Sinh)
              </span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
              Ma trận đặc tả & Đề 7991 (3 dạng trắc nghiệm + tự luận) · KHBD 5512
            </span>
          </div>
        </a>
      </div>

      {/* Zone 2: Bộ chọn nhanh Môn học, Khối lớp, Bộ sách, Tên bài học */}
      <div className="flex-1 max-w-2xl flex items-center gap-2 overflow-x-auto py-1">
        {/* Chọn Môn Học */}
        <div className="flex items-center shrink-0">
          <select
            value={state.lessonPlan.subject}
            onChange={(e) => onUpdateMetadata({ subject: e.target.value as Subject })}
            className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer hover:bg-slate-100"
          >
            {SUBJECT_OPTIONS.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Chọn Khối Lớp */}
        <div className="flex items-center shrink-0">
          <select
            value={state.lessonPlan.grade}
            onChange={(e) => onUpdateMetadata({ grade: e.target.value as GradeLevel })}
            className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer hover:bg-slate-100"
          >
            {GRADE_OPTIONS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Bộ sách giáo khoa thống nhất quốc gia: Kết Nối Tri Thức */}
        <div className="hidden xl:flex items-center shrink-0">
          <span 
            className="text-xs font-semibold text-blue-900 bg-blue-50/80 border border-blue-200 rounded-lg px-2.5 py-1.5 select-none"
            title="Bộ sách giáo khoa duy nhất thống nhất toàn quốc: Kết Nối Tri Thức Với Cuộc Sống"
          >
            Sách: Kết Nối Tri Thức
          </span>
        </div>

        {/* Nhập / Sửa Tên bài học */}
        <div className="flex-1 min-w-[150px] max-w-sm hidden md:flex items-center">
          <input
            type="text"
            value={state.lessonPlan.lessonName}
            onChange={(e) => onUpdateMetadata({ lessonName: e.target.value })}
            placeholder="Tên bài học (VD: Bài 15: Hàm số bậc hai)..."
            className="w-full text-xs font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 truncate"
          />
        </div>
      </div>

      {/* Zone 3: Navigation Quick Links, Settings Profile & Actions */}
      <div className="flex items-center gap-2 shrink-0">
        
        {/* Nút Tra Cứu Hóa Học THCS (Chuyên biệt) */}
        {onOpenChemistry && (
          <button
            onClick={onOpenChemistry}
            className="px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xs border border-emerald-400/50 ring-1 ring-emerald-300/30"
            title="Tra cứu Bảng tuần hoàn IUPAC, Dãy hoạt động kim loại, Thang pH, Bảng tính tan"
          >
            <FlaskConical className="w-3.5 h-3.5 text-amber-300 fill-amber-300/40" />
            <span className="hidden md:inline">Tra Cứu Hóa Học</span>
          </button>
        )}

        {/* Nút Kho Học Liệu (SGK/SGV/SBT) */}
        <button
          onClick={onOpenLibrary}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
            state.activeTab === 'library'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
          title="Kho sách giáo khoa, sách giáo viên, sách bài tập"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden lg:inline">Kho Sách</span>
          <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px] font-mono">
            {state.uploadedDocuments.length}
          </span>
        </button>

        {/* Nút Đám Mây Lưu Trữ */}
        <button
          onClick={onOpenCloud}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
            state.activeTab === 'cloud'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
          title="Lưu trữ đám mây & xuất nhiều định dạng"
        >
          <Cloud className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden xl:inline">Cloud Lưu Trữ</span>
        </button>

        {/* CÀI ĐẶT THÔNG TIN GIÁO VIÊN (Yêu cầu trọng tâm của người dùng) */}
        <button
          onClick={onOpenSettings}
          className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-2 border border-slate-200 transition-all"
          title="Cài đặt thông tin giáo viên (Họ tên, trường, chức vụ)"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
            {teacher.name.charAt(0) || 'L'}
          </div>
          <span className="font-bold max-w-[130px] truncate">
            {teacher.name || 'Cài Đặt GV'}
          </span>
          <Settings className="w-3.5 h-3.5 text-slate-500" />
        </button>

        {/* Nút Kiểm chứng & Tải HTML */}
        <button
          onClick={() => exportStandaloneHtmlFile(state)}
          title="Tải tệp Single-file HTML tự hành mở trực tiếp bằng trình duyệt"
          className="p-2 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors hidden sm:flex items-center"
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenHandoverModal}
          className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Kiểm chứng</span>
        </button>
      </div>
    </header>
  );
};
