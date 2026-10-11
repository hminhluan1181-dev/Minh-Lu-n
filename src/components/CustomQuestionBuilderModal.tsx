import React, { useState, useMemo } from 'react';
import { 
  X, 
  Sparkles, 
  Plus, 
  Check, 
  HelpCircle, 
  Sliders, 
  BookOpen, 
  Layers, 
  FileText,
  FlaskConical,
  Atom,
  Dna,
  Wrench,
  CheckCircle2,
  Trash2,
  Edit3
} from 'lucide-react';
import { 
  GradeLevel, 
  MultipleChoiceQuestion, 
  TrueFalseQuestion, 
  ShortAnswerQuestion, 
  EssayQuestion,
  MatrixRowItem,
  SpecSheetRow,
  Exam7991
} from '../types';
import { getAvailableLessonsForExam, LessonSelectionItem } from '../data/allCurriculumData';
import { 
  buildCustomMultipleChoiceQuestion, 
  buildCustomTrueFalseQuestion, 
  buildCustomShortAnswerQuestion, 
  buildCustomEssayQuestion 
} from '../utils/customQuestionEngine';

interface CustomQuestionBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGrade: GradeLevel;
  currentMatrixRows: MatrixRowItem[];
  currentSpecRows: SpecSheetRow[];
  currentExam?: Exam7991;
  onAddCustomQuestion: (params: {
    questionType: 'mc' | 'tf' | 'sa' | 'essay';
    questionData: MultipleChoiceQuestion | TrueFalseQuestion | ShortAnswerQuestion | EssayQuestion;
    targetLesson: LessonSelectionItem;
    level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng';
  }) => void;
}

export const CustomQuestionBuilderModal: React.FC<CustomQuestionBuilderModalProps> = ({
  isOpen,
  onClose,
  currentGrade,
  currentMatrixRows,
  currentSpecRows,
  currentExam,
  onAddCustomQuestion
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(currentGrade || 'Lớp 8');
  const [selectedDiscipline, setSelectedDiscipline] = useState<'Tất cả' | 'Hóa học' | 'Vật lí' | 'Sinh học' | 'Công nghệ'>('Tất cả');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  
  // Dạng câu hỏi (Chuẩn CV 7991)
  const [questionType, setQuestionType] = useState<'mc' | 'tf' | 'sa' | 'essay'>('mc');
  // Mức độ đánh giá
  const [level, setLevel] = useState<'Nhận biết' | 'Thông hiểu' | 'Vận dụng'>('Thông hiểu');
  
  // Yêu cầu ra đề riêng của người dùng
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [customExpectedAnswer, setCustomExpectedAnswer] = useState<string>('');

  // Xem trước & chỉnh sửa trực tiếp câu hỏi
  const [previewContent, setPreviewContent] = useState<string>('');
  const [previewOptions, setPreviewOptions] = useState<{ A: string; B: string; C: string; D: string }>({
    A: '', B: '', C: '', D: ''
  });
  const [previewCorrectMC, setPreviewCorrectMC] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [previewTfStatements, setPreviewTfStatements] = useState<Array<{ subId: 'a' | 'b' | 'c' | 'd'; text: string; isCorrect: boolean }>>([
    { subId: 'a', text: '', isCorrect: true },
    { subId: 'b', text: '', isCorrect: false },
    { subId: 'c', text: '', isCorrect: true },
    { subId: 'd', text: '', isCorrect: false }
  ]);
  const [previewExplanation, setPreviewExplanation] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Lấy danh sách các bài học khả dụng
  const lessons = useMemo(() => {
    return getAvailableLessonsForExam(selectedGrade, selectedDiscipline);
  }, [selectedGrade, selectedDiscipline]);

  // Tự động chọn bài đầu tiên khi danh sách thay đổi
  const activeLesson = useMemo(() => {
    if (lessons.length === 0) return null;
    const found = lessons.find(l => l.id === selectedLessonId);
    return found || lessons[0];
  }, [lessons, selectedLessonId]);

  // Hàm tạo câu hỏi mẫu
  const handleGeneratePreview = () => {
    if (!activeLesson) return;

    if (questionType === 'mc') {
      const q = buildCustomMultipleChoiceQuestion(activeLesson, level, customPrompt, 1);
      setPreviewContent(q.content);
      setPreviewOptions(q.options);
      setPreviewCorrectMC(q.correctAnswer);
      setPreviewExplanation(q.explanation);
    } else if (questionType === 'tf') {
      const q = buildCustomTrueFalseQuestion(activeLesson, level, customPrompt, 1);
      setPreviewContent(q.context);
      setPreviewTfStatements(q.statements.map(s => ({ subId: s.subId, text: s.text, isCorrect: s.isCorrect })));
      setPreviewExplanation('Barem: Đúng 1 ý = 0.1đ; Đúng 2 ý = 0.25đ; Đúng 3 ý = 0.5đ; Đúng 4 ý = 1.0đ.');
    } else if (questionType === 'sa') {
      const q = buildCustomShortAnswerQuestion(activeLesson, level === 'Nhận biết' ? 'Thông hiểu' : level, customPrompt, customExpectedAnswer, 1);
      setPreviewContent(q.content);
      setCustomExpectedAnswer(q.acceptableAnswers[0] || '');
      setPreviewExplanation(q.solutionGuide);
    } else {
      const q = buildCustomEssayQuestion(activeLesson, level === 'Nhận biết' ? 'Thông hiểu' : level, customPrompt, 1);
      setPreviewContent(q.content);
      setPreviewExplanation(`Tiêu chí chấm điểm: ${q.gradingCriteria.map(g => `${g.step}`).join(' | ')}`);
    }

    setToastMessage('Đã sinh nội dung câu hỏi mẫu chuẩn 7991! Thầy/Cô có thể chỉnh sửa trực tiếp bên dưới.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Khởi tạo preview khi mở modal hoặc thay đổi bài học
  React.useEffect(() => {
    if (isOpen && activeLesson) {
      handleGeneratePreview();
    }
  }, [isOpen, selectedLessonId, questionType, level]);

  if (!isOpen) return null;

  // Xử lý xác nhận thêm câu hỏi vào hệ thống
  const handleConfirmAdd = () => {
    if (!activeLesson) return;

    let finalQuestion: any;

    if (questionType === 'mc') {
      finalQuestion = {
        id: `custom-mc-${Date.now()}`,
        number: (currentExam?.partI_MultipleChoice.length || 0) + 1,
        content: previewContent,
        options: previewOptions,
        correctAnswer: previewCorrectMC,
        points: 0.25,
        level,
        topic: `${activeLesson.discipline} - Bài ${activeLesson.lessonNumber}: ${activeLesson.lessonName}`,
        explanation: previewExplanation,
        ragSource: {
          docName: activeLesson.docName,
          pageNumber: `Bài ${activeLesson.lessonNumber}`,
          relevanceScore: 99
        }
      };
    } else if (questionType === 'tf') {
      finalQuestion = {
        id: `custom-tf-${Date.now()}`,
        number: (currentExam?.partII_TrueFalse.length || 0) + 1,
        context: previewContent,
        statements: previewTfStatements.map(s => ({
          subId: s.subId,
          text: s.text,
          isCorrect: s.isCorrect,
          explanation: `Giải thích ý ${s.subId.toUpperCase()}`
        })),
        pointsTotal: 1.0,
        level,
        topic: `${activeLesson.discipline} - Bài ${activeLesson.lessonNumber}: ${activeLesson.lessonName}`,
        ragSource: {
          docName: activeLesson.docName,
          pageNumber: `Bài ${activeLesson.lessonNumber}`,
          relevanceScore: 99
        }
      };
    } else if (questionType === 'sa') {
      finalQuestion = {
        id: `custom-sa-${Date.now()}`,
        number: (currentExam?.partIII_ShortAnswer.length || 0) + 1,
        content: previewContent,
        acceptableAnswers: [customExpectedAnswer.trim() || '10', customExpectedAnswer.replace('.', ',')],
        points: 0.5,
        level: level === 'Nhận biết' ? 'Thông hiểu' : level,
        topic: `${activeLesson.discipline} - Bài ${activeLesson.lessonNumber}: ${activeLesson.lessonName}`,
        solutionGuide: previewExplanation,
        ragSource: {
          docName: activeLesson.docName,
          pageNumber: `Bài ${activeLesson.lessonNumber}`,
          relevanceScore: 99
        }
      };
    } else {
      finalQuestion = {
        id: `custom-essay-${Date.now()}`,
        number: (currentExam?.partIV_Essay.length || 0) + 1,
        content: previewContent,
        points: 1.5,
        level: level === 'Nhận biết' ? 'Thông hiểu' : level,
        topic: `${activeLesson.discipline} - Bài ${activeLesson.lessonNumber}: ${activeLesson.lessonName}`,
        gradingCriteria: [
          { step: 'Ý a (1.0đ): Nêu đúng nguyên lý, viết đúng công thức / PTHH.', points: 1.0 },
          { step: 'Ý b (0.5đ): Vận dụng tính toán chính xác hoặc liên hệ thực tế.', points: 0.5 }
        ],
        ragSource: {
          docName: activeLesson.docName,
          pageNumber: `Bài ${activeLesson.lessonNumber}`,
          relevanceScore: 99
        }
      };
    }

    onAddCustomQuestion({
      questionType,
      questionData: finalQuestion,
      targetLesson: activeLesson,
      level
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
        
        {/* HEADER */}
        <div className="p-4 md:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white flex items-center justify-between shrink-0 border-b border-indigo-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Sliders className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-mono">
                  Công văn 7991
                </span>
                <span className="text-xs text-indigo-200">Ra đề tùy chọn & đồng bộ Ma trận</span>
              </div>
              <h2 className="text-base md:text-lg font-bold text-white mt-0.5">
                Thiết Kế Câu Hỏi Tùy Chọn Theo Bài Học & Mức Độ
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TOAST NOTICE */}
        {toastMessage && (
          <div className="p-2.5 bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* BODY (SCROLLABLE) */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-5 flex-1 text-slate-900">
          
          {/* ZONE 1: BỘ LỌC CHỌN NỘI DUNG BÀI HỌC */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>1. Chọn nội dung bài học ra đề:</span>
              </span>
              <span className="text-xs text-indigo-600 font-semibold">
                Khối: {selectedGrade} · {selectedDiscipline}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Chọn khối lớp */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Khối lớp THCS:</label>
                <div className="grid grid-cols-4 gap-1 p-1 bg-white rounded-lg border border-slate-200">
                  {(['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'] as GradeLevel[]).map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        setSelectedGrade(g);
                        if (g !== 'Lớp 7' && selectedDiscipline === 'Công nghệ') {
                          setSelectedDiscipline('Tất cả');
                        }
                      }}
                      className={`py-1.5 text-xs font-bold rounded transition-all ${
                        selectedGrade === g 
                          ? (g === 'Lớp 8' || g === 'Lớp 9' ? 'bg-amber-400 text-slate-950 font-black shadow-2xs' : 'bg-indigo-600 text-white')
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chọn phân môn (Lí - Hóa - Sinh) */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Phân môn KHTN:</label>
                <div className="grid grid-cols-4 gap-1 p-1 bg-white rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setSelectedDiscipline('Tất cả')}
                    className={`py-1.5 text-[11px] font-bold rounded text-center transition-all ${
                      selectedDiscipline === 'Tất cả'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDiscipline('Vật lí')}
                    className={`py-1.5 text-[11px] font-bold rounded text-center flex items-center justify-center gap-1 transition-all ${
                      selectedDiscipline === 'Vật lí'
                        ? 'bg-sky-500 text-slate-950 font-black shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Atom className="w-3 h-3" />
                    <span>Lí</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDiscipline('Hóa học')}
                    className={`py-1.5 text-[11px] font-bold rounded text-center flex items-center justify-center gap-1 transition-all ${
                      selectedDiscipline === 'Hóa học'
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <FlaskConical className="w-3 h-3" />
                    <span>Hóa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDiscipline(selectedGrade === 'Lớp 7' ? 'Công nghệ' : 'Sinh học')}
                    className={`py-1.5 text-[11px] font-bold rounded text-center flex items-center justify-center gap-1 transition-all ${
                      selectedDiscipline === 'Sinh học' || selectedDiscipline === 'Công nghệ'
                        ? 'bg-purple-500 text-white font-black shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {selectedGrade === 'Lớp 7' ? <Wrench className="w-3 h-3" /> : <Dna className="w-3 h-3" />}
                    <span>{selectedGrade === 'Lớp 7' ? 'C.Nghệ' : 'Sinh'}</span>
                  </button>
                </div>
              </div>

              {/* Chọn bài học cụ thể */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Nội dung bài học SGK:</label>
                <select
                  value={activeLesson?.id || ''}
                  onChange={(e) => setSelectedLessonId(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-slate-800 truncate"
                >
                  {lessons.map(l => (
                    <option key={l.id} value={l.id}>
                      [{l.discipline}] Bài {l.lessonNumber}: {l.lessonName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {activeLesson && (
              <div className="p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-100 text-xs text-indigo-900 flex items-start gap-2">
                <span className="font-bold shrink-0 text-indigo-700">Chủ đề:</span>
                <span className="truncate">{activeLesson.chapterTitle} — {activeLesson.summary || activeLesson.keyPoints[0]}</span>
              </div>
            )}
          </div>

          {/* ZONE 2: CHỌN DẠNG CÂU HỎI & MỨC ĐỘ NHẬN THỨC THEO CV 7991 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 2. Dạng câu hỏi */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                2. Dạng câu hỏi (Chuẩn Công văn 7991):
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setQuestionType('mc')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    questionType === 'mc'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold ring-2 ring-indigo-400'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span>1. Nhiều Lựa Chọn</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-1 rounded font-mono">0.25đ</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">4 phương án (A, B, C, D)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setQuestionType('tf')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    questionType === 'tf'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold ring-2 ring-indigo-400'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span>2. Đúng / Sai</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded font-mono">1.0đ</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Ngữ liệu chung + 4 ý a,b,c,d</div>
                </button>

                <button
                  type="button"
                  onClick={() => setQuestionType('sa')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    questionType === 'sa'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold ring-2 ring-indigo-400'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span>3. Trả Lời Ngắn</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 rounded font-mono">0.5đ</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Điền số hoặc từ ngữ</div>
                </button>

                <button
                  type="button"
                  onClick={() => setQuestionType('essay')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    questionType === 'essay'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold ring-2 ring-indigo-400'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span>4. Tự Luận</span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 px-1 rounded font-mono">1.5đ</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Barem chấm từng bước</div>
                </button>
              </div>
            </div>

            {/* 3. Mức độ nhận thức */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                3. Yêu cầu mức độ nhận thức:
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setLevel('Nhận biết')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    level === 'Nhận biết'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-black ring-2 ring-emerald-400'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold">🟢 Nhận biết</div>
                  <div className="text-[10px] text-slate-500 mt-1">Định nghĩa, nhận diện</div>
                </button>

                <button
                  type="button"
                  onClick={() => setLevel('Thông hiểu')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    level === 'Thông hiểu'
                      ? 'border-amber-600 bg-amber-50 text-amber-950 font-black ring-2 ring-amber-400'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold">🟡 Thông hiểu</div>
                  <div className="text-[10px] text-slate-500 mt-1">Giải thích, cơ chế</div>
                </button>

                <button
                  type="button"
                  onClick={() => setLevel('Vận dụng')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    level === 'Vận dụng'
                      ? 'border-rose-600 bg-rose-50 text-rose-950 font-black ring-2 ring-rose-400'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold">🔴 Vận dụng</div>
                  <div className="text-[10px] text-slate-500 mt-1">Bài toán, thực tiễn</div>
                </button>
              </div>

              {/* Yêu cầu / Ghi chú đề bài riêng */}
              <div className="pt-2">
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Yêu cầu nội dung riêng (Tùy chọn):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="VD: Bài toán tính thể tích khí H2, công suất động cơ, ADN..."
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleGeneratePreview}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Sinh mẫu</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* ZONE 3: XEM TRƯỚC VÀ CHỈNH SỬA TRỰC TIẾP CÂU HỎI THEO FORM CHUẨN 7991 */}
          <div className="p-4 bg-white rounded-xl border-2 border-indigo-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Xem trước & Chỉnh sửa câu hỏi (Chuẩn CV 7991):
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                Mức độ: {level} · {questionType.toUpperCase()}
              </span>
            </div>

            {/* Nội dung câu hỏi */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Nội dung câu hỏi / Ngữ liệu dẫn:</label>
              <textarea
                value={previewContent}
                onChange={(e) => setPreviewContent(e.target.value)}
                rows={3}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>

            {/* Form chỉnh sửa theo từng Dạng câu hỏi */}
            {questionType === 'mc' && (
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-600 block">4 Phương án trả lời (Chọn nút tròn đáp án đúng):</label>
                {(['A', 'B', 'C', 'D'] as const).map(opt => (
                  <div key={opt} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewCorrectMC(opt)}
                      className={`w-7 h-7 rounded-lg text-xs font-black shrink-0 transition-all ${
                        previewCorrectMC === opt 
                          ? 'bg-emerald-600 text-white shadow-sm' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      title={`Chọn ${opt} là đáp án đúng`}
                    >
                      {opt}
                    </button>
                    <input
                      type="text"
                      value={previewOptions[opt]}
                      onChange={(e) => setPreviewOptions({ ...previewOptions, [opt]: e.target.value })}
                      className={`flex-1 p-2 text-xs border rounded-lg ${
                        previewCorrectMC === opt ? 'border-emerald-500 bg-emerald-50/40 font-medium' : 'border-slate-300 bg-white'
                      }`}
                    />
                  </div>
                ))}
              </div>
            )}

            {questionType === 'tf' && (
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-600 block">4 Ý khẳng định (Chọn nút Đúng hoặc Sai):</label>
                {previewTfStatements.map((stmt, idx) => (
                  <div key={stmt.subId} className="flex items-center gap-2">
                    <span className="w-6 text-xs font-bold text-indigo-700 uppercase shrink-0">
                      {stmt.subId})
                    </span>
                    <input
                      type="text"
                      value={stmt.text}
                      onChange={(e) => {
                        const updated = [...previewTfStatements];
                        updated[idx].text = e.target.value;
                        setPreviewTfStatements(updated);
                      }}
                      className="flex-1 p-2 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...previewTfStatements];
                          updated[idx].isCorrect = true;
                          setPreviewTfStatements(updated);
                        }}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                          stmt.isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Đúng
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...previewTfStatements];
                          updated[idx].isCorrect = false;
                          setPreviewTfStatements(updated);
                        }}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                          !stmt.isCorrect ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Sai
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {questionType === 'sa' && (
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-600 block">Đáp số / Thuật ngữ chính xác:</label>
                <input
                  type="text"
                  value={customExpectedAnswer}
                  onChange={(e) => setCustomExpectedAnswer(e.target.value)}
                  placeholder="VD: 7.437 hoặc 200..."
                  className="w-full p-2 text-xs font-bold text-emerald-800 bg-emerald-50/50 border border-emerald-300 rounded-lg"
                />
              </div>
            )}

            {/* Hướng dẫn giải / Barem */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Lời giải chi tiết & Barem chấm điểm:</label>
              <textarea
                value={previewExplanation}
                onChange={(e) => setPreviewExplanation(e.target.value)}
                rows={2}
                className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

          </div>

        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-600">
            <span>Sẽ tự động cập nhật: </span>
            <strong className="text-indigo-700">Ma trận (+1 câu)</strong> · <strong className="text-indigo-700">Bản đặc tả</strong> · <strong className="text-indigo-700">Đề kiểm tra</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Hủy bỏ
            </button>

            <button
              type="button"
              onClick={handleConfirmAdd}
              className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transform active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Thêm Vào Đề & Đồng Bộ Ma Trận</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
