export type Subject = 
  // Môn học nền tảng chung THCS & THPT
  | 'Toán học'
  | 'Ngữ văn'
  | 'Tiếng Anh'
  | 'Tin học'
  // Môn học đặc thù cấp THCS theo GDPT 2018 (Lớp 6, 7, 8, 9)
  | 'Khoa học tự nhiên'
  | 'Lịch sử & Địa lí'
  | 'Công nghệ'
  | 'Giáo dục công dân'
  | 'Giáo dục thể chất'
  | 'Nghệ thuật (Âm nhạc, Mĩ thuật)'
  | 'Hoạt động trải nghiệm, hướng nghiệp'
  | 'Giáo dục địa phương'
  // Phân môn chuyên sâu THPT
  | 'Vật lí'
  | 'Hoá học'
  | 'Sinh học'
  | 'Lịch sử'
  | 'Địa lí'
  | 'Giáo dục kinh tế và pháp luật';

export type GradeLevel = 'Lớp 10' | 'Lớp 11' | 'Lớp 12' | 'Lớp 9' | 'Lớp 8' | 'Lớp 7' | 'Lớp 6';

export type CurriculumSeries = 
  | 'Kết nối tri thức với cuộc sống'
  | 'Cánh diều'
  | 'Chân trời sáng tạo';

// --- PHÂN HỆ 1: KHBD THEO CÔNG VĂN 5512/BGDĐT-GDTrH (PHỤ LỤC I) ---
export interface LessonIllustration {
  id: string;
  caption: string;
  url: string;
  description?: string;
  type?: 'experiment' | 'diagram' | 'molecule' | 'chart' | 'photo' | 'sgk_scan';
  source?: string;
}

export interface ActivityImplementation {
  step1_assign: string;    // Bước 1: Chuyển giao nhiệm vụ học tập
  step2_execute: string;   // Bước 2: Thực hiện nhiệm vụ học tập (học sinh làm, GV theo dõi, hỗ trợ)
  step3_report: string;    // Bước 3: Báo cáo kết quả và thảo luận (học sinh trình bày, tranh luận)
  step4_conclude: string;  // Bước 4: Đánh giá kết quả, kết luận, nhận định
}

export interface TeachingActivity {
  id: string;
  code: 'ACT_1' | 'ACT_2' | 'ACT_3' | 'ACT_4';
  title: string;          // e.g., "Hoạt động 1: Xác định vấn đề / Khởi động"
  duration: string;       // e.g., "10 phút"
  goal: string;           // a) Mục tiêu
  content: string;        // b) Nội dung
  product: string;        // c) Sản phẩm học tập
  implementation: ActivityImplementation; // d) Tổ chức thực hiện
  studentNotes?: string;  // e) Nội dung ghi bài cho học sinh (Nội dung cốt lõi HS ghi chép vào vở / Bảng ghi của GV)
  illustrations?: LessonIllustration[]; // f) Hình ảnh minh họa bài học SGK (Thí nghiệm, sơ đồ, bảng biểu...)
  ragCitation?: {
    docName: string;
    pageNumber: string | number;
    relevanceScore: number;
    snippet: string;
  };
}

export interface LessonPlan5512 {
  schoolName: string;
  department: string;
  teacherName: string;
  subject: Subject;
  grade: GradeLevel;
  curriculum: CurriculumSeries;
  lessonName: string;
  durationInPeriods: number; // e.g., 2 tiết
  academicYear: string;
  appendixTitle?: string;    // Phụ lục I: Khung kế hoạch bài dạy (Kèm theo Công văn số 5512/BGDĐT-GDTrH)
  
  // I. Mục tiêu
  objectives: {
    knowledge: string[];
    competencies: {
      general: string[];   // Năng lực tự chủ, giao tiếp hợp tác, giải quyết vấn đề
      specific: string[];  // Năng lực đặc thù bộ môn
    };
    qualities: string[];   // Yêu nước, nhân ái, chăm chỉ, trung thực, trách nhiệm
  };

  // II. Thiết bị dạy học và học liệu
  equipments: {
    teacher: string[];
    students: string[];
  };

  // III. Tiến trình dạy học (4 hoạt động theo chuẩn 5512 Phụ lục I)
  activities: TeachingActivity[];

  // IV. Nội dung ghi bảng / Sổ tay kiến thức cốt lõi của học sinh (Tổng kết bám sát SGK Kết Nối Tri Thức)
  boardPlanSummary?: {
    title: string;
    sections: {
      heading: string;
      content: string;
      bulletPoints?: string[];
    }[];
  };
}

// --- PHÂN HỆ 2: SLIDE BÀI GIẢNG TRÌNH CHIẾU ---
export interface InteractiveSlideQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SlideItem {
  id: string;
  activityCode?: 'ACT_1' | 'ACT_2' | 'ACT_3' | 'ACT_4' | 'INTRO';
  stageLabel: string; // "Khởi động" | "Hình thành kiến thức" | "Luyện tập" | "Vận dụng" | "Tổng kết"
  title: string;
  subtitle?: string;
  bulletPoints: string[];
  calloutBox?: {
    title: string;
    text: string;
    type: 'info' | 'key-concept' | 'warning';
  };
  formulaOrCode?: string;
  speakerNotes: string;
  interactiveQuestion?: InteractiveSlideQuestion;
}

export interface SlideDeck {
  title: string;
  author: string;
  slides: SlideItem[];
}

// --- PHÂN HỆ 3: ĐỀ KIỂM TRA ĐỊNH KÌ THEO CÔNG VĂN 7991/BGDĐT-GDTrH ---
// Phần I: Trắc nghiệm nhiều lựa chọn
export interface MultipleChoiceQuestion {
  id: string;
  number: number;
  content: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  points: number; // Thường là 0.25 điểm
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng';
  topic: string;
  explanation: string;
  ragSource?: {
    docName: string;
    pageNumber: string | number;
    relevanceScore: number;
  };
}

// Phần II: Trắc nghiệm Đúng / Sai (Mỗi câu gồm 4 lệnh a, b, c, d)
export interface TrueFalseSubStatement {
  subId: 'a' | 'b' | 'c' | 'd';
  text: string;
  isCorrect: boolean; // true = Đúng, false = Sai
  explanation: string;
}

export interface TrueFalseQuestion {
  id: string;
  number: number;
  context: string; // Dữ kiện bài toán / Ngữ liệu chung
  statements: TrueFalseSubStatement[];
  pointsTotal: number; // Thường là 1.0 điểm cho đủ 4 ý đúng (theo barem: 1 ý = 0.1đ; 2 ý = 0.25đ; 3 ý = 0.5đ; 4 ý = 1.0đ)
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng';
  topic: string;
  ragSource?: {
    docName: string;
    pageNumber: string | number;
    relevanceScore: number;
  };
}

// Phần III: Trắc nghiệm trả lời ngắn
export interface ShortAnswerQuestion {
  id: string;
  number: number;
  content: string;
  acceptableAnswers: string[]; // Các đáp án được chấp nhận (e.g. ["25", "25 cm", "x = 4"])
  points: number; // e.g. 0.5 điểm
  level: 'Thông hiểu' | 'Vận dụng';
  topic: string;
  solutionGuide: string;
  ragSource?: {
    docName: string;
    pageNumber: string | number;
    relevanceScore: number;
  };
}

// Phần IV: Tự luận
export interface EssayQuestion {
  id: string;
  number: number;
  content: string;
  points: number; // e.g. 1.5 điểm
  level: 'Thông hiểu' | 'Vận dụng';
  topic: string;
  gradingCriteria: {
    step: string;
    points: number;
  }[];
  ragSource?: {
    docName: string;
    pageNumber: string | number;
    relevanceScore: number;
  };
}

// Toàn bộ đề kiểm tra 7991
export interface Exam7991 {
  title: string;
  examType: 'Kiểm tra giữa học kì 1' | 'Kiểm tra cuối học kì 1' | 'Kiểm tra giữa học kì 2' | 'Kiểm tra cuối học kì 2';
  durationMinutes: number; // 45 hoặc 90 phút
  academicYear: string;
  
  partI_MultipleChoice: MultipleChoiceQuestion[]; // 3.0 điểm (30%)
  partII_TrueFalse: TrueFalseQuestion[];          // 2.0 điểm (20%)
  partIII_ShortAnswer: ShortAnswerQuestion[];     // 2.0 điểm (20%)
  partIV_Essay: EssayQuestion[];                  // 3.0 điểm (30%)
  
  totalScore: 10.0;
  weighting: {
    recognition: number;  // Nhận biết: 40% (4.0đ)
    comprehension: number;// Thông hiểu: 30% (3.0đ)
    application: number;  // Vận dụng: 30% (3.0đ)
  };
}

// Ma trận đề kiểm tra định kì (Phụ lục 1 CV 7991)
export interface MatrixRowItem {
  id: string;
  chapter: string;
  unit: string;
  // Số câu hỏi ở các mức độ theo 4 dạng thức
  tnkq_nhieuLuaChon: {
    biet: number;
    hieu: number;
    vanDung: number;
  };
  tnkq_dungSai: {
    biet: number; // số câu (hoặc ý)
    hieu: number;
    vanDung: number;
  };
  tnkq_traLoiNgan: {
    biet: number;
    hieu: number;
    vanDung: number;
  };
  tuLuan: {
    biet: number;
    hieu: number;
    vanDung: number;
  };
}

// Bản đặc tả đề kiểm tra định kì (Phụ lục 2 CV 7991)
export interface SpecSheetRow {
  id: string;
  chapter: string;
  unit: string;
  learningOutcomes: {
    biet: string[];
    hieu: string[];
    vanDung: string[];
  };
  numberOfQuestions: {
    tnkq_nhieuLuaChon: { biet: number; hieu: number; vanDung: number };
    tnkq_dungSai: { biet: number; hieu: number; vanDung: number };
    tnkq_traLoiNgan: { biet: number; hieu: number; vanDung: number };
    tuLuan: { biet: number; hieu: number; vanDung: number };
  };
}

// --- THÔNG TIN GIÁO VIÊN & HỒ SƠ NGƯỜI DÙNG (SETTING) ---
export interface TeacherProfile {
  name: string;             // Ví dụ: "Hồ Minh Luân"
  academicDegree?: string;  // "Thạc sĩ", "Cử nhân", "Nhà giáo ưu tú"
  title: string;            // "Giáo viên Toán - Tin học", "Tổ trưởng chuyên môn"
  school: string;           // "Trường THPT Chuyên Nguyễn Huệ"
  department: string;       // "Tổ Toán - Tin học"
  email: string;            // "H.Minhluan1181@gmail.com"
  phone?: string;
  academicYear: string;     // "2024 - 2025"
  notes?: string;
  defaultSubject?: Subject; // Môn học phụ trách chính
  defaultGrade?: GradeLevel;// Khối lớp phụ trách chính
  defaultSlideCount?: number; // Số slide trình chiếu ưa thích
  defaultCurriculum?: CurriculumSeries; // Bộ sách ưu tiên
  exportFormat?: 'word' | 'pdf' | 'pptx'; // Định dạng xuất mặc định
  autoSave?: boolean;       // Tự động lưu cấu hình
}

// --- RAG (RETRIEVAL-AUGMENTED GENERATION) NGỮ LIỆU SGK ---
export interface RagChunkResult {
  id: string;
  docId: string;
  docName: string;
  subject: Subject;
  grade: GradeLevel;
  curriculum: CurriculumSeries;
  chapterTitle: string;
  lessonNumber?: string | number;
  lessonName: string;
  pageNumber: number | string; // Ví dụ: Trang 42-43
  contentType: 'Khái niệm & Định lý' | 'Hoạt động & Thí nghiệm' | 'Bài tập & Câu hỏi' | 'Kiến thức cốt lõi' | 'Ứng dụng thực tế';
  contentSnippet: string;
  relevanceScore: number; // Ví dụ: 98 (98%)
  keywords: string[];
}

// --- KHO HỌC LIỆU SỐ: TẢI SGK, SGV, SBT ---
export type BookCategory = 
  | 'sgk'      // Sách giáo khoa (Nguồn kiến thức cốt lõi)
  | 'sgv'      // Sách giáo viên (Nguồn phương pháp dạy học & tiến trình 5512)
  | 'sbt'      // Sách bài tập (Nguồn bài tập, câu hỏi 7991)
  | 'tailieu'; // Tài liệu tham khảo, đề cương, chuyên đề

export interface LessonLearningActivity {
  stage: 'Khởi động' | 'Hình thành kiến thức' | 'Luyện tập' | 'Vận dụng' | string;
  title: string;
  description: string;
  expectedProduct?: string;
}

export interface LessonTextbookExercise {
  type: 'question' | 'exercise' | 'discussion';
  content: string;
  suggestedAnswer?: string;
}

export interface DocumentChapter {
  id: string;
  chapterNumber: number;
  chapterTitle: string;
  lessonNumber?: number | string; // Số bài: e.g. 15, "15", "01"
  lessonName: string;            // Tên bài học: e.g. "Hàm số bậc hai và đồ thị"
  summary: string;
  keyPoints: string[];
  duration?: string;             // Thời lượng: "2 tiết (90 phút)"
  objectives?: {
    knowledge?: string[];
    competenciesSpecific?: string[];
    competenciesGeneral?: string[];
    qualities?: string[];
  };
  coreContent?: string[];
  learningActivities?: LessonLearningActivity[];
  textbookExercises?: LessonTextbookExercise[];
  rawContent?: string;           // Toàn văn trích xuất hoặc đoạn trích bài học
}

export interface UploadedDocument {
  id: string;
  name: string;             // Tên tệp hoặc tên sách
  category: BookCategory;
  subject: Subject;
  grade: GradeLevel;
  curriculum: CurriculumSeries;
  uploadDate: string;
  fileSize: string;         // "12.4 MB"
  pageCount: number;        // 148 trang
  status: 'ready' | 'processing' | 'indexed';
  chapters: DocumentChapter[];
  rawTextPreview?: string;
  fileUrl?: string;
}

// --- KHO LƯU TRỮ ĐÁM MÂY (CLOUD STORAGE & SAVED RESULTS) ---
export interface SavedCloudProject {
  id: string;
  title: string;
  type: 'khbd' | 'slides' | 'exam' | 'full_bundle';
  subject: Subject;
  grade: GradeLevel;
  curriculum: CurriculumSeries;
  savedAt: string;
  fileSize: string;
  sourceDocName?: string;
  teacherName: string;
  cloudSyncStatus: 'synced' | 'local_cached' | 'uploading';
  downloadFormats: ('word' | 'pdf' | 'pptx' | 'json')[];
}

// Toàn bộ State bàn giao phiên làm việc (Handover Session State)
export interface WorkspaceState {
  version: string;
  timestamp: string;
  teacherProfile: TeacherProfile;
  uploadedDocuments: UploadedDocument[];
  savedProjects: SavedCloudProject[];
  lessonPlan: LessonPlan5512;
  slides: SlideDeck;
  matrixRows: MatrixRowItem[];
  specRows: SpecSheetRow[];
  exam: Exam7991;
  activeTab: 'library' | 'khbd' | 'slides' | 'exam' | 'matrix_spec' | 'cloud' | 'handover';
}
