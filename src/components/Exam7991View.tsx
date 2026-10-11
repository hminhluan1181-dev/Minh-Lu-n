import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Table, 
  Lock, 
  Sliders, 
  RotateCcw, 
  Check, 
  X, 
  Info, 
  Award, 
  Eye, 
  EyeOff, 
  CheckCircle2,
  FileSpreadsheet,
  Zap,
  Sparkles,
  BookOpen,
  Search,
  Copy,
  Plus
} from 'lucide-react';
import { 
  Exam7991, 
  MatrixRowItem, 
  SpecSheetRow, 
  UploadedDocument, 
  LessonPlan5512, 
  RagChunkResult, 
  Subject, 
  GradeLevel,
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  ShortAnswerQuestion,
  EssayQuestion
} from '../types';
import { exportToWord, exportMatrixSpecWord } from '../utils/exportUtils';
import { 
  searchTextbookRag, 
  generateExamQuestionFromRagChunk, 
  enrichExamFromRag, 
  RAG_SUGGESTED_QUERIES 
} from '../utils/ragEngine';
import { CustomQuestionBuilderModal } from './CustomQuestionBuilderModal';
import { LessonSelectionItem } from '../data/allCurriculumData';

interface Exam7991ViewProps {
  exam: Exam7991;
  documents?: UploadedDocument[];
  lessonPlan?: LessonPlan5512;
  matrixRows?: MatrixRowItem[];
  specRows?: SpecSheetRow[];
  subject: string;
  grade: string;
  onUpdateExam?: (updated: Exam7991) => void;
  onUpdateMatrixRows?: (updated: MatrixRowItem[]) => void;
  onUpdateSpecRows?: (updated: SpecSheetRow[]) => void;
}

export const Exam7991View: React.FC<Exam7991ViewProps> = ({
  exam,
  documents = [],
  lessonPlan,
  matrixRows = [],
  specRows = [],
  subject,
  grade,
  onUpdateExam,
  onUpdateMatrixRows,
  onUpdateSpecRows,
}) => {
  // State for matrix ratio sliders (Default: 40% Nhận biết, 30% Thông hiểu, 30% Vận dụng)
  const [ratioBiet, setRatioBiet] = useState(40);
  const [ratioHieu, setRatioHieu] = useState(30);
  const [ratioVanDung, setRatioVanDung] = useState(30);

  const [showAnswers, setShowAnswers] = useState(true);
  const [interactiveMode, setInteractiveMode] = useState(false);

  // Custom Question Builder Modal State
  const [isCustomBuilderOpen, setIsCustomBuilderOpen] = useState(false);

  // RAG Question Builder States
  const [isRagExamDrawerOpen, setIsRagExamDrawerOpen] = useState(false);
  const [ragExamQuery, setRagExamQuery] = useState(
    lessonPlan?.lessonName ? lessonPlan.lessonName.replace(/BÀI\s+\d+:?\s*/i, '') : `${subject} ${grade}`
  );
  const [ragExamToast, setRagExamToast] = useState<string | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (ragExamToast) {
      const t = setTimeout(() => setRagExamToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [ragExamToast]);

  // RAG Chunks Retrieval for Exam
  const ragChunks = useMemo(() => {
    if (!ragExamQuery.trim()) return [];
    return searchTextbookRag(ragExamQuery, documents, { minScore: 20 });
  }, [ragExamQuery, documents]);

  // Xử lý tự động sinh/làm giàu toàn bộ Đề thi 7991 từ RAG SGK
  const handleAutoEnrichExam = () => {
    if (!onUpdateExam) return;
    const { enrichedExam, addedQuestionsCount, message } = enrichExamFromRag(
      exam,
      documents,
      subject as Subject,
      grade as GradeLevel,
      lessonPlan?.lessonName
    );
    onUpdateExam(enrichedExam);
    setRagExamToast(message);
  };

  // Xử lý thêm câu hỏi từ RAG chunk vào đúng phần trong Đề 7991
  const handleAddQuestionFromChunk = (chunk: RagChunkResult, type: 'mc' | 'tf' | 'sa' | 'essay') => {
    if (!onUpdateExam) return;

    if (type === 'mc') {
      const newNum = exam.partI_MultipleChoice.length + 1;
      const newQ = generateExamQuestionFromRagChunk(chunk, 'mc', newNum) as MultipleChoiceQuestion;
      onUpdateExam({
        ...exam,
        partI_MultipleChoice: [...exam.partI_MultipleChoice, newQ]
      });
      setRagExamToast(`Đã thêm Câu ${newNum} (Phần I - Trắc nghiệm 0.25đ) từ SGK ${chunk.docName}!`);
    } else if (type === 'tf') {
      const newNum = exam.partII_TrueFalse.length + 1;
      const newQ = generateExamQuestionFromRagChunk(chunk, 'tf', newNum) as TrueFalseQuestion;
      onUpdateExam({
        ...exam,
        partII_TrueFalse: [...exam.partII_TrueFalse, newQ]
      });
      setRagExamToast(`Đã thêm Câu ${newNum} (Phần II - Đúng/Sai 4 ý 1.0đ) từ SGK ${chunk.docName}!`);
    } else if (type === 'sa') {
      const newNum = exam.partIII_ShortAnswer.length + 1;
      const newQ = generateExamQuestionFromRagChunk(chunk, 'sa', newNum) as ShortAnswerQuestion;
      onUpdateExam({
        ...exam,
        partIII_ShortAnswer: [...exam.partIII_ShortAnswer, newQ]
      });
      setRagExamToast(`Đã thêm Câu ${newNum} (Phần III - Trả lời ngắn 0.5đ) từ SGK ${chunk.docName}!`);
    } else {
      const newNum = exam.partIV_Essay.length + 1;
      const newQ = generateExamQuestionFromRagChunk(chunk, 'essay', newNum) as EssayQuestion;
      onUpdateExam({
        ...exam,
        partIV_Essay: [...exam.partIV_Essay, newQ]
      });
      setRagExamToast(`Đã thêm Bài ${newNum} (Phần IV - Tự luận 1.5đ) từ SGK ${chunk.docName}!`);
    }
  };

  // Xử lý thêm câu hỏi tùy chọn từ CustomQuestionBuilderModal & đồng bộ ma trận đặc tả
  const handleAddCustomQuestionFromModal = (params: {
    questionType: 'mc' | 'tf' | 'sa' | 'essay';
    questionData: MultipleChoiceQuestion | TrueFalseQuestion | ShortAnswerQuestion | EssayQuestion;
    targetLesson: LessonSelectionItem;
    level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng';
  }) => {
    if (!onUpdateExam) return;

    const { questionType, questionData, targetLesson, level: qLevel } = params;
    let toastLabel = '';

    if (questionType === 'mc') {
      const q = questionData as MultipleChoiceQuestion;
      q.number = exam.partI_MultipleChoice.length + 1;
      onUpdateExam({
        ...exam,
        partI_MultipleChoice: [...exam.partI_MultipleChoice, q]
      });
      toastLabel = `Câu ${q.number} (Phần I - Trắc nghiệm Nhiều lựa chọn 0.25đ)`;
    } else if (questionType === 'tf') {
      const q = questionData as TrueFalseQuestion;
      q.number = exam.partII_TrueFalse.length + 1;
      onUpdateExam({
        ...exam,
        partII_TrueFalse: [...exam.partII_TrueFalse, q]
      });
      toastLabel = `Câu ${q.number} (Phần II - Trắc nghiệm Đúng/Sai 1.0đ)`;
    } else if (questionType === 'sa') {
      const q = questionData as ShortAnswerQuestion;
      q.number = exam.partIII_ShortAnswer.length + 1;
      onUpdateExam({
        ...exam,
        partIII_ShortAnswer: [...exam.partIII_ShortAnswer, q]
      });
      toastLabel = `Câu ${q.number} (Phần III - Trắc nghiệm Trả lời ngắn 0.5đ)`;
    } else {
      const q = questionData as EssayQuestion;
      q.number = exam.partIV_Essay.length + 1;
      onUpdateExam({
        ...exam,
        partIV_Essay: [...exam.partIV_Essay, q]
      });
      toastLabel = `Bài ${q.number} (Phần IV - Tự luận 1.5đ)`;
    }

    // Tự động đồng bộ số lượng vào Ma trận (Phụ lục 1) và Bản đặc tả (Phụ lục 2)
    if (matrixRows.length > 0 && onUpdateMatrixRows) {
      const updatedMatrix = [...matrixRows];
      let foundIndex = updatedMatrix.findIndex(r => 
        r.unit.toLowerCase().includes(targetLesson.lessonName.toLowerCase()) ||
        r.chapter.toLowerCase().includes(targetLesson.chapterTitle.toLowerCase())
      );

      if (foundIndex === -1 && updatedMatrix.length > 0) {
        foundIndex = updatedMatrix.length - 1;
      }

      if (foundIndex !== -1) {
        const row = { ...updatedMatrix[foundIndex] };
        const levelKey = qLevel === 'Nhận biết' ? 'biet' : qLevel === 'Thông hiểu' ? 'hieu' : 'vanDung';

        if (questionType === 'mc') {
          row.tnkq_nhieuLuaChon = { ...row.tnkq_nhieuLuaChon, [levelKey]: row.tnkq_nhieuLuaChon[levelKey] + 1 };
        } else if (questionType === 'tf') {
          row.tnkq_dungSai = { ...row.tnkq_dungSai, [levelKey]: row.tnkq_dungSai[levelKey] + 1 };
        } else if (questionType === 'sa') {
          row.tnkq_traLoiNgan = { ...row.tnkq_traLoiNgan, [levelKey]: row.tnkq_traLoiNgan[levelKey] + 1 };
        } else {
          row.tuLuan = { ...row.tuLuan, [levelKey]: row.tuLuan[levelKey] + 1 };
        }
        updatedMatrix[foundIndex] = row;
        onUpdateMatrixRows(updatedMatrix);
      }
    }

    setRagExamToast(`Đã thêm thành công ${toastLabel} cho bài [${targetLesson.lessonName}] và đồng bộ Ma trận 7991!`);
  };

  // Student test answers state for live grading
  const [mcSelections, setMcSelections] = useState<{ [qId: string]: 'A' | 'B' | 'C' | 'D' }>({});
  const [tfSelections, setTfSelections] = useState<{ [key: string]: boolean }>({});
  const [saAnswers, setSaAnswers] = useState<{ [qId: string]: string }>({});
  const [essayGradedScores, setEssayGradedScores] = useState<{ [qId: string]: number }>({
    'es-1': 1.5,
    'es-2': 1.5
  });

  // Slider change handler with locked 10.0 total points constraint
  const handleBietChange = (val: number) => {
    const newBiet = Math.min(60, Math.max(20, val));
    const remaining = 100 - newBiet;
    // Divide remaining equally between Hieu and Van Dung
    const newHieu = Math.round(remaining / 2);
    const newVD = remaining - newHieu;
    setRatioBiet(newBiet);
    setRatioHieu(newHieu);
    setRatioVanDung(newVD);
  };

  const handleHieuChange = (val: number) => {
    const newHieu = Math.min(50, Math.max(10, val));
    const remaining = 100 - newHieu;
    const newBiet = Math.min(60, Math.max(20, ratioBiet));
    const newVD = Math.max(10, remaining - newBiet);
    const adjustedBiet = 100 - newHieu - newVD;
    setRatioBiet(adjustedBiet);
    setRatioHieu(newHieu);
    setRatioVanDung(newVD);
  };

  const handleVDChange = (val: number) => {
    const newVD = Math.min(50, Math.max(10, val));
    const remaining = 100 - newVD;
    const newBiet = Math.min(60, Math.max(20, ratioBiet));
    const newHieu = Math.max(10, remaining - newBiet);
    const adjustedBiet = 100 - newVD - newHieu;
    setRatioBiet(adjustedBiet);
    setRatioHieu(newHieu);
    setRatioVanDung(newVD);
  };

  const resetToStandardRatio = () => {
    setRatioBiet(40);
    setRatioHieu(30);
    setRatioVanDung(30);
  };

  // Calculate live scores according to CV 7991 regulations
  const calculateScores = () => {
    let scorePartI = 0;
    exam.partI_MultipleChoice.forEach(q => {
      if (mcSelections[q.id] === q.correctAnswer) {
        scorePartI += q.points;
      }
    });

    // Thang điểm Phần II Đúng/Sai chuẩn BGDĐT:
    // 1 ý đúng = 0.1đ | 2 ý đúng = 0.25đ | 3 ý đúng = 0.5đ | 4 ý đúng = 1.0đ
    let scorePartII = 0;
    exam.partII_TrueFalse.forEach(tf => {
      let correctSubCount = 0;
      tf.statements.forEach(st => {
        const studentChoice = tfSelections[`${tf.id}_${st.subId}`];
        if (studentChoice !== undefined && studentChoice === st.isCorrect) {
          correctSubCount += 1;
        }
      });

      if (correctSubCount === 1) scorePartII += 0.1;
      else if (correctSubCount === 2) scorePartII += 0.25;
      else if (correctSubCount === 3) scorePartII += 0.5;
      else if (correctSubCount === 4) scorePartII += 1.0;
    });

    let scorePartIII = 0;
    exam.partIII_ShortAnswer.forEach(sa => {
      const studentAns = (saAnswers[sa.id] || '').trim().toLowerCase();
      const match = sa.acceptableAnswers.some(ans => ans.toLowerCase().trim() === studentAns);
      if (match) {
        scorePartIII += sa.points;
      }
    });

    let scorePartIV = 0;
    exam.partIV_Essay.forEach(es => {
      scorePartIV += essayGradedScores[es.id] || 0;
    });

    const total = scorePartI + scorePartII + scorePartIII + scorePartIV;
    return {
      partI: Number(scorePartI.toFixed(2)),
      partII: Number(scorePartII.toFixed(2)),
      partIII: Number(scorePartIII.toFixed(2)),
      partIV: Number(scorePartIV.toFixed(2)),
      total: Number(total.toFixed(2))
    };
  };

  const scores = calculateScores();

  // Export handlers
  const handleExportWordExam = () => {
    const el = document.getElementById('exam-live-document-root');
    if (el) {
      exportToWord(
        `DE_KIEM_TRA_7991_${subject}_${grade}`,
        el.innerHTML,
        exam.title
      );
    }
  };

  const handleExportMatrixSpec = () => {
    exportMatrixSpecWord(subject, grade, matrixRows, specRows);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-700 uppercase bg-indigo-50 px-2 py-0.5 rounded">
              Scope 2: Module Đề Thi Chuẩn Công Văn 7991
            </span>
            <span className="text-xs text-slate-500">Cấu trúc 4 phần độc lập · Thang điểm 10.0</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 mt-1">
            Thiết Lập Ma Trận & Live Document Đề Kiểm Tra Định Kì
          </h1>
        </div>

        {/* Cụm nút hành động bao gồm RAG Ngữ Liệu SGK */}
        <div className="flex items-center gap-2 flex-wrap">
          {onUpdateExam && (
            <button
              type="button"
              onClick={() => setIsCustomBuilderOpen(true)}
              title="Ra đề tùy chọn: chọn nội dung bài học SGK (Lí, Hóa, Sinh, Công nghệ), mức độ nhận thức (Biết, Hiểu, Vận dụng) và dạng câu hỏi (Nhiều lựa chọn, Đúng Sai, Trả lời ngắn, Tự luận) chuẩn CV 7991"
              className="px-3.5 py-1.5 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 border border-amber-400 rounded-lg shadow-sm flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3] text-slate-950" />
              <span>➕ Ra Đề Tùy Chọn (Chuẩn 7991)</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsRagExamDrawerOpen(!isRagExamDrawerOpen)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 ${
              isRagExamDrawerOpen
                ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-300 shadow-sm'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500 shadow-xs'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>{isRagExamDrawerOpen ? 'Đóng Bảng RAG' : '⚡ Tra Cứu RAG Tạo Câu Hỏi'}</span>
          </button>

          {onUpdateExam && (
            <button
              type="button"
              onClick={handleAutoEnrichExam}
              title="Tự động đồng bộ và sinh câu hỏi trích dẫn trực tiếp từ SGK cho cả 4 phần đề thi"
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 rounded-lg shadow-xs flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>⚡ Sinh Đề 7991 Chuẩn RAG SGK</span>
            </button>
          )}

          <button
            onClick={handleExportWordExam}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải file Word chuẩn Bộ GD&ĐT</span>
          </button>

          <button
            onClick={handleExportMatrixSpec}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" />
            <span>Tải Ma Trận Đặc Tả</span>
          </button>
        </div>
      </div>

      {/* RAG EXAM TOAST THÔNG BÁO */}
      {ragExamToast && (
        <div className="p-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl shadow-md text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in duration-200 no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>{ragExamToast}</span>
          </div>
          <button 
            onClick={() => setRagExamToast(null)}
            className="text-xs text-white/80 hover:text-white px-2 py-0.5 bg-white/20 rounded"
          >
            Đóng
          </button>
        </div>
      )}

      {/* PHÂN HỆ RAG QUESTION BUILDER CHO ĐỀ THI 7991 */}
      {isRagExamDrawerOpen && (
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/80 rounded-2xl p-5 text-white shadow-xl space-y-4 animate-in fade-in duration-200 no-print">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black shadow-md">
                <Zap className="w-4 h-4 fill-slate-950" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <span>TRỢ LÝ RAG SOẠN CÂU HỎI ĐỀ THI 7991 TỪ SÁCH GIÁO KHOA</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                    Barem Chuẩn 4 Phần
                  </span>
                </h3>
                <p className="text-[11px] text-indigo-200">
                  Trích xuất ngữ liệu SGK {subject} {grade} để tạo câu hỏi trắc nghiệm nhiều lựa chọn, đúng/sai 4 ý, trả lời ngắn hoặc tự luận kèm số trang trích dẫn.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsRagExamDrawerOpen(false)}
              className="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 self-start sm:self-center"
            >
              ✕ Đóng bảng RAG
            </button>
          </div>

          {/* Search bar & quick suggestions */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-indigo-300 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={ragExamQuery}
                onChange={(e) => setRagExamQuery(e.target.value)}
                placeholder="Nhập nội dung/chủ đề cần sinh câu hỏi từ SGK..."
                className="w-full pl-9 pr-20 py-2 bg-white/10 border border-indigo-400/40 rounded-xl text-xs text-white placeholder-indigo-300/60 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
              />
              {ragExamQuery && (
                <button
                  onClick={() => setRagExamQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-indigo-300 hover:text-white"
                >
                  ✕ Xóa
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="text-amber-300 font-bold shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Gợi ý:</span>
              </span>
              {RAG_SUGGESTED_QUERIES.map((sq, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => setRagExamQuery(sq.query)}
                  className="px-2 py-0.5 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 rounded text-[11px] whitespace-nowrap border border-indigo-700/50"
                >
                  {sq.label}
                </button>
              ))}
            </div>
          </div>

          {/* RAG results list */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between text-xs text-indigo-200 font-semibold border-t border-indigo-900 pt-2">
              <span>Tìm thấy {ragChunks.length} đoạn ngữ liệu SGK. Bấm vào các nút để tạo câu hỏi:</span>
              <span className="text-[11px] text-amber-300">Tự động điền đáp án, barem điểm và trích dẫn trang SGK</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {ragChunks.map((chunk) => (
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

                  {/* 4 Nút tạo 4 dạng câu hỏi chuẩn 7991 */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-1 flex-wrap">
                    <span className="text-[10px] text-indigo-300 font-bold">Thêm vào đề:</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleAddQuestionFromChunk(chunk, 'mc')}
                        title="Tạo câu Trắc nghiệm 4 lựa chọn Phần I (0.25đ)"
                        className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded flex items-center gap-0.5"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>Phần I (0.25đ)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddQuestionFromChunk(chunk, 'tf')}
                        title="Tạo câu Đúng/Sai 4 ý Phần II (1.0đ)"
                        className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded flex items-center gap-0.5"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>Phần II (1.0đ)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddQuestionFromChunk(chunk, 'sa')}
                        title="Tạo câu Trả lời ngắn Phần III (0.5đ)"
                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded flex items-center gap-0.5"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>Phần III (0.5đ)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddQuestionFromChunk(chunk, 'essay')}
                        title="Tạo câu Tự luận Phần IV (1.5đ)"
                        className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold rounded flex items-center gap-0.5"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>Phần IV (1.5đ)</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TWO-COLUMN SCOPE 2 LAYOUT: Left Matrix Panel | Right Live Document */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ======================================================== */}
        {/* BÊN TRÁI: BẢNG THIẾT LẬP MA TRẬN ĐỀ (340px ~ 4/12 cols)  */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-4 no-print">
          
          {/* Card 1: Slider phân bổ tỉ lệ 40-30-30 & Tổng điểm khóa chặt 10.0 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Phân Bổ Tỉ Lệ Ma Trận
                </h3>
              </div>
              <button
                onClick={resetToStandardRatio}
                title="Khôi phục chuẩn Bộ GD&ĐT (40% - 30% - 30%)"
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Chuẩn Bộ</span>
              </button>
            </div>

            {/* Tổng điểm khóa chặt ở 10.0 điểm */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase block">
                    Tổng điểm đề kiểm tra
                  </span>
                  <span className="text-xs text-emerald-600">Khóa chặt theo CV 7991</span>
                </div>
              </div>
              <span className="text-xl font-extrabold text-emerald-700 font-mono">
                10.0 đ
              </span>
            </div>

            {/* 3 Slider: Nhận biết (40%), Thông hiểu (30%), Vận dụng (30%) */}
            <div className="space-y-4 text-xs">
              {/* Slider 1: Nhận biết */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-800">
                    1. Nhận biết ({ratioBiet}%):
                  </span>
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {(ratioBiet * 0.1).toFixed(1)} điểm
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="60"
                  step="5"
                  value={ratioBiet}
                  onChange={(e) => handleBietChange(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>20% (2.0đ)</span>
                  <span className="font-bold text-blue-600">Chuẩn 40% (4.0đ)</span>
                  <span>60% (6.0đ)</span>
                </div>
              </div>

              {/* Slider 2: Thông hiểu */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-800">
                    2. Thông hiểu ({ratioHieu}%):
                  </span>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {(ratioHieu * 0.1).toFixed(1)} điểm
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={ratioHieu}
                  onChange={(e) => handleHieuChange(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>10% (1.0đ)</span>
                  <span className="font-bold text-emerald-600">Chuẩn 30% (3.0đ)</span>
                  <span>50% (5.0đ)</span>
                </div>
              </div>

              {/* Slider 3: Vận dụng */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-800">
                    3. Vận dụng ({ratioVanDung}%):
                  </span>
                  <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    {(ratioVanDung * 0.1).toFixed(1)} điểm
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={ratioVanDung}
                  onChange={(e) => handleVDChange(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>10% (1.0đ)</span>
                  <span className="font-bold text-amber-600">Chuẩn 30% (3.0đ)</span>
                  <span>50% (5.0đ)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Bộ đếm số lượng câu hỏi từng phần */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Table className="w-4 h-4 text-indigo-600" />
                <span>Bộ Đếm Số Lượng Câu Hỏi</span>
              </h3>
              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                20 Câu / 10.0đ
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 block">Phần I: Nhiều lựa chọn</strong>
                  <span className="text-slate-500 text-[11px]">12 câu trắc nghiệm (0.25đ / câu)</span>
                </div>
                <span className="font-mono font-bold text-blue-700 bg-white px-2 py-1 rounded border border-slate-200">
                  12 câu (3.0đ)
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/50 flex items-center justify-between">
                <div>
                  <strong className="text-blue-950 block">Phần II: Đúng / Sai 4 ý</strong>
                  <span className="text-blue-800 text-[11px]">2 câu (8 lệnh a-b-c-d)</span>
                </div>
                <span className="font-mono font-bold text-blue-700 bg-white px-2 py-1 rounded border border-blue-200">
                  2 câu (2.0đ)
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 block">Phần III: Trả lời ngắn</strong>
                  <span className="text-slate-500 text-[11px]">4 câu điền kết quả (0.5đ / câu)</span>
                </div>
                <span className="font-mono font-bold text-blue-700 bg-white px-2 py-1 rounded border border-slate-200">
                  4 câu (2.0đ)
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 block">Phần IV: Tự luận</strong>
                  <span className="text-slate-500 text-[11px]">2 câu giải toán (1.5đ / câu)</span>
                </div>
                <span className="font-mono font-bold text-blue-700 bg-white px-2 py-1 rounded border border-slate-200">
                  2 câu (3.0đ)
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Toggle Tương Tác & Chấm Điểm */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">
                Công Cụ Giảng Dạy & Khảo Thí
              </span>
              {interactiveMode && (
                <span className="text-xs font-mono font-extrabold text-emerald-400">
                  Điểm: {scores.total} / 10.0
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setInteractiveMode(!interactiveMode)}
                className={`p-2.5 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  interactiveMode
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>{interactiveMode ? 'Đang Làm Bài' : 'Làm Bài Thử'}</span>
              </button>

              <button
                onClick={() => setShowAnswers(!showAnswers)}
                className={`p-2.5 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  showAnswers
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {showAnswers ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{showAnswers ? 'Hiện Đáp Án' : 'Ẩn Đáp Án'}</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
              <span>Barem câu Đúng/Sai: Đúng 1 ý (0.1đ) · 2 ý (0.25đ) · 3 ý (0.5đ) · 4 ý (1.0đ).</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BÊN PHẢI: LIVE DOCUMENT HIỂN THỊ ĐÚNG 4 PHẦN (8/12 cols) */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 space-y-6">
          <div 
            id="exam-live-document-root"
            className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-slate-200 space-y-8"
          >
            {/* Header Đề thi theo chuẩn Văn bản Hành chính Giáo dục */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-200 pb-6">
              <div>
                <p className="font-bold text-xs uppercase tracking-wide text-slate-800">
                  {lessonPlan?.department ? lessonPlan.department.toUpperCase() : 'PHÒNG GIÁO DỤC VÀ ĐÀO TẠO'}
                </p>
                <p className="font-bold text-sm uppercase text-slate-900 mt-0.5">
                  {lessonPlan?.schoolName || 'TRƯỜNG THCS NGUYỄN HUỆ'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Mã đề: <strong className="text-slate-800 font-mono">101</strong> · Môn: <strong className="text-indigo-900">{subject} ({grade})</strong>
                </p>
              </div>

              <div className="text-right sm:text-right w-full sm:w-auto">
                <p className="font-bold text-sm uppercase text-slate-900">
                  {exam.title}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Thời gian làm bài: <strong>{exam.durationMinutes} phút</strong> (Không kể thời gian phát đề)
                </p>
                <p className="text-xs text-slate-500 italic mt-1">
                  (Đề kiểm tra có 04 phần độc lập - Tổng điểm: 10.0 điểm)
                </p>
              </div>
            </div>

            {/* Dòng định danh học sinh */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 flex flex-wrap justify-between gap-2">
              <span>Họ và tên thí sinh: .......................................................................</span>
              <span>Số báo danh: ........................ Lớp: .............</span>
            </div>

            {/* ---------------------------------------------------- */}
            {/* PHẦN I: TRẮC NGHIỆM 4 LỰA CHỌN (3.0Đ) KÈM KEY ĐÁP ÁN */}
            {/* ---------------------------------------------------- */}
            <section className="space-y-4">
              <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 uppercase">
                    PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (3,0 ĐIỂM)
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Thí sinh trả lời từ câu 1 đến câu 12. Mỗi câu hỏi chỉ chọn một phương án. (Mỗi câu đúng được 0,25 điểm)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {onUpdateExam && (
                    <button
                      type="button"
                      onClick={() => setIsCustomBuilderOpen(true)}
                      className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs shadow-xs flex items-center gap-1 transition-all active:scale-95 no-print"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Câu Tùy Chọn</span>
                    </button>
                  )}
                  <span className="text-xs font-bold text-indigo-700 bg-white px-2 py-1 rounded border border-indigo-200 whitespace-nowrap">
                    {exam.partI_MultipleChoice.length} Câu · {(exam.partI_MultipleChoice.length * 0.25).toFixed(2)}đ
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {exam.partI_MultipleChoice.map(q => {
                  const selected = mcSelections[q.id];
                  const isCorrect = selected === q.correctAnswer;

                  return (
                    <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-white text-sm">
                      {q.ragSource && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-[10px] text-indigo-900 font-semibold mb-2 w-fit">
                          <BookOpen className="w-3 h-3 text-indigo-600" />
                          <span>Nguồn RAG SGK: <strong>{q.ragSource.docName}</strong> ({q.ragSource.pageNumber})</span>
                          <span className="text-emerald-700 bg-emerald-100 px-1 rounded font-bold font-mono">{q.ragSource.relevanceScore}% Khớp</span>
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-slate-900 leading-relaxed">
                          <span className="text-indigo-600 font-bold">Câu {q.number}: </span>
                          {q.content}
                        </p>
                        <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                          [{q.level}]
                        </span>
                      </div>

                      {/* 4 Options A, B, C, D */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                        {(['A', 'B', 'C', 'D'] as const).map(optKey => {
                          const isOptionSelected = selected === optKey;
                          const isThisCorrect = q.correctAnswer === optKey;

                          let optClasses = 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100';

                          if (interactiveMode && selected) {
                            if (isThisCorrect) {
                              optClasses = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-medium';
                            } else if (isOptionSelected) {
                              optClasses = 'border-rose-500 bg-rose-50 text-rose-900';
                            }
                          } else if (interactiveMode && isOptionSelected) {
                            optClasses = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-medium';
                          }

                          if (showAnswers && isThisCorrect) {
                            optClasses = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                          }

                          return (
                            <div
                              key={optKey}
                              onClick={() => interactiveMode && setMcSelections({ ...mcSelections, [q.id]: optKey })}
                              className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                                interactiveMode ? 'cursor-pointer' : ''
                              } ${optClasses}`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-bold">{optKey}.</span>
                                <span>{q.options[optKey]}</span>
                              </div>
                              {showAnswers && isThisCorrect && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded uppercase">
                                  KEY
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Key Đáp án và Giải thích */}
                      {showAnswers && (
                        <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Key đáp án đúng: {q.correctAnswer}</strong> · {q.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ---------------------------------------------------- */}
            {/* PHẦN II: TRẮC NGHIỆM ĐÚNG/SAI 4 LỆNH A-B-C-D (2.0Đ) */}
            {/* ---------------------------------------------------- */}
            <section className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-blue-950 uppercase">
                      PHẦN II. CÂU TRẮC NGHIỆM ĐÚNG SAI (2,0 ĐIỂM)
                    </h3>
                    <span className="text-[11px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                      Chuẩn CV 7991
                    </span>
                  </div>
                  <p className="text-xs text-blue-900 mt-1 leading-relaxed">
                    Thí sinh trả lời từ câu 1 đến câu 2. Trong mỗi ý <strong>a), b), c), d)</strong> ở mỗi câu, thí sinh chọn Đúng hoặc Sai.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {onUpdateExam && (
                    <button
                      type="button"
                      onClick={() => setIsCustomBuilderOpen(true)}
                      className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs shadow-xs flex items-center gap-1 transition-all active:scale-95 no-print"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Câu Tùy Chọn</span>
                    </button>
                  )}
                  <span className="text-xs font-bold text-blue-800 bg-white px-2 py-1 rounded border border-blue-200 shrink-0">
                    {exam.partII_TrueFalse.length} Câu · {(exam.partII_TrueFalse.length * 1.0).toFixed(1)}đ
                  </span>
                </div>
              </div>

              {/* Barem tính điểm chuẩn Bộ GDĐT */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-slate-900">Barem chấm điểm 1 câu 4 ý:</span>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span>Đúng 1 ý: <strong>0,10đ</strong></span>
                  <span>·</span>
                  <span>Đúng 2 ý: <strong>0,25đ</strong></span>
                  <span>·</span>
                  <span>Đúng 3 ý: <strong>0,50đ</strong></span>
                  <span>·</span>
                  <span>Đúng cả 4 ý: <strong>1,00đ</strong></span>
                </div>
              </div>

              <div className="space-y-6">
                {exam.partII_TrueFalse.map(tf => {
                  return (
                    <div key={tf.id} className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
                      {tf.ragSource && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-[10px] text-indigo-900 font-semibold mb-2.5 w-fit">
                          <BookOpen className="w-3 h-3 text-indigo-600" />
                          <span>Nguồn RAG SGK: <strong>{tf.ragSource.docName}</strong> ({tf.ragSource.pageNumber})</span>
                          <span className="text-emerald-700 bg-emerald-100 px-1 rounded font-bold font-mono">{tf.ragSource.relevanceScore}% Khớp</span>
                        </div>
                      )}

                      {/* Câu gốc / Ngữ liệu */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <p className="font-semibold text-slate-900 text-sm leading-relaxed">
                          <span className="text-indigo-600 font-bold">Câu {tf.number} ({tf.pointsTotal} điểm): </span>
                          {tf.context}
                        </p>
                        <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                          [{tf.level}]
                        </span>
                      </div>

                      {/* 4 Mệnh đề a, b, c, d với BADGE CHỌN ĐÚNG/SAI TRỰC QUAN */}
                      <div className="space-y-2.5">
                        {tf.statements.map(st => {
                          const userSelection = tfSelections[`${tf.id}_${st.subId}`];
                          const isUserCorrect = userSelection === st.isCorrect;

                          return (
                            <div 
                              key={st.subId}
                              className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                            >
                              <div className="flex-1">
                                <span className="font-bold text-slate-900 uppercase mr-1.5">
                                  {st.subId})
                                </span>
                                <span className="text-slate-800">{st.text}</span>

                                {showAnswers && (
                                  <p className="text-[11px] text-slate-500 mt-1 italic pl-4">
                                    {st.explanation}
                                  </p>
                                )}
                              </div>

                              {/* Badges chọn Đúng/Sai trực quan */}
                              <div className="flex items-center gap-2 shrink-0">
                                {interactiveMode ? (
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => setTfSelections({ ...tfSelections, [`${tf.id}_${st.subId}`]: true })}
                                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                                        userSelection === true
                                          ? 'bg-emerald-600 text-white shadow-xs scale-105'
                                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                                      }`}
                                    >
                                      ĐÚNG
                                    </button>
                                    <button
                                      onClick={() => setTfSelections({ ...tfSelections, [`${tf.id}_${st.subId}`]: false })}
                                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                                        userSelection === false
                                          ? 'bg-rose-600 text-white shadow-xs scale-105'
                                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                                      }`}
                                    >
                                      SAI
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                                      st.isCorrect ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                                    }`}>
                                      {st.isCorrect ? 'ĐÚNG' : 'SAI'}
                                    </span>
                                  </div>
                                )}

                                {interactiveMode && userSelection !== undefined && (
                                  <span className={`p-1 rounded-full ${isUserCorrect ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                                    {isUserCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ---------------------------------------------------- */}
            {/* PHẦN III: TRẢ LỜI NGẮN (2.0Đ) CÓ Ô ĐIỀN KẾT QUẢ NHANH */}
            {/* ---------------------------------------------------- */}
            <section className="space-y-4">
              <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 uppercase">
                    PHẦN III. CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN (2,0 ĐIỂM)
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Thí sinh trả lời từ câu 1 đến câu 4. Điền kết quả số hoặc biểu thức ngắn gọn vào ô làm bài. (Mỗi câu đúng 0,5 điểm)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {onUpdateExam && (
                    <button
                      type="button"
                      onClick={() => setIsCustomBuilderOpen(true)}
                      className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs shadow-xs flex items-center gap-1 transition-all active:scale-95 no-print"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Câu Tùy Chọn</span>
                    </button>
                  )}
                  <span className="text-xs font-bold text-indigo-700 bg-white px-2 py-1 rounded border border-indigo-200 whitespace-nowrap">
                    {exam.partIII_ShortAnswer.length} Câu · {(exam.partIII_ShortAnswer.length * 0.5).toFixed(1)}đ
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {exam.partIII_ShortAnswer.map(sa => {
                  const currentInput = saAnswers[sa.id] || '';
                  const isMatch = sa.acceptableAnswers.some(ans => ans.toLowerCase().trim() === currentInput.toLowerCase().trim());

                  return (
                    <div key={sa.id} className="p-4 rounded-xl border border-slate-200 bg-white text-sm">
                      {sa.ragSource && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-[10px] text-indigo-900 font-semibold mb-2 w-fit">
                          <BookOpen className="w-3 h-3 text-indigo-600" />
                          <span>Nguồn RAG SGK: <strong>{sa.ragSource.docName}</strong> ({sa.ragSource.pageNumber})</span>
                          <span className="text-emerald-700 bg-emerald-100 px-1 rounded font-bold font-mono">{sa.ragSource.relevanceScore}% Khớp</span>
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-semibold text-slate-900 leading-relaxed">
                          <span className="text-indigo-600 font-bold">Câu {sa.number} ({sa.points} điểm): </span>
                          {sa.content}
                        </p>
                        <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                          [{sa.level}]
                        </span>
                      </div>

                      {/* Ô điền kết quả nhanh */}
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-xs font-semibold text-slate-700">Đáp số của bạn:</span>
                        <input
                          type="text"
                          placeholder="Điền kết quả nhanh (VD: 25, x=4)..."
                          value={currentInput}
                          onChange={(e) => setSaAnswers({ ...saAnswers, [sa.id]: e.target.value })}
                          className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                        />
                        {currentInput && (
                          <span className={`text-xs font-bold flex items-center gap-1 ${isMatch ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isMatch ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                            <span>{isMatch ? 'Chính xác' : 'Chưa khớp'}</span>
                          </span>
                        )}
                      </div>

                      {showAnswers && (
                        <div className="mt-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                          <p>
                            <strong>Key đáp án chấp nhận:</strong> <span className="font-mono">{sa.acceptableAnswers.join(' / ')}</span>
                          </p>
                          <p className="text-slate-600">
                            <strong>Hướng dẫn giải:</strong> {sa.solutionGuide}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ---------------------------------------------------- */}
            {/* PHẦN IV: TỰ LUẬN (3.0Đ) KÈM BAREM CHẤM TỪNG BƯỚC     */}
            {/* ---------------------------------------------------- */}
            <section className="space-y-4">
              <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 uppercase">
                    PHẦN IV. TỰ LUẬN (3,0 ĐIỂM)
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Thí sinh trình bày chi tiết các bước giải, lập luận và đáp số vào giấy làm bài.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {onUpdateExam && (
                    <button
                      type="button"
                      onClick={() => setIsCustomBuilderOpen(true)}
                      className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs shadow-xs flex items-center gap-1 transition-all active:scale-95 no-print"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Câu Tùy Chọn</span>
                    </button>
                  )}
                  <span className="text-xs font-bold text-indigo-700 bg-white px-2 py-1 rounded border border-indigo-200 whitespace-nowrap">
                    {exam.partIV_Essay.length} Câu · {exam.partIV_Essay.reduce((s, e) => s + e.points, 0).toFixed(1)}đ
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                {exam.partIV_Essay.map(es => {
                  return (
                    <div key={es.id} className="p-5 rounded-xl border border-slate-200 bg-white text-sm space-y-3">
                      {es.ragSource && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-[10px] text-indigo-900 font-semibold mb-2.5 w-fit">
                          <BookOpen className="w-3 h-3 text-indigo-600" />
                          <span>Nguồn RAG SGK: <strong>{es.ragSource.docName}</strong> ({es.ragSource.pageNumber})</span>
                          <span className="text-emerald-700 bg-emerald-100 px-1 rounded font-bold font-mono">{es.ragSource.relevanceScore}% Khớp</span>
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-slate-900 leading-relaxed whitespace-pre-line">
                          <span className="text-indigo-600 font-bold">Câu {es.number} ({es.points} điểm): </span>
                          {es.content}
                        </p>
                        <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                          [{es.level}]
                        </span>
                      </div>

                      {/* Barem chấm từng bước chi tiết */}
                      <div className="mt-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200">
                          <strong className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                            <span>Barem Chấm Từng Bước Chi Tiết:</span>
                          </strong>
                          {interactiveMode && (
                            <div className="flex items-center gap-2 text-xs">
                              <span>Chấm điểm:</span>
                              <input
                                type="number"
                                min="0"
                                max={es.points}
                                step="0.25"
                                value={essayGradedScores[es.id] ?? es.points}
                                onChange={(e) => setEssayGradedScores({ ...essayGradedScores, [es.id]: Number(e.target.value) })}
                                className="w-16 px-2 py-1 border border-slate-300 rounded text-center font-bold"
                              />
                              <span>/ {es.points}đ</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2 text-xs text-slate-700">
                          {es.gradingCriteria.map((crit, cIdx) => (
                            <div key={cIdx} className="flex justify-between items-start gap-4 border-b border-slate-200 pb-1.5 last:border-0">
                              <span>{crit.step}</span>
                              <span className="font-mono font-bold text-indigo-700 shrink-0">
                                {crit.points}đ
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Footer Document */}
            <div className="pt-8 border-t border-slate-200 flex justify-between items-start text-xs text-slate-600">
              <p className="italic">Ghi chú: Cán bộ coi thi không giải thích gì thêm.</p>
              <div className="text-center">
                <p className="font-bold uppercase text-slate-800">TỔ TRƯỞNG CHUYÊN MÔN</p>
                <p className="italic text-slate-500 mt-0.5">(Ký và ghi rõ họ tên)</p>
                <div className="h-12"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL RA ĐỀ TÙY CHỌN THEO BÀI HỌC, MỨC ĐỘ VÀ HÌNH THỨC 7991 */}
      <CustomQuestionBuilderModal
        isOpen={isCustomBuilderOpen}
        onClose={() => setIsCustomBuilderOpen(false)}
        currentGrade={grade as GradeLevel}
        currentMatrixRows={matrixRows}
        currentSpecRows={specRows}
        currentExam={exam}
        onAddCustomQuestion={handleAddCustomQuestionFromModal}
      />
    </div>
  );
};
