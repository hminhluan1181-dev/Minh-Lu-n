import React, { useState, useMemo, useEffect } from 'react';
import { 
  Table, 
  Download, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  Layers, 
  Zap, 
  Sparkles, 
  Filter, 
  CheckSquare, 
  Square, 
  Search, 
  BookOpen, 
  Sliders, 
  RotateCcw,
  FlaskConical,
  Atom,
  Dna,
  Wrench,
  Check,
  ChevronDown,
  ChevronUp,
  Plus
} from 'lucide-react';
import { 
  MatrixRowItem, 
  SpecSheetRow, 
  UploadedDocument, 
  Subject, 
  GradeLevel,
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  ShortAnswerQuestion,
  EssayQuestion
} from '../types';
import { exportToWord } from '../utils/exportUtils';
import { enrichSpecFromRag } from '../utils/ragEngine';
import { 
  getAvailableLessonsForExam, 
  LessonSelectionItem, 
  generateMatrixAndSpecForSelectedLessons 
} from '../data/allCurriculumData';
import { CustomQuestionBuilderModal } from './CustomQuestionBuilderModal';

interface MatrixSpecViewProps {
  matrixRows: MatrixRowItem[];
  specRows: SpecSheetRow[];
  documents?: UploadedDocument[];
  subject: string;
  grade: string;
  onUpdateSpecRows?: (updated: SpecSheetRow[]) => void;
  onUpdateMatrixRows?: (updated: MatrixRowItem[]) => void;
  onApplyNewMatrixAndSpec?: (
    newMatrix: MatrixRowItem[], 
    newSpec: SpecSheetRow[], 
    newSubject?: Subject, 
    newGrade?: GradeLevel
  ) => void;
}

export const MatrixSpecView: React.FC<MatrixSpecViewProps> = ({
  matrixRows,
  specRows,
  documents = [],
  subject,
  grade,
  onUpdateSpecRows,
  onUpdateMatrixRows,
  onApplyNewMatrixAndSpec
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'spec'>('matrix');
  const [currentMatrixRows, setCurrentMatrixRows] = useState<MatrixRowItem[]>(matrixRows);
  const [currentSpecRows, setCurrentSpecRows] = useState<SpecSheetRow[]>(specRows);
  const [ragSyncToast, setRagSyncToast] = useState<string | null>(null);

  // Modal ra đề tùy chọn
  const [isCustomQuestionModalOpen, setIsCustomQuestionModalOpen] = useState(false);

  // --- STATE CHO BỘ TÙY CHỌN BÀI HỌC THEO KHỐI LỚP (BUILDER 7991) ---
  const [isBuilderOpen, setIsBuilderOpen] = useState(true);
  const [builderGrade, setBuilderGrade] = useState<GradeLevel>(
    (['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'].includes(grade) ? grade : 'Lớp 8') as GradeLevel
  );
  const [builderDiscipline, setBuilderDiscipline] = useState<'Tất cả' | 'Hóa học' | 'Vật lí' | 'Sinh học' | 'Công nghệ'>('Tất cả');
  const [searchLessonKeyword, setSearchLessonKeyword] = useState('');
  const [scopePreset, setScopePreset] = useState<'custom' | 'mid1' | 'end1' | 'mid2' | 'end2'>('mid1');
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);

  // Đồng bộ props từ cha nếu có cập nhật bên ngoài
  useEffect(() => {
    setCurrentMatrixRows(matrixRows);
  }, [matrixRows]);

  useEffect(() => {
    setCurrentSpecRows(specRows);
  }, [specRows]);

  // Lấy danh sách các bài học khả dụng theo khối lớp và phân môn đã lọc
  const availableLessons = useMemo(() => {
    return getAvailableLessonsForExam(builderGrade, builderDiscipline);
  }, [builderGrade, builderDiscipline]);

  // Lọc bài học theo từ khóa tìm kiếm
  const filteredAvailableLessons = useMemo(() => {
    if (!searchLessonKeyword.trim()) return availableLessons;
    const kw = searchLessonKeyword.toLowerCase().trim();
    return availableLessons.filter(l => 
      l.lessonName.toLowerCase().includes(kw) || 
      l.chapterTitle.toLowerCase().includes(kw) ||
      l.discipline.toLowerCase().includes(kw) ||
      l.lessonNumber.includes(kw)
    );
  }, [availableLessons, searchLessonKeyword]);

  // Tự động chọn các bài học khi chuyển khối lớp hoặc chọn preset phạm vi kì thi
  useEffect(() => {
    if (availableLessons.length === 0) {
      setSelectedLessonIds([]);
      return;
    }

    if (scopePreset === 'mid1') {
      // Giữa kì 1: Chọn các bài thuộc nửa đầu HK1 (thường là 3 - 4 bài đầu)
      const halfCount = Math.max(2, Math.min(4, Math.ceil(availableLessons.length * 0.35)));
      setSelectedLessonIds(availableLessons.slice(0, halfCount).map(l => l.id));
    } else if (scopePreset === 'end1') {
      // Cuối kì 1: Chọn các bài HK1 (khoảng 50% số bài đầu)
      const halfCount = Math.max(3, Math.min(6, Math.ceil(availableLessons.length * 0.5)));
      setSelectedLessonIds(availableLessons.slice(0, halfCount).map(l => l.id));
    } else if (scopePreset === 'mid2') {
      // Giữa kì 2: Chọn các bài ở giữa
      const startIdx = Math.floor(availableLessons.length * 0.5);
      const count = Math.max(2, Math.min(4, Math.ceil(availableLessons.length * 0.25)));
      setSelectedLessonIds(availableLessons.slice(startIdx, startIdx + count).map(l => l.id));
    } else if (scopePreset === 'end2') {
      // Cuối kì 2: Chọn các bài ở nửa sau học kì
      const startIdx = Math.floor(availableLessons.length * 0.5);
      setSelectedLessonIds(availableLessons.slice(startIdx).map(l => l.id));
    }
  }, [builderGrade, builderDiscipline, scopePreset, availableLessons]);

  // Xử lý bật/tắt chọn bài học
  const handleToggleLesson = (id: string) => {
    setScopePreset('custom');
    setSelectedLessonIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllLessons = () => {
    setScopePreset('custom');
    setSelectedLessonIds(filteredAvailableLessons.map(l => l.id));
  };

  const handleDeselectAllLessons = () => {
    setScopePreset('custom');
    setSelectedLessonIds([]);
  };

  // HÀM SINH ĐỀ XUẤT MA TRẬN & BẢN ĐẶC TẢ THEO CV 7991
  const handleGenerateMatrixAndSpec = () => {
    const chosenObjects = availableLessons.filter(l => selectedLessonIds.includes(l.id));
    if (chosenObjects.length === 0) {
      alert('Vui lòng chọn ít nhất 1 bài học để hệ thống đề xuất Ma trận & Bản đặc tả.');
      return;
    }

    const { matrixRows: newMatrix, specRows: newSpec } = generateMatrixAndSpecForSelectedLessons(
      chosenObjects,
      `ĐỀ KIỂM TRA ĐỊNH KÌ THEO CÔNG VĂN 7991 - ${builderGrade.toUpperCase()}`
    );

    setCurrentMatrixRows(newMatrix);
    setCurrentSpecRows(newSpec);

    if (onUpdateMatrixRows) onUpdateMatrixRows(newMatrix);
    if (onUpdateSpecRows) onUpdateSpecRows(newSpec);

    setRagSyncToast(`Đã đề xuất Ma trận & Bản đặc tả thành công từ ${chosenObjects.length} bài học (${builderGrade}) theo chuẩn CV 7991!`);
    setTimeout(() => setRagSyncToast(null), 4500);
  };

  // Áp dụng trực tiếp vào Workspace State của toàn bộ ứng dụng
  const handleApplyToWorkspace = () => {
    const chosenObjects = availableLessons.filter(l => selectedLessonIds.includes(l.id));
    let targetSubject: Subject = subject as Subject;
    if (builderDiscipline === 'Công nghệ') {
      targetSubject = 'Công nghệ';
    } else {
      targetSubject = 'Khoa học tự nhiên';
    }

    if (onApplyNewMatrixAndSpec) {
      onApplyNewMatrixAndSpec(currentMatrixRows, currentSpecRows, targetSubject, builderGrade);
    } else {
      if (onUpdateMatrixRows) onUpdateMatrixRows(currentMatrixRows);
      if (onUpdateSpecRows) onUpdateSpecRows(currentSpecRows);
    }

    setRagSyncToast(`Đã lưu và áp dụng Ma trận & Bản đặc tả cho ${targetSubject} - ${builderGrade} vào hệ thống!`);
    setTimeout(() => setRagSyncToast(null), 4500);
  };

  // Xử lý đồng bộ Yêu cầu cần đạt chuẩn từ RAG SGK vào Bản Đặc Tả
  const handleSyncSpecWithRag = () => {
    const { enrichedSpec, syncedCount } = enrichSpecFromRag(
      currentSpecRows,
      documents,
      subject as Subject,
      grade as GradeLevel
    );
    setCurrentSpecRows(enrichedSpec);
    if (onUpdateSpecRows) {
      onUpdateSpecRows(enrichedSpec);
    }
    setRagSyncToast(`Đã đồng bộ Yêu cầu cần đạt chuẩn GDPT 2018 từ ${syncedCount} bài học SGK vào Bản Đặc Tả!`);
    setActiveSubTab('spec');
    setTimeout(() => setRagSyncToast(null), 4000);
  };

  const handleExportWord = () => {
    const el = document.getElementById('matrix-spec-print-root');
    if (el) {
      exportToWord(
        `MA_TRAN_BAN_DAC_TA_7991_${subject}_${builderGrade}`,
        el.innerHTML,
        `MA TRẬN & BẢN ĐẶC TẢ ĐỀ KIỂM TRA ĐỊNH KÌ - CV 7991`
      );
    }
  };

  // TÍNH TOÁN DÒNG TỔNG MA TRẬN ĐỘNG (DYNAMIC TOTALS THEO CHUẨN 7991)
  const totals = useMemo(() => {
    let tnkqBiet = 0, tnkqHieu = 0, tnkqVD = 0;
    let dungSaiBiet = 0, dungSaiHieu = 0, dungSaiVD = 0;
    let tlNganBiet = 0, tlNganHieu = 0, tlNganVD = 0;
    let tuLuanBiet = 0, tuLuanHieu = 0, tuLuanVD = 0;

    currentMatrixRows.forEach(r => {
      tnkqBiet += r.tnkq_nhieuLuaChon.biet;
      tnkqHieu += r.tnkq_nhieuLuaChon.hieu;
      tnkqVD += r.tnkq_nhieuLuaChon.vanDung;

      dungSaiBiet += r.tnkq_dungSai.biet;
      dungSaiHieu += r.tnkq_dungSai.hieu;
      dungSaiVD += r.tnkq_dungSai.vanDung;

      tlNganBiet += r.tnkq_traLoiNgan.biet;
      tlNganHieu += r.tnkq_traLoiNgan.hieu;
      tlNganVD += r.tnkq_traLoiNgan.vanDung;

      tuLuanBiet += r.tuLuan.biet;
      tuLuanHieu += r.tuLuan.hieu;
      tuLuanVD += r.tuLuan.vanDung;
    });

    const sumTnkq = tnkqBiet + tnkqHieu + tnkqVD;
    const sumDungSai = dungSaiBiet + dungSaiHieu + dungSaiVD;
    const sumTlNgan = tlNganBiet + tlNganHieu + tlNganVD;
    const sumTuLuan = tuLuanBiet + tuLuanHieu + tuLuanVD;

    const totalQuestions = sumTnkq + sumDungSai + sumTlNgan + sumTuLuan;

    const totalBiet = tnkqBiet + dungSaiBiet + tlNganBiet + tuLuanBiet;
    const totalHieu = tnkqHieu + dungSaiHieu + tlNganHieu + tuLuanHieu;
    const totalVD = tnkqVD + dungSaiVD + tlNganVD + tuLuanVD;

    // Tính điểm số chuẩn
    const pointsTnkq = Number((sumTnkq * 0.25).toFixed(2));
    const pointsDungSai = Number((sumDungSai * 1.0).toFixed(2));
    const pointsTlNgan = Number((sumTlNgan * 0.5).toFixed(2));
    const pointsTuLuan = Number((sumTuLuan * 1.5).toFixed(2));

    const pointsBiet = 4.0;
    const pointsHieu = 3.0;
    const pointsVD = 3.0;
    const totalPoints = 10.0;

    return {
      tnkqBiet, tnkqHieu, tnkqVD, sumTnkq, pointsTnkq,
      dungSaiBiet, dungSaiHieu, dungSaiVD, sumDungSai, pointsDungSai,
      tlNganBiet, tlNganHieu, tlNganVD, sumTlNgan, pointsTlNgan,
      tuLuanBiet, tuLuanHieu, tuLuanVD, sumTuLuan, pointsTuLuan,
      totalBiet, totalHieu, totalVD, totalQuestions,
      pointsBiet, pointsHieu, pointsVD, totalPoints
    };
  }, [currentMatrixRows]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* =========================================================================
          PANEL: BỘ ĐỀ XUẤT MA TRẬN & BẢN ĐẶC TẢ THEO TỪNG BÀI HỌC VÀ KHỐI LỚP (CV 7991)
         ========================================================================= */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-5 md:p-6 shadow-xl border border-indigo-700/50 no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-700/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-md">
              <Sliders className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Tùy Chọn Theo Khối Lớp & Bài Học
                </span>
                <span className="text-xs text-indigo-200">Chuẩn hóa Công văn 7991/BGDĐT-GDTrH</span>
              </div>
              <h2 className="text-base md:text-lg font-bold text-white mt-0.5 flex items-center gap-2">
                <span>Đề Xuất Ma Trận & Bản Đặc Tả Tự Động</span>
                <span className="text-xs font-normal text-indigo-300">
                  ({builderGrade} · {builderDiscipline === 'Tất cả' ? 'KHTN' : builderDiscipline})
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsBuilderOpen(!isBuilderOpen)}
              className="px-3 py-1.5 bg-indigo-800/80 hover:bg-indigo-700 text-indigo-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-indigo-600/50"
            >
              <span>{isBuilderOpen ? 'Thu gọn bộ lọc' : 'Mở rộng bộ lọc bài học'}</span>
              {isBuilderOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {isBuilderOpen && (
          <div className="mt-5 space-y-4 animate-in fade-in duration-200">
            {/* Hàng 1: Bộ chọn Khối lớp, Phân môn và Phạm vi kiểm tra */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* 1. Chọn Khối Lớp */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-indigo-200 block uppercase tracking-wider">
                  1. Khối lớp THCS:
                </label>
                <div className="grid grid-cols-4 gap-1.5 p-1 bg-indigo-950/60 rounded-xl border border-indigo-700/50">
                  {(['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'] as GradeLevel[]).map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        setBuilderGrade(g);
                        if (g !== 'Lớp 7' && builderDiscipline === 'Công nghệ') {
                          setBuilderDiscipline('Tất cả');
                        }
                      }}
                      className={`py-2 text-xs font-bold rounded-lg transition-all text-center ${
                        builderGrade === g
                          ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                          : 'text-indigo-200 hover:text-white hover:bg-indigo-800/50'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Chọn Phân Môn */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-indigo-200 block uppercase tracking-wider">
                  2. Phân môn KHTN (Lí - Hóa - Sinh):
                </label>
                <div className="grid grid-cols-4 gap-1.5 p-1 bg-indigo-950/60 rounded-xl border border-indigo-700/50">
                  <button
                    type="button"
                    onClick={() => setBuilderDiscipline('Tất cả')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all text-center ${
                      builderDiscipline === 'Tất cả'
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'text-indigo-200 hover:text-white hover:bg-indigo-800/50'
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    type="button"
                    onClick={() => setBuilderDiscipline('Vật lí')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
                      builderDiscipline === 'Vật lí'
                        ? 'bg-sky-500 text-slate-950 font-black shadow-md'
                        : 'text-indigo-200 hover:text-white hover:bg-indigo-800/50'
                    }`}
                  >
                    <Atom className="w-3.5 h-3.5" />
                    <span>Lí</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBuilderDiscipline('Hóa học')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
                      builderDiscipline === 'Hóa học'
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                        : 'text-indigo-200 hover:text-white hover:bg-indigo-800/50'
                    }`}
                  >
                    <FlaskConical className="w-3.5 h-3.5" />
                    <span>Hóa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBuilderDiscipline(builderGrade === 'Lớp 7' && builderDiscipline === 'Công nghệ' ? 'Công nghệ' : 'Sinh học')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
                      builderDiscipline === 'Sinh học' || (builderGrade === 'Lớp 7' && builderDiscipline === 'Công nghệ')
                        ? 'bg-purple-500 text-white font-black shadow-md'
                        : 'text-indigo-200 hover:text-white hover:bg-indigo-800/50'
                    }`}
                  >
                    <Dna className="w-3.5 h-3.5" />
                    <span>Sinh</span>
                  </button>
                </div>
              </div>

              {/* 3. Phạm vi Kì Thi */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-indigo-200 block uppercase tracking-wider">
                  3. Phạm vi đề kiểm tra:
                </label>
                <div className="grid grid-cols-4 gap-1 p-1 bg-indigo-950/60 rounded-xl border border-indigo-700/50">
                  <button
                    type="button"
                    onClick={() => setScopePreset('mid1')}
                    className={`py-2 text-[11px] font-bold rounded-lg transition-all text-center ${
                      scopePreset === 'mid1' ? 'bg-amber-400 text-slate-950' : 'text-indigo-200 hover:bg-indigo-800/50'
                    }`}
                  >
                    Giữa kì 1
                  </button>
                  <button
                    type="button"
                    onClick={() => setScopePreset('end1')}
                    className={`py-2 text-[11px] font-bold rounded-lg transition-all text-center ${
                      scopePreset === 'end1' ? 'bg-amber-400 text-slate-950' : 'text-indigo-200 hover:bg-indigo-800/50'
                    }`}
                  >
                    Cuối kì 1
                  </button>
                  <button
                    type="button"
                    onClick={() => setScopePreset('mid2')}
                    className={`py-2 text-[11px] font-bold rounded-lg transition-all text-center ${
                      scopePreset === 'mid2' ? 'bg-amber-400 text-slate-950' : 'text-indigo-200 hover:bg-indigo-800/50'
                    }`}
                  >
                    Giữa kì 2
                  </button>
                  <button
                    type="button"
                    onClick={() => setScopePreset('end2')}
                    className={`py-2 text-[11px] font-bold rounded-lg transition-all text-center ${
                      scopePreset === 'end2' ? 'bg-amber-400 text-slate-950' : 'text-indigo-200 hover:bg-indigo-800/50'
                    }`}
                  >
                    Cuối kì 2
                  </button>
                </div>
              </div>

            </div>

            {/* Hàng 2: Tìm kiếm và các nút chọn nhanh */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-indigo-300" />
                <input
                  type="text"
                  value={searchLessonKeyword}
                  onChange={(e) => setSearchLessonKeyword(e.target.value)}
                  placeholder={`Tìm bài học ${builderGrade} (VD: Acid, Lực, Quang hợp, Trồng trọt...)...`}
                  className="w-full pl-9 pr-3 py-1.5 bg-indigo-950/80 border border-indigo-700 rounded-xl text-xs text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-indigo-300 mr-1">
                  Đã chọn: <strong className="text-amber-300 font-bold">{selectedLessonIds.length}</strong> / {availableLessons.length} bài
                </span>
                <button
                  type="button"
                  onClick={handleSelectAllLessons}
                  className="px-2.5 py-1 bg-indigo-800/70 hover:bg-indigo-700 text-indigo-200 hover:text-white rounded-lg text-xs font-medium border border-indigo-600/40 transition-colors"
                >
                  Chọn tất cả
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAllLessons}
                  className="px-2.5 py-1 bg-indigo-800/70 hover:bg-indigo-700 text-indigo-200 hover:text-white rounded-lg text-xs font-medium border border-indigo-600/40 transition-colors"
                >
                  Bỏ chọn
                </button>
              </div>
            </div>

            {/* Hàng 3: Danh sách các bài học với Checkbox tương tác */}
            <div className="max-h-56 overflow-y-auto p-2 bg-indigo-950/70 rounded-xl border border-indigo-700/60 divide-y divide-indigo-800/40 space-y-1">
              {filteredAvailableLessons.length === 0 ? (
                <div className="p-4 text-center text-xs text-indigo-300">
                  Không tìm thấy bài học phù hợp với bộ lọc {builderGrade} và từ khóa "{searchLessonKeyword}".
                </div>
              ) : (
                filteredAvailableLessons.map(lesson => {
                  const isChecked = selectedLessonIds.includes(lesson.id);
                  return (
                    <label
                      key={lesson.id}
                      className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-all ${
                        isChecked 
                          ? 'bg-indigo-800/80 text-white font-medium shadow-2xs border border-indigo-500/50' 
                          : 'hover:bg-indigo-900/40 text-indigo-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleLesson(lesson.id)}
                        className="mt-0.5 rounded border-indigo-500 text-amber-500 focus:ring-amber-400 w-4 h-4 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-amber-300">
                            Bài {lesson.lessonNumber}: {lesson.lessonName}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                            lesson.discipline === 'Hóa học' 
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : lesson.discipline === 'Vật lí'
                              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                              : lesson.discipline === 'Sinh học'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : lesson.discipline === 'Công nghệ'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-indigo-500/20 text-indigo-300'
                          }`}>
                            {lesson.discipline}
                          </span>
                        </div>
                        <p className="text-[11px] text-indigo-300/90 truncate mt-0.5">
                          {lesson.chapterTitle}
                        </p>
                      </div>
                    </label>
                  );
                })
              )}
            </div>

            {/* Hàng 4: Các nút thực thi cốt lõi (Đề xuất & Áp dụng) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-indigo-700/60">
              <div className="text-xs text-indigo-200">
                <span>Khung tỉ lệ vàng CV 7991: </span>
                <strong className="text-amber-300">40% Nhận biết (4.0đ) · 30% Thông hiểu (3.0đ) · 30% Vận dụng (3.0đ)</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerateMatrixAndSpec}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs shadow-md flex items-center gap-2 transform active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>✨ Đề Xuất Ma Trận & Bản Đặc Tả</span>
                </button>

                <button
                  type="button"
                  onClick={handleApplyToWorkspace}
                  title="Lưu Ma trận và Bản đặc tả này vào không gian làm việc của đề thi"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>💾 Áp Dụng Vào Hệ Thống</span>
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Top Banner Control & Chuyển đổi Phụ lục 1 / Phụ lục 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Công văn 7991/BGDĐT-GDTrH (Phụ Lục 1 & 2)
            </span>
            <span className="text-xs text-slate-500">Quy chuẩn xây dựng Ma trận & Bản đặc tả</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 mt-1">
            Ma Trận & Bản Đặc Tả Đề Kiểm Tra Định Kì
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Nút Mở Ra Đề Tùy Chọn */}
          <button
            type="button"
            onClick={() => setIsCustomQuestionModalOpen(true)}
            title="Ra đề tùy chọn: chọn nội dung bài học SGK (Lí, Hóa, Sinh, Công nghệ), mức độ nhận thức (Biết, Hiểu, Vận dụng) và dạng câu hỏi (Nhiều lựa chọn, Đúng Sai, Trả lời ngắn, Tự luận) chuẩn CV 7991"
            className="px-3.5 py-1.5 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 border border-amber-400 rounded-lg shadow-sm flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3] text-slate-950" />
            <span>➕ Ra Đề Tùy Chọn (Chuẩn 7991)</span>
          </button>

          {/* Nút Đồng bộ RAG SGK */}
          <button
            type="button"
            onClick={handleSyncSpecWithRag}
            title="Đồng bộ chuẩn Yêu cầu cần đạt (Biết, Hiểu, Vận dụng) từ các bài SGK trong kho"
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>⚡ Đồng Bộ YCCĐ Từ RAG SGK</span>
          </button>

          {/* Sub-tab switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveSubTab('matrix')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeSubTab === 'matrix' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Ma Trận Đề Thi
            </button>
            <button
              onClick={() => setActiveSubTab('spec')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeSubTab === 'spec' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Bản Đặc Tả
            </button>
          </div>

          <button
            onClick={handleExportWord}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải File Word</span>
          </button>
        </div>
      </div>

      {/* RAG SYNC TOAST */}
      {ragSyncToast && (
        <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in duration-200 no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>{ragSyncToast}</span>
          </div>
          <button 
            onClick={() => setRagSyncToast(null)}
            className="text-xs text-white/80 hover:text-white px-2 py-0.5 bg-white/20 rounded"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Main Print Container */}
      <div id="matrix-spec-print-root" className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-slate-200 space-y-8">
        {/* National Header */}
        <div className="text-center space-y-1 border-b border-slate-200 pb-5">
          <p className="font-bold text-xs uppercase tracking-wide text-slate-800">
            BỘ GIÁO DỤC VÀ ĐÀO TẠO · CÔNG VĂN SỐ 7991/BGDĐT-GDTrH
          </p>
          <h2 className="text-xl font-bold uppercase text-slate-900">
            {activeSubTab === 'matrix' 
              ? 'PHỤ LỤC 1: MA TRẬN ĐỀ KIỂM TRA ĐỊNH KÌ' 
              : 'PHỤ LỤC 2: BẢN ĐẶC TẢ ĐỀ KIỂM TRA ĐỊNH KÌ'}
          </h2>
          <p className="text-xs text-slate-600">
            Môn học: <strong>{subject}</strong> · Khối: <strong>{builderGrade}</strong> · Khung tỉ lệ: <strong>40% Nhận biết - 30% Thông hiểu - 30% Vận dụng</strong>
          </p>
        </div>

        {/* 1. MA TRẬN VIEW (PHỤ LỤC 1) */}
        {activeSubTab === 'matrix' && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse border border-slate-300 text-center font-sans">
                <thead>
                  <tr className="bg-slate-100 text-slate-800">
                    <th rowSpan={3} className="border border-slate-300 p-2 w-10">TT</th>
                    <th rowSpan={3} className="border border-slate-300 p-2 w-44 text-left">Chủ đề/Chương</th>
                    <th rowSpan={3} className="border border-slate-300 p-2 w-48 text-left">Nội dung/đơn vị kiến thức</th>
                    <th colSpan={12} className="border border-slate-300 p-2 font-bold">Mức độ đánh giá</th>
                    <th colSpan={3} rowSpan={2} className="border border-slate-300 p-2 font-bold bg-slate-200">Tổng</th>
                    <th rowSpan={3} className="border border-slate-300 p-2 w-16 bg-slate-200 font-bold">Tỉ lệ % điểm</th>
                  </tr>
                  <tr className="bg-slate-100 text-slate-800">
                    <th colSpan={9} className="border border-slate-300 p-1.5 font-semibold bg-blue-50 text-blue-900">TNKQ</th>
                    <th colSpan={3} className="border border-slate-300 p-1.5 font-semibold bg-indigo-50 text-indigo-900">Tự luận</th>
                  </tr>
                  <tr className="bg-slate-50 text-slate-700">
                    {/* Nhiều lựa chọn */}
                    <th className="border border-slate-300 p-1">Biết</th>
                    <th className="border border-slate-300 p-1">Hiểu</th>
                    <th className="border border-slate-300 p-1">VD</th>
                    {/* Đúng - Sai */}
                    <th className="border border-slate-300 p-1 bg-amber-50">Biết</th>
                    <th className="border border-slate-300 p-1 bg-amber-50">Hiểu</th>
                    <th className="border border-slate-300 p-1 bg-amber-50">VD</th>
                    {/* Trả lời ngắn */}
                    <th className="border border-slate-300 p-1">Biết</th>
                    <th className="border border-slate-300 p-1">Hiểu</th>
                    <th className="border border-slate-300 p-1">VD</th>
                    {/* Tự luận */}
                    <th className="border border-slate-300 p-1 bg-indigo-50">Biết</th>
                    <th className="border border-slate-300 p-1 bg-indigo-50">Hiểu</th>
                    <th className="border border-slate-300 p-1 bg-indigo-50">VD</th>
                    {/* Tổng */}
                    <th className="border border-slate-300 p-1 font-bold bg-slate-100">Biết</th>
                    <th className="border border-slate-300 p-1 font-bold bg-slate-100">Hiểu</th>
                    <th className="border border-slate-300 p-1 font-bold bg-slate-100">VD</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMatrixRows.map((row, idx) => {
                    const rowBiet = row.tnkq_nhieuLuaChon.biet + row.tnkq_dungSai.biet + row.tnkq_traLoiNgan.biet + row.tuLuan.biet;
                    const rowHieu = row.tnkq_nhieuLuaChon.hieu + row.tnkq_dungSai.hieu + row.tnkq_traLoiNgan.hieu + row.tuLuan.hieu;
                    const rowVD = row.tnkq_nhieuLuaChon.vanDung + row.tnkq_dungSai.vanDung + row.tnkq_traLoiNgan.vanDung + row.tuLuan.vanDung;
                    const rowTotalQuestions = rowBiet + rowHieu + rowVD;
                    const rowPercent = currentMatrixRows.length > 0 
                      ? Math.round((rowTotalQuestions / totals.totalQuestions) * 100) 
                      : 0;

                    return (
                      <tr key={row.id} className="hover:bg-slate-50 text-slate-800">
                        <td className="border border-slate-300 p-2 font-mono">{idx + 1}</td>
                        <td className="border border-slate-300 p-2 text-left font-medium">{row.chapter}</td>
                        <td className="border border-slate-300 p-2 text-left">{row.unit}</td>
                        
                        {/* Nhiều lựa chọn */}
                        <td className="border border-slate-300 p-2">{row.tnkq_nhieuLuaChon.biet || '-'}</td>
                        <td className="border border-slate-300 p-2">{row.tnkq_nhieuLuaChon.hieu || '-'}</td>
                        <td className="border border-slate-300 p-2">{row.tnkq_nhieuLuaChon.vanDung || '-'}</td>

                        {/* Đúng - Sai */}
                        <td className="border border-slate-300 p-2 bg-amber-50/50">{row.tnkq_dungSai.biet || '-'}</td>
                        <td className="border border-slate-300 p-2 bg-amber-50/50">{row.tnkq_dungSai.hieu || '-'}</td>
                        <td className="border border-slate-300 p-2 bg-amber-50/50">{row.tnkq_dungSai.vanDung || '-'}</td>

                        {/* Trả lời ngắn */}
                        <td className="border border-slate-300 p-2">{row.tnkq_traLoiNgan.biet || '-'}</td>
                        <td className="border border-slate-300 p-2">{row.tnkq_traLoiNgan.hieu || '-'}</td>
                        <td className="border border-slate-300 p-2">{row.tnkq_traLoiNgan.vanDung || '-'}</td>

                        {/* Tự luận */}
                        <td className="border border-slate-300 p-2 bg-indigo-50/50">{row.tuLuan.biet || '-'}</td>
                        <td className="border border-slate-300 p-2 bg-indigo-50/50">{row.tuLuan.hieu || '-'}</td>
                        <td className="border border-slate-300 p-2 bg-indigo-50/50">{row.tuLuan.vanDung || '-'}</td>

                        {/* Tổng Biết / Hiểu / VD */}
                        <td className="border border-slate-300 p-2 font-bold bg-slate-100">{rowBiet}</td>
                        <td className="border border-slate-300 p-2 font-bold bg-slate-100">{rowHieu}</td>
                        <td className="border border-slate-300 p-2 font-bold bg-slate-100">{rowVD}</td>

                        <td className="border border-slate-300 p-2 font-semibold">
                          {rowPercent}%
                        </td>
                      </tr>
                    );
                  })}

                  {/* SUMMARY ROWS THEO ĐÚNG MẪU PHỤ LỤC CV 7991 (TÍNH TOÁN ĐỘNG) */}
                  <tr className="bg-slate-100 font-bold text-slate-900">
                    <td colSpan={3} className="border border-slate-300 p-2 text-right">Tổng số câu</td>
                    <td colSpan={3} className="border border-slate-300 p-2 text-center">{totals.sumTnkq} câu</td>
                    <td colSpan={3} className="border border-slate-300 p-2 text-center">{totals.sumDungSai} câu (8 ý)</td>
                    <td colSpan={3} className="border border-slate-300 p-2 text-center">{totals.sumTlNgan} câu</td>
                    <td colSpan={3} className="border border-slate-300 p-2 text-center">{totals.sumTuLuan} câu</td>
                    <td colSpan={3} className="border border-slate-300 p-2 text-center bg-slate-200">{totals.totalQuestions} câu</td>
                    <td className="border border-slate-300 p-2 text-center bg-slate-200">100%</td>
                  </tr>

                  <tr className="bg-blue-50 font-bold text-blue-950">
                    <td colSpan={3} className="border border-slate-300 p-2 text-right">Tổng số điểm</td>
                    <td colSpan={3} className="border border-slate-300 p-2 text-center">{totals.pointsTnkq.toFixed(1)} điểm</td>
                    <td colSpan={3} className="border border-slate-300 p-2 text-center">{totals.pointsDungSai.toFixed(1)} điểm</td>
                    <td colSpan={3} className="border border-slate-300 p-2 text-center">{totals.pointsTlNgan.toFixed(1)} điểm</td>
                    <td colSpan={3} className="border border-slate-300 p-2 text-center">{totals.pointsTuLuan.toFixed(1)} điểm</td>
                    <td className="border border-slate-300 p-2 text-center bg-blue-100">{totals.pointsBiet.toFixed(1)}đ</td>
                    <td className="border border-slate-300 p-2 text-center bg-blue-100">{totals.pointsHieu.toFixed(1)}đ</td>
                    <td className="border border-slate-300 p-2 text-center bg-blue-100">{totals.pointsVD.toFixed(1)}đ</td>
                    <td className="border border-slate-300 p-2 text-center bg-blue-200 text-blue-900 font-extrabold">{totals.totalPoints.toFixed(1)} điểm</td>
                  </tr>

                  <tr className="bg-slate-100 font-bold text-slate-800">
                    <td colSpan={3} className="border border-slate-300 p-2 text-right">Tỉ lệ %</td>
                    <td colSpan={3} className="border border-slate-300 p-2 text-center">30%</td>
                    <td colSpan={3} className="border border-slate-300 p-2 text-center">20%</td>
                    <td colSpan={3} className="border border-slate-300 p-2 text-center">20%</td>
                    <td colSpan={3} className="border border-slate-300 p-2 text-center">30%</td>
                    <td className="border border-slate-300 p-2 text-center bg-slate-200">40%</td>
                    <td className="border border-slate-300 p-2 text-center bg-slate-200">30%</td>
                    <td className="border border-slate-300 p-2 text-center bg-slate-200">30%</td>
                    <td className="border border-slate-300 p-2 text-center bg-slate-300">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <p><strong>Ghi chú sư phạm chuẩn Công văn 7991:</strong></p>
              <ul className="list-disc pl-5 space-y-0.5">
                <li>Mỗi câu trắc nghiệm Đúng - Sai bao gồm 4 ý nhỏ (a, b, c, d), mỗi ý học sinh chọn đúng hoặc sai.</li>
                <li>Thang điểm câu hỏi Đúng/Sai chuẩn: Đúng 1 ý = 0.1đ; Đúng 2 ý = 0.25đ; Đúng 3 ý = 0.5đ; Đúng 4 ý = 1.0đ.</li>
                <li>Tỉ lệ tổng kết ma trận đạt tuyệt đối: 40% Nhận biết (4.0đ) - 30% Thông hiểu (3.0đ) - 30% Vận dụng (3.0đ).</li>
              </ul>
            </div>
          </div>
        )}

        {/* 2. BẢN ĐẶC TẢ VIEW (PHỤ LỤC 2) */}
        {activeSubTab === 'spec' && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse border border-slate-300 font-sans">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 text-center">
                    <th rowSpan={3} className="border border-slate-300 p-2 w-10">TT</th>
                    <th rowSpan={3} className="border border-slate-300 p-2 w-44 text-left">Chủ đề/Chương</th>
                    <th rowSpan={3} className="border border-slate-300 p-2 w-40 text-left">Nội dung/đơn vị kiến thức</th>
                    <th rowSpan={3} className="border border-slate-300 p-2 w-80 text-left">Yêu cầu cần đạt</th>
                    <th colSpan={12} className="border border-slate-300 p-2 font-bold">Số câu hỏi ở các mức độ đánh giá</th>
                  </tr>
                  <tr className="bg-slate-100 text-slate-800 text-center">
                    <th colSpan={9} className="border border-slate-300 p-1.5 font-semibold bg-blue-50 text-blue-900">TNKQ</th>
                    <th colSpan={3} className="border border-slate-300 p-1.5 font-semibold bg-indigo-50 text-indigo-900">Tự luận</th>
                  </tr>
                  <tr className="bg-slate-50 text-slate-700 text-center">
                    {/* Nhiều lựa chọn */}
                    <th className="border border-slate-300 p-1">Biết</th>
                    <th className="border border-slate-300 p-1">Hiểu</th>
                    <th className="border border-slate-300 p-1">VD</th>
                    {/* Đúng - Sai */}
                    <th className="border border-slate-300 p-1 bg-amber-50">Biết</th>
                    <th className="border border-slate-300 p-1 bg-amber-50">Hiểu</th>
                    <th className="border border-slate-300 p-1 bg-amber-50">VD</th>
                    {/* Trả lời ngắn */}
                    <th className="border border-slate-300 p-1">Biết</th>
                    <th className="border border-slate-300 p-1">Hiểu</th>
                    <th className="border border-slate-300 p-1">VD</th>
                    {/* Tự luận */}
                    <th className="border border-slate-300 p-1 bg-indigo-50">Biết</th>
                    <th className="border border-slate-300 p-1 bg-indigo-50">Hiểu</th>
                    <th className="border border-slate-300 p-1 bg-indigo-50">VD</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSpecRows.map((spec, sIdx) => (
                    <tr key={spec.id} className="hover:bg-slate-50 text-slate-800">
                      <td className="border border-slate-300 p-2 text-center font-mono">{sIdx + 1}</td>
                      <td className="border border-slate-300 p-2 font-medium">{spec.chapter}</td>
                      <td className="border border-slate-300 p-2">{spec.unit}</td>
                      <td className="border border-slate-300 p-2 space-y-1.5 text-left">
                        {spec.learningOutcomes.biet.length > 0 && (
                          <div>
                            <span className="font-bold text-slate-900 block">- Nhận biết:</span>
                            <ul className="list-disc pl-4 text-slate-700 space-y-0.5">
                              {spec.learningOutcomes.biet.map((b, i) => <li key={i}>{b}</li>)}
                            </ul>
                          </div>
                        )}
                        {spec.learningOutcomes.hieu.length > 0 && (
                          <div>
                            <span className="font-bold text-slate-900 block">- Thông hiểu:</span>
                            <ul className="list-disc pl-4 text-slate-700 space-y-0.5">
                              {spec.learningOutcomes.hieu.map((b, i) => <li key={i}>{b}</li>)}
                            </ul>
                          </div>
                        )}
                        {spec.learningOutcomes.vanDung.length > 0 && (
                          <div>
                            <span className="font-bold text-slate-900 block">- Vận dụng:</span>
                            <ul className="list-disc pl-4 text-slate-700 space-y-0.5">
                              {spec.learningOutcomes.vanDung.map((b, i) => <li key={i}>{b}</li>)}
                            </ul>
                          </div>
                        )}
                      </td>

                      {/* Nhiều lựa chọn */}
                      <td className="border border-slate-300 p-2 text-center">{spec.numberOfQuestions.tnkq_nhieuLuaChon.biet || '-'}</td>
                      <td className="border border-slate-300 p-2 text-center">{spec.numberOfQuestions.tnkq_nhieuLuaChon.hieu || '-'}</td>
                      <td className="border border-slate-300 p-2 text-center">{spec.numberOfQuestions.tnkq_nhieuLuaChon.vanDung || '-'}</td>

                      {/* Đúng - Sai */}
                      <td className="border border-slate-300 p-2 text-center bg-amber-50/50">{spec.numberOfQuestions.tnkq_dungSai.biet || '-'}</td>
                      <td className="border border-slate-300 p-2 text-center bg-amber-50/50">{spec.numberOfQuestions.tnkq_dungSai.hieu || '-'}</td>
                      <td className="border border-slate-300 p-2 text-center bg-amber-50/50">{spec.numberOfQuestions.tnkq_dungSai.vanDung || '-'}</td>

                      {/* Trả lời ngắn */}
                      <td className="border border-slate-300 p-2 text-center">{spec.numberOfQuestions.tnkq_traLoiNgan.biet || '-'}</td>
                      <td className="border border-slate-300 p-2 text-center">{spec.numberOfQuestions.tnkq_traLoiNgan.hieu || '-'}</td>
                      <td className="border border-slate-300 p-2 text-center">{spec.numberOfQuestions.tnkq_traLoiNgan.vanDung || '-'}</td>

                      {/* Tự luận */}
                      <td className="border border-slate-300 p-2 text-center bg-indigo-50/50">{spec.numberOfQuestions.tuLuan.biet || '-'}</td>
                      <td className="border border-slate-300 p-2 text-center bg-indigo-50/50">{spec.numberOfQuestions.tuLuan.hieu || '-'}</td>
                      <td className="border border-slate-300 p-2 text-center bg-indigo-50/50">{spec.numberOfQuestions.tuLuan.vanDung || '-'}</td>
                    </tr>
                  ))}

                  <tr className="bg-blue-50 font-bold text-blue-950 text-center">
                    <td colSpan={4} className="border border-slate-300 p-2 text-right">Tổng số điểm</td>
                    <td colSpan={3} className="border border-slate-300 p-2">{totals.pointsTnkq.toFixed(1)} điểm</td>
                    <td colSpan={3} className="border border-slate-300 p-2">{totals.pointsDungSai.toFixed(1)} điểm</td>
                    <td colSpan={3} className="border border-slate-300 p-2">{totals.pointsTlNgan.toFixed(1)} điểm</td>
                    <td colSpan={3} className="border border-slate-300 p-2">{totals.pointsTuLuan.toFixed(1)} điểm</td>
                  </tr>

                  <tr className="bg-slate-100 font-bold text-slate-800 text-center">
                    <td colSpan={4} className="border border-slate-300 p-2 text-right">Tỉ lệ %</td>
                    <td colSpan={3} className="border border-slate-300 p-2">30%</td>
                    <td colSpan={3} className="border border-slate-300 p-2">20%</td>
                    <td colSpan={3} className="border border-slate-300 p-2">20%</td>
                    <td colSpan={3} className="border border-slate-300 p-2">30%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL RA ĐỀ TÙY CHỌN THEO BÀI HỌC VÀ MỨC ĐỘ 7991 */}
      <CustomQuestionBuilderModal
        isOpen={isCustomQuestionModalOpen}
        onClose={() => setIsCustomQuestionModalOpen(false)}
        currentGrade={builderGrade}
        currentMatrixRows={currentMatrixRows}
        currentSpecRows={currentSpecRows}
        onAddCustomQuestion={({ questionType, targetLesson, level: qLevel }) => {
          // 1. Tự động cập nhật số lượng vào ma trận hiện tại (Phụ lục 1)
          const updatedMatrix = [...currentMatrixRows];
          let foundIdx = updatedMatrix.findIndex(r => 
            r.unit.toLowerCase().includes(targetLesson.lessonName.toLowerCase()) ||
            r.chapter.toLowerCase().includes(targetLesson.chapterTitle.toLowerCase())
          );

          if (foundIdx === -1 && updatedMatrix.length > 0) {
            foundIdx = updatedMatrix.length - 1;
          }

          const lKey = qLevel === 'Nhận biết' ? 'biet' : qLevel === 'Thông hiểu' ? 'hieu' : 'vanDung';

          if (foundIdx !== -1) {
            const row = { ...updatedMatrix[foundIdx] };
            if (questionType === 'mc') {
              row.tnkq_nhieuLuaChon = { ...row.tnkq_nhieuLuaChon, [lKey]: row.tnkq_nhieuLuaChon[lKey] + 1 };
            } else if (questionType === 'tf') {
              row.tnkq_dungSai = { ...row.tnkq_dungSai, [lKey]: row.tnkq_dungSai[lKey] + 1 };
            } else if (questionType === 'sa') {
              row.tnkq_traLoiNgan = { ...row.tnkq_traLoiNgan, [lKey]: row.tnkq_traLoiNgan[lKey] + 1 };
            } else {
              row.tuLuan = { ...row.tuLuan, [lKey]: row.tuLuan[lKey] + 1 };
            }
            updatedMatrix[foundIdx] = row;
            setCurrentMatrixRows(updatedMatrix);
            if (onUpdateMatrixRows) onUpdateMatrixRows(updatedMatrix);
          }

          // 2. Tự động đồng bộ số lượng câu hỏi vào Bản đặc tả (Phụ lục 2)
          if (currentSpecRows.length > 0) {
            const updatedSpec = [...currentSpecRows];
            let foundSpecIdx = updatedSpec.findIndex(s => 
              s.unit.toLowerCase().includes(targetLesson.lessonName.toLowerCase()) ||
              s.chapter.toLowerCase().includes(targetLesson.chapterTitle.toLowerCase())
            );

            if (foundSpecIdx === -1 && updatedSpec.length > 0) {
              foundSpecIdx = updatedSpec.length - 1;
            }

            if (foundSpecIdx !== -1) {
              const specItem = { ...updatedSpec[foundSpecIdx] };
              const numQ = { ...specItem.numberOfQuestions };

              if (questionType === 'mc') {
                numQ.tnkq_nhieuLuaChon = { ...numQ.tnkq_nhieuLuaChon, [lKey]: numQ.tnkq_nhieuLuaChon[lKey] + 1 };
              } else if (questionType === 'tf') {
                numQ.tnkq_dungSai = { ...numQ.tnkq_dungSai, [lKey]: numQ.tnkq_dungSai[lKey] + 1 };
              } else if (questionType === 'sa') {
                numQ.tnkq_traLoiNgan = { ...numQ.tnkq_traLoiNgan, [lKey]: numQ.tnkq_traLoiNgan[lKey] + 1 };
              } else {
                numQ.tuLuan = { ...numQ.tuLuan, [lKey]: numQ.tuLuan[lKey] + 1 };
              }

              specItem.numberOfQuestions = numQ;
              updatedSpec[foundSpecIdx] = specItem;
              setCurrentSpecRows(updatedSpec);
              if (onUpdateSpecRows) onUpdateSpecRows(updatedSpec);
            }
          }

          setRagSyncToast(`Đã thêm câu hỏi tùy chọn (${qLevel}) cho bài [${targetLesson.lessonName}] và đồng bộ chuẩn Ma trận & Bản đặc tả 7991!`);
          setTimeout(() => setRagSyncToast(null), 4000);
        }}
      />
    </div>
  );
};
