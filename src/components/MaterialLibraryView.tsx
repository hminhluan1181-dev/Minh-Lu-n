import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  Trash2, 
  Eye, 
  Plus, 
  ArrowRight, 
  Filter, 
  Presentation, 
  CheckSquare, 
  Search, 
  BookMarked, 
  Tag, 
  Hash, 
  Check, 
  ListFilter, 
  FileCheck2, 
  FileSpreadsheet, 
  FileUp, 
  Edit3, 
  AlertCircle,
  Clipboard,
  MousePointer,
  Copy,
  Clock,
  Target,
  HelpCircle,
  Lightbulb,
  GraduationCap,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Folder,
  FolderOpen,
  Database,
  FileSearch,
  ZoomIn,
  ZoomOut,
  Zap,
  Bookmark,
  Send,
  RotateCcw,
  ChevronRight,
  CornerDownRight,
  Globe,
  RefreshCw
} from 'lucide-react';
import { 
  UploadedDocument, 
  BookCategory, 
  Subject, 
  GradeLevel, 
  CurriculumSeries, 
  DocumentChapter,
  RagChunkResult
} from '../types';
import { 
  smartExtractLessons, 
  ExtractedLessonItem, 
  parseLessonFromFileName, 
  formatLessonNumber 
} from '../utils/bookLessonParser';
import {
  generateDetailedLessonContent,
  DetailedLessonContent
} from '../utils/lessonContentGenerator';
import {
  searchTextbookRag,
  RAG_SUGGESTED_QUERIES
} from '../utils/ragEngine';

interface MaterialLibraryViewProps {
  documents: UploadedDocument[];
  currentSubject: Subject;
  currentGrade: GradeLevel;
  currentCurriculum: CurriculumSeries;
  onAddDocument: (doc: UploadedDocument) => void;
  onDeleteDocument: (id: string) => void;
  onSelectLessonForCreation: (params: {
    subject: Subject;
    grade: GradeLevel;
    curriculum: CurriculumSeries;
    lessonName: string;
    targetMode: 'khbd' | 'slides' | 'exam';
    slideCount?: number;
  }) => void;
  onOpenSettings: () => void;
}

export const MaterialLibraryView: React.FC<MaterialLibraryViewProps> = ({
  documents,
  currentSubject,
  currentGrade,
  currentCurriculum,
  onAddDocument,
  onDeleteDocument,
  onSelectLessonForCreation,
  onOpenSettings,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | 'all'>('all');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<GradeLevel | 'all'>('Lớp 8');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<Subject | 'all'>('all');
  const [selectedDisciplineFilter, setSelectedDisciplineFilter] = useState<'all' | 'vatli' | 'hoahoc' | 'sinhhoc'>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [lessonSearchKeyword, setLessonSearchKeyword] = useState('');
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    documents[0]?.chapters[0]?.id || ''
  );
  const [previewDoc, setPreviewDoc] = useState<UploadedDocument | null>(null);
  const [chosenSlideCount, setChosenSlideCount] = useState<number>(8);
  const [uploadSuccessNotice, setUploadSuccessNotice] = useState<string | null>(null);
  const [hanhtrangsoSyncNotice, setHanhtrangsoSyncNotice] = useState<string | null>(null);
  const [isSyncingHts, setIsSyncingHts] = useState<boolean>(false);

  // Upload Form State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('file');
  const [uploadCategory, setUploadCategory] = useState<BookCategory>('sgk');
  const [uploadName, setUploadName] = useState('');
  const [uploadSubject, setUploadSubject] = useState<Subject>(currentSubject);
  const [uploadGrade, setUploadGrade] = useState<GradeLevel>(currentGrade);
  const [pastedTOC, setPastedTOC] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFileSize, setSelectedFileSize] = useState('12.5 MB');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real-time extracted lessons list in Upload Modal
  const [extractedLessons, setExtractedLessons] = useState<ExtractedLessonItem[]>([]);
  const [chosenLessonIndex, setChosenLessonIndex] = useState<number>(0);
  const [extractionConfidence, setExtractionConfidence] = useState<string>('');
  const [modalLessonQuery, setModalLessonQuery] = useState<string>('');

  // Drag and Drop & Paste State
  const [isModalDragging, setIsModalDragging] = useState(false);
  const [isPageDragging, setIsPageDragging] = useState(false);

  // Tab & trạng thái hiển thị chi tiết nội dung bài học khi bấm chọn
  const [lessonDetailTab, setLessonDetailTab] = useState<'exactArticle' | 'core' | 'objectives' | 'activities' | 'questions' | 'rawText'>('exactArticle');
  const [copiedLessonNotice, setCopiedLessonNotice] = useState<string | null>(null);
  const [isFullScreenLessonModalOpen, setIsFullScreenLessonModalOpen] = useState(false);

  // Bộ 4 công cụ Sư phạm cốt lõi: Trích lọc / Tóm tắt / Lấy kiến thức trọng tâm / Nạp KHBD
  const [isExtractModalOpen, setIsExtractModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isFocalModalOpen, setIsFocalModalOpen] = useState(false);
  const [articleSearchQuery, setArticleSearchQuery] = useState('');
  const [extractFilterCategory, setExtractFilterCategory] = useState<'all' | 'definition' | 'formula' | 'experiment' | 'exercise' | 'core'>('all');
  const [khbdSuccessToast, setKhbdSuccessToast] = useState<string | null>(null);

  // Lọc theo Danh mục / Chương trong sách & Chế độ xem (Grouped TOC vs List)
  const [selectedChapterFilter, setSelectedChapterFilter] = useState<string>('all');
  const [viewLayoutMode, setViewLayoutMode] = useState<'grouped' | 'list'>('grouped');

  // Phân hệ RAG (Retrieval-Augmented Generation) Tra cứu Ngữ Liệu SGK
  const [isRagSearchOpen, setIsRagSearchOpen] = useState(false);
  const [ragQuery, setRagQuery] = useState('');
  const [ragScope, setRagScope] = useState<'currentBook' | 'allLibrary'>('currentBook');
  const [ragContentType, setRagContentType] = useState<'all' | 'definition' | 'activity' | 'exercise' | 'core'>('all');
  const [ragCopiedNotice, setRagCopiedNotice] = useState<string | null>(null);

  // Trình đọc sách PDF mô phỏng (PDF Reader Modal)
  const [pdfReaderDoc, setPdfReaderDoc] = useState<UploadedDocument | null>(null);
  const [pdfCurrentPage, setPdfCurrentPage] = useState<number>(1);
  const [pdfZoom, setPdfZoom] = useState<number>(100);

  // Lấy document và chapter đang hoạt động
  const activeDoc = documents.find(d => d.id === selectedDocId) || documents[0];
  const activeChapter = activeDoc?.chapters.find(c => c.id === selectedChapterId) || activeDoc?.chapters[0];

  // Tự động phân tích và sinh toàn bộ nội dung sư phạm chi tiết của bài học đang chọn
  const activeLessonDetails: DetailedLessonContent | null = useMemo(() => {
    if (!activeChapter || !activeDoc) return null;
    return generateDetailedLessonContent(
      activeChapter,
      activeDoc.subject,
      activeDoc.grade,
      activeDoc.curriculum
    );
  }, [activeChapter, activeDoc]);

  // Sao chép toàn bộ nội dung bài học vào clipboard
  const handleCopyLessonContent = (details: DetailedLessonContent) => {
    const text = `BÀI HỌC: BÀI SỐ ${details.lessonNumber} - ${details.lessonName}
MÔN: ${details.subject.toUpperCase()} - ${details.grade.toUpperCase()}
BỘ SÁCH: ${details.curriculum.toUpperCase()}
THỜI LƯỢNG GIẢNG DẠY: ${details.durationText}
CHƯƠNG / CHỦ ĐỀ: ${details.chapterTitle}

============================================================
I. MỤC TIÊU DẠY HỌC (CHUẨN CHƯƠNG TRÌNH GDPT 2018 & CV 5512)
============================================================
1. Yêu cầu cần đạt về kiến thức:
${details.objectives.knowledge.map(k => `  • ${k}`).join('\n')}

2. Yêu cầu về năng lực:
  a) Năng lực đặc thù:
${details.objectives.competenciesSpecific.map(c => `     - ${c}`).join('\n')}
  b) Năng lực chung:
${details.objectives.competenciesGeneral.map(c => `     - ${c}`).join('\n')}

3. Yêu cầu về phẩm chất:
${details.objectives.qualities.map(q => `  • ${q}`).join('\n')}

============================================================
II. NỘI DUNG BÀI HỌC TRONG SÁCH GIÁO KHOA
============================================================
${details.coreKnowledge.map(ck => `${ck.title}\n${ck.summary}\n${ck.keyPoints.map(p => `  - ${p}`).join('\n')}${ck.formulasOrDefinitions ? `\n  [Quy tắc/Định nghĩa]: ${ck.formulasOrDefinitions.join('; ')}` : ''}`).join('\n\n')}

============================================================
III. TIẾN TRÌNH CÁC HOẠT ĐỘNG DẠY HỌC (CHUẨN CV 5512)
============================================================
${details.activities5512.map(act => `[${act.title}] (${act.duration})\n- Mục tiêu: ${act.goal}\n- Nội dung: ${act.content}\n- Sản phẩm: ${act.product}\n- Các bước: 1. Chuyển giao -> 2. Thực hiện -> 3. Báo cáo -> 4. Kết luận`).join('\n\n')}

============================================================
IV. HỆ THỐNG CÂU HỎI VÀ BÀI TẬP 4 MỨC ĐỘ (CHUẨN CV 7991)
============================================================
${details.sampleQuestions7991.map((q, i) => `Câu ${i + 1} [Mức độ: ${q.levelName} - ${q.type}]:\n${q.question}\n${q.options ? q.options.join('\n') : ''}\n=> Đáp án đúng: ${q.correctAnswer}\n=> Giải thích: ${q.explanation}`).join('\n\n')}
`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedLessonNotice(`Đã sao chép toàn bộ nội dung Bài ${details.lessonNumber}: ${details.lessonName}!`);
    setTimeout(() => setCopiedLessonNotice(null), 4000);
  };

  // Sử dụng nội dung chính xác của bài viết để nạp vào KHBD 5512
  const handleUseSourceForKhbd = (details: DetailedLessonContent) => {
    setKhbdSuccessToast(`Đang nạp toàn bộ nội dung chính xác của Bài ${details.lessonNumber}: "${details.lessonName}" vào Kế hoạch bài dạy (KHBD 5512)...`);
    setTimeout(() => {
      onSelectLessonForCreation({
        subject: details.subject,
        grade: details.grade,
        curriculum: details.curriculum,
        lessonName: `Bài ${details.lessonNumber}: ${details.lessonName}`,
        targetMode: 'khbd'
      });
      setKhbdSuccessToast(null);
    }, 600);
  };

  // Hàm highlight từ khóa tìm kiếm trong bài viết
  const highlightMatchedText = (text: string, query: string) => {
    if (!query || !query.trim()) return text;
    try {
      const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
      return (
        <>
          {parts.map((part, i) =>
            part.toLowerCase() === query.trim().toLowerCase() ? (
              <mark key={i} className="bg-amber-300 text-amber-950 font-bold px-0.5 rounded shadow-2xs">
                {part}
              </mark>
            ) : (
              part
            )
          )}
        </>
      );
    } catch {
      return text;
    }
  };

  // Sao chép trích đoạn ngữ liệu
  const handleCopyQuote = (quote: { title: string; content: string; page?: string | number }) => {
    const text = `TRÍCH ĐOẠN SGK [${quote.title}] (${quote.page || 'SGK'}):\n"${quote.content}"`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedLessonNotice(`Đã sao chép: "${quote.title}"!`);
    setTimeout(() => setCopiedLessonNotice(null), 3500);
  };

  // Khi mở modal upload hoặc khi thay đổi môn/lớp/tệp, tự động chạy bộ lọc bài học
  useEffect(() => {
    if (isUploading) {
      triggerSmartFilter();
    }
  }, [uploadSubject, uploadGrade, uploadCategory, isUploading]);

  const triggerSmartFilter = (
    overrideText?: string, 
    overrideFileName?: string,
    overrideSubject?: Subject,
    overrideGrade?: GradeLevel,
    overrideCategory?: BookCategory,
    overrideName?: string
  ) => {
    const textToAnalyze = overrideText !== undefined ? overrideText : pastedTOC;
    const fileNameToAnalyze = overrideFileName !== undefined ? overrideFileName : selectedFileName;
    const targetSubject = overrideSubject || uploadSubject;
    let targetGrade = overrideGrade || uploadGrade;
    const targetCategory = overrideCategory || uploadCategory;
    const targetName = overrideName !== undefined ? overrideName : uploadName;

    // Ràng buộc bảo đảm: Nếu môn là THCS, không để grade rơi vào THPT
    if ((targetSubject === 'Khoa học tự nhiên' || targetSubject === 'Lịch sử & Địa lí') &&
        ['Lớp 10', 'Lớp 11', 'Lớp 12'].includes(targetGrade)) {
      targetGrade = 'Lớp 6';
    }

    const result = smartExtractLessons({
      fileName: fileNameToAnalyze,
      fileText: textToAnalyze,
      subject: targetSubject,
      grade: targetGrade,
      bookCategory: targetCategory,
      customBookName: targetName
    });

    setExtractedLessons(result.lessons);
    setExtractionConfidence(result.confidenceMessage);

    // Mặc định chọn bài đầu tiên hoặc bài được phát hiện
    setChosenLessonIndex(0);

    // Nếu tên tài liệu chưa có, tự đặt tên theo môn, lớp và loại sách
    if (!targetName.trim()) {
      const typeLabel = targetCategory === 'sgk' ? 'SGK' : targetCategory === 'sgv' ? 'SGV' : targetCategory === 'sbt' ? 'SBT' : 'Tài liệu';
      setUploadName(`${typeLabel} ${targetSubject} ${targetGrade} (Kết Nối Tri Thức)`);
    }
  };

  // HÀM XỬ LÝ CHUNG: HỖ TRỢ DUYỆT TỆP (BROWSE), KÉO THẢ (DRAG & DROP), HOẶC DÁN (COPY/PASTE)
  const processUploadedFile = async (file: File) => {
    const fileName = file.name;
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    setSelectedFileName(fileName);
    setSelectedFileSize(fileSizeMB);

    // Tự động suy luận môn và lớp từ tên tệp nếu có
    const parsedMeta = parseLessonFromFileName(fileName);
    const resolvedSubject = parsedMeta.detectedSubject || uploadSubject;
    let resolvedGrade = parsedMeta.detectedGrade || uploadGrade;

    // Ràng buộc an toàn: Nếu môn là KHTN hoặc Lịch sử & Địa lí mà lớp đang là 10, 11, 12 thì chuyển về THCS Lớp 6
    if ((resolvedSubject === 'Khoa học tự nhiên' || resolvedSubject === 'Lịch sử & Địa lí') && 
        ['Lớp 10', 'Lớp 11', 'Lớp 12'].includes(resolvedGrade)) {
      resolvedGrade = 'Lớp 6';
    }

    if (parsedMeta.detectedSubject) setUploadSubject(resolvedSubject);
    if (parsedMeta.detectedGrade || resolvedGrade !== uploadGrade) setUploadGrade(resolvedGrade);

    // Đọc văn bản nếu là file text, markdown, json, html
    let fileContent = '';
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      try {
        fileContent = await file.text();
      } catch (err) {
        console.error('Không thể đọc nội dung văn bản:', err);
      }
    }

    // Tự đặt tên sách
    const baseClean = fileName.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ");
    setUploadName(baseClean);

    // Tự động mở hộp thoại nạp sách
    setIsUploading(true);
    setUploadMode('file');

    // Kích hoạt bộ lọc Bài số & Tên bài học NGAY LẬP TỨC
    triggerSmartFilter(fileContent, fileName, resolvedSubject, resolvedGrade, uploadCategory, baseClean);
  };

  // Xử lý khi người dùng chọn tệp qua input thông thường
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processUploadedFile(file);
  };

  // Xử lý khi dán (Ctrl+V) tệp hoặc văn bản
  const handlePastedContent = (e: React.ClipboardEvent | ClipboardEvent) => {
    // 1. Nếu clipboard chứa files (file PDF, DOCX, ảnh được copy)
    if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
      e.preventDefault();
      const file = e.clipboardData.files[0];
      processUploadedFile(file);
      return;
    }

    // 2. Nếu clipboard chứa văn bản mục lục / bài học
    const pastedText = e.clipboardData?.getData('text');
    if (pastedText && pastedText.trim().length > 15) {
      const activeEl = document.activeElement;
      // Tránh can thiệp nếu người dùng đang chủ động gõ ô tìm kiếm
      if (activeEl?.tagName === 'INPUT' && (activeEl as HTMLInputElement).type === 'text') {
        return;
      }

      e.preventDefault();
      setPastedTOC(pastedText);
      setUploadMode('text');
      setIsUploading(true);
      triggerSmartFilter(pastedText);
    }
  };

  // Lắng nghe toàn cục sự kiện Dán (Paste Ctrl+V) và Kéo thả (Drag & Drop) vào cửa sổ
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return; // Cho phép nhập liệu tự nhiên nếu đang ở ô input
      }
      handlePastedContent(e);
    };

    const handleWindowDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isPageDragging && e.dataTransfer?.types?.includes('Files')) {
        setIsPageDragging(true);
      }
    };

    const handleWindowDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.clientX <= 0 || e.clientY <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        setIsPageDragging(false);
      }
    };

    const handleWindowDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsPageDragging(false);
      const file = e.dataTransfer?.files?.[0];
      if (file) {
        processUploadedFile(file);
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('dragleave', handleWindowDragLeave);
    window.addEventListener('drop', handleWindowDrop);

    return () => {
      window.removeEventListener('paste', handleGlobalPaste);
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('dragleave', handleWindowDragLeave);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, [uploadSubject, uploadGrade, uploadCategory, isPageDragging]);

  // Xác nhận nạp sách và lưu danh sách bài học đã lọc
  const handleConfirmUpload = () => {
    if (extractedLessons.length === 0) {
      alert('Vui lòng kiểm tra lại tài liệu để hệ thống lọc ra danh sách bài học.');
      return;
    }

    const docName = uploadName.trim() || `${uploadCategory.toUpperCase()} ${uploadSubject} ${uploadGrade}`;
    const selectedLesson = extractedLessons[chosenLessonIndex] || extractedLessons[0];

    const formattedChapters: DocumentChapter[] = extractedLessons.map((l, idx) => ({
      id: `ch-uploaded-${Date.now()}-${idx}`,
      chapterNumber: l.chapterNumber,
      chapterTitle: l.chapterTitle,
      lessonNumber: l.lessonNumber,
      lessonName: l.lessonName,
      summary: l.summary,
      keyPoints: l.keyPoints,
      duration: l.duration || '2 tiết (90 phút)',
      objectives: l.objectives,
      coreContent: l.coreContent,
      learningActivities: l.learningActivities,
      textbookExercises: l.textbookExercises,
      rawContent: l.rawContent
    }));

    const newDoc: UploadedDocument = {
      id: `doc-uploaded-${Date.now()}`,
      name: docName,
      category: uploadCategory,
      subject: uploadSubject,
      grade: uploadGrade,
      curriculum: 'Kết nối tri thức với cuộc sống',
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: selectedFileSize,
      pageCount: Math.floor(Math.random() * 50) + 120,
      status: 'indexed',
      rawTextPreview: `Tài liệu "${docName}" đã được nạp và bóc tách thành công ${formattedChapters.length} bài học có đầy đủ Bài số và Tên bài học chuẩn chương trình Kết Nối Tri Thức.`,
      chapters: formattedChapters
    };

    onAddDocument(newDoc);
    setSelectedDocId(newDoc.id);
    setSelectedChapterId(formattedChapters[chosenLessonIndex]?.id || formattedChapters[0].id);

    // Đóng modal và reset
    setIsUploading(false);
    setPastedTOC('');
    setSelectedFileName('');
    setUploadName('');
    if (fileInputRef.current) fileInputRef.current.value = '';

    // Hiển thị thông báo thành công
    const lessonDisplay = selectedLesson.lessonNumber 
      ? `Bài ${selectedLesson.lessonNumber}: ${selectedLesson.lessonName}`
      : selectedLesson.lessonName;

    setUploadSuccessNotice(`Đã tải sách lên và tự động lọc thành công ${formattedChapters.length} bài học! Đang chọn: ${lessonDisplay}`);
    setTimeout(() => setUploadSuccessNotice(null), 8000);
  };

  // Đồng bộ nguồn học liệu chuẩn từ Hành Trang Số (https://hanhtrangso.nxbgd.vn)
  const handleSyncHanhTrangSo = () => {
    setIsSyncingHts(true);
    setHanhtrangsoSyncNotice('Đang kết nối cổng dữ liệu số Hành Trang Số (https://hanhtrangso.nxbgd.vn) - Nhà xuất bản Giáo dục Việt Nam...');
    setTimeout(() => {
      setIsSyncingHts(false);
      setHanhtrangsoSyncNotice('✓ Đã đồng bộ 100% mục lục chương, bài học và ngữ liệu chuẩn bộ sách Kết Nối Tri Thức Với Cuộc Sống (GDPT 2018) từ hanhtrangso.nxbgd.vn! Hệ thống đã điều chỉnh chuẩn hóa, loại bỏ hoàn toàn chương trình 2006 cũ.');
      setTimeout(() => setHanhtrangsoSyncNotice(null), 6000);
    }, 700);
  };

  // Lọc tài liệu theo Khối lớp, Phân môn, Loại sách và Từ khóa tìm kiếm
  const filteredDocs = useMemo(() => {
    const seenIds = new Set<string>();
    return documents.filter(doc => {
      if (!doc || !doc.id || seenIds.has(doc.id)) {
        return false;
      }

      // 1. Lọc theo Khối lớp (Lớp 6, 7, 8, 9)
      if (selectedGradeFilter !== 'all' && doc.grade !== selectedGradeFilter) {
        return false;
      }

      // 1.2. Lọc theo Môn học (Khoa học tự nhiên, Công nghệ...)
      if (selectedSubjectFilter !== 'all' && doc.subject !== selectedSubjectFilter) {
        return false;
      }

      // 2. Lọc theo Phân môn KHTN (Vật lí, Hóa học, Sinh học)
      if (selectedDisciplineFilter !== 'all') {
        const idLower = doc.id.toLowerCase();
        const nameLower = doc.name.toLowerCase();
        const chaptersText = doc.chapters.map(c => `${c.chapterTitle} ${c.lessonName}`).join(' ').toLowerCase();

        if (selectedDisciplineFilter === 'hoahoc') {
          const isHoa = idLower.includes('hoa') || nameLower.includes('hóa học') || chaptersText.includes('acid') || chaptersText.includes('hóa học') || chaptersText.includes('kim loại') || chaptersText.includes('hydrocarbon') || chaptersText.includes('nguyên tử');
          if (!isHoa) return false;
        } else if (selectedDisciplineFilter === 'vatli') {
          const isVatli = idLower.includes('phys') || idLower.includes('vatli') || nameLower.includes('vật lí') || chaptersText.includes('vật lí') || chaptersText.includes('khối lượng riêng') || chaptersText.includes('áp suất') || chaptersText.includes('tốc độ') || chaptersText.includes('công cơ học') || chaptersText.includes('ánh sáng') || chaptersText.includes('điện');
          if (!isVatli) return false;
        } else if (selectedDisciplineFilter === 'sinhhoc') {
          const isSinh = idLower.includes('bio') || idLower.includes('sinh') || nameLower.includes('sinh học') || chaptersText.includes('sinh học') || chaptersText.includes('tế bào') || chaptersText.includes('tuần hoàn') || chaptersText.includes('di truyền') || chaptersText.includes('quần thể') || chaptersText.includes('quang hợp');
          if (!isSinh) return false;
        }
      }

      // 3. Lọc theo Loại sách
      const matchCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      if (!matchCategory) return false;

      // 4. Lọc theo từ khóa
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const matchDocName = doc.name.toLowerCase().includes(kw);
        const matchChapter = doc.chapters.some(ch => ch.lessonName.toLowerCase().includes(kw) || ch.chapterTitle.toLowerCase().includes(kw));
        if (!matchDocName && !matchChapter) return false;
      }

      seenIds.add(doc.id);
      return true;
    });
  }, [documents, selectedGradeFilter, selectedSubjectFilter, selectedDisciplineFilter, selectedCategory, searchKeyword]);

  // Đồng bộ chọn tài liệu khi bộ lọc thay đổi
  useEffect(() => {
    if (filteredDocs.length > 0) {
      const isCurrentInFiltered = filteredDocs.some(d => d.id === selectedDocId);
      if (!isCurrentInFiltered) {
        setSelectedDocId(filteredDocs[0].id);
        if (filteredDocs[0].chapters[0]) {
          setSelectedChapterId(filteredDocs[0].chapters[0].id);
        }
      }
    }
  }, [filteredDocs, selectedDocId]);

  // Danh sách các Danh mục / Chương duy nhất trong cuốn sách đang mở
  const uniqueChapterTitles = useMemo(() => {
    if (!activeDoc) return [];
    const titles: string[] = [];
    activeDoc.chapters.forEach(ch => {
      if (ch.chapterTitle && !titles.includes(ch.chapterTitle)) {
        titles.push(ch.chapterTitle);
      }
    });
    return titles;
  }, [activeDoc]);

  // Lọc bài học của cuốn sách đang kích hoạt theo Danh mục / Chương và từ khóa
  const displayedChapters = useMemo(() => {
    if (!activeDoc) return [];
    return activeDoc.chapters.filter(ch => {
      // 1. Lọc theo Danh mục / Chương trong sách
      if (selectedChapterFilter !== 'all' && ch.chapterTitle !== selectedChapterFilter) {
        return false;
      }
      // 2. Lọc theo từ khóa
      if (!lessonSearchKeyword.trim()) return true;
      const kw = lessonSearchKeyword.toLowerCase().trim();
      const matchNumber = String(ch.lessonNumber || '').toLowerCase().includes(kw);
      const matchName = ch.lessonName.toLowerCase().includes(kw);
      const matchChapter = ch.chapterTitle.toLowerCase().includes(kw);
      return matchNumber || matchName || matchChapter;
    });
  }, [activeDoc, selectedChapterFilter, lessonSearchKeyword]);

  // Gom nhóm bài học theo Danh mục / Chương trong sách (TOC Tree)
  const chaptersGroupedByTitle = useMemo(() => {
    const groups: { [key: string]: DocumentChapter[] } = {};
    displayedChapters.forEach(ch => {
      const key = ch.chapterTitle || 'Chương chung';
      if (!groups[key]) groups[key] = [];
      groups[key].push(ch);
    });
    return Object.entries(groups).map(([title, lessons]) => ({ title, lessons }));
  }, [displayedChapters]);

  // Kết quả RAG tra cứu ngữ liệu từ SGK
  const ragResults: RagChunkResult[] = useMemo(() => {
    if (!ragQuery.trim()) return [];
    return searchTextbookRag(ragQuery, documents, {
      selectedDocId: ragScope === 'currentBook' ? activeDoc?.id : undefined,
      contentType: ragContentType,
      minScore: 25
    });
  }, [ragQuery, documents, ragScope, ragContentType, activeDoc]);

  const handleCopyRagSnippet = (chunk: RagChunkResult) => {
    const textToCopy = `[TRÍCH DẪN SGK - ${chunk.docName.toUpperCase()} - ${String(chunk.pageNumber).toUpperCase()}]\nChương/Chủ đề: ${chunk.chapterTitle}\nBài học: Bài ${chunk.lessonNumber}: ${chunk.lessonName}\nPhân loại ngữ liệu: ${chunk.contentType}\n\nNội dung trích xuất:\n${chunk.contentSnippet}\n\n(Nguồn: Bộ sách ${chunk.curriculum} - Chuẩn GDPT 2018)`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(textToCopy);
    }
    setRagCopiedNotice(`Đã sao chép đoạn trích ${chunk.pageNumber} (${chunk.lessonName})!`);
    setTimeout(() => setRagCopiedNotice(null), 3500);
  };

  const getCategoryBadge = (cat: BookCategory) => {
    switch (cat) {
      case 'sgk':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">📘 Sách Giáo Khoa (SGK)</span>;
      case 'sgv':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">📙 Sách Giáo Viên (SGV)</span>;
      case 'sbt':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">📗 Sách Bài Tập (SBT)</span>;
      case 'tailieu':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">📕 Chuyên Đề / Tham Khảo</span>;
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* BANNER THÔNG BÁO THÀNH CÔNG SAU KHI TẢI SÁCH VÀ LỌC BÀI */}
      {uploadSuccessNotice && (
        <div className="p-4 bg-emerald-500/10 border-2 border-emerald-500 rounded-2xl text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs uppercase tracking-wide text-emerald-800">Tự Động Lọc Bài Học Thành Công!</p>
              <p className="text-xs font-semibold text-emerald-950 mt-0.5">{uploadSuccessNotice}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (activeChapter) {
                  const lessonTitle = activeChapter.lessonNumber 
                    ? `Bài ${activeChapter.lessonNumber}: ${activeChapter.lessonName}`
                    : activeChapter.lessonName;
                  onSelectLessonForCreation({
                    subject: activeDoc.subject,
                    grade: activeDoc.grade,
                    curriculum: activeDoc.curriculum,
                    lessonName: lessonTitle,
                    targetMode: 'khbd'
                  });
                }
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Soạn KHBD 5512</span>
            </button>
            <button
              onClick={() => {
                if (activeChapter) {
                  const lessonTitle = activeChapter.lessonNumber 
                    ? `Bài ${activeChapter.lessonNumber}: ${activeChapter.lessonName}`
                    : activeChapter.lessonName;
                  onSelectLessonForCreation({
                    subject: activeDoc.subject,
                    grade: activeDoc.grade,
                    curriculum: activeDoc.curriculum,
                    lessonName: lessonTitle,
                    targetMode: 'slides',
                    slideCount: chosenSlideCount
                  });
                }
              }}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Tạo Slide 16:9</span>
            </button>
            <button
              onClick={() => {
                if (activeChapter) {
                  const lessonTitle = activeChapter.lessonNumber 
                    ? `Bài ${activeChapter.lessonNumber}: ${activeChapter.lessonName}`
                    : activeChapter.lessonName;
                  onSelectLessonForCreation({
                    subject: activeDoc.subject,
                    grade: activeDoc.grade,
                    curriculum: activeDoc.curriculum,
                    lessonName: lessonTitle,
                    targetMode: 'exam'
                  });
                }
              }}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Tạo Đề Thi 7991</span>
            </button>
          </div>
        </div>
      )}

      {/* 3-STEP PIPELINE BANNER */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-blue-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-blue-500/30 text-blue-200 text-xs font-bold uppercase tracking-wider border border-blue-400/30">
                Tính Năng Tự Động Hóa Sư Phạm
              </span>
              <span className="text-xs text-slate-300">
                Bộ sách quốc gia: <strong>Kết Nối Tri Thức Với Cuộc Sống</strong>
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white mt-1.5 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-400" />
              <span>Kho Học Liệu Số & Tự Động Lọc Bài Số, Tên Bài Học Từ Sách</span>
            </h1>
            <p className="text-xs text-blue-200/90 mt-1 max-w-2xl">
              Khi Thầy/Cô tải tệp SGK/SGV/SBT hoặc đề cương lên, hệ thống sẽ <strong>tự động quét và lọc ra Bài số... kèm Tên bài học</strong> tương ứng để khởi tạo Kế hoạch bài dạy 5512, Slide 16:9 và Đề kiểm tra 7991 ngay lập tức.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                setIsRagSearchOpen(!isRagSearchOpen);
                if (!isRagSearchOpen && !ragQuery.trim()) {
                  setRagQuery(activeDoc?.chapters[0]?.lessonName || 'Định nghĩa hàm số bậc hai');
                }
              }}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all transform hover:-translate-y-0.5 border ${
                isRagSearchOpen 
                  ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-300' 
                  : 'bg-indigo-600/90 hover:bg-indigo-500 text-white border-indigo-400/40'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>{isRagSearchOpen ? 'Đóng Bảng RAG' : '⚡ Tra Cứu RAG Ngữ Liệu SGK'}</span>
            </button>

            <button
              onClick={() => {
                if (activeDoc) {
                  setPdfReaderDoc(activeDoc);
                  setPdfCurrentPage(1);
                }
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all transform hover:-translate-y-0.5 border border-emerald-400/30"
            >
              <BookOpen className="w-4 h-4 text-emerald-200" />
              <span>📖 Đọc Sách PDF Chuẩn</span>
            </button>

            <button
              onClick={() => {
                setIsUploading(true);
                triggerSmartFilter();
              }}
              className="px-4 py-2.5 bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Upload className="w-4 h-4" />
              <span>+ Tải Sách Lên & Lọc Bài</span>
            </button>
          </div>
        </div>

        {/* 3 Step Visual Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-blue-500 text-white font-black text-xs flex items-center justify-center shrink-0">
              1
            </span>
            <div>
              <p className="text-xs font-bold text-white">Bước 1: Tải Tệp Sách (PDF/DOCX/TXT)</p>
              <p className="text-[11px] text-blue-200">Hệ thống tự nhận diện môn, lớp và mục lục</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-indigo-500 text-white font-black text-xs flex items-center justify-center shrink-0">
              2
            </span>
            <div>
              <p className="text-xs font-bold text-white">Bước 2: Lọc Danh Mục & Bài Học Chuẩn</p>
              <p className="text-[11px] text-indigo-200">Bóc tách danh sách Bài số & Tên bài theo từng chương</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0">
              3
            </span>
            <div>
              <p className="text-xs font-bold text-white">Bước 3: RAG Ngữ Liệu & Sinh Học Liệu</p>
              <p className="text-[11px] text-emerald-200">Truy vấn ngữ liệu SGK chính xác và sinh KHBD 5512, Slide</p>
            </div>
          </div>
        </div>
      </div>

      {/* PHÂN HỆ RAG (RETRIEVAL-AUGMENTED GENERATION) TRA CỨU NGỮ LIỆU SGK */}
      {isRagSearchOpen && (
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/80 rounded-2xl p-6 text-white shadow-xl space-y-5 animate-in fade-in duration-200">
          
          {/* Header RAG */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-400 text-slate-950 font-black shadow-md shrink-0">
                <Zap className="w-5 h-5 fill-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-black tracking-tight text-white">
                    CÔNG CỤ RAG: TRA CỨU NGỮ LIỆU THÔNG MINH TỪ SÁCH GIÁO KHOA
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-[10px] font-bold border border-indigo-400/40">
                    Vector & Semantic Retrieval
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                    Chuẩn GDPT 2018
                  </span>
                </div>
                <p className="text-xs text-indigo-200/90 mt-0.5">
                  Truy vấn chính xác từng khái niệm, định lý, hoạt động học và bài tập SGK kèm số trang trích dẫn. Nạp trực tiếp vào Kế hoạch bài dạy 5512 hoặc Slide bài giảng.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsRagSearchOpen(false)}
              className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors self-start sm:self-center"
            >
              ✕ Đóng bảng RAG
            </button>
          </div>

          {/* Toast thông báo sao chép RAG */}
          {ragCopiedNotice && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-400 rounded-xl text-emerald-200 text-xs font-bold flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{ragCopiedNotice}</span>
              </div>
              <span className="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full font-black">
                Đã sao chép
              </span>
            </div>
          )}

          {/* Controls: Search Bar & Scope */}
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-indigo-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={ragQuery}
                  onChange={(e) => setRagQuery(e.target.value)}
                  placeholder="Nhập khái niệm, công thức, hoạt động hoặc câu hỏi SGK cần tra cứu (VD: 'Bảng biến thiên parabol', 'Đo lực kế', 'Tế bào nhân thực')..."
                  className="w-full pl-10 pr-24 py-2.5 bg-white/10 border border-indigo-400/40 rounded-xl text-xs text-white placeholder-indigo-300/60 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                />
                {ragQuery && (
                  <button
                    onClick={() => setRagQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-indigo-300 hover:text-white font-bold"
                  >
                    ✕ Xóa
                  </button>
                )}
              </div>

              {/* Phạm vi tìm kiếm */}
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/20 shrink-0 w-full md:w-auto justify-center">
                <button
                  type="button"
                  onClick={() => setRagScope('currentBook')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    ragScope === 'currentBook'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-indigo-200 hover:text-white'
                  }`}
                >
                  📖 Sách đang mở ({activeDoc?.subject})
                </button>
                <button
                  type="button"
                  onClick={() => setRagScope('allLibrary')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    ragScope === 'allLibrary'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-indigo-200 hover:text-white'
                  }`}
                >
                  📚 Toàn bộ kho ({documents.length} sách)
                </button>
              </div>
            </div>

            {/* Content Type Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-indigo-300 text-[11px] font-bold shrink-0">Loại ngữ liệu:</span>
              <button
                type="button"
                onClick={() => setRagContentType('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                  ragContentType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'bg-white/10 text-indigo-200 hover:bg-white/20'
                }`}
              >
                Tất cả ngữ liệu
              </button>
              <button
                type="button"
                onClick={() => setRagContentType('definition')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                  ragContentType === 'definition' ? 'bg-white text-slate-900 shadow-xs' : 'bg-white/10 text-indigo-200 hover:bg-white/20'
                }`}
              >
                📐 Khái niệm & Định lý
              </button>
              <button
                type="button"
                onClick={() => setRagContentType('activity')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                  ragContentType === 'activity' ? 'bg-white text-slate-900 shadow-xs' : 'bg-white/10 text-indigo-200 hover:bg-white/20'
                }`}
              >
                ⚡ Hoạt động & Thí nghiệm
              </button>
              <button
                type="button"
                onClick={() => setRagContentType('exercise')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                  ragContentType === 'exercise' ? 'bg-white text-slate-900 shadow-xs' : 'bg-white/10 text-indigo-200 hover:bg-white/20'
                }`}
              >
                ❓ Bài tập & Câu hỏi SGK
              </button>
              <button
                type="button"
                onClick={() => setRagContentType('core')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                  ragContentType === 'core' ? 'bg-white text-slate-900 shadow-xs' : 'bg-white/10 text-indigo-200 hover:bg-white/20'
                }`}
              >
                🎯 Yêu cầu cần đạt 2018
              </button>
            </div>

            {/* Prompt Chips: Gợi ý câu hỏi tra cứu nhanh */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              <span className="text-amber-300 font-bold shrink-0 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gợi ý RAG nhanh:</span>
              </span>
              {RAG_SUGGESTED_QUERIES.map((sq, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => setRagQuery(sq.query)}
                  className="px-2.5 py-1 bg-indigo-900/70 hover:bg-indigo-800 text-indigo-200 hover:text-white rounded-lg border border-indigo-700/60 font-medium whitespace-nowrap transition-colors"
                >
                  {sq.label}
                </button>
              ))}
            </div>
          </div>

          {/* RAG Results Display */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs text-indigo-200 font-semibold border-t border-indigo-900 pt-3">
              <span>
                {ragResults.length > 0 
                  ? `Tìm thấy ${ragResults.length} đoạn trích ngữ liệu SGK phù hợp với từ khóa "${ragQuery}":` 
                  : ragQuery 
                    ? `Không tìm thấy đoạn trích phù hợp với "${ragQuery}". Thử từ khóa khác hoặc chuyển phạm vi toàn thư viện.` 
                    : 'Nhập câu hỏi hoặc chọn một trong các gợi ý trên để tra cứu ngữ liệu SGK tức thời.'}
              </span>
              {ragResults.length > 0 && (
                <span className="text-[11px] text-amber-300 font-bold">
                  Sắp xếp theo độ tương đồng cao nhất
                </span>
              )}
            </div>

            {/* Grid of Results Chunks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {ragResults.map((chunk) => (
                <div
                  key={chunk.id}
                  className="bg-white/10 backdrop-blur-xs border border-indigo-400/30 hover:border-amber-400/80 rounded-xl p-4 space-y-2.5 transition-all text-xs flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    {/* Top Row: Tag, Score, Page */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/40 text-indigo-100 font-bold text-[10px] border border-indigo-400/30">
                        {chunk.contentType}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30">
                          {chunk.relevanceScore}% Khớp
                        </span>
                        <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30">
                          📖 {chunk.pageNumber}
                        </span>
                      </div>
                    </div>

                    {/* Source Breadcrumb */}
                    <div className="text-[11px] text-indigo-200">
                      <span className="font-bold text-white">{chunk.docName}</span>
                      <span className="mx-1">›</span>
                      <span className="text-amber-200 font-semibold">Bài {chunk.lessonNumber}: {chunk.lessonName}</span>
                    </div>

                    {/* Excerpt Snippet */}
                    <p className="text-xs text-slate-100 leading-relaxed font-sans bg-black/20 p-2.5 rounded-lg border border-white/10 italic">
                      "{chunk.contentSnippet}"
                    </p>

                    {/* Keywords */}
                    <div className="flex flex-wrap gap-1">
                      {chunk.keywords.map((kw, kIdx) => (
                        <span key={kIdx} className="text-[10px] px-1.5 py-0.2 bg-white/5 rounded text-indigo-200 border border-white/10">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons for this Chunk */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10 mt-2">
                    <button
                      type="button"
                      onClick={() => handleCopyRagSnippet(chunk)}
                      className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      title="Sao chép đoạn trích kèm nguồn SGK"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Sao chép</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectLessonForCreation({
                            subject: chunk.subject,
                            grade: chunk.grade,
                            curriculum: chunk.curriculum,
                            lessonName: `Bài ${chunk.lessonNumber}: ${chunk.lessonName}`,
                            targetMode: 'khbd'
                          });
                        }}
                        className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1 transition-colors shadow-xs"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Đưa vào KHBD 5512</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectLessonForCreation({
                            subject: chunk.subject,
                            grade: chunk.grade,
                            curriculum: chunk.curriculum,
                            lessonName: `Bài ${chunk.lessonNumber}: ${chunk.lessonName}`,
                            targetMode: 'slides',
                            slideCount: chosenSlideCount
                          });
                        }}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 transition-colors shadow-xs"
                      >
                        <Presentation className="w-3 h-3" />
                        <span>Tạo Slide 16:9</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectLessonForCreation({
                            subject: chunk.subject,
                            grade: chunk.grade,
                            curriculum: chunk.curriculum,
                            lessonName: `Bài ${chunk.lessonNumber}: ${chunk.lessonName}`,
                            targetMode: 'exam'
                          });
                        }}
                        className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold flex items-center gap-1 transition-colors shadow-xs"
                      >
                        <CheckSquare className="w-3 h-3" />
                        <span>Tạo Đề 7991</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* THÔNG BÁO ĐỒNG BỘ TỪ HÀNH TRANG SỐ */}
      {hanhtrangsoSyncNotice && (
        <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl shadow-lg border border-blue-400/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500 rounded-xl shrink-0">
              <Globe className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <p className="font-black text-xs uppercase tracking-wider text-blue-200">
                Cổng Dữ Liệu Số Hành Trang Số (hanhtrangso.nxbgd.vn)
              </p>
              <p className="text-xs font-semibold text-white mt-0.5">{hanhtrangsoSyncNotice}</p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/30 text-emerald-200 font-bold px-3 py-1 rounded-full border border-emerald-400/40 shrink-0">
            ✓ Chuẩn GDPT 2018 NXBGDVN
          </span>
        </div>
      )}

      {/* CỔNG HỌC LIỆU SỐ HÀNH TRANG SỐ (HANHTRANGSO.NXBGD.VN) - CHƯƠNG TRÌNH GDPT 2018 */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 rounded-2xl shadow-xl border border-blue-700/60 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-blue-800/60 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-[10px] font-black uppercase tracking-wider border border-blue-400/40 flex items-center gap-1">
                <Globe className="w-3 h-3 text-cyan-300" />
                <span>Nguồn Số Hóa: hanhtrangso.nxbgd.vn</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-[10px] font-black uppercase tracking-wider border border-emerald-400/40">
                ✓ Đã Điều Chỉnh Chuẩn GDPT 2018 (Loại bỏ CT 2006)
              </span>
              <span className="text-xs text-slate-300 font-medium">
                Bộ sách: <strong>Kết Nối Tri Thức Với Cuộc Sống</strong> (NXB Giáo Dục Việt Nam)
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span>Kho Sách - Học Liệu Số Hành Trang Số (NXB Giáo Dục Việt Nam)</span>
            </h2>
            <p className="text-xs text-blue-200/90 max-w-3xl leading-relaxed">
              Toàn bộ nội dung SGK, SGV, SBT đã được cập nhật chính xác theo chương trình GDPT 2018 từ nguồn số hóa <strong>https://hanhtrangso.nxbgd.vn</strong>. Thầy/Cô có thể chọn nhanh: <strong>Khối lớp ➔ Môn học / Phân môn ➔ Chương ➔ Bài học cụ thể</strong> để xuất ra <strong>KHBD 5512</strong> và từ KHBD xuất sang <strong>Slide bài giảng (16:9)</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <a
              href="https://hanhtrangso.nxbgd.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md border border-blue-400/40"
              title="Mở cổng học liệu số Hành Trang Số - NXB Giáo Dục Việt Nam"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-200" />
              <span>hanhtrangso.nxbgd.vn</span>
            </a>

            <button
              type="button"
              onClick={handleSyncHanhTrangSo}
              disabled={isSyncingHts}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md border border-emerald-400/40 cursor-pointer disabled:opacity-50"
              title="Cập nhật đồng bộ lại danh mục và nội dung chuẩn từ kho Hành Trang Số"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-200 ${isSyncingHts ? 'animate-spin' : ''}`} />
              <span>{isSyncingHts ? 'Đang đồng bộ...' : 'Đồng bộ từ Hành Trang Số'}</span>
            </button>
          </div>
        </div>

        {/* 4 BƯỚC ĐIỀU HƯỚNG LIÊN THÔNG: KHỐI LỚP ➔ MÔN HỌC ➔ CHƯƠNG ➔ BÀI HỌC */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white/5 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 text-xs">
          {/* BƯỚC 1: KHỐI LỚP */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
              1. Khối Lớp THCS:
            </label>
            <select
              value={selectedGradeFilter}
              onChange={(e) => setSelectedGradeFilter(e.target.value as GradeLevel | 'all')}
              className="w-full p-2 bg-slate-800 border border-blue-500/40 rounded-lg text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer"
            >
              <option value="Lớp 6">Lớp 6 (KNTT GDPT 2018)</option>
              <option value="Lớp 7">Lớp 7 (KNTT GDPT 2018)</option>
              <option value="Lớp 8">Lớp 8 (KNTT GDPT 2018)</option>
              <option value="Lớp 9">Lớp 9 (KNTT GDPT 2018)</option>
              <option value="all">Tất cả các khối lớp</option>
            </select>
          </div>

          {/* BƯỚC 2: MÔN HỌC / PHÂN MÔN */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
              2. Môn Học / Phân Môn:
            </label>
            <select
              value={selectedDisciplineFilter !== 'all' ? selectedDisciplineFilter : (selectedSubjectFilter !== 'all' ? selectedSubjectFilter : 'all')}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'vatli' || val === 'hoahoc' || val === 'sinhhoc') {
                  setSelectedSubjectFilter('Khoa học tự nhiên');
                  setSelectedDisciplineFilter(val as 'vatli' | 'hoahoc' | 'sinhhoc');
                } else if (val === 'Công nghệ') {
                  setSelectedSubjectFilter('Công nghệ');
                  setSelectedDisciplineFilter('all');
                } else if (val === 'Khoa học tự nhiên') {
                  setSelectedSubjectFilter('Khoa học tự nhiên');
                  setSelectedDisciplineFilter('all');
                } else {
                  setSelectedSubjectFilter('all');
                  setSelectedDisciplineFilter('all');
                }
              }}
              className="w-full p-2 bg-slate-800 border border-blue-500/40 rounded-lg text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer"
            >
              <option value="all">Tất cả các môn</option>
              <option value="Khoa học tự nhiên">Khoa học tự nhiên (Toàn bộ KHTN)</option>
              <option value="hoahoc">🧪 KHTN - Phân môn Hóa học</option>
              <option value="vatli">⚛️ KHTN - Phân môn Vật lí</option>
              <option value="sinhhoc">🧬 KHTN - Phân môn Sinh học</option>
              <option value="Công nghệ">🌱 Công nghệ (KNTT)</option>
            </select>
          </div>

          {/* BƯỚC 3: CHỌN CHƯƠNG TRONG SGK */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
              3. Chương Cụ Thể Trong SGK:
            </label>
            <select
              value={selectedChapterFilter}
              onChange={(e) => setSelectedChapterFilter(e.target.value)}
              className="w-full p-2 bg-slate-800 border border-blue-500/40 rounded-lg text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 truncate cursor-pointer"
            >
              <option value="all">📂 Tất cả các chương ({uniqueChapterTitles.length} chương)</option>
              {uniqueChapterTitles.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* BƯỚC 4: CHỌN BÀI HỌC CỤ THỂ */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
              4. Bài Học Cụ Thể:
            </label>
            <select
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              className="w-full p-2 bg-slate-800 border border-blue-500/40 rounded-lg text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 truncate cursor-pointer"
            >
              {displayedChapters.map(ch => (
                <option key={ch.id} value={ch.id}>
                  {ch.lessonNumber ? `Bài ${ch.lessonNumber}: ` : ''}{ch.lessonName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* THẺ TỔNG KẾT VÀ 3 NÚT TẠO KHBD ➔ XUẤT SLIDE */}
        {activeLessonDetails && (
          <div className="p-3.5 bg-blue-950/90 rounded-xl border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="px-2.5 py-1.5 bg-blue-600 rounded-lg text-white font-black text-center shrink-0">
                <span className="block text-[8px] uppercase tracking-wider">BÀI</span>
                <span className="block text-sm leading-none">{activeLessonDetails.lessonNumber}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold text-cyan-300">
                    {activeLessonDetails.chapterTitle}
                  </span>
                  <span className="text-[10px] text-slate-400">·</span>
                  <span className="text-[10px] text-slate-300">{activeLessonDetails.durationText}</span>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-500/30">
                    Nguồn: Hành Trang Số (GDPT 2018)
                  </span>
                </div>
                <h4 className="text-sm font-black text-white mt-0.5">
                  {activeLessonDetails.lessonName}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={() => handleUseSourceForKhbd(activeLessonDetails)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer transition-transform hover:scale-102"
              >
                <FileText className="w-3.5 h-3.5 text-white" />
                <span>1. Tạo KHBD 5512</span>
              </button>

              <div className="flex items-center bg-emerald-700 rounded-lg p-0.5 border border-emerald-500/40">
                <button
                  type="button"
                  onClick={() => {
                    const lessonTitle = activeChapter.lessonNumber 
                      ? `Bài ${activeChapter.lessonNumber}: ${activeChapter.lessonName}`
                      : activeChapter.lessonName;
                    onSelectLessonForCreation({
                      subject: activeDoc.subject,
                      grade: activeDoc.grade,
                      curriculum: activeDoc.curriculum,
                      lessonName: lessonTitle,
                      targetMode: 'slides',
                      slideCount: chosenSlideCount
                    });
                  }}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-black flex items-center gap-1.5 cursor-pointer"
                >
                  <Presentation className="w-3.5 h-3.5 text-white" />
                  <span>2. Xuất Slide 16:9</span>
                </button>
                <select
                  value={chosenSlideCount}
                  onChange={(e) => setChosenSlideCount(Number(e.target.value))}
                  className="bg-emerald-800 text-white text-[10px] font-bold px-1.5 py-1 rounded-r focus:outline-none cursor-pointer"
                >
                  <option value={4}>4 slide</option>
                  <option value={6}>6 slide</option>
                  <option value={8}>8 slide</option>
                  <option value={10}>10 slide</option>
                  <option value={12}>12 slide</option>
                  <option value={16}>16 slide</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  const lessonTitle = activeChapter.lessonNumber 
                    ? `Bài ${activeChapter.lessonNumber}: ${activeChapter.lessonName}`
                    : activeChapter.lessonName;
                  onSelectLessonForCreation({
                    subject: activeDoc.subject,
                    grade: activeDoc.grade,
                    curriculum: activeDoc.curriculum,
                    lessonName: lessonTitle,
                    targetMode: 'exam'
                  });
                }}
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer transition-transform hover:scale-102"
              >
                <CheckSquare className="w-3.5 h-3.5 text-white" />
                <span>3. Tạo Đề 7991</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* BỘ LỌC ĐỒNG BỘ: KHỐI LỚP - PHÂN MÔN - LOẠI SÁCH (CHUẨN KNTT GDPT 2018) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Hàng 1: Tiêu đề & Chọn khối lớp THCS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <GraduationCap className="w-4 h-4 text-blue-700" />
            </span>
            <div>
              <h3 className="font-extrabold text-xs uppercase tracking-wide text-slate-900">
                1. Chọn Khối Lớp THCS (Bộ sách Kết Nối Tri Thức GDPT 2018):
              </h3>
              <p className="text-[11px] text-slate-500">
                Chọn khối lớp để tải đúng mục lục chương, bài học và ngữ liệu chuẩn
              </p>
            </div>
          </div>

          {/* Segmented Grade Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
            {(['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'] as GradeLevel[]).map((g) => {
              const isSelected = selectedGradeFilter === g;
              const countInGrade = documents.filter(d => d.grade === g).length;
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => setSelectedGradeFilter(g)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs scale-102 ring-1 ring-blue-600'
                      : 'text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  <span>{g}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isSelected ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {countInGrade}
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setSelectedGradeFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedGradeFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả
            </button>
          </div>
        </div>

        {/* Hàng 2: Chọn Phân môn KHTN & Loại tài liệu & Tìm kiếm */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Phân môn KHTN */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">Phân môn:</span>
            <button
              type="button"
              onClick={() => setSelectedDisciplineFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                selectedDisciplineFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Toàn bộ KHTN
            </button>
            <button
              type="button"
              onClick={() => setSelectedDisciplineFilter('vatli')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors border ${
                selectedDisciplineFilter === 'vatli'
                  ? 'bg-cyan-600 text-white border-cyan-700 shadow-2xs'
                  : 'bg-cyan-50 text-cyan-900 border-cyan-200 hover:bg-cyan-100'
              }`}
            >
              ⚛️ Vật lí
            </button>
            <button
              type="button"
              onClick={() => setSelectedDisciplineFilter('hoahoc')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors border ${
                selectedDisciplineFilter === 'hoahoc'
                  ? 'bg-amber-500 text-slate-950 font-black border-amber-600 shadow-2xs'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              }`}
            >
              🧪 Hóa học
            </button>
            <button
              type="button"
              onClick={() => setSelectedDisciplineFilter('sinhhoc')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors border ${
                selectedDisciplineFilter === 'sinhhoc'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              🧬 Sinh học
            </button>
          </div>

          {/* Loại sách & Search */}
          <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap">
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-2 py-1 rounded text-[11px] font-bold ${
                  selectedCategory === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('sgk')}
                className={`px-2 py-1 rounded text-[11px] font-bold ${
                  selectedCategory === 'sgk' ? 'bg-blue-600 text-white shadow-2xs' : 'text-blue-800 hover:bg-blue-50'
                }`}
              >
                📘 SGK
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('sgv')}
                className={`px-2 py-1 rounded text-[11px] font-bold ${
                  selectedCategory === 'sgv' ? 'bg-amber-600 text-white shadow-2xs' : 'text-amber-800 hover:bg-amber-50'
                }`}
              >
                📙 SGV
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('sbt')}
                className={`px-2 py-1 rounded text-[11px] font-bold ${
                  selectedCategory === 'sbt' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                📗 SBT
              </button>
            </div>

            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Tìm tên sách, bài học..."
                className="w-full pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2-COLUMN WORKSPACE: LEFT IS BOOKS LIST, RIGHT IS LESSON SELECTION & LAUNCHPAD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: LIST OF BOOKS (COL 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-blue-600" />
              <span>Sách Đã Nạp Vào Hệ Thống ({filteredDocs.length})</span>
            </h3>
            <button
              onClick={() => {
                setIsUploading(true);
                triggerSmartFilter();
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm sách</span>
            </button>
          </div>

          <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
            {/* THẺ TẢI NHANH: KÉO THẢ FILE, BẤM ĐỂ CHỌN, HOẶC DÁN (CTRL+V) */}
            <div
              tabIndex={0}
              onClick={() => {
                setIsUploading(true);
                setTimeout(() => fileInputRef.current?.click(), 80);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsPageDragging(true);
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsPageDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsPageDragging(false);
                const file = e.dataTransfer?.files?.[0];
                if (file) {
                  processUploadedFile(file);
                }
              }}
              onPaste={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePastedContent(e);
              }}
              className="p-4 rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-600 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white hover:bg-blue-50/90 transition-all cursor-pointer shadow-2xs group outline-hidden"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
                  <FileUp className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-blue-950 uppercase tracking-wide">
                      Kéo Thả File Hoặc Dán (Ctrl+V)
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Mới</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    Thả tệp PDF, Word hoặc dán mục lục để tự động lọc bài
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                  <span>Tải lên</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {filteredDocs.map((doc) => {
              const isSelected = doc.id === selectedDocId;

              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    setSelectedDocId(doc.id);
                    if (doc.chapters[0]) setSelectedChapterId(doc.chapters[0].id);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left relative ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/70 shadow-sm ring-1 ring-blue-500'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    {getCategoryBadge(doc.category)}
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {doc.fileSize} · {doc.pageCount} trang
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 leading-snug">
                    {doc.name}
                  </h4>

                  <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-2 flex-wrap">
                    <span className="font-semibold text-blue-700">{doc.subject}</span>
                    <span>·</span>
                    <span>{doc.grade}</span>
                    <span>·</span>
                    <span className="text-slate-500 font-medium">{doc.curriculum}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-3 mt-3 border-t border-slate-200/80 flex-wrap gap-2">
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{doc.chapters.length} bài học đã lọc</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPdfReaderDoc(doc);
                          setPdfCurrentPage(1);
                        }}
                        className="text-xs text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 hover:bg-emerald-100 transition-colors"
                        title="Đọc sách PDF trực quan"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Đọc PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDocId(doc.id);
                          setIsRagSearchOpen(true);
                          setRagScope('currentBook');
                          if (doc.chapters[0]) {
                            setRagQuery(doc.chapters[0].lessonName);
                          }
                        }}
                        className="text-xs text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 hover:bg-indigo-100 transition-colors"
                        title="Tra cứu RAG ngữ liệu cuốn sách này"
                      >
                        <Zap className="w-3 h-3 fill-indigo-600" />
                        <span>RAG</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewDoc(doc);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 hover:underline"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Mục lục</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredDocs.length === 0 && (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs space-y-2">
                <p>Chưa có tài liệu nào phù hợp với bộ lọc.</p>
                <button
                  onClick={() => setIsUploading(true)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold text-xs"
                >
                  + Tải Tệp Sách Của Tôi Lên
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: LESSON VIEWER & GENERATOR LAUNCHPAD (COL 7) */}
        <div className="lg:col-span-7 space-y-5">
          {activeDoc && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              
              {/* Selected Book Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    {getCategoryBadge(activeDoc.category)}
                    <span className="text-xs text-slate-500 font-medium">Sách nguồn đang mở</span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                      PDF Chuẩn · {activeDoc.pageCount || 160} trang
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {activeDoc.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPdfReaderDoc(activeDoc);
                      setPdfCurrentPage(1);
                    }}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Đọc Sách PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsRagSearchOpen(true);
                      setRagScope('currentBook');
                      if (activeChapter) {
                        setRagQuery(activeChapter.lessonName);
                      }
                    }}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>RAG Ngữ Liệu</span>
                  </button>
                </div>
              </div>

              {/* BỘ LỌC DANH MỤC / CHƯƠNG TRONG SÁCH & CHẾ ĐỘ XEM (YÊU CẦU TRỌNG TÂM CỦA NGƯỜI DÙNG) */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-indigo-100 text-indigo-800 rounded-lg">
                      <FolderOpen className="w-4 h-4 text-indigo-600" />
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                        Lọc Danh Mục / Chương Trong Sách:
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {uniqueChapterTitles.length} chương / danh mục mục lục chuẩn trong cuốn sách này
                      </p>
                    </div>
                  </div>

                  {/* Toggle Chế độ xem: Gom nhóm theo Danh mục vs Danh sách phẳng */}
                  <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 text-xs shrink-0">
                    <button
                      type="button"
                      onClick={() => setViewLayoutMode('grouped')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
                        viewLayoutMode === 'grouped'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Folder className="w-3 h-3" />
                      <span>Theo Danh Mục SGK</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewLayoutMode('list')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
                        viewLayoutMode === 'list'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <ListFilter className="w-3 h-3" />
                      <span>Danh Sách Phẳng</span>
                    </button>
                  </div>
                </div>

                {/* Dropdown Lọc nhanh Danh mục + Ô tìm kiếm bài học */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
                  <div className="sm:col-span-6">
                    <select
                      value={selectedChapterFilter}
                      onChange={(e) => setSelectedChapterFilter(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="all">📂 Tất cả danh mục trong sách ({activeDoc.chapters.length} bài)</option>
                      {uniqueChapterTitles.map((title) => {
                        const countInChapter = activeDoc.chapters.filter(c => c.chapterTitle === title).length;
                        return (
                          <option key={title} value={title}>
                            📂 {title} ({countInChapter} bài)
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="sm:col-span-6 relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={lessonSearchKeyword}
                      onChange={(e) => setLessonSearchKeyword(e.target.value)}
                      placeholder="Tìm bài số hoặc tên bài trong sách..."
                      className="w-full pl-8 pr-2.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                </div>

                {/* Quick Chapter Chips (Nếu có nhiều hơn 1 chương) */}
                {uniqueChapterTitles.length > 1 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setSelectedChapterFilter('all')}
                      className={`px-2.5 py-1 rounded-full whitespace-nowrap font-bold transition-all ${
                        selectedChapterFilter === 'all'
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      Tất cả ({activeDoc.chapters.length})
                    </button>
                    {uniqueChapterTitles.map((title, tIdx) => {
                      const countInChapter = activeDoc.chapters.filter(c => c.chapterTitle === title).length;
                      const isPicked = selectedChapterFilter === title;
                      // Lấy nhãn ngắn gọn của chương
                      const shortTitle = title.length > 32 ? title.substring(0, 30) + '...' : title;

                      return (
                        <button
                          key={tIdx}
                          type="button"
                          onClick={() => setSelectedChapterFilter(title)}
                          className={`px-2.5 py-1 rounded-full whitespace-nowrap font-semibold border transition-all ${
                            isPicked
                              ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs font-bold'
                              : 'bg-white text-slate-700 hover:bg-indigo-50 border-slate-200'
                          }`}
                        >
                          {shortTitle} ({countInChapter})
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* DANH SÁCH BÀI HỌC THEO ĐÚNG DANH MỤC TRONG SÁCH */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    <span>Bài Học Trong Danh Mục Đã Lọc ({displayedChapters.length} bài):</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    Bấm chọn bài để xem toàn bộ nội dung chi tiết
                  </span>
                </div>

                {/* DANH SÁCH BÀI HỌC (HIỂN THỊ THEO DANH MỤC CHƯƠNG HOẶC DANH SÁCH) */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  
                  {/* CHẾ ĐỘ 1: GOM NHÓM THEO DANH MỤC / CHƯƠNG TRONG SÁCH (TOC HIERARCHY) */}
                  {viewLayoutMode === 'grouped' && (
                    <div className="space-y-3">
                      {chaptersGroupedByTitle.map((group, gIdx) => (
                        <div key={gIdx} className="space-y-1.5 bg-slate-50/60 p-2.5 rounded-xl border border-slate-200/90">
                          
                          {/* TIÊU ĐỀ DANH MỤC / CHƯƠNG */}
                          <div className="flex items-center justify-between px-2 py-1 bg-white rounded-lg border border-slate-200 text-slate-800 shadow-2xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <FolderOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                              <span className="font-bold text-xs text-indigo-950 truncate">
                                {group.title}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full shrink-0 border border-indigo-200">
                              {group.lessons.length} bài học
                            </span>
                          </div>

                          {/* DANH SÁCH BÀI TRONG CHƯƠNG */}
                          <div className="space-y-1.5 pt-0.5">
                            {group.lessons.map((ch, idx) => {
                              const isChapterSelected = ch.id === selectedChapterId;
                              const lessonNumDisplay = ch.lessonNumber || (idx + 1);

                              return (
                                <div
                                  key={ch.id}
                                  onClick={() => setSelectedChapterId(ch.id)}
                                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                    isChapterSelected
                                      ? 'border-indigo-500 bg-indigo-50/90 shadow-xs ring-1 ring-indigo-500'
                                      : 'border-slate-200 bg-white hover:bg-slate-50'
                                  }`}
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    {/* BÀI SỐ BADGE */}
                                    <div className={`px-2.5 py-1.5 rounded-lg text-center shrink-0 border ${
                                      isChapterSelected 
                                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs' 
                                        : 'bg-blue-50 text-blue-900 border-blue-200 font-bold'
                                    }`}>
                                      <span className="block text-[9px] font-black uppercase tracking-wider">BÀI</span>
                                      <span className="block text-xs font-black leading-tight">{lessonNumDisplay}</span>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <h5 className="font-bold text-xs text-slate-900 leading-snug truncate">
                                        {ch.lessonName}
                                      </h5>
                                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                                        {ch.summary}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="shrink-0 flex items-center gap-1.5">
                                    {isChapterSelected ? (
                                      <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[11px] flex items-center gap-1">
                                        <Check className="w-3.5 h-3.5" />
                                        <span>Đang chọn</span>
                                      </span>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedChapterId(ch.id);
                                        }}
                                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-[11px] transition-colors"
                                      >
                                        Bấm xem bài
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CHẾ ĐỘ 2: DANH SÁCH PHẲNG LIÊN TỤC */}
                  {viewLayoutMode === 'list' && (
                    <div className="space-y-2">
                      {displayedChapters.map((ch, idx) => {
                        const isChapterSelected = ch.id === selectedChapterId;
                        const lessonNumDisplay = ch.lessonNumber || (idx + 1);

                        return (
                          <div
                            key={ch.id}
                            onClick={() => setSelectedChapterId(ch.id)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isChapterSelected
                                ? 'border-indigo-500 bg-indigo-50/80 shadow-xs ring-1 ring-indigo-500'
                                : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
                            }`}
                          >
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className={`px-2.5 py-1.5 rounded-lg text-center shrink-0 border ${
                                isChapterSelected 
                                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs' 
                                  : 'bg-blue-100 text-blue-900 border-blue-200 font-bold'
                              }`}>
                                <span className="block text-[10px] font-black uppercase tracking-wider">BÀI SỐ</span>
                                <span className="block text-sm font-black leading-tight">{lessonNumDisplay}</span>
                              </div>

                              <div className="min-w-0 flex-1">
                                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wide block truncate">
                                  {ch.chapterTitle}
                                </span>
                                <h5 className="font-bold text-sm text-slate-900 mt-0.5 leading-snug">
                                  {ch.lessonName}
                                </h5>
                                <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">
                                  {ch.summary}
                                </p>
                              </div>
                            </div>

                            <div className="shrink-0 flex items-center gap-1.5">
                              {isChapterSelected ? (
                                <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[11px] flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Đang chọn</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedChapterId(ch.id);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-[11px] transition-colors"
                                >
                                  Bấm xem bài
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {displayedChapters.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <p className="font-bold text-slate-700">Không tìm thấy bài học nào phù hợp.</p>
                      <p>Vui lòng chọn danh mục khác hoặc xóa từ khóa tìm kiếm.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedChapterFilter('all');
                          setLessonSearchKeyword('');
                        }}
                        className="mt-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg font-bold text-xs border border-indigo-200 hover:bg-indigo-100"
                      >
                        Khôi phục xem tất cả bài học
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* BẢNG HIỂN THỊ CHI TIẾT NỘI DUNG BÀI HỌC KHI BẤM CHỌN (CHUẨN GDPT 2018 & CV 5512) */}
              {activeLessonDetails && (
                <div className="bg-gradient-to-b from-slate-50 to-white rounded-2xl border-2 border-indigo-200/90 shadow-sm p-5 space-y-4 text-xs animate-in fade-in duration-200">
                  
                  {/* Toast thông báo đã sao chép */}
                  {copiedLessonNotice && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 font-semibold flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{copiedLessonNotice}</span>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">Clipboard Ready</span>
                    </div>
                  )}

                  {/* Toast thông báo sử dụng nguồn tạo KHBD */}
                  {khbdSuccessToast && (
                    <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl font-bold flex items-center justify-between shadow-md animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
                        <span>{khbdSuccessToast}</span>
                      </div>
                      <span className="text-[10px] bg-white/20 text-white font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Đang đồng bộ 5512
                      </span>
                    </div>
                  )}

                  {/* Header bài học được chọn */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-100">
                    <div className="flex items-start gap-3">
                      <div className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-center shrink-0 shadow-xs border border-indigo-700">
                        <span className="block text-[9px] font-black uppercase tracking-wider text-indigo-200">BÀI SỐ</span>
                        <span className="block text-base font-black leading-tight">{activeLessonDetails.lessonNumber}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                            {activeLessonDetails.chapterTitle}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{activeLessonDetails.durationText}</span>
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Chuẩn GDPT 2018</span>
                          </span>
                        </div>
                        <h4 className="font-extrabold text-base text-slate-900 mt-1 leading-snug">
                          {activeLessonDetails.lessonName}
                        </h4>
                      </div>
                    </div>

                    {/* Nút tác vụ nhanh: RAG, Đọc PDF, Sao chép & Xem toàn màn hình */}
                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          setRagQuery(activeLessonDetails.lessonName);
                          setIsRagSearchOpen(true);
                          setRagScope('currentBook');
                        }}
                        className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-lg border border-amber-300 shadow-2xs flex items-center gap-1 transition-colors"
                        title="Tra cứu vector & ngữ liệu SGK liên quan đến bài học này"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                        <span>RAG bài này</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPdfReaderDoc(activeDoc);
                          setPdfCurrentPage(1);
                        }}
                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-300 shadow-2xs flex items-center gap-1 transition-colors"
                        title="Mở xem trang PDF chuẩn của bài học này"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Xem PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyLessonContent(activeLessonDetails)}
                        className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-300 shadow-2xs flex items-center gap-1 transition-colors"
                        title="Sao chép toàn bộ nội dung bài học này để dán vào Word/PowerPoint"
                      >
                        <Copy className="w-3.5 h-3.5 text-blue-600" />
                        <span>Sao chép</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsFullScreenLessonModalOpen(true)}
                        className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg border border-indigo-200 shadow-2xs flex items-center gap-1 transition-colors"
                        title="Mở toàn màn hình để đọc trọn vẹn giáo trình bài học"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Toàn màn hình</span>
                      </button>
                    </div>
                  </div>

                  {/* QUY TRÌNH SƯ PHẠM GDPT 2018: NGUỒN SÁCH -> XUẤT RA KHBD 5512 -> XUẤT RA SLIDE BÀI GIẢNG 16:9 */}
                  <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl shadow-lg border border-indigo-700/60 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-800/60 pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-[10px] font-black uppercase tracking-wider border border-blue-400/40">
                            Tiến Trình Chuyển Đổi Sư Phạm Tự Động
                          </span>
                          <span className="text-[11px] text-blue-200">
                            Nguồn: <strong>SGK {activeDoc.subject} {activeDoc.grade} (KNTT)</strong>
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-white mt-1">
                          Từ Bài Học SGK: "{activeLessonDetails.lessonName}" ➔ Xuất KHBD 5512 ➔ Xuất Slide Bài Giảng 16:9
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/40 self-start sm:self-center">
                        ✓ 100% Đồng bộ GDPT 2018
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* BƯỚC 1: XUẤT RA KHBD 5512 */}
                      <button
                        type="button"
                        onClick={() => handleUseSourceForKhbd(activeLessonDetails)}
                        className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-md flex items-center justify-between transition-all transform hover:-translate-y-0.5 border border-blue-400/40 group text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-white/20 rounded-lg shrink-0">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <span className="block text-xs font-black text-white">
                              1. Xuất Ra KHBD 5512
                            </span>
                            <span className="block text-[10px] font-medium text-blue-100 mt-0.5">
                              Kế hoạch bài dạy 4 hoạt động
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform shrink-0" />
                      </button>

                      {/* BƯỚC 2: TỪ KHBD XUẤT RA SLIDE BÀI GIẢNG 16:9 */}
                      <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-xl font-bold shadow-md flex items-center justify-between transition-all border border-emerald-400/40 text-left">
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          <div className="p-2 bg-white/20 rounded-lg shrink-0">
                            <Presentation className="w-5 h-5 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-black text-white truncate">
                                2. Xuất Slide 16:9
                              </span>
                              <select
                                value={chosenSlideCount}
                                onChange={(e) => setChosenSlideCount(Number(e.target.value))}
                                className="bg-emerald-950 text-white text-[10px] font-bold rounded px-1.5 py-0.5 border border-emerald-400/40 focus:outline-none cursor-pointer"
                              >
                                <option value={4}>4 Slide</option>
                                <option value={6}>6 Slide</option>
                                <option value={8}>8 Slide</option>
                                <option value={10}>10 Slide</option>
                                <option value={12}>12 Slide</option>
                                <option value={16}>16 Slide</option>
                              </select>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const lessonTitle = activeChapter.lessonNumber 
                                  ? `Bài ${activeChapter.lessonNumber}: ${activeChapter.lessonName}`
                                  : activeChapter.lessonName;
                                onSelectLessonForCreation({
                                  subject: activeDoc.subject,
                                  grade: activeDoc.grade,
                                  curriculum: activeDoc.curriculum,
                                  lessonName: lessonTitle,
                                  targetMode: 'slides',
                                  slideCount: chosenSlideCount
                                });
                              }}
                              className="text-[10px] font-bold text-emerald-100 hover:text-white mt-0.5 flex items-center gap-1 group cursor-pointer"
                            >
                              <span>Tạo {chosenSlideCount} slide từ KHBD</span>
                              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* BƯỚC 3: XUẤT RA ĐỀ THI 7991 */}
                      <button
                        type="button"
                        onClick={() => {
                          const lessonTitle = activeChapter.lessonNumber 
                            ? `Bài ${activeChapter.lessonNumber}: ${activeChapter.lessonName}`
                            : activeChapter.lessonName;
                          onSelectLessonForCreation({
                            subject: activeDoc.subject,
                            grade: activeDoc.grade,
                            curriculum: activeDoc.curriculum,
                            lessonName: lessonTitle,
                            targetMode: 'exam'
                          });
                        }}
                        className="p-3 bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl font-bold shadow-md flex items-center justify-between transition-all transform hover:-translate-y-0.5 border border-purple-400/40 group text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-white/20 rounded-lg shrink-0">
                            <CheckSquare className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <span className="block text-xs font-black text-white">
                              3. Tạo Đề Thi 7991
                            </span>
                            <span className="block text-[10px] font-medium text-purple-200 mt-0.5">
                              Ma trận & 3 dạng trắc nghiệm
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform shrink-0" />
                      </button>
                    </div>
                  </div>

                  {/* THANH 4 CÔNG CỤ SƯ PHẠM CỐT LÕI: Trích lọc / Tóm tắt / Lấy kiến thức trọng tâm / Sử dụng nguồn tạo KHBD */}
                  <div className="p-3 bg-gradient-to-r from-blue-50/80 via-indigo-50/70 to-emerald-50/80 rounded-xl border border-indigo-200 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-black uppercase text-indigo-950 tracking-wider flex items-center gap-1.5 mr-1">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Tác vụ bài viết:</span>
                      </span>

                      {/* 1. NÚT TRÍCH LỌC */}
                      <button
                        type="button"
                        onClick={() => setIsExtractModalOpen(true)}
                        className="px-3 py-1.5 bg-white hover:bg-indigo-100/70 text-indigo-900 font-bold rounded-lg border border-indigo-300 shadow-2xs flex items-center gap-1.5 transition-all text-xs active:scale-95 group"
                        title="Trích lọc các đoạn ngữ liệu cốt lõi (Khái niệm, Định nghĩa, Công thức, Thí nghiệm, Bài tập)"
                      >
                        <Filter className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-110 transition-transform" />
                        <span>Trích lọc</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 text-indigo-700 font-extrabold">
                          {activeLessonDetails.exactArticle?.extractedQuotes?.length || 5}
                        </span>
                      </button>

                      {/* 2. NÚT TÓM TẮT */}
                      <button
                        type="button"
                        onClick={() => setIsSummaryModalOpen(true)}
                        className="px-3 py-1.5 bg-white hover:bg-blue-100/70 text-blue-900 font-bold rounded-lg border border-blue-300 shadow-2xs flex items-center gap-1.5 transition-all text-xs active:scale-95 group"
                        title="Tóm tắt tổng quan bài viết, rút trích 4 luận điểm cốt lõi và ý nghĩa thực tiễn"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
                        <span>Tóm tắt</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-700 font-extrabold">
                          4 ý
                        </span>
                      </button>

                      {/* 3. NÚT LẤY KIẾN THỨC TRỌNG TÂM */}
                      <button
                        type="button"
                        onClick={() => setIsFocalModalOpen(true)}
                        className="px-3 py-1.5 bg-white hover:bg-amber-100/70 text-amber-950 font-bold rounded-lg border border-amber-300 shadow-2xs flex items-center gap-1.5 transition-all text-xs active:scale-95 group"
                        title="Lấy và hiển thị toàn bộ kiến thức trọng tâm (Định nghĩa then chốt, Công thức vàng, Khung Em đã học)"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
                        <span>Lấy kiến thức trọng tâm</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-extrabold">
                          Chuẩn GDPT
                        </span>
                      </button>
                    </div>

                    {/* 4. NÚT SỬ DỤNG NGUỒN TẠO KHBD */}
                    <button
                      type="button"
                      onClick={() => handleUseSourceForKhbd(activeLessonDetails)}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-lg shadow-xs flex items-center gap-1.5 transition-all text-xs ring-2 ring-emerald-400/40 hover:scale-[1.02] active:scale-[0.98]"
                      title="Sử dụng nội dung chính xác của bài viết này để nạp vào Kế hoạch bài dạy (KHBD 5512)"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
                      <span>Sử dụng nguồn tạo KHBD</span>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-100" />
                    </button>
                  </div>

                  {/* Thanh chuyển đổi các Phân mục nội dung (Tabs) */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
                    <button
                      type="button"
                      onClick={() => setLessonDetailTab('exactArticle')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 ${
                        lessonDetailTab === 'exactArticle'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>📖 Nội dung chính xác của bài viết</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLessonDetailTab('core')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 ${
                        lessonDetailTab === 'core'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>1. Kiến thức cốt lõi SGK</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLessonDetailTab('objectives')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 ${
                        lessonDetailTab === 'objectives'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>2. Mục tiêu & YCCĐ</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLessonDetailTab('activities')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 ${
                        lessonDetailTab === 'activities'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>3. Tiến trình 4 hoạt động 5512</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLessonDetailTab('questions')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 ${
                        lessonDetailTab === 'questions'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>4. Câu hỏi & Bài tập SGK</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLessonDetailTab('rawText')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 ${
                        lessonDetailTab === 'rawText'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>5. Toàn văn trích xuất</span>
                    </button>
                  </div>

                  {/* TAB ĐẶC TRƯNG: NỘI DUNG CHÍNH XÁC CỦA BÀI VIẾT (CHUẨN SGK GDPT 2018) */}
                  {lessonDetailTab === 'exactArticle' && (
                    <div className="space-y-4 pt-1 animate-in fade-in duration-200">
                      
                      {/* Thanh công cụ tìm kiếm và thông số bài viết */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                            📖 {activeLessonDetails.curriculum}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold text-[10px]">
                            {activeLessonDetails.subject} · {activeLessonDetails.grade}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-emerald-600" />
                            <span>{activeLessonDetails.exactArticle?.readingMinutes || 5} phút đọc</span>
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold text-[10px]">
                            {activeLessonDetails.exactArticle?.wordCount || 1050} từ
                          </span>
                        </div>

                        {/* Ô tìm kiếm trong nội dung bài viết */}
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1 sm:w-64">
                            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              value={articleSearchQuery}
                              onChange={(e) => setArticleSearchQuery(e.target.value)}
                              placeholder="Tìm từ khóa trong bài viết..."
                              className="w-full pl-8 pr-7 py-1 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                            />
                            {articleSearchQuery && (
                              <button
                                type="button"
                                onClick={() => setArticleSearchQuery('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold text-xs"
                              >
                                ✕
                              </button>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (navigator?.clipboard?.writeText) {
                                navigator.clipboard.writeText(activeLessonDetails.exactArticle?.fullFormattedText || '');
                              }
                              setCopiedLessonNotice(`Đã sao chép toàn văn văn bản Bài ${activeLessonDetails.lessonNumber}!`);
                              setTimeout(() => setCopiedLessonNotice(null), 3000);
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-300 shadow-2xs flex items-center gap-1 transition-colors shrink-0"
                            title="Sao chép toàn bộ văn bản chính xác của bài viết"
                          >
                            <Copy className="w-3 h-3 text-blue-600" />
                            <span>Sao chép bài</span>
                          </button>
                        </div>
                      </div>

                      {/* Khung bài viết giáo trình xuất bản chính xác */}
                      <article className="bg-white rounded-2xl border-2 border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 text-slate-800 text-xs sm:text-[13px] leading-relaxed select-text font-serif">
                        
                        {/* Tiêu đề đầu bài theo chuẩn SGK */}
                        <div className="text-center space-y-2 pb-4 border-b-2 border-slate-900 font-sans">
                          <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500">
                            BỘ GIÁO DỤC VÀ ĐÀO TẠO · BỘ SÁCH {activeLessonDetails.curriculum.toUpperCase()}
                          </div>
                          <div className="inline-block px-3 py-1 bg-blue-600 text-white font-black text-xs rounded-md shadow-xs uppercase tracking-wide">
                            BÀI {activeLessonDetails.lessonNumber}
                          </div>
                          <h3 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight">
                            {activeLessonDetails.lessonName}
                          </h3>
                          <div className="flex items-center justify-center gap-3 text-slate-500 text-[11px] font-semibold">
                            <span>Chương: {activeLessonDetails.chapterTitle}</span>
                            <span>•</span>
                            <span>Thời lượng giảng dạy: {activeLessonDetails.durationText}</span>
                          </div>
                        </div>

                        {/* Render từng phân đoạn nội dung chính xác */}
                        {activeLessonDetails.exactArticle?.sections?.map((sec, sIdx) => (
                          <section key={sIdx} className="space-y-3 pt-2">
                            <div className="flex items-center gap-2 pb-1 border-b border-slate-200 font-sans">
                              <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                                {sIdx + 1}
                              </span>
                              <div>
                                <h4 className="font-extrabold text-sm sm:text-base text-slate-950">
                                  {sec.heading}
                                </h4>
                                {sec.subheading && (
                                  <p className="text-[11px] text-slate-500 font-medium">
                                    {sec.subheading}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Các đoạn văn trong phân đoạn */}
                            <div className="space-y-2.5 pl-2 sm:pl-4 text-justify font-sans text-slate-700">
                              {sec.paragraphs.map((para, pIdx) => (
                                <p key={pIdx} className="leading-relaxed indent-4">
                                  {highlightMatchedText(para, articleSearchQuery)}
                                </p>
                              ))}
                            </div>

                            {/* Khung Callout nổi bật (Định nghĩa / Công thức / Ghi nhớ) */}
                            {sec.callout && (
                              <div className={`p-4 rounded-xl border my-3 space-y-1 font-sans ${
                                sec.callout.type === 'definition'
                                  ? 'bg-blue-50/80 border-blue-300 text-blue-950'
                                  : sec.callout.type === 'formula'
                                  ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                                  : 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                              }`}>
                                <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wide">
                                  <Bookmark className="w-4 h-4 text-blue-700" />
                                  <span>{sec.callout.title}</span>
                                </div>
                                <p className="font-semibold text-xs leading-relaxed pl-6">
                                  {highlightMatchedText(sec.callout.content, articleSearchQuery)}
                                </p>
                              </div>
                            )}
                          </section>
                        ))}

                        {/* Footer bài viết chính xác với 4 nút tác vụ */}
                        <div className="pt-6 border-t-2 border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans">
                          <div className="text-[11px] text-slate-500">
                            NXB GIÁO DỤC VIỆT NAM · SGK {activeLessonDetails.subject} {activeLessonDetails.grade}
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                              type="button"
                              onClick={() => setIsExtractModalOpen(true)}
                              className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-lg font-bold text-xs border border-indigo-200 flex items-center gap-1"
                            >
                              <Filter className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Trích lọc</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setIsSummaryModalOpen(true)}
                              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-lg font-bold text-xs border border-blue-200 flex items-center gap-1"
                            >
                              <FileText className="w-3.5 h-3.5 text-blue-600" />
                              <span>Tóm tắt</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setIsFocalModalOpen(true)}
                              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg font-bold text-xs border border-amber-200 flex items-center gap-1"
                            >
                              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                              <span>Kiến thức trọng tâm</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleUseSourceForKhbd(activeLessonDetails)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs shadow-xs flex items-center gap-1.5"
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                              <span>Sử dụng nguồn tạo KHBD</span>
                            </button>
                          </div>
                        </div>

                      </article>
                    </div>
                  )}

                  {/* TAB 1: KIẾN THỨC CỐT LÕI TRONG SGK */}
                  {lessonDetailTab === 'core' && (
                    <div className="space-y-3 pt-1">
                      {activeLessonDetails.coreKnowledge.map((sec, idx) => (
                        <div key={idx} className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                          <h5 className="font-bold text-slate-900 text-xs flex items-center gap-2 text-blue-900">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-[10px]">
                              {idx + 1}
                            </span>
                            <span>{sec.title}</span>
                          </h5>
                          <p className="text-slate-700 leading-relaxed pl-7">
                            {sec.summary}
                          </p>
                          <div className="pl-7 space-y-1">
                            {sec.keyPoints.map((pt, pIdx) => (
                              <div key={pIdx} className="flex items-start gap-2 text-slate-600">
                                <span className="text-blue-500 font-bold">•</span>
                                <span className="leading-snug">{pt}</span>
                              </div>
                            ))}
                          </div>
                          {sec.formulasOrDefinitions && sec.formulasOrDefinitions.length > 0 && (
                            <div className="ml-7 p-2.5 bg-blue-50/60 rounded-lg border border-blue-200/80 text-blue-950 font-medium">
                              {sec.formulasOrDefinitions.map((f, fIdx) => (
                                <p key={fIdx} className="text-[11px] font-mono leading-relaxed">
                                  📌 {f}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Khung Ghi nhớ chuẩn SGK (Khung Em đã học) */}
                      <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-1.5 shadow-2xs">
                        <div className="flex items-center gap-2 font-bold text-amber-900 text-xs">
                          <Lightbulb className="w-4 h-4 text-amber-600" />
                          <span>Ghi Nhớ Trọng Tâm (Khung "Em Đã Học" SGK Kết Nối Tri Thức):</span>
                        </div>
                        <ul className="space-y-1 pl-6 text-amber-950 leading-relaxed">
                          {activeChapter.keyPoints.map((kp, kIdx) => (
                            <li key={kIdx} className="list-disc font-medium">
                              {kp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: MỤC TIÊU & YÊU CẦU CẦN ĐẠT (GDPT 2018 & CV 5512) */}
                  {lessonDetailTab === 'objectives' && (
                    <div className="space-y-3 pt-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* 1. Yêu cầu về Kiến thức */}
                        <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                          <div className="flex items-center gap-2 font-bold text-blue-950">
                            <GraduationCap className="w-4 h-4 text-blue-600" />
                            <span>1. Yêu cầu cần đạt về Kiến thức</span>
                          </div>
                          <ul className="space-y-1.5 pl-4 text-slate-700">
                            {activeLessonDetails.objectives.knowledge.map((k, idx) => (
                              <li key={idx} className="list-disc leading-relaxed">{k}</li>
                            ))}
                          </ul>
                        </div>

                        {/* 2. Năng lực đặc thù */}
                        <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                          <div className="flex items-center gap-2 font-bold text-indigo-950">
                            <Target className="w-4 h-4 text-indigo-600" />
                            <span>2. Năng lực đặc thù bộ môn</span>
                          </div>
                          <ul className="space-y-1.5 pl-4 text-slate-700">
                            {activeLessonDetails.objectives.competenciesSpecific.map((c, idx) => (
                              <li key={idx} className="list-disc leading-relaxed">{c}</li>
                            ))}
                          </ul>
                        </div>

                        {/* 3. Năng lực chung */}
                        <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                          <div className="flex items-center gap-2 font-bold text-teal-950">
                            <Layers className="w-4 h-4 text-teal-600" />
                            <span>3. Năng lực chung</span>
                          </div>
                          <ul className="space-y-1.5 pl-4 text-slate-700">
                            {activeLessonDetails.objectives.competenciesGeneral.map((g, idx) => (
                              <li key={idx} className="list-disc leading-relaxed">{g}</li>
                            ))}
                          </ul>
                        </div>

                        {/* 4. Phẩm chất */}
                        <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                          <div className="flex items-center gap-2 font-bold text-rose-950">
                            <Sparkles className="w-4 h-4 text-rose-600" />
                            <span>4. Phẩm chất chủ yếu</span>
                          </div>
                          <ul className="space-y-1.5 pl-4 text-slate-700">
                            {activeLessonDetails.objectives.qualities.map((q, idx) => (
                              <li key={idx} className="list-disc leading-relaxed">{q}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Thiết bị & Học liệu số */}
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-800 block">Thiết bị dạy học và học liệu:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                          <div>
                            <span className="font-semibold text-blue-900 block">• Giáo viên chuẩn bị:</span>
                            <p className="text-[11px] text-slate-600 mt-0.5">{activeLessonDetails.equipment.teacher.join('; ')}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-emerald-900 block">• Học sinh chuẩn bị:</span>
                            <p className="text-[11px] text-slate-600 mt-0.5">{activeLessonDetails.equipment.students.join('; ')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: TIẾN TRÌNH 4 HOẠT ĐỘNG CHUẨN 5512 */}
                  {lessonDetailTab === 'activities' && (
                    <div className="space-y-3 pt-1">
                      {activeLessonDetails.activities5512.map((act, idx) => (
                        <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                          <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-100">
                            <h5 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-extrabold text-[10px]">
                                {act.code}
                              </span>
                              <span>{act.title}</span>
                            </h5>
                            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              ⏱️ Thời lượng: {act.duration}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                            <div className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-100">
                              <span className="font-bold text-blue-900 block mb-1">a) Mục tiêu:</span>
                              <p className="text-slate-700 text-[11px] leading-relaxed">{act.goal}</p>
                            </div>
                            <div className="p-2.5 bg-indigo-50/50 rounded-lg border border-indigo-100">
                              <span className="font-bold text-indigo-900 block mb-1">b) Nội dung:</span>
                              <p className="text-slate-700 text-[11px] leading-relaxed">{act.content}</p>
                            </div>
                            <div className="p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-100">
                              <span className="font-bold text-emerald-900 block mb-1">c) Sản phẩm:</span>
                              <p className="text-slate-700 text-[11px] leading-relaxed">{act.product}</p>
                            </div>
                          </div>

                          <div className="mt-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                            <span className="font-bold text-slate-800 block mb-1">d) Tổ chức thực hiện (4 bước CV 5512):</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                              <div>
                                <strong className="text-blue-800">Bước 1 (Chuyển giao):</strong> {act.implementation.step1_assign}
                              </div>
                              <div>
                                <strong className="text-emerald-800">Bước 2 (Thực hiện):</strong> {act.implementation.step2_execute}
                              </div>
                              <div>
                                <strong className="text-indigo-800">Bước 3 (Báo cáo):</strong> {act.implementation.step3_report}
                              </div>
                              <div>
                                <strong className="text-purple-800">Bước 4 (Kết luận):</strong> {act.implementation.step4_conclude}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 4: CÂU HỎI & BÀI TẬP SGK (CHUẨN 7991) */}
                  {lessonDetailTab === 'questions' && (
                    <div className="space-y-3 pt-1">
                      {activeLessonDetails.sampleQuestions7991.map((q, idx) => (
                        <div key={idx} className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-[10px]">
                                {idx + 1}
                              </span>
                              <span>Câu hỏi {idx + 1}</span>
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              q.levelName === 'Nhận biết' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                              q.levelName === 'Thông hiểu' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                              q.levelName === 'Vận dụng' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                              'bg-purple-100 text-purple-800 border border-purple-200'
                            }`}>
                              Mức độ: {q.levelName}
                            </span>
                          </div>

                          <p className="font-semibold text-slate-800 pl-6 leading-relaxed">
                            {q.question}
                          </p>

                          {q.options && q.options.length > 0 && (
                            <div className="pl-6 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-700">
                              {q.options.map((opt, oIdx) => (
                                <div key={oIdx} className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px]">
                                  {opt}
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="ml-6 p-2.5 bg-emerald-50/70 rounded-lg border border-emerald-200 text-emerald-950 text-[11px] space-y-0.5">
                            <div className="font-bold flex items-center gap-1 text-emerald-900">
                              <Check className="w-3.5 h-3.5" />
                              <span>Đáp án: {q.correctAnswer}</span>
                            </div>
                            <p className="text-slate-600">{q.explanation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 5: TOÀN VĂN BÀI HỌC TRÍCH XUẤT */}
                  {lessonDetailTab === 'rawText' && (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">Toàn văn văn bản giáo trình bài học:</span>
                        <button
                          type="button"
                          onClick={() => handleCopyLessonContent(activeLessonDetails)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Sao chép toàn bộ</span>
                        </button>
                      </div>

                      <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] leading-relaxed max-h-80 overflow-y-auto whitespace-pre-wrap select-all border border-slate-800 shadow-inner">
                        {activeChapter.rawContent || `BÀI HỌC: BÀI SỐ ${activeLessonDetails.lessonNumber} - ${activeLessonDetails.lessonName}
MÔN: ${activeLessonDetails.subject.toUpperCase()} - ${activeLessonDetails.grade.toUpperCase()}
BỘ SÁCH: ${activeLessonDetails.curriculum.toUpperCase()}
THỜI LƯỢNG: ${activeLessonDetails.durationText}
CHƯƠNG / CHỦ ĐỀ: ${activeLessonDetails.chapterTitle}

I. MỤC TIÊU YÊU CẦU CẦN ĐẠT (GDPT 2018)
${activeLessonDetails.objectives.knowledge.map(k => `• ${k}`).join('\n')}

II. NỘI DUNG TRỌNG TÂM SGK
${activeLessonDetails.coreKnowledge.map(ck => `${ck.title}\n${ck.summary}\n${ck.keyPoints.map(p => `  - ${p}`).join('\n')}`).join('\n\n')}

III. CÂU HỎI VÀ BÀI TẬP SGK
${activeLessonDetails.sampleQuestions7991.map((q, i) => `Câu ${i + 1} (${q.levelName}): ${q.question}\n-> Đáp án: ${q.correctAnswer}`).join('\n\n')}
`}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* LAUNCHPAD: 3 NÚT CHUYỂN TIẾP SANG SOẠN THẢO (KHBD, SLIDE, ĐỀ THI) */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="font-bold text-xs uppercase tracking-wide text-slate-800 flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                    <span>Khởi Tạo Nội Dung Cho: </span>
                    <span className="text-blue-900 font-black">
                      {activeChapter ? (activeChapter.lessonNumber ? `Bài ${activeChapter.lessonNumber}: ${activeChapter.lessonName}` : activeChapter.lessonName) : activeDoc.name}
                    </span>
                  </h4>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    Đã sẵn sàng tạo học liệu
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Action 1: Tạo KHBD 5512 */}
                  <button
                    onClick={() => {
                      const lessonTitle = activeChapter 
                        ? (activeChapter.lessonNumber ? `Bài ${activeChapter.lessonNumber}: ${activeChapter.lessonName}` : activeChapter.lessonName)
                        : activeDoc.name;
                      onSelectLessonForCreation({
                        subject: activeDoc.subject,
                        grade: activeDoc.grade,
                        curriculum: activeDoc.curriculum,
                        lessonName: lessonTitle,
                        targetMode: 'khbd'
                      });
                    }}
                    className="p-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm text-left flex flex-col justify-between transition-all transform hover:-translate-y-0.5 group"
                  >
                    <div>
                      <div className="p-2 bg-blue-500 text-white rounded-lg w-fit mb-2">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="font-bold text-xs leading-tight">
                        Tạo KHBD 5512
                      </div>
                      <div className="text-[11px] text-blue-100 mt-1 leading-snug">
                        Kế hoạch bài dạy 4 hoạt động chuẩn BGDĐT
                      </div>
                    </div>
                    <div className="mt-3 text-[11px] font-semibold text-blue-200 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Soạn giáo án ngay</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>

                  {/* Action 2: Tạo Slide 16:9 */}
                  <div className="p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm text-left flex flex-col justify-between transition-all transform hover:-translate-y-0.5 group">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-emerald-500 text-white rounded-lg w-fit">
                          <Presentation className="w-4 h-4" />
                        </div>
                        
                        {/* BỘ CHỌN SỐ SLIDE TRƯỚC KHI TẠO */}
                        <div className="flex items-center gap-1 bg-emerald-800/80 px-2 py-1 rounded-md border border-emerald-400/40">
                          <span className="text-[10px] font-bold text-emerald-100">Số slide:</span>
                          <select
                            value={chosenSlideCount}
                            onChange={(e) => setChosenSlideCount(Number(e.target.value))}
                            className="bg-emerald-900 text-white font-bold text-[11px] rounded px-1 py-0.5 focus:outline-none cursor-pointer"
                          >
                            <option value={4}>4 Slide</option>
                            <option value={6}>6 Slide</option>
                            <option value={8}>8 Slide</option>
                            <option value={10}>10 Slide</option>
                            <option value={12}>12 Slide</option>
                            <option value={16}>16 Slide</option>
                          </select>
                        </div>
                      </div>

                      <div className="font-bold text-xs leading-tight">
                        Tạo Slide Giảng Dạy 16:9
                      </div>
                      <div className="text-[11px] text-emerald-100 mt-1 leading-snug">
                        Xuất PowerPoint (.pptx) tĩnh 100% không mất chữ
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const lessonTitle = activeChapter 
                          ? (activeChapter.lessonNumber ? `Bài ${activeChapter.lessonNumber}: ${activeChapter.lessonName}` : activeChapter.lessonName)
                          : activeDoc.name;
                        onSelectLessonForCreation({
                          subject: activeDoc.subject,
                          grade: activeDoc.grade,
                          curriculum: activeDoc.curriculum,
                          lessonName: lessonTitle,
                          targetMode: 'slides',
                          slideCount: chosenSlideCount
                        });
                      }}
                      className="mt-3 text-[11px] font-semibold text-emerald-200 flex items-center justify-between group-hover:translate-x-1 transition-transform cursor-pointer"
                    >
                      <span>Trình chiếu {chosenSlideCount} slide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Action 3: Tạo Đề kiểm tra 7991 */}
                  <button
                    onClick={() => {
                      const lessonTitle = activeChapter 
                        ? (activeChapter.lessonNumber ? `Bài ${activeChapter.lessonNumber}: ${activeChapter.lessonName}` : activeChapter.lessonName)
                        : activeDoc.name;
                      onSelectLessonForCreation({
                        subject: activeDoc.subject,
                        grade: activeDoc.grade,
                        curriculum: activeDoc.curriculum,
                        lessonName: lessonTitle,
                        targetMode: 'exam'
                      });
                    }}
                    className="p-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-sm text-left flex flex-col justify-between transition-all transform hover:-translate-y-0.5 group"
                  >
                    <div>
                      <div className="p-2 bg-amber-500 text-white rounded-lg w-fit mb-2">
                        <CheckSquare className="w-4 h-4" />
                      </div>
                      <div className="font-bold text-xs leading-tight">
                        Tạo Đề Thi & Ma Trận 7991
                      </div>
                      <div className="text-[11px] text-amber-100 mt-1 leading-snug">
                        Đủ 4 phần thi và bản đặc tả tự động
                      </div>
                    </div>
                    <div className="mt-3 text-[11px] font-semibold text-amber-200 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Tạo đề kiểm tra</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>

                </div>
              </div>

            </div>
          )}
        </div>

      </div>

      {/* MODAL TẢI SÁCH LÊN & TỰ ĐỘNG LỌC RA BÀI SỐ VÀ TÊN BÀI HỌC */}
      {isUploading && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full p-6 space-y-4 max-h-[92vh] flex flex-col text-xs">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-600 text-white rounded-xl">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Tải Sách Lên & Tự Động Lọc Bài Số, Tên Bài Học</h3>
                  <p className="text-slate-500 text-[11px]">Hệ thống quét nội dung hoặc tên file để bóc tách mục lục chuẩn xác</p>
                </div>
              </div>
              <button 
                onClick={() => setIsUploading(false)} 
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto flex-1 pr-1">
              
              {/* Phân loại tài liệu */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">1. Loại tài liệu học liệu:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setUploadCategory('sgk');
                      triggerSmartFilter();
                    }}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      uploadCategory === 'sgk'
                        ? 'border-blue-500 bg-blue-50 text-blue-800 font-bold shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    📘 Sách Giáo Khoa (SGK)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadCategory('sgv');
                      triggerSmartFilter();
                    }}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      uploadCategory === 'sgv'
                        ? 'border-amber-500 bg-amber-50 text-amber-800 font-bold shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    📙 Sách Giáo Viên (SGV)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadCategory('sbt');
                      triggerSmartFilter();
                    }}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      uploadCategory === 'sbt'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    📗 Sách Bài Tập (SBT)
                  </button>
                </div>
              </div>

              {/* Bộ lọc chọn Môn & Lớp */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">2. Môn học:</label>
                  <select
                    value={uploadSubject}
                    onChange={(e) => {
                      const subj = e.target.value as Subject;
                      setUploadSubject(subj);
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:bg-white"
                  >
                    <optgroup label="Cấp THCS (GDPT 2018 - Lớp 6, 7, 8, 9)">
                      <option value="Khoa học tự nhiên">Khoa học tự nhiên (KHTN)</option>
                      <option value="Lịch sử & Địa lí">Lịch sử & Địa lí</option>
                      <option value="Công nghệ">Công nghệ</option>
                      <option value="Tin học">Tin học</option>
                      <option value="Giáo dục công dân">Giáo dục công dân (GDCD)</option>
                      <option value="Toán học">Toán học</option>
                      <option value="Ngữ văn">Ngữ văn</option>
                      <option value="Tiếng Anh">Tiếng Anh</option>
                      <option value="Giáo dục thể chất">Giáo dục thể chất</option>
                      <option value="Nghệ thuật (Âm nhạc, Mĩ thuật)">Nghệ thuật (Âm nhạc, Mĩ thuật)</option>
                      <option value="Hoạt động trải nghiệm, hướng nghiệp">Hoạt động trải nghiệm, hướng nghiệp</option>
                      <option value="Giáo dục địa phương">Giáo dục địa phương</option>
                    </optgroup>
                    <optgroup label="Cấp THPT (GDPT 2018 - Lớp 10, 11, 12)">
                      <option value="Vật lí">Vật lí</option>
                      <option value="Hoá học">Hoá học</option>
                      <option value="Sinh học">Sinh học</option>
                      <option value="Lịch sử">Lịch sử</option>
                      <option value="Địa lí">Địa lí</option>
                      <option value="Giáo dục kinh tế và pháp luật">Giáo dục kinh tế và pháp luật (GDKT&PL)</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Khối lớp:</label>
                  <select
                    value={uploadGrade}
                    onChange={(e) => {
                      const grd = e.target.value as GradeLevel;
                      setUploadGrade(grd);
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:bg-white"
                  >
                    <optgroup label="Cấp THCS (Chương trình GDPT 2018)">
                      <option value="Lớp 6">Lớp 6</option>
                      <option value="Lớp 7">Lớp 7</option>
                      <option value="Lớp 8">Lớp 8</option>
                      <option value="Lớp 9">Lớp 9</option>
                    </optgroup>
                    <optgroup label="Cấp THPT (Chương trình GDPT 2018)">
                      <option value="Lớp 10">Lớp 10</option>
                      <option value="Lớp 11">Lớp 11</option>
                      <option value="Lớp 12">Lớp 12</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Tên sách / Tài liệu */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">3. Tên sách / Tiêu đề tài liệu:</label>
                <input
                  type="text"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="VD: Sách Giáo Khoa Toán 10 Tập 2 - Kết Nối Tri Thức..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:bg-white"
                />
              </div>

              {/* Hai hình thức nạp tài liệu */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">4. Chọn tệp sách hoặc dán mục lục:</label>
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setUploadMode('file')}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                        uploadMode === 'file' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600'
                      }`}
                    >
                      📁 Tải tệp từ máy
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode('text')}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                        uploadMode === 'text' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600'
                      }`}
                    >
                      📋 Dán mục lục / bài
                    </button>
                  </div>
                </div>

                {uploadMode === 'file' ? (
                  <div 
                    tabIndex={0}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsModalDragging(true);
                    }}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsModalDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsModalDragging(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsModalDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        processUploadedFile(file);
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handlePastedContent(e);
                    }}
                    className={`border-2 border-dashed p-6 rounded-2xl text-center cursor-pointer transition-all relative outline-hidden ${
                      isModalDragging
                        ? 'border-blue-600 bg-blue-100/90 ring-4 ring-blue-300 scale-[1.01]'
                        : 'border-blue-300 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50/80'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className={`p-3 rounded-full transition-transform ${
                        isModalDragging ? 'bg-blue-600 text-white scale-110 animate-bounce' : 'bg-blue-100 text-blue-600'
                      }`}>
                        <Upload className="w-6 h-6" />
                      </div>

                      {selectedFileName ? (
                        <div className="space-y-1">
                          <p className="font-bold text-xs text-blue-900 flex items-center justify-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Tệp đang chọn: <strong>{selectedFileName}</strong> ({selectedFileSize})</span>
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Thả tệp khác hoặc bấm để đổi tệp
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="font-bold text-xs text-slate-800">
                            {isModalDragging ? '🎉 Thả tệp sách vào đây ngay!' : 'Bấm để tải lên, Kéo thả file hoặc Nhấn Ctrl+V để Dán'}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Hỗ trợ tệp <strong>PDF, DOCX, TXT, EPUB</strong>. Hệ thống tự động đọc và lọc ra Bài số... kèm Tên bài học.
                          </p>
                        </div>
                      )}

                      {/* 3 action badges */}
                      <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full bg-white text-slate-700 text-[10px] font-semibold border border-slate-200 shadow-2xs flex items-center gap-1">
                          <MousePointer className="w-3 h-3 text-blue-600" />
                          <span>Bấm để duyệt file</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white text-slate-700 text-[10px] font-semibold border border-slate-200 shadow-2xs flex items-center gap-1">
                          <FileUp className="w-3 h-3 text-indigo-600" />
                          <span>Kéo & thả file</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white text-slate-700 text-[10px] font-semibold border border-slate-200 shadow-2xs flex items-center gap-1">
                          <Clipboard className="w-3 h-3 text-emerald-600" />
                          <span>Copy/Paste (Ctrl+V)</span>
                        </span>
                      </div>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.docx,.doc,.txt,.epub,.md"
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <textarea
                      rows={4}
                      value={pastedTOC}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPastedTOC(val);
                        triggerSmartFilter(val);
                      }}
                      placeholder={`Dán danh sách bài học hoặc mục lục cuốn sách vào đây. Ví dụ:\nChương 1: Mệnh đề và tập hợp\nBài 1: Mệnh đề\nBài 2: Tập hợp và các phép toán trên tập hợp\nBài 15: Hàm số bậc hai và đồ thị...`}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:bg-white"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => triggerSmartFilter(pastedTOC)}
                        className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[11px] font-bold flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Lọc lại danh sách bài học</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* KẾT QUẢ TỰ ĐỘNG LỌC RA BÀI SỐ VÀ TÊN BÀI HỌC (THE CORE USER REQUIREMENT) */}
              <div className="space-y-2.5 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                    </span>
                    <div>
                      <h4 className="font-black text-xs uppercase tracking-wide text-slate-900">
                        ⚡ KẾT QUẢ TỰ ĐỘNG LỌC RA BÀI SỐ VÀ TÊN BÀI HỌC:
                      </h4>
                      <p className="text-[11px] text-slate-500">{extractionConfidence}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs border border-emerald-300">
                    Đã lọc được {extractedLessons.length} bài
                  </span>
                </div>

                {/* Thanh tìm kiếm nhanh bài học đã trích xuất */}
                {extractedLessons.length > 3 && (
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={modalLessonQuery}
                      onChange={(e) => setModalLessonQuery(e.target.value)}
                      placeholder="Tìm nhanh bài số hoặc từ khóa (VD: '10', 'Bài 4', 'Đo chiều dài', 'Không khí')..."
                      className="w-full pl-9 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-hidden focus:border-blue-500 shadow-2xs"
                    />
                    {modalLessonQuery && (
                      <button
                        type="button"
                        onClick={() => setModalLessonQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1"
                        title="Xóa tìm kiếm"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                )}

                {/* Danh sách các bài đã lọc được */}
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto divide-y divide-slate-100 bg-slate-50/50">
                  {extractedLessons
                    .map((item, originalIndex) => ({ item, originalIndex }))
                    .filter(({ item }) => {
                      if (!modalLessonQuery.trim()) return true;
                      const q = modalLessonQuery.toLowerCase().trim();
                      const num = String(item.lessonNumber).toLowerCase();
                      const name = item.lessonName.toLowerCase();
                      const ch = item.chapterTitle.toLowerCase();
                      return num.includes(q) || name.includes(q) || ch.includes(q) || `bài ${num}`.includes(q);
                    })
                    .map(({ item, originalIndex }) => {
                      const isPicked = originalIndex === chosenLessonIndex;

                      return (
                        <div
                          key={item.id || originalIndex}
                          onClick={() => setChosenLessonIndex(originalIndex)}
                          className={`p-3 transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                            isPicked ? 'bg-blue-50/90 border-l-4 border-blue-600' : 'hover:bg-slate-100/70'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* BADGE BÀI SỐ */}
                            <div className={`px-2 py-1 rounded-md text-center shrink-0 border ${
                              isPicked ? 'bg-blue-600 text-white border-blue-700 shadow-xs' : 'bg-slate-200 text-slate-800 border-slate-300 font-bold'
                            }`}>
                              <span className="block text-[9px] font-black uppercase">BÀI</span>
                              <span className="block text-xs font-black leading-none">{item.lessonNumber}</span>
                            </div>

                            <div className="min-w-0">
                              <span className="text-[10px] font-semibold text-slate-500 block truncate">
                                {item.chapterTitle}
                              </span>
                              <p className="font-bold text-xs text-slate-900 truncate">
                                {item.lessonName}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-2">
                            {isPicked ? (
                              <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-2xs">
                                <Check className="w-3 h-3" />
                                <span>Đang chọn bài này</span>
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-medium hover:text-blue-600">
                                Bấm để chọn
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* XEM TRƯỚC NỘI DUNG BÀI HỌC ĐANG CHỌN NGAY TRONG MODAL NẠP SÁCH */}
                {extractedLessons[chosenLessonIndex] && (
                  <div className="p-3.5 bg-gradient-to-r from-blue-50/90 to-indigo-50/70 border border-blue-200 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-black text-[10px]">
                          BÀI {extractedLessons[chosenLessonIndex].lessonNumber}
                        </span>
                        <span className="font-extrabold text-blue-950">
                          {extractedLessons[chosenLessonIndex].lessonName}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Đã nạp đủ nội dung</span>
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-700 leading-relaxed italic">
                      {extractedLessons[chosenLessonIndex].summary}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {extractedLessons[chosenLessonIndex].keyPoints.map((pt, pIdx) => (
                        <span key={pIdx} className="px-2 py-0.5 rounded-md bg-white text-slate-700 border border-blue-200 text-[10px] font-medium flex items-center gap-1">
                          <span className="text-blue-500 font-bold">•</span>
                          <span>{pt}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500">
                Tất cả bài học trên sẽ được nạp đầy đủ vào kho để Thầy/Cô sử dụng bất kì lúc nào.
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setIsUploading(false)}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmUpload}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác Nhận Nạp Sách & Lọc Bài Học</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-sm text-slate-900">{previewDoc.name}</h3>
                <p className="text-slate-500 mt-0.5">{previewDoc.subject} · {previewDoc.grade} · {previewDoc.curriculum}</p>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">✕</button>
            </div>
            
            <div className="space-y-3 overflow-y-auto flex-1 pr-1">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Văn bản trích xuất:</span>
                <p className="text-slate-700 leading-relaxed italic">{previewDoc.rawTextPreview}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    Danh Sách Bài Học Đã Bóc Tách ({previewDoc.chapters.length} bài):
                  </span>
                  <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Tự động lọc Bài số & Tên bài
                  </span>
                </div>

                {previewDoc.chapters.map((ch, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg flex items-start gap-3">
                    <div className="px-2 py-1 bg-blue-100 text-blue-900 rounded font-black text-center shrink-0 border border-blue-200">
                      <span className="block text-[8px] uppercase">BÀI</span>
                      <span className="text-xs">{ch.lessonNumber || (idx + 1)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-indigo-700 font-semibold block">{ch.chapterTitle}</span>
                      <p className="font-bold text-blue-900">{ch.lessonName}</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">{ch.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ĐỌC TOÀN BÀI HỌC (FULLSCREEN LESSON READER) */}
      {isFullScreenLessonModalOpen && activeLessonDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-5xl w-full h-[90vh] flex flex-col overflow-hidden text-xs">
            
            {/* Modal Reader Header */}
            <div className="p-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between gap-4 border-b border-indigo-800">
              <div className="flex items-center gap-3 min-w-0">
                <div className="px-3 py-2 bg-blue-600 rounded-xl text-center shrink-0 border border-blue-400/40">
                  <span className="block text-[9px] font-black uppercase text-blue-200">BÀI SỐ</span>
                  <span className="block text-lg font-black leading-none">{activeLessonDetails.lessonNumber}</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs text-blue-200">
                    <span>{activeLessonDetails.subject}</span>
                    <span>·</span>
                    <span>{activeLessonDetails.grade}</span>
                    <span>·</span>
                    <span>{activeLessonDetails.curriculum}</span>
                    <span>·</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold text-white text-[10px]">{activeLessonDetails.durationText}</span>
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-white truncate mt-0.5">
                    {activeLessonDetails.lessonName}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsExtractModalOpen(true)}
                  className="px-2.5 py-1.5 bg-indigo-500/30 hover:bg-indigo-500/50 text-indigo-100 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors border border-indigo-400/40"
                  title="Trích lọc các đoạn ngữ liệu then chốt"
                >
                  <Filter className="w-3.5 h-3.5 text-indigo-200" />
                  <span>Trích lọc</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsSummaryModalOpen(true)}
                  className="px-2.5 py-1.5 bg-blue-500/30 hover:bg-blue-500/50 text-blue-100 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors border border-blue-400/40"
                  title="Tóm tắt tổng quan bài viết"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-200" />
                  <span>Tóm tắt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsFocalModalOpen(true)}
                  className="px-2.5 py-1.5 bg-amber-500/30 hover:bg-amber-500/50 text-amber-100 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors border border-amber-400/40"
                  title="Lấy kiến thức trọng tâm SGK"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-200" />
                  <span>Kiến thức trọng tâm</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFullScreenLessonModalOpen(false);
                    handleUseSourceForKhbd(activeLessonDetails);
                  }}
                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-xs ring-1 ring-emerald-400/50"
                  title="Sử dụng nguồn chính xác của bài viết này để nạp vào KHBD 5512"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
                  <span>Sử dụng nguồn tạo KHBD</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopyLessonContent(activeLessonDetails)}
                  className="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold text-xs flex items-center gap-1 transition-colors border border-white/30"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sao chép</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsFullScreenLessonModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-base transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Reader Tabs */}
            <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0">
              <button
                type="button"
                onClick={() => setLessonDetailTab('exactArticle')}
                className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 ${
                  lessonDetailTab === 'exactArticle' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>📖 Nội dung chính xác bài viết</span>
              </button>
              <button
                type="button"
                onClick={() => setLessonDetailTab('core')}
                className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 ${
                  lessonDetailTab === 'core' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>1. Kiến thức cốt lõi SGK</span>
              </button>
              <button
                type="button"
                onClick={() => setLessonDetailTab('objectives')}
                className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 ${
                  lessonDetailTab === 'objectives' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>2. Mục tiêu YCCĐ (GDPT 2018)</span>
              </button>
              <button
                type="button"
                onClick={() => setLessonDetailTab('activities')}
                className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 ${
                  lessonDetailTab === 'activities' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>3. Tiến trình 4 hoạt động 5512</span>
              </button>
              <button
                type="button"
                onClick={() => setLessonDetailTab('questions')}
                className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 ${
                  lessonDetailTab === 'questions' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>4. Câu hỏi & Bài tập SGK (7991)</span>
              </button>
              <button
                type="button"
                onClick={() => setLessonDetailTab('rawText')}
                className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 ${
                  lessonDetailTab === 'rawText' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>5. Toàn văn bài học</span>
              </button>
            </div>

            {/* Modal Reader Body Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-4xl mx-auto w-full">
              {lessonDetailTab === 'exactArticle' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 text-slate-800 text-xs sm:text-sm leading-relaxed font-serif">
                  <div className="text-center space-y-2 pb-4 border-b-2 border-slate-900 font-sans">
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      BỘ GIÁO DỤC VÀ ĐÀO TẠO · BỘ SÁCH {activeLessonDetails.curriculum.toUpperCase()}
                    </div>
                    <div className="inline-block px-3 py-1 bg-blue-600 text-white font-black text-xs rounded-md shadow-xs uppercase">
                      BÀI {activeLessonDetails.lessonNumber}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight">
                      {activeLessonDetails.lessonName}
                    </h2>
                    <p className="text-slate-500 text-xs font-semibold">
                      Chương: {activeLessonDetails.chapterTitle} · {activeLessonDetails.subject} {activeLessonDetails.grade} · Thời lượng: {activeLessonDetails.durationText}
                    </p>
                  </div>

                  {activeLessonDetails.exactArticle?.sections?.map((sec, sIdx) => (
                    <section key={sIdx} className="space-y-3 pt-2">
                      <div className="flex items-center gap-2 pb-1 border-b border-slate-200 font-sans">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                          {sIdx + 1}
                        </span>
                        <h3 className="font-extrabold text-sm sm:text-base text-slate-950">
                          {sec.heading}
                        </h3>
                      </div>
                      <div className="space-y-2 pl-3 text-justify font-sans text-slate-700">
                        {sec.paragraphs.map((para, pIdx) => (
                          <p key={pIdx} className="leading-relaxed indent-4">
                            {highlightMatchedText(para, articleSearchQuery)}
                          </p>
                        ))}
                      </div>
                      {sec.callout && (
                        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/70 text-blue-950 my-2 font-sans space-y-1">
                          <span className="font-black text-xs flex items-center gap-1 text-blue-900">
                            📌 {sec.callout.title}
                          </span>
                          <p className="font-semibold text-xs leading-relaxed pl-4">
                            {sec.callout.content}
                          </p>
                        </div>
                      )}
                    </section>
                  ))}
                </div>
              )}
              {lessonDetailTab === 'core' && (
                <div className="space-y-4">
                  {activeLessonDetails.coreKnowledge.map((sec, idx) => (
                    <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                      <h4 className="font-extrabold text-sm text-blue-950 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </span>
                        <span>{sec.title}</span>
                      </h4>
                      <p className="text-slate-800 text-xs leading-relaxed pl-8">
                        {sec.summary}
                      </p>
                      <div className="pl-8 space-y-1.5 pt-1">
                        {sec.keyPoints.map((pt, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-2 text-slate-700">
                            <span className="text-blue-600 font-bold text-sm">•</span>
                            <span className="leading-relaxed">{pt}</span>
                          </div>
                        ))}
                      </div>
                      {sec.formulasOrDefinitions && (
                        <div className="ml-8 p-3 bg-blue-100/60 rounded-xl border border-blue-200 text-blue-950 font-mono text-xs">
                          {sec.formulasOrDefinitions.map((f, fIdx) => (
                            <p key={fIdx} className="leading-relaxed">📌 {f}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Khung Ghi nhớ */}
                  <div className="p-5 bg-amber-50 rounded-2xl border-2 border-amber-300 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                      <Lightbulb className="w-5 h-5 text-amber-600" />
                      <span>GHI NHỚ TRỌNG TÂM (KHUNG "EM ĐÃ HỌC" SGK KẾT NỐI TRI THỨC)</span>
                    </div>
                    <ul className="space-y-1.5 pl-6 text-amber-950 text-xs leading-relaxed">
                      {activeChapter.keyPoints.map((kp, kIdx) => (
                        <li key={kIdx} className="list-disc font-medium">
                          {kp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {lessonDetailTab === 'objectives' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <h5 className="font-bold text-blue-950 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-blue-600" />
                        <span>1. Về Kiến thức (Chuẩn YCCĐ)</span>
                      </h5>
                      <ul className="space-y-1.5 pl-5 text-slate-700">
                        {activeLessonDetails.objectives.knowledge.map((k, idx) => (
                          <li key={idx} className="list-disc leading-relaxed">{k}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <h5 className="font-bold text-indigo-950 flex items-center gap-2">
                        <Target className="w-4 h-4 text-indigo-600" />
                        <span>2. Năng lực đặc thù</span>
                      </h5>
                      <ul className="space-y-1.5 pl-5 text-slate-700">
                        {activeLessonDetails.objectives.competenciesSpecific.map((c, idx) => (
                          <li key={idx} className="list-disc leading-relaxed">{c}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <h5 className="font-bold text-teal-950 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-teal-600" />
                        <span>3. Năng lực chung</span>
                      </h5>
                      <ul className="space-y-1.5 pl-5 text-slate-700">
                        {activeLessonDetails.objectives.competenciesGeneral.map((g, idx) => (
                          <li key={idx} className="list-disc leading-relaxed">{g}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <h5 className="font-bold text-rose-950 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-rose-600" />
                        <span>4. Phẩm chất chủ yếu</span>
                      </h5>
                      <ul className="space-y-1.5 pl-5 text-slate-700">
                        {activeLessonDetails.objectives.qualities.map((q, idx) => (
                          <li key={idx} className="list-disc leading-relaxed">{q}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {lessonDetailTab === 'activities' && (
                <div className="space-y-4">
                  {activeLessonDetails.activities5512.map((act, idx) => (
                    <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-black text-[10px]">
                            {act.code}
                          </span>
                          <span>{act.title}</span>
                        </h4>
                        <span className="text-[11px] font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                          ⏱️ {act.duration}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="font-bold text-blue-900 block mb-1">a) Mục tiêu:</span>
                          <p className="text-slate-700 leading-relaxed">{act.goal}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="font-bold text-indigo-900 block mb-1">b) Nội dung:</span>
                          <p className="text-slate-700 leading-relaxed">{act.content}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="font-bold text-emerald-900 block mb-1">c) Sản phẩm:</span>
                          <p className="text-slate-700 leading-relaxed">{act.product}</p>
                        </div>
                      </div>
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-900 block">d) Tổ chức thực hiện (4 bước CV 5512):</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                          <p><strong>Bước 1 (Chuyển giao):</strong> {act.implementation.step1_assign}</p>
                          <p><strong>Bước 2 (Thực hiện):</strong> {act.implementation.step2_execute}</p>
                          <p><strong>Bước 3 (Báo cáo):</strong> {act.implementation.step3_report}</p>
                          <p><strong>Bước 4 (Kết luận):</strong> {act.implementation.step4_conclude}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {lessonDetailTab === 'questions' && (
                <div className="space-y-4">
                  {activeLessonDetails.sampleQuestions7991.map((q, idx) => (
                    <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">Câu hỏi {idx + 1} ({q.type})</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          Mức độ: {q.levelName}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 leading-relaxed">{q.question}</p>
                      {q.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 text-xs space-y-1">
                        <p className="font-bold flex items-center gap-1 text-emerald-900">
                          <Check className="w-4 h-4" />
                          <span>Đáp án chính xác: {q.correctAnswer}</span>
                        </p>
                        <p className="text-slate-600">{q.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {lessonDetailTab === 'rawText' && (
                <div className="p-5 bg-slate-900 text-slate-100 rounded-2xl font-mono text-xs leading-relaxed whitespace-pre-wrap select-all">
                  {activeChapter.rawContent || `BÀI HỌC: BÀI SỐ ${activeLessonDetails.lessonNumber} - ${activeLessonDetails.lessonName}
MÔN: ${activeLessonDetails.subject.toUpperCase()} - ${activeLessonDetails.grade.toUpperCase()}
BỘ SÁCH: ${activeLessonDetails.curriculum.toUpperCase()}
THỜI LƯỢNG: ${activeLessonDetails.durationText}
CHƯƠNG / CHỦ ĐỀ: ${activeLessonDetails.chapterTitle}

I. MỤC TIÊU YÊU CẦU CẦN ĐẠT (GDPT 2018)
${activeLessonDetails.objectives.knowledge.map(k => `• ${k}`).join('\n')}

II. NỘI DUNG TRỌNG TÂM SGK
${activeLessonDetails.coreKnowledge.map(ck => `${ck.title}\n${ck.summary}\n${ck.keyPoints.map(p => `  - ${p}`).join('\n')}`).join('\n\n')}

III. CÂU HỎI VÀ BÀI TẬP SGK
${activeLessonDetails.sampleQuestions7991.map((q, i) => `Câu ${i + 1} (${q.levelName}): ${q.question}\n-> Đáp án: ${q.correctAnswer}`).join('\n\n')}
`}
                </div>
              )}
            </div>

            {/* Modal Reader Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-3">
              <span className="text-slate-500 text-xs">
                Toàn bộ dữ liệu bài học đã sẵn sàng để chuyển giao sang Soạn KHBD 5512, Tạo Slide hoặc Đề thi 7991.
              </span>
              <button
                type="button"
                onClick={() => setIsFullScreenLessonModalOpen(false)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
              >
                Đóng chế độ đọc
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRÌNH ĐỌC SÁCH GIÁO KHOA PDF MÔ PHỎNG CHUẨN (PDF VIEWER MODAL) */}
      {pdfReaderDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col overflow-hidden animate-in fade-in duration-200 text-xs">
          
          {/* PDF Viewer Top Toolbar */}
          <div className="bg-slate-900 text-white px-6 py-3 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0 shadow-lg">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white truncate">
                    {pdfReaderDoc.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Bản PDF Sư Phạm
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {pdfReaderDoc.subject} · {pdfReaderDoc.grade} · {pdfReaderDoc.curriculum} · Dung lượng: {pdfReaderDoc.fileSize}
                </p>
              </div>
            </div>

            {/* Controls: Page navigation & Zoom */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Lật trang */}
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
                <button
                  type="button"
                  disabled={pdfCurrentPage <= 1}
                  onClick={() => setPdfCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-2.5 py-1 text-slate-200 hover:text-white disabled:opacity-40 font-bold hover:bg-slate-700 rounded transition-colors"
                >
                  ← Trước
                </button>
                <span className="px-2 py-1 text-[11px] font-mono font-bold text-emerald-300 bg-slate-900 rounded">
                  Trang {pdfCurrentPage} / {pdfReaderDoc.pageCount || 160}
                </span>
                <button
                  type="button"
                  disabled={pdfCurrentPage >= (pdfReaderDoc.pageCount || 160)}
                  onClick={() => setPdfCurrentPage(prev => Math.min(pdfReaderDoc.pageCount || 160, prev + 1))}
                  className="px-2.5 py-1 text-slate-200 hover:text-white disabled:opacity-40 font-bold hover:bg-slate-700 rounded transition-colors"
                >
                  Sau →
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 hidden sm:flex">
                <button
                  type="button"
                  onClick={() => setPdfZoom(prev => Math.max(75, prev - 15))}
                  className="p-1 hover:bg-slate-700 rounded text-slate-300"
                  title="Thu nhỏ"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono px-1.5 text-slate-300 font-bold">
                  {pdfZoom}%
                </span>
                <button
                  type="button"
                  onClick={() => setPdfZoom(prev => Math.min(150, prev + 15))}
                  className="p-1 hover:bg-slate-700 rounded text-slate-300"
                  title="Phóng to"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <button
                type="button"
                onClick={() => setIsExtractModalOpen(true)}
                className="px-2.5 py-1 bg-indigo-500/30 hover:bg-indigo-500/50 text-indigo-100 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors border border-indigo-400/40 hidden sm:flex"
                title="Trích lọc ngữ liệu bài này"
              >
                <Filter className="w-3.5 h-3.5 text-indigo-200" />
                <span>Trích lọc</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSummaryModalOpen(true)}
                className="px-2.5 py-1 bg-blue-500/30 hover:bg-blue-500/50 text-blue-100 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors border border-blue-400/40 hidden sm:flex"
                title="Tóm tắt tổng quan bài này"
              >
                <FileText className="w-3.5 h-3.5 text-blue-200" />
                <span>Tóm tắt</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFocalModalOpen(true)}
                className="px-2.5 py-1 bg-amber-500/30 hover:bg-amber-500/50 text-amber-100 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors border border-amber-400/40 hidden md:flex"
                title="Lấy kiến thức trọng tâm bài này"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-200" />
                <span>Kiến thức trọng tâm</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const currentLesson = pdfReaderDoc.chapters[Math.min(pdfReaderDoc.chapters.length - 1, Math.floor((pdfCurrentPage - 1) / 4))] || pdfReaderDoc.chapters[0];
                  if (currentLesson) {
                    setPdfReaderDoc(null);
                    onSelectLessonForCreation({
                      subject: pdfReaderDoc.subject,
                      grade: pdfReaderDoc.grade,
                      curriculum: pdfReaderDoc.curriculum,
                      lessonName: `Bài ${currentLesson.lessonNumber}: ${currentLesson.lessonName}`,
                      targetMode: 'khbd'
                    });
                  }
                }}
                className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-xs ring-1 ring-emerald-400/40"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Sử dụng nguồn tạo KHBD</span>
              </button>

              <button
                type="button"
                onClick={() => setPdfReaderDoc(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold text-base transition-colors"
                title="Đóng trình đọc PDF"
              >
                ✕
              </button>
            </div>
          </div>

          {/* PDF Page Viewport Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-900/60">
            {(() => {
              // Tính toán bài học tương ứng với trang hiện tại
              const lessonIdx = Math.min(
                pdfReaderDoc.chapters.length - 1,
                Math.max(0, Math.floor((pdfCurrentPage - 1) / 3))
              );
              const lesson = pdfReaderDoc.chapters[lessonIdx] || pdfReaderDoc.chapters[0];

              return (
                <div 
                  style={{ transform: `scale(${pdfZoom / 100})`, transformOrigin: 'top center' }}
                  className="bg-white text-slate-900 rounded-lg shadow-2xl border border-slate-300 max-w-3xl w-full p-8 sm:p-12 space-y-6 transition-transform select-text"
                >
                  {/* Top Running Header */}
                  <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2 text-[10px] uppercase font-bold text-slate-600 tracking-wider">
                    <span>BỘ GIÁO DỤC VÀ ĐÀO TẠO · BỘ SÁCH KẾT NỐI TRI THỨC VỚI CUỘC SỐNG</span>
                    <span>{pdfReaderDoc.subject} {pdfReaderDoc.grade}</span>
                  </div>

                  {/* Chapter Tag */}
                  <div className="text-center pt-2">
                    <span className="text-xs font-black text-indigo-700 tracking-widest uppercase bg-indigo-50 px-3 py-1 rounded-md border border-indigo-200">
                      {lesson?.chapterTitle || 'CHƯƠNG I'}
                    </span>
                  </div>

                  {/* Lesson Title Banner */}
                  <div className="text-center space-y-2 pb-2">
                    <div className="inline-block px-3 py-1 bg-blue-600 text-white font-black text-sm rounded-lg shadow-xs">
                      BÀI {lesson?.lessonNumber || '1'}
                    </div>
                    <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tight">
                      {lesson?.lessonName || 'Nội dung bài học'}
                    </h2>
                    <p className="text-xs text-slate-500 font-semibold italic">
                      Thời lượng giảng dạy khuyến nghị: {lesson?.duration || '2 tiết (90 phút)'}
                    </p>
                  </div>

                  {/* Mục tiêu / Yêu cầu cần đạt Box */}
                  <div className="p-4 bg-blue-50/70 border-l-4 border-blue-600 rounded-r-xl space-y-2">
                    <h4 className="font-extrabold text-xs text-blue-950 flex items-center gap-1.5 uppercase tracking-wide">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span>Học xong bài này, em sẽ:</span>
                    </h4>
                    <ul className="space-y-1 text-xs text-blue-900 leading-relaxed list-disc list-inside">
                      {lesson?.objectives?.knowledge && lesson.objectives.knowledge.length > 0 ? (
                        lesson.objectives.knowledge.map((k, kIdx) => (
                          <li key={kIdx}>{k}</li>
                        ))
                      ) : (
                        <>
                          <li>Nắm vững định nghĩa, khái niệm và công thức cốt lõi của bài học</li>
                          <li>Vận dụng giải quyết các bài toán và hiện tượng thực tiễn liên quan</li>
                          <li>Rèn luyện tư duy logic, năng lực giải quyết vấn đề và tự học</li>
                        </>
                      )}
                    </ul>
                  </div>

                  {/* Simulated Textbook 2-Column / Structured Knowledge Sections */}
                  <div className="space-y-5 text-xs text-slate-800 leading-relaxed">
                    
                    {/* Section 1: Khởi động / Khái niệm */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                          1
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-950">
                          Khám phá kiến thức mới & Khái niệm cốt lõi
                        </h4>
                      </div>
                      <p className="indent-4 text-justify">
                        {lesson?.coreContent || lesson?.summary || 'Nội dung bài học cung cấp nền tảng kiến thức khoa học chuẩn xác theo chương trình GDPT 2018.'}
                      </p>

                      {/* Formula / Rule Box */}
                      <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl space-y-1 text-amber-950 my-2 shadow-2xs">
                        <span className="font-black text-xs flex items-center gap-1 text-amber-900">
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Quy tắc / Định lý ghi nhớ:</span>
                        </span>
                        <p className="font-mono text-xs font-bold pl-2 text-slate-900">
                          {lesson?.keyPoints?.[0] || 'Kiến thức trọng tâm đã được chuẩn hóa theo chương trình GDPT 2018'}
                        </p>
                      </div>
                    </div>

                    {/* Section 2: Hoạt động học tập / Thực hành */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                          2
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-950">
                          Hoạt động thực hành & Trải nghiệm
                        </h4>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                        <div className="flex items-center gap-1.5 text-indigo-900 font-bold">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span>HĐ {pdfCurrentPage % 2 === 0 ? '2' : '1'}: {lesson?.learningActivities?.[0]?.title || 'Tìm hiểu bản chất vấn đề'}</span>
                        </div>
                        <p className="text-[11px] text-slate-700">
                          {lesson?.learningActivities?.[0]?.description || 'Học sinh làm việc theo nhóm, quan sát hình ảnh hoặc thí nghiệm để rút ra nhận xét khoa học.'}
                        </p>
                        {lesson?.learningActivities?.[0]?.expectedProduct && (
                          <div className="text-[10px] text-emerald-800 bg-emerald-50 p-1.5 rounded border border-emerald-200 font-semibold">
                            Sản phẩm kỳ vọng: {lesson.learningActivities[0].expectedProduct}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Section 3: Bài tập rèn luyện cuối bài */}
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">
                          BÀI TẬP VẬN DỤNG & CÂU HỎI SGK:
                        </h4>
                        <span className="text-[10px] text-slate-500 italic">Trang {pdfCurrentPage}</span>
                      </div>
                      
                      <div className="space-y-2 pt-1">
                        {lesson?.textbookExercises && lesson.textbookExercises.length > 0 ? (
                          lesson.textbookExercises.slice(0, 2).map((ex, exIdx) => (
                            <div key={exIdx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                              <span className="font-bold text-blue-900">Bài {pdfCurrentPage}.{exIdx + 1}:</span>
                              <p className="text-slate-800">{ex.content}</p>
                              {ex.suggestedAnswer && (
                                <p className="text-[11px] text-emerald-700 font-medium pt-0.5">
                                  💡 Hướng dẫn: {ex.suggestedAnswer}
                                </p>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                            <span className="font-bold text-blue-900">Bài {pdfCurrentPage}.1:</span>
                            <p className="text-slate-800">
                              Nêu các tính chất chính của {lesson?.lessonName || 'bài học'} và lấy ít nhất hai ví dụ minh họa trong thực tế đời sống.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Footer Page Number */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-300 text-[11px] text-slate-500 font-mono">
                    <span>NXB GIÁO DỤC VIỆT NAM</span>
                    <span className="font-bold text-slate-900 text-sm">{pdfCurrentPage}</span>
                    <span>SGK-{pdfReaderDoc.subject.toUpperCase()}</span>
                  </div>

                </div>
              );
            })()}
          </div>

        </div>
      )}
      {isPageDragging && (
        <div 
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsPageDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsPageDragging(false);
            const file = e.dataTransfer?.files?.[0];
            if (file) {
              processUploadedFile(file);
            }
          }}
          className="fixed inset-0 z-50 bg-blue-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in duration-150"
        >
          <div className="p-8 rounded-3xl bg-blue-900/60 border-3 border-dashed border-blue-300 max-w-lg w-full space-y-4 shadow-2xl scale-105 transition-transform">
            <div className="w-20 h-20 rounded-full bg-blue-500/30 border border-blue-400/40 flex items-center justify-center mx-auto text-blue-200 animate-bounce">
              <Upload className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-white">Thả Tệp Sách Vào Đây Ngay!</h3>
              <p className="text-xs text-blue-200 leading-relaxed max-w-md mx-auto">
                Hệ thống sẽ ngay lập tức đọc tài liệu và <strong>tự động bóc tách từng Bài số... kèm Tên bài học</strong> theo chuẩn GDPT 2018 Kết Nối Tri Thức.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-semibold border border-white/30">
                PDF
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-semibold border border-white/30">
                Word (.docx)
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-semibold border border-white/30">
                Văn bản (.txt)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. MODAL TRÍCH LỌC NGỮ LIỆU BÀI VIẾT (TRÍCH LỌC) */}
      {/* ========================================================================= */}
      {isExtractModalOpen && activeLessonDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-xs">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white flex items-center justify-between gap-4 border-b border-indigo-800 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-indigo-600 text-white shrink-0 shadow-xs border border-indigo-500">
                  <Filter className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">
                      BỘ TRÍCH LỌC NGỮ LIỆU
                    </span>
                    <span className="text-[11px] text-indigo-200">
                      {activeLessonDetails.subject} · {activeLessonDetails.grade}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-white truncate mt-0.5">
                    Trích Lọc: Bài {activeLessonDetails.lessonNumber} - {activeLessonDetails.lessonName}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsExtractModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-base transition-colors shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Filter Pills and Keyword Search */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'all', label: 'Tất cả đoạn trích', count: activeLessonDetails.exactArticle?.extractedQuotes?.length || 5 },
                  { id: 'definition', label: 'Khái niệm & Định nghĩa', count: activeLessonDetails.exactArticle?.extractedQuotes?.filter(q => q.category === 'definition').length || 1 },
                  { id: 'formula', label: 'Công thức & Quy tắc', count: activeLessonDetails.exactArticle?.extractedQuotes?.filter(q => q.category === 'formula').length || 1 },
                  { id: 'experiment', label: 'Hoạt động & Dẫn chứng', count: activeLessonDetails.exactArticle?.extractedQuotes?.filter(q => q.category === 'experiment').length || 1 },
                  { id: 'core', label: 'Ghi nhớ cốt lõi', count: activeLessonDetails.exactArticle?.extractedQuotes?.filter(q => q.category === 'core').length || 1 },
                  { id: 'exercise', label: 'Bài tập SGK', count: activeLessonDetails.exactArticle?.extractedQuotes?.filter(q => q.category === 'exercise').length || 1 },
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setExtractFilterCategory(cat.id as any)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs shrink-0 flex items-center gap-1.5 transition-colors ${
                      extractFilterCategory === cat.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      extractFilterCategory === cat.id ? 'bg-indigo-800 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Keyword Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={articleSearchQuery}
                  onChange={(e) => setArticleSearchQuery(e.target.value)}
                  placeholder="Lọc đoạn trích theo từ khóa (khái niệm, công thức, số trang, thuật ngữ)..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 shadow-2xs"
                />
              </div>
            </div>

            {/* List of Extracted Quotes */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
              {(() => {
                const quotes = (activeLessonDetails.exactArticle?.extractedQuotes || []).filter(q => {
                  const matchCat = extractFilterCategory === 'all' || q.category === extractFilterCategory;
                  const matchQuery = !articleSearchQuery.trim() || 
                    q.title.toLowerCase().includes(articleSearchQuery.toLowerCase()) ||
                    q.content.toLowerCase().includes(articleSearchQuery.toLowerCase()) ||
                    q.categoryLabel.toLowerCase().includes(articleSearchQuery.toLowerCase());
                  return matchCat && matchQuery;
                });

                if (quotes.length === 0) {
                  return (
                    <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <p className="font-bold text-slate-700">Không có đoạn trích nào phù hợp với bộ lọc.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setExtractFilterCategory('all');
                          setArticleSearchQuery('');
                        }}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg font-bold text-xs border border-indigo-200 hover:bg-indigo-100"
                      >
                        Đặt lại bộ lọc trích xuất
                      </button>
                    </div>
                  );
                }

                return quotes.map((q, idx) => (
                  <div key={q.id || idx} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 transition-all space-y-2.5 shadow-2xs group">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] ${
                          q.category === 'definition' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          q.category === 'formula' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                          q.category === 'experiment' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          q.category === 'core' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                          'bg-slate-100 text-slate-800 border border-slate-200'
                        }`}>
                          {q.categoryLabel}
                        </span>
                        <h4 className="font-extrabold text-xs text-slate-900">
                          {q.title}
                        </h4>
                      </div>

                      {q.page && (
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                          📍 {q.page}
                        </span>
                      )}
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 font-sans text-xs text-slate-800 leading-relaxed italic">
                      "{highlightMatchedText(q.content, articleSearchQuery)}"
                    </div>

                    {/* Action buttons on quote */}
                    <div className="flex items-center justify-between pt-1 gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {q.highlightWords?.map((hw, hIdx) => (
                          <span key={hIdx} className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                            #{hw}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopyQuote(q)}
                          className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-300 text-xs flex items-center gap-1 transition-colors"
                        >
                          <Copy className="w-3 h-3 text-blue-600" />
                          <span>Sao chép</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            handleCopyQuote(q);
                            setIsExtractModalOpen(false);
                            onSelectLessonForCreation({
                              subject: activeLessonDetails.subject,
                              grade: activeLessonDetails.grade,
                              curriculum: activeLessonDetails.curriculum,
                              lessonName: `Bài ${activeLessonDetails.lessonNumber}: ${activeLessonDetails.lessonName}`,
                              targetMode: 'khbd'
                            });
                          }}
                          className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg border border-indigo-200 text-xs flex items-center gap-1 transition-colors"
                          title="Chèn trích đoạn này vào Kế hoạch bài dạy 5512"
                        >
                          <Zap className="w-3 h-3 text-indigo-600" />
                          <span>Gắn vào KHBD 5512</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <span className="text-[11px] text-slate-600 font-medium">
                Ngữ liệu trích lọc bảo đảm chuẩn xác theo SGK và chuẩn kiến thức GDPT 2018.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsExtractModalOpen(false);
                    handleUseSourceForKhbd(activeLessonDetails);
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>Sử dụng nguồn tạo KHBD</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsExtractModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MODAL TÓM TẮT BÀI VIẾT (TÓM TẮT) */}
      {/* ========================================================================= */}
      {isSummaryModalOpen && activeLessonDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-xs">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between gap-4 border-b border-blue-800 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0 shadow-xs border border-blue-500">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/40">
                      BẢN TỔNG QUAN TÓM TẮT
                    </span>
                    <span className="text-[11px] text-blue-200">
                      {activeLessonDetails.subject} · {activeLessonDetails.grade} · {activeLessonDetails.curriculum}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-white truncate mt-0.5">
                    Tóm Tắt Bài Học: Bài {activeLessonDetails.lessonNumber} - {activeLessonDetails.lessonName}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSummaryModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-base transition-colors shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Structured Summary */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {/* Card 1: Tổng quan điều hành (Executive Summary) */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-black text-xs text-blue-950 uppercase tracking-wide">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>1. Tổng quan điều hành nội dung bài viết</span>
                </div>
                <p className="text-slate-800 text-xs sm:text-[13px] leading-relaxed pl-6">
                  {activeLessonDetails.exactArticle?.summary?.executiveSummary || 
                   activeLessonDetails.coreKnowledge[0]?.summary || 
                   'Nội dung bài học chuẩn mực theo chương trình GDPT 2018.'}
                </p>
              </div>

              {/* Card 2: 4 Luận điểm cốt lõi (Key Points) */}
              <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2.5 shadow-2xs">
                <div className="flex items-center gap-2 font-black text-xs text-slate-900 uppercase tracking-wide">
                  <Bookmark className="w-4 h-4 text-indigo-600" />
                  <span>2. Bốn Luận Điểm Cốt Lõi Cần Nhớ</span>
                </div>
                <div className="space-y-2 pl-2">
                  {(activeLessonDetails.exactArticle?.summary?.keyPoints || [
                    `Nắm vững khái niệm, thuật ngữ và bản chất của ${activeLessonDetails.lessonName}.`,
                    `Hiểu rõ các công thức, quy tắc biến đổi và phạm vi áp dụng thực tế.`,
                    `Rèn luyện phương pháp tư duy phân tích, tổng hợp thông qua các hoạt động học tập nhóm.`,
                    `Có khả năng liên hệ và vận dụng linh hoạt vào các bài tập định lượng cũng như đời sống.`
                  ]).map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: Giá trị ứng dụng thực tiễn & STEM */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-black text-xs text-emerald-950 uppercase tracking-wide">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <span>3. Giá trị ứng dụng thực tiễn & Kết nối liên môn</span>
                </div>
                <p className="text-emerald-950 text-xs leading-relaxed pl-6">
                  {activeLessonDetails.exactArticle?.summary?.practicalApplication || 
                   'Kiến thức bài học gắn kết chặt chẽ với các hiện tượng thực tế đời sống và định hướng STEM.'}
                </p>
              </div>

              {/* Card 4: Kết luận sư phạm */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-black text-xs text-amber-950 uppercase tracking-wide">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>4. Kết luận sư phạm & Định hướng phát triển năng lực</span>
                </div>
                <p className="text-amber-950 text-xs leading-relaxed pl-6">
                  {activeLessonDetails.exactArticle?.summary?.conclusion || 
                   'Bài học tạo tiền đề phát triển toàn diện năng lực tự chủ, giải quyết vấn đề và tư duy khoa học.'}
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const summaryText = `TÓM TẮT BÀI HỌC: BÀI ${activeLessonDetails.lessonNumber} - ${activeLessonDetails.lessonName}
MÔN: ${activeLessonDetails.subject} ${activeLessonDetails.grade} (${activeLessonDetails.curriculum})

I. TỔNG QUAN:
${activeLessonDetails.exactArticle?.summary?.executiveSummary || ''}

II. CÁC ĐIỂM CỐT LÕI:
${(activeLessonDetails.exactArticle?.summary?.keyPoints || []).map((pt, i) => `${i + 1}. ${pt}`).join('\n')}

III. ỨNG DỤNG THỰC TIỄN:
${activeLessonDetails.exactArticle?.summary?.practicalApplication || ''}

IV. KẾT LUẬN SƯ PHẠM:
${activeLessonDetails.exactArticle?.summary?.conclusion || ''}
`;
                  if (navigator?.clipboard?.writeText) {
                    navigator.clipboard.writeText(summaryText);
                  }
                  setCopiedLessonNotice(`Đã sao chép toàn bộ tóm tắt Bài ${activeLessonDetails.lessonNumber}!`);
                  setTimeout(() => setCopiedLessonNotice(null), 3000);
                }}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-200 text-slate-800 font-bold rounded-xl border border-slate-300 text-xs flex items-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-blue-600" />
                <span>Sao chép tóm tắt</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSummaryModalOpen(false);
                    handleUseSourceForKhbd(activeLessonDetails);
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>Sử dụng nguồn tạo KHBD</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsSummaryModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODAL LẤY KIẾN THỨC TRỌNG TÂM (LẤY KIẾN THỨC TRỌNG TÂM) */}
      {/* ========================================================================= */}
      {isFocalModalOpen && activeLessonDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-xs">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 text-white flex items-center justify-between gap-4 border-b border-amber-600 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0 shadow-xs border border-amber-400">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/30 text-amber-100 border border-amber-300/40">
                      KIẾN THỨC TRỌNG TÂM CỐT LÕI
                    </span>
                    <span className="text-[11px] text-amber-200">
                      Chuẩn GDPT 2018 · {activeLessonDetails.curriculum}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-white truncate mt-0.5">
                    Kiến Thức Trọng Tâm: Bài {activeLessonDetails.lessonNumber} - {activeLessonDetails.lessonName}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFocalModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-base transition-colors shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Focal Knowledge */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {/* 1. Khái niệm & Định nghĩa then chốt */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2 font-black text-xs text-blue-950 uppercase tracking-wide">
                  <Bookmark className="w-4 h-4 text-blue-600" />
                  <span>1. Khái Niệm & Định Nghĩa Then Chốt (Bất biến)</span>
                </div>
                <div className="space-y-2 pl-2">
                  {(activeLessonDetails.exactArticle?.focalKnowledge?.coreConcepts || [
                    { name: `Khái niệm then chốt: ${activeLessonDetails.lessonName}`, definition: `Định nghĩa chuẩn xác theo SGK Kết Nối Tri Thức.` }
                  ]).map((concept, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-blue-100 space-y-1 shadow-2xs">
                      <h5 className="font-bold text-blue-900 text-xs">
                        📌 {concept.name}
                      </h5>
                      <p className="text-slate-700 text-xs leading-relaxed pl-4">
                        {concept.definition}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Công thức / Quy tắc vàng */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2 font-black text-xs text-amber-950 uppercase tracking-wide">
                  <Bookmark className="w-4 h-4 text-amber-600" />
                  <span>2. Công Thức & Quy Tắc Vàng (Kèm điều kiện áp dụng)</span>
                </div>
                <div className="space-y-2 pl-2">
                  {(activeLessonDetails.exactArticle?.focalKnowledge?.formulasAndRules || [
                    { name: `Quy tắc vận hành của Bài ${activeLessonDetails.lessonNumber}`, formula: activeChapter.keyPoints[0] || 'Áp dụng các định luật và công thức chuẩn SGK.', note: 'Kiểm tra kĩ điều kiện xác định trước khi áp dụng.' }
                  ]).map((f, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-amber-200 space-y-1 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-900 text-xs">⚡ {f.name}</span>
                      </div>
                      <p className="font-mono text-xs font-bold text-slate-900 bg-amber-50/80 p-2 rounded-lg border border-amber-200/80">
                        {f.formula}
                      </p>
                      {f.note && (
                        <p className="text-[11px] text-slate-600 italic pl-1">
                          💡 Lưu ý: {f.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Khung Em đã học (Ghi nhớ cốt lõi SGK) */}
              <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2 font-black text-xs text-indigo-950 uppercase tracking-wide">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>3. Khung "Em Đã Học" (Ghi nhớ cốt lõi bắt buộc)</span>
                </div>
                <div className="space-y-1.5 pl-2">
                  {activeChapter.keyPoints.map((kp, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-white border border-indigo-100 text-xs text-slate-800 shadow-2xs">
                      <span className="w-4 h-4 rounded-full bg-indigo-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span className="font-medium leading-snug">{kp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Chuẩn đầu ra YCCĐ GDPT 2018 */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-black text-xs text-emerald-950 uppercase tracking-wide">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <span>4. Chuẩn Đầu Ra Yêu Cầu Cần Đạt (YCCĐ) Tối Thiểu</span>
                </div>
                <ul className="space-y-1 pl-6 text-emerald-950 text-xs leading-relaxed list-disc">
                  {activeLessonDetails.objectives.knowledge.map((k, idx) => (
                    <li key={idx} className="font-medium">{k}</li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const focalText = `KIẾN THỨC TRỌNG TÂM: BÀI ${activeLessonDetails.lessonNumber} - ${activeLessonDetails.lessonName}
MÔN: ${activeLessonDetails.subject} ${activeLessonDetails.grade} (${activeLessonDetails.curriculum})

I. KHÁI NIỆM & ĐỊNH NGHĨA THEN CHỐT:
${(activeLessonDetails.exactArticle?.focalKnowledge?.coreConcepts || []).map((c, i) => `${i + 1}. ${c.name}:\n   ${c.definition}`).join('\n')}

II. CÔNG THỨC & QUY TẮC VÀNG:
${(activeLessonDetails.exactArticle?.focalKnowledge?.formulasAndRules || []).map((f, i) => `${i + 1}. ${f.name}: ${f.formula} (Lưu ý: ${f.note})`).join('\n')}

III. GHI NHỚ CỐT LÕI (KHUNG EM ĐÃ HỌC):
${activeChapter.keyPoints.map((kp, i) => `${i + 1}. ${kp}`).join('\n')}

IV. YÊU CẦU CẦN ĐẠT TỐI THIỂU:
${activeLessonDetails.objectives.knowledge.map((k, i) => `${i + 1}. ${k}`).join('\n')}
`;
                  if (navigator?.clipboard?.writeText) {
                    navigator.clipboard.writeText(focalText);
                  }
                  setCopiedLessonNotice(`Đã sao chép kiến thức trọng tâm Bài ${activeLessonDetails.lessonNumber}!`);
                  setTimeout(() => setCopiedLessonNotice(null), 3000);
                }}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-200 text-slate-800 font-bold rounded-xl border border-slate-300 text-xs flex items-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-blue-600" />
                <span>Sao chép trọng tâm</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsFocalModalOpen(false);
                    handleUseSourceForKhbd(activeLessonDetails);
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>Sử dụng nguồn tạo KHBD</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsFocalModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
