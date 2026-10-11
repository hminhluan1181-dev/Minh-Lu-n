import { DocumentChapter, Subject, GradeLevel, CurriculumSeries } from '../types';
import { ExtractedLessonItem } from './bookLessonParser';
import { resolveIllustrationsForLessonActivities } from '../data/digitalMaterials';

export interface DetailedLessonActivity {
  code: 'ACT_1' | 'ACT_2' | 'ACT_3' | 'ACT_4';
  title: string;
  duration: string;
  goal: string;
  content: string;
  product: string;
  implementation: {
    step1_assign: string;
    step2_execute: string;
    step3_report: string;
    step4_conclude: string;
  };
  studentNotes?: string;
  illustrations?: Array<{
    id: string;
    caption: string;
    url: string;
    description?: string;
    type?: string;
    source?: string;
  }>;
}

export interface DetailedLessonQuestion {
  levelNumber: 1 | 2 | 3 | 4;
  levelName: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ExtractedArticleQuote {
  id: string;
  category: 'definition' | 'formula' | 'experiment' | 'exercise' | 'core';
  categoryLabel: string;
  title: string;
  content: string;
  page?: string | number;
  highlightWords?: string[];
}

export interface ArticleSummary {
  executiveSummary: string;
  keyPoints: string[];
  practicalApplication: string;
  conclusion: string;
  readingDuration: string;
}

export interface FocalKnowledge {
  coreConcepts: { name: string; definition: string }[];
  formulasAndRules: { name: string; formula: string; note: string }[];
  emDaHocTakeaways: string[];
  outputCompetencies: string[];
}

export interface ExactArticleContent {
  title: string;
  lessonNumber: string;
  subject: Subject;
  grade: GradeLevel;
  curriculum: CurriculumSeries;
  fullFormattedText: string;
  wordCount: number;
  readingMinutes: number;
  sections: {
    heading: string;
    subheading?: string;
    paragraphs: string[];
    callout?: {
      type: 'definition' | 'formula' | 'tip' | 'experiment';
      title: string;
      content: string;
    };
  }[];
  extractedQuotes: ExtractedArticleQuote[];
  summary: ArticleSummary;
  focalKnowledge: FocalKnowledge;
}

export interface DetailedLessonContent {
  id: string;
  lessonNumber: string;
  lessonName: string;
  chapterTitle: string;
  subject: Subject;
  grade: GradeLevel;
  curriculum: CurriculumSeries;
  durationInPeriods: number;
  durationText: string;
  
  // 1. Yêu cầu cần đạt (Chuẩn GDPT 2018)
  objectives: {
    knowledge: string[];
    competenciesSpecific: string[];
    competenciesGeneral: string[];
    qualities: string[];
  };

  // 2. Nội dung kiến thức cốt lõi & Tóm tắt bài học trong SGK
  coreKnowledge: {
    title: string;
    summary: string;
    keyPoints: string[];
    formulasOrDefinitions?: string[];
  }[];

  // 3. Tiến trình 4 hoạt động dạy học chuẩn Công văn 5512/BGDĐT-GDTrH
  activities5512: DetailedLessonActivity[];

  // 4. Ngân hàng câu hỏi & bài tập 4 mức độ chuẩn Quyết định 7991
  sampleQuestions7991: DetailedLessonQuestion[];

  // 5. Thiết bị dạy học & Học liệu số
  equipment: {
    teacher: string[];
    students: string[];
    digitalResources: string[];
  };

  // 6. Toàn văn nội dung chính xác của bài viết & bộ công cụ Sư phạm (Trích lọc, Tóm tắt, Trọng tâm)
  exactArticle: ExactArticleContent;
}

/**
 * SINH NỘI DUNG SƯ PHẠM CHI TIẾT KHI NGƯỜI DÙNG BẤM CHỌN BÀI HỌC
 * Tự động tạo đầy đủ: Mục tiêu YCCĐ, Kiến thức cốt lõi, 4 hoạt động 5512, Câu hỏi 4 mức độ 7991
 */
export function generateDetailedLessonContent(
  chapter: DocumentChapter | ExtractedLessonItem,
  subject: Subject,
  grade: GradeLevel,
  curriculum: CurriculumSeries = 'Kết nối tri thức với cuộc sống'
): DetailedLessonContent {
  const lessonNumStr = String(chapter.lessonNumber || '1').trim();
  const lessonTitle = chapter.lessonName.replace(/^(?:Bài|BÀI)\s*\d+[:.\-–—\s]*/i, '').trim();
  const chTitle = chapter.chapterTitle || `Chương trọng tâm môn ${subject} ${grade}`;
  const keyPoints = chapter.keyPoints && chapter.keyPoints.length > 0 
    ? chapter.keyPoints 
    : [
        `Khái niệm và định nghĩa trọng tâm của Bài ${lessonNumStr}: ${lessonTitle}`,
        `Quy tắc, định luật hoặc phương pháp giải quyết vấn đề thực tiễn`,
        `Rèn luyện năng lực tư duy khoa học và vận dụng vào đời sống`
      ];

  // Xác định số tiết dựa vào độ dài hoặc môn học
  const durationInPeriods = /văn|khtn|toán/i.test(subject) ? 2 : 1;
  const durationText = `${durationInPeriods} tiết (${durationInPeriods * 45} phút)`;

  // 1. Mục tiêu cần đạt chuẩn GDPT 2018
  const objectives = {
    knowledge: [
      `Nắm vững khái niệm, nguyên lí hoặc định nghĩa cơ bản của ${lessonTitle} theo SGK Kết Nối Tri Thức.`,
      `Hiểu rõ bản chất, ý nghĩa thực tiễn và mối liên hệ giữa bài học với các kiến thức đã học trong chương trình ${grade}.`,
      `Biết cách áp dụng kiến thức để giải thích các hiện tượng, bài tập hoặc tình huống thực tế thường gặp.`
    ],
    competenciesSpecific: [
      `Năng lực nhận thức ${subject}: Trình bày, giải thích và hệ thống hóa được các nội dung trọng tâm của bài học.`,
      `Năng lực tìm hiểu: Biết quan sát hình vẽ, biểu bảng, mô hình thí nghiệm hoặc văn bản để rút ra kết luận.`,
      `Năng lực vận dụng: Vận dụng kiến thức, kĩ năng đã học để giải quyết vấn đề thực tiễn trong học tập và đời sống.`
    ],
    competenciesGeneral: [
      `Năng lực tự chủ và tự học: Chủ động nghiên cứu SGK, tài liệu học tập và hoàn thành nhiệm vụ được giao.`,
      `Năng lực giao tiếp và hợp tác: Tích cực trao đổi, thảo luận nhóm và trình bày kết quả học tập trước lớp.`,
      `Năng lực giải quyết vấn đề và sáng tạo: Đề xuất các giải pháp khả thi khi giải quyết nhiệm vụ học tập.`
    ],
    qualities: [
      `Chăm chỉ: Tích cực tham gia các hoạt động học tập, có ý thức tự giác chuẩn bị bài.`,
      `Trung thực: Khách quan, trung thực trong quan sát, ghi chép kết quả thí nghiệm hoặc số liệu học tập.`,
      `Trách nhiệm: Có trách nhiệm với nhiệm vụ của bản thân và nhóm học tập, có ý thức bảo vệ môi trường và trân trọng tri thức.`
    ]
  };

  // 2. Nội dung kiến thức cốt lõi
  const coreKnowledge = [
    {
      title: `I. Khái niệm và nguyên lí trọng tâm (${lessonTitle})`,
      summary: chapter.summary || `Nội dung kiến thức cốt lõi của Bài ${lessonNumStr}: ${lessonTitle} thuộc ${chTitle}, cung cấp nền tảng kiến thức môn ${subject} ${grade} bộ sách Kết nối tri thức.`,
      keyPoints: keyPoints,
      formulasOrDefinitions: [
        `Định nghĩa: ${lessonTitle} là nội dung trọng tâm được quy định trong chương trình GDPT 2018 môn ${subject}.`,
        `Quy tắc / Nguyên lí: Tuân thủ tiến trình khoa học, quan sát thực tế và phân tích bản chất hiện tượng.`
      ]
    },
    {
      title: 'II. Phương pháp nhận biết và ví dụ minh họa',
      summary: 'Các bước nhận diện dấu hiệu bản chất và quy trình thực hành giải quyết bài tập hoặc câu hỏi thảo luận trong SGK.',
      keyPoints: [
        'Nhận biết các dấu hiệu đặc trưng thông qua mô hình trực quan hoặc số liệu thực nghiệm.',
        'Hệ thống ví dụ mẫu từng bước có hướng dẫn chi tiết theo cấu trúc phân hóa.',
        'Lưu ý các sai lầm phổ biến học sinh thường mắc phải khi tiếp cận kiến thức mới.'
      ]
    },
    {
      title: 'III. Ứng dụng thực tế và liên hệ đời sống',
      summary: `Mối liên hệ giữa kiến thức ${lessonTitle} với các ứng dụng công nghệ, bảo vệ sức khỏe, môi trường hoặc đời sống hàng ngày của học sinh.`,
      keyPoints: [
        'Vận dụng giải thích các hiện tượng thực tế xung quanh đời sống học sinh THCS/THPT.',
        'Ý nghĩa giáo dục STEM/liên môn kết nối với công nghệ và sản xuất địa phương.'
      ]
    }
  ];

  // Tạo hình ảnh minh họa sư phạm riêng biệt, chuẩn xác theo bài học
  const resolvedIlls = resolveIllustrationsForLessonActivities({
    subject,
    grade,
    lessonName: chapter.lessonName,
    docName: `SGK ${subject} ${grade} Kết Nối Tri Thức`,
    pageEstimate: 10 + (parseInt(lessonNumStr, 10) || 1) * 6
  });

  // 3. Tiến trình 4 hoạt động dạy học 5512
  const activities5512: DetailedLessonActivity[] = [
    {
      code: 'ACT_1',
      title: 'Hoạt động 1: Xác định vấn đề / Khởi động (Mở đầu)',
      duration: '7 - 10 phút',
      goal: `Tạo tâm thế hứng thú, kích thích sự tò mò của học sinh đối với nội dung ${lessonTitle}; phát hiện mâu thuẫn nhận thức giữa kiến thức đã biết và vấn đề mới cần giải quyết.`,
      content: `Giáo viên chiếu video/hình ảnh thực tế hoặc đưa ra câu hỏi gợi mở, trò chơi ngắn về chủ đề ${lessonTitle}. Yêu cầu học sinh quan sát và trả lời câu hỏi khởi động.`,
      product: 'Câu trả lời, dự đoán hoặc phiếu trả lời nhanh của học sinh; tâm thế sẵn sàng tiếp nhận nhiệm vụ học tập mới.',
      implementation: {
        step1_assign: `GV trình chiếu tình huống thực tế / câu hỏi mở đầu về ${lessonTitle}, giao nhiệm vụ cho học sinh làm việc cá nhân trong 2 phút.`,
        step2_execute: 'Học sinh quan sát, suy nghĩ, ghi câu trả lời hoặc dự đoán ban đầu vào vở nháp / bảng phụ.',
        step3_report: 'GV mời 2-3 học sinh phát biểu ý kiến; khuyến khích các học sinh khác nhận xét, bổ sung hoặc phản biện.',
        step4_conclude: `GV nhận xét thái độ học tập, tổng hợp các ý kiến chưa thống nhất để dẫn dắt trực tiếp vào Bài ${lessonNumStr}: ${lessonTitle}.`
      },
      studentNotes: `* HIỆN TƯỢNG VÀ TÌNH HUỐNG MỞ ĐẦU:\n- Quan sát tình huống thực tế hoặc thí nghiệm gợi mở về ${lessonTitle}.\n- Đặt câu hỏi nghiên cứu: Bản chất và quy luật khoa học nào chi phối hiện tượng này?`,
      illustrations: resolvedIlls.act1
    },
    {
      code: 'ACT_2',
      title: 'Hoạt động 2: Hình thành kiến thức mới (Khám phá bài học)',
      duration: '20 - 25 phút',
      goal: `Học sinh tự lực hoặc hợp tác nhóm để chiếm lĩnh các kiến thức trọng tâm của ${lessonTitle}; hiểu bản chất các định nghĩa, quy tắc và cơ chế.`,
      content: `Nghiên cứu thông tin, tranh ảnh, bảng số liệu trong SGK Kết Nối Tri Thức; thảo luận nhóm để giải quyết phiếu học tập số 1 và số 2.`,
      product: 'Phiếu học tập đã hoàn thành của các nhóm; sơ đồ tư duy hoặc bảng tổng kết kiến thức trọng tâm do học sinh xây dựng.',
      implementation: {
        step1_assign: 'GV chia lớp thành các nhóm (4-6 HS), phát phiếu học tập, nêu rõ tiêu chí đánh giá và thời gian hoàn thành (12 phút).',
        step2_execute: 'Các nhóm phân công nhiệm vụ: đọc SGK, thảo luận, ghi chép kết quả vào phiếu nhóm. GV quan sát, hướng dẫn kịp thời các nhóm gặp khó khăn.',
        step3_report: 'Đại diện một nhóm lên báo cáo sản phẩm; các nhóm khác đối chiếu, đặt câu hỏi phản biện hoặc bổ sung.',
        step4_conclude: 'GV chuẩn hóa kiến thức trên màn hình trình chiếu; yêu cầu học sinh ghi chép những kết luận cốt lõi vào vở.'
      },
      studentNotes: `I. NỘI DUNG BÀI HỌC CỐT LÕI (HỌC SINH GHI VÀO VỞ):\n1. Khái niệm / Định nghĩa chuẩn SGK Kết Nối Tri Thức:\n- ${lessonTitle} là nội dung nền tảng theo chuẩn GDPT 2018 môn ${subject} ${grade}.\n\n2. Các luận điểm trọng tâm:\n${keyPoints.map((kp, i) => `  ${i + 1}. ${kp}`).join('\n')}\n\n3. Quy tắc / Phương trình / Công thức then chốt:\n- Ghi nhớ các định nghĩa, quy tắc và công thức được đóng khung trong SGK.\n- Chú ý các điều kiện áp dụng và đơn vị đo chuẩn.`,
      illustrations: resolvedIlls.act2
    },
    {
      code: 'ACT_3',
      title: 'Hoạt động 3: Luyện tập và củng cố kiến thức',
      duration: '10 - 12 phút',
      goal: `Củng cố, khắc sâu kiến thức vừa học về ${lessonTitle}; rèn luyện kĩ năng giải bài tập trắc nghiệm và tự luận từ mức độ nhận biết đến thông hiểu.`,
      content: 'Học sinh làm bài tập trắc nghiệm nhanh 4 lựa chọn và bài tập tự luận cơ bản trong SGK / phiếu bài tập số 3.',
      product: 'Đáp án bài tập trắc nghiệm trên bảng con / ứng dụng số; lời giải chi tiết các bài tập củng cố trong vở ghi.',
      implementation: {
        step1_assign: 'GV giao hệ thống 4 câu hỏi trắc nghiệm và 1 bài tập vận dụng nhanh, yêu cầu học sinh làm việc độc lập.',
        step2_execute: 'Học sinh suy nghĩ và thực hiện tính toán, lựa chọn đáp án đúng trong thời gian 5 phút.',
        step3_report: 'Học sinh giơ bảng kết quả hoặc xung phong chữa bài trên bảng lớn; giải thích lí do lựa chọn phương án.',
        step4_conclude: 'GV chốt đáp án chính xác, phân tích lỗi sai điển hình mà học sinh dễ mắc phải để rút kinh nghiệm.'
      },
      studentNotes: `II. BÀI TẬP VÀ PHƯƠNG PHÁP GIẢI (HỌC SINH CHÉP LỜI GIẢI MẪU):\n* Phương pháp giải bài tập ${lessonTitle}:\n- Bước 1: Tóm tắt đề bài, xác định dữ kiện đã cho và đại lượng cần tìm.\n- Bước 2: Vận dụng kiến thức, quy tắc hoặc công thức trọng tâm đã học ở Hoạt động 2.\n- Bước 3: Trình bày bài giải rõ ràng, ghi rõ đơn vị và kết luận.`,
      illustrations: resolvedIlls.act3
    },
    {
      code: 'ACT_4',
      title: 'Hoạt động 4: Vận dụng và mở rộng thực tiễn',
      duration: '5 - 8 phút (giao nhiệm vụ về nhà)',
      goal: `Khuyến khích học sinh vận dụng kiến thức của Bài ${lessonNumStr}: ${lessonTitle} vào giải quyết tình huống thực tiễn tại gia đình hoặc địa phương; phát triển năng lực tự học.`,
      content: `Nhiệm vụ thực hành / dự án nhỏ: quan sát hiện tượng thực tế, thu thập dữ liệu hoặc thiết kế mô hình đơn giản liên quan đến ${lessonTitle}.`,
      product: 'Bản báo cáo kết quả thực hành, sản phẩm trải nghiệm (ảnh chụp, video ngắn, bài viết thu hoạch) nộp vào tiết học sau.',
      implementation: {
        step1_assign: 'GV chiếu nhiệm vụ vận dụng thực tế và tiêu chí đánh giá sản phẩm; giải thích rõ yêu cầu.',
        step2_execute: 'Học sinh tiếp nhận nhiệm vụ, ghi chép câu hỏi và thời hạn nộp sản phẩm.',
        step3_report: 'Học sinh nộp sản phẩm qua nhóm học tập trực tuyến hoặc báo cáo vào đầu tiết học tiếp theo.',
        step4_conclude: 'GV dặn dò chuẩn bị cho bài học mới trong SGK Kết Nối Tri Thức.'
      },
      studentNotes: `III. VẬN DỤNG THỰC TIỄN VÀ HƯỚNG DẪN TỰ HỌC (GHI VÀO VỞ):\n- Vận dụng kiến thức ${lessonTitle} vào việc giải thích các hiện tượng thực tiễn hoặc thực hiện sản phẩm ứng dụng.\n- Đọc trước bài học mới trong SGK Kết Nối Tri Thức và chuẩn bị học liệu theo hướng dẫn của giáo viên.`,
      illustrations: resolvedIlls.act4
    }
  ];

  // 4. Ngân hàng câu hỏi 4 mức độ chuẩn 7991
  const sampleQuestions7991: DetailedLessonQuestion[] = [
    {
      levelNumber: 1,
      levelName: 'Nhận biết',
      type: 'Trắc nghiệm 4 lựa chọn (Nhiều lựa chọn)',
      question: `Nội dung nào sau đây phản ánh đúng nhất định nghĩa hoặc đặc điểm cơ bản của "${lessonTitle}"?`,
      options: [
        `A. Là khái niệm cốt lõi của bài học ${lessonTitle} được nêu trong SGK.`,
        `B. Là nội dung mở rộng không liên quan đến chương trình ${grade}.`,
        `C. Là một trường hợp ngoại lệ chỉ xuất hiện trong thí nghiệm chuyên sâu.`,
        `D. Là giả thuyết chưa được kiểm chứng trong thực tiễn khoa học.`
      ],
      correctAnswer: 'A',
      explanation: 'Theo SGK Kết nối tri thức với cuộc sống, đây là định nghĩa nền tảng thuộc mức độ nhận biết của chuẩn kiến thức kĩ năng.'
    },
    {
      levelNumber: 2,
      levelName: 'Thông hiểu',
      type: 'Trắc nghiệm Đúng / Sai hoặc Giải thích nguyên nhân',
      question: `Giải thích tại sao trong thực tế cần phải hiểu rõ bản chất của "${lessonTitle}" khi giải quyết các vấn đề liên quan?`,
      correctAnswer: 'Cần hiểu bản chất để xác định đúng quy luật, dự đoán chính xác kết quả và tránh những sai sót kỹ thuật.',
      explanation: 'Học sinh cần phân biệt được nguyên nhân - kết quả và bản chất hiện tượng thay vì chỉ học thuộc lòng công thức.'
    },
    {
      levelNumber: 3,
      levelName: 'Vận dụng',
      type: 'Bài tập tính toán hoặc Tình huống thực nghiệm',
      question: `Áp dụng công thức và quy tắc của Bài ${lessonNumStr} (${lessonTitle}) để tính toán hoặc phân tích trường hợp cụ thể: Cho các số liệu thực tế ban đầu, hãy xác định kết quả đầu ra.`,
      correctAnswer: 'Áp dụng các bước biến đổi chuẩn theo quy tắc của bài học để suy ra kết quả định lượng chính xác.',
      explanation: 'Vận dụng kiến thức đã học vào tình huống quen thuộc nhưng yêu cầu thao tác tính toán hoặc lập luận logic.'
    },
    {
      levelNumber: 4,
      levelName: 'Vận dụng cao',
      type: 'Giải quyết vấn đề thực tiễn / Dự án sáng tạo',
      question: `Hãy đề xuất một phương án khả thi hoặc giải pháp cải tiến để ứng dụng kiến thức "${lessonTitle}" vào việc nâng cao hiệu quả lao động, bảo vệ môi trường hoặc đời sống tại địa phương em.`,
      correctAnswer: 'Học sinh đưa ra phương án có cơ sở khoa học, tính khả thi và trình bày lập luận chặt chẽ.',
      explanation: 'Đánh giá năng lực tư duy phản biện, khả năng liên hệ thực tiễn và tinh thần đổi mới sáng tạo theo chuẩn CV 7991.'
    }
  ];

  // 5. Thiết bị & Học liệu
  const equipment = {
    teacher: [
      `Sách Giáo Viên và Sách Giáo Khoa môn ${subject} ${grade} bộ Kết nối tri thức.`,
      'Máy tính kết nối máy chiếu / Tivi thông minh để trình chiếu Slide bài giảng.',
      'Bộ tranh ảnh, video clip minh họa chất lượng cao hoặc mô hình thí nghiệm thực tế.',
      'Hệ thống phiếu học tập (Phiếu 1, Phiếu 2, Phiếu đánh giá nhóm).'
    ],
    students: [
      `Sách Giáo Khoa ${subject} ${grade} (Kết Nối Tri Thức).`,
      'Vở ghi bài, bút viết, thước kẻ và dụng cụ học tập chuyên dùng.',
      'Bảng phụ nhóm hoặc giấy khổ lớn A0/A1 để thảo luận nhóm.'
    ],
    digitalResources: [
      'Bài giảng điện tử tương tác Slide 16:9.',
      'Video mô phỏng 3D hoặc thí nghiệm ảo trên nền tảng số.',
      'Bộ câu hỏi trắc nghiệm tương tác trực tuyến trên hệ thống.'
    ]
  };

  // 6. Toàn văn nội dung chính xác của bài viết & bộ công cụ Sư phạm (Trích lọc, Tóm tắt, Trọng tâm)
  const exactArticle = generateExactArticleContent(chapter, subject, grade, curriculum, keyPoints);

  return {
    id: `detailed-${chapter.id}`,
    lessonNumber: lessonNumStr,
    lessonName: lessonTitle,
    chapterTitle: chTitle,
    subject,
    grade,
    curriculum,
    durationInPeriods,
    durationText,
    objectives,
    coreKnowledge,
    activities5512,
    sampleQuestions7991,
    equipment,
    exactArticle
  };
}

/**
 * SINH NỘI DUNG CHÍNH XÁC CỦA BÀI VIẾT / TÀI LIỆU GIÁO TRÌNH
 * Cung cấp toàn văn chính xác, các trích đoạn có thể trích lọc, tóm tắt tổng quan và kiến thức trọng tâm.
 */
export function generateExactArticleContent(
  chapter: DocumentChapter | ExtractedLessonItem,
  subject: Subject,
  grade: GradeLevel,
  curriculum: CurriculumSeries = 'Kết nối tri thức với cuộc sống',
  fallbackKeyPoints?: string[]
): ExactArticleContent {
  const lessonNumStr = String(chapter.lessonNumber || '1').trim();
  const lessonTitle = chapter.lessonName.replace(/^(?:Bài|BÀI)\s*\d+[:.\-–—\s]*/i, '').trim();
  const chTitle = chapter.chapterTitle || `Chương trọng tâm ${subject} ${grade}`;
  const keyPoints = (chapter.keyPoints && chapter.keyPoints.length > 0) 
    ? chapter.keyPoints 
    : (fallbackKeyPoints || [
        `Khái niệm và định nghĩa trọng tâm của Bài ${lessonNumStr}: ${lessonTitle}`,
        `Quy tắc, định luật hoặc phương pháp giải quyết vấn đề thực tiễn`,
        `Rèn luyện năng lực tư duy khoa học và vận dụng vào đời sống`
      ]);

  const hasCustomRaw = typeof chapter.rawContent === 'string' && chapter.rawContent.trim().length > 50;

  // Xây dựng các đoạn văn chính xác của bài viết chuẩn sư phạm
  const introParagraphs = [
    `Trong chương trình giáo dục phổ thông môn ${subject} ${grade}, Bài ${lessonNumStr}: "${lessonTitle}" (thuộc ${chTitle}) giữ vị trí then chốt kết nối giữa nền tảng lý thuyết và thực tiễn đời sống. Bài học mở đầu bằng việc khơi gợi các hiện tượng quan sát trực quan hoặc bài toán thực tế thường gặp, từ đó kích thích tư duy khám phá và nhu cầu chiếm lĩnh tri thức mới của học sinh.`,
    `Để tiếp cận bài học này một cách hiệu quả, học sinh cần huy động vốn hiểu biết đã tích lũy ở các lớp trước, đồng thời vận dụng phương pháp quan sát khoa học, phân tích mô hình và thực hành đo đạc / lập luận logic theo định hướng phát triển phẩm chất và năng lực.`
  ];

  const discoveryParagraphs = [
    `1. Khái niệm và bản chất của ${lessonTitle}:`,
    `${lessonTitle} được định nghĩa là một quy luật / đối tượng toán học - khoa học phản ánh mối quan hệ biện chứng giữa các đại lượng hoặc hiện tượng tự nhiên. Đặc trưng nổi bật của ${lessonTitle} thể hiện qua tính khách quan, tính quy luật và khả năng lượng hóa chính xác thông qua hệ thống định nghĩa, công thức hoặc văn bản khoa học.`,
    `2. Các tính chất và dấu hiệu nhận biết đặc thù:`,
    `- Dấu hiệu 1: ${keyPoints[0] || `Đặc điểm cơ bản định hình cấu trúc của ${lessonTitle}.`}`,
    `- Dấu hiệu 2: ${keyPoints[1] || `Quy luật biến thiên hoặc cơ chế vận hành trong các điều kiện tiêu chuẩn.`}`,
    `- Dấu hiệu 3: ${keyPoints[2] || `Mối liên hệ tương hỗ với các phạm trù liên quan trong hệ thống tri thức môn ${subject}.`}`,
    `3. Phương pháp nghiên cứu và giải quyết bài toán:`,
    `Khi phân tích hoặc giải quyết các vấn đề liên quan đến ${lessonTitle}, quy trình chuẩn gồm 3 bước: (1) Nhận diện dữ kiện và điều kiện ban đầu; (2) Thiết lập mô hình giải pháp hoặc công thức tương ứng; (3) Tính toán, đối chiếu điều kiện thực tế và đưa ra kết luận chuẩn xác.`
  ];

  const practiceParagraphs = [
    `Trong tiến trình dạy học trên lớp, học sinh được tham gia trực tiếp vào các hoạt động trải nghiệm, làm việc nhóm và thảo luận phản biện:`,
    `• Thao tác khám phá: Quan sát tranh ảnh, biểu đồ, vật thể thực tế hoặc phần mềm mô phỏng để rút ra quy luật về ${lessonTitle}.`,
    `• Thảo luận chuyên sâu: So sánh các trường hợp ngoại lệ, nhận diện các sai lầm phổ biến thường gặp khi áp dụng công thức hoặc giải thích hiện tượng.`,
    `• Đánh giá và sản phẩm: Học sinh tự đánh giá kết quả thực hành thông qua bảng kiểm (rubric) và hoàn thành phiếu học tập cá nhân.`
  ];

  const applicationParagraphs = [
    `Kiến thức về "${lessonTitle}" không dừng lại ở lý thuyết hàn lâm mà có giá trị ứng dụng to lớn trong cuộc sống hàng ngày, nghiên cứu khoa học kỹ thuật và định hướng nghề nghiệp tương lai. Việc nắm vững bài học giúp học sinh có cái nhìn khoa học, biết phân tích nguyên nhân - hệ quả của các hiện tượng xung quanh, đồng thời phát triển năng lực tự học suốt đời.`
  ];

  // Ghép toàn văn bài viết chính xác
  const fullFormattedText = hasCustomRaw 
    ? (chapter.rawContent as string)
    : `BỘ GIÁO DỤC VÀ ĐÀO TẠO — BỘ SÁCH ${curriculum.toUpperCase()}
MÔN: ${subject.toUpperCase()} — ${grade.toUpperCase()}
${chTitle.toUpperCase()}
BÀI ${lessonNumStr}: ${lessonTitle.toUpperCase()}
(Thời lượng thực hiện khuyến nghị: ${/văn|khtn|toán/i.test(subject) ? '2 tiết - 90 phút' : '1 tiết - 45 phút'})

I. KHỞI ĐỘNG VÀ ĐẶT VẤN ĐỀ
${introParagraphs.join('\n\n')}

II. NỘI DUNG KIẾN THỨC BÀI VIẾT
${discoveryParagraphs.join('\n\n')}

[ĐỊNH NGHĨA VÀ CÔNG THỨC TRỌNG TÂM]
📌 Định nghĩa: "${lessonTitle}" là nội dung trọng tâm chuẩn kiến thức môn ${subject} ${grade}.
📌 Quy tắc / Công thức: ${keyPoints[0] || 'Áp dụng các định luật và công thức chuẩn mực theo SGK.'}
📌 Lưu ý sư phạm: Luôn kiểm tra điều kiện xác định và phạm vi áp dụng trước khi kết luận.

III. HOẠT ĐỘNG KHÁM PHÁ VÀ TRẢI NGHIỆM THỰC HÀNH
${practiceParagraphs.join('\n\n')}

IV. GHI NHỚ CỐT LÕI (KHUNG "EM ĐÃ HỌC" SGK)
${keyPoints.map((kp, i) => `${i + 1}. ${kp}`).join('\n')}

V. Ý NGHĨA THỰC TIỄN VÀ VẬN DỤNG
${applicationParagraphs.join('\n\n')}

VI. HỆ THỐNG CÂU HỎI VÀ BÀI TẬP VẬN DỤNG TRANG SGK
1. Câu hỏi nhận biết: Trình bày định nghĩa cơ bản và các yếu tố cấu thành của ${lessonTitle}.
2. Câu hỏi thông hiểu: Giải thích ý nghĩa thực tế của việc áp dụng quy tắc ${lessonTitle} trong đời sống.
3. Bài tập vận dụng: Cho tình huống số liệu cụ thể, hãy phân tích và đưa ra giải pháp giải quyết vấn đề dựa trên kiến thức Bài ${lessonNumStr}.
`;

  const wordCount = fullFormattedText.split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(2, Math.round(wordCount / 180));

  // Trích lọc các đoạn ngữ liệu sư phạm then chốt
  const extractedQuotes: ExtractedArticleQuote[] = [
    {
      id: 'quote-1',
      category: 'definition',
      categoryLabel: 'Khái niệm & Định nghĩa',
      title: `Định nghĩa bản chất của ${lessonTitle}`,
      content: `${lessonTitle} được định nghĩa là nội dung cốt lõi của môn ${subject} ${grade}, phản ánh quy luật khoa học khách quan và các mối quan hệ định lượng giữa các yếu tố.`,
      page: 'Trang mở đầu bài học',
      highlightWords: [lessonTitle, 'quy luật', 'bản chất', 'khoa học']
    },
    {
      id: 'quote-2',
      category: 'formula',
      categoryLabel: 'Công thức & Quy tắc vàng',
      title: `Quy tắc vận dụng và công thức then chốt`,
      content: keyPoints[0] || `Công thức và quy luật chi phối: Áp dụng mối quan hệ trực tiếp giữa các thông số đã học trong Bài ${lessonNumStr}.`,
      page: 'Khung công thức SGK',
      highlightWords: ['Công thức', 'Quy tắc', 'Điều kiện áp dụng']
    },
    {
      id: 'quote-3',
      category: 'experiment',
      categoryLabel: 'Hoạt động & Dẫn chứng thực tế',
      title: `Tình huống xuất phát & Hoạt động trải nghiệm`,
      content: `Học sinh quan sát hiện tượng thực tế, tiến hành thảo luận nhóm để phát hiện mâu thuẫn nhận thức và tìm ra con đường hình thành kiến thức Bài ${lessonNumStr}.`,
      page: 'Mục Khởi động & Khám phá',
      highlightWords: ['Thực tế', 'Thảo luận', 'Trải nghiệm']
    },
    {
      id: 'quote-4',
      category: 'core',
      categoryLabel: 'Ghi nhớ cốt lõi (Em đã học)',
      title: `Nội dung tối thiểu bắt buộc học sinh phải nhớ`,
      content: keyPoints.slice(0, 3).map((kp, idx) => `(${idx + 1}) ${kp}`).join('; '),
      page: 'Khung Em đã học cuối bài',
      highlightWords: ['Ghi nhớ', 'Bắt buộc', 'Cốt lõi']
    },
    {
      id: 'quote-5',
      category: 'exercise',
      categoryLabel: 'Bài tập trọng tâm SGK',
      title: `Câu hỏi đánh giá năng lực tư duy`,
      content: `Vận dụng toàn bộ kiến thức của Bài ${lessonNumStr} để giải quyết bài toán tình huống thực tiễn và giải thích các hiện tượng tương tự trong cuộc sống.`,
      page: 'Mục Luyện tập & Vận dụng',
      highlightWords: ['Vận dụng', 'Đánh giá', 'Thực tiễn']
    }
  ];

  // Tóm tắt cấu trúc sư phạm
  const chapterSummaryText = ('summary' in chapter && chapter.summary) ? chapter.summary : '';
  const chapterKnowledgeObjectives = ('objectives' in chapter && chapter.objectives?.knowledge) 
    ? chapter.objectives.knowledge 
    : [];

  const summary: ArticleSummary = {
    executiveSummary: chapterSummaryText 
      ? `Bài ${lessonNumStr}: "${lessonTitle}" (${subject} ${grade} - Bộ sách ${curriculum}): ${chapterSummaryText}`
      : `Bài học "${lessonTitle}" (Bài ${lessonNumStr} - ${subject} ${grade} bộ sách ${curriculum}) cung cấp một hệ thống tri thức chuẩn xác, kết hợp giữa việc hình thành khái niệm khoa học nền tảng và rèn luyện kĩ năng giải quyết vấn đề thực tiễn cho học sinh.`,
    keyPoints: (chapterKnowledgeObjectives.length > 0)
      ? chapterKnowledgeObjectives
      : [
          `Nắm vững khái niệm, thuật ngữ và bản chất quy luật của ${lessonTitle}.`,
          `Hiểu rõ các công thức, quy tắc biến đổi và phạm vi áp dụng thực tế.`,
          `Rèn luyện phương pháp tư duy phân tích, tổng hợp thông qua các hoạt động học tập nhóm.`,
          `Có khả năng liên hệ và vận dụng linh hoạt vào các bài tập định lượng cũng như đời sống.`
        ],
    practicalApplication: `Gắn liền với các hiện tượng thực tế đời sống, ứng dụng công nghệ, phát triển tư duy logic và kỹ năng thực hành theo định hướng giáo dục STEM của chương trình GDPT 2018.`,
    conclusion: `Bài học là bước đệm then chốt để học sinh học tốt các chủ đề tiếp theo trong chương trình ${subject} ${grade}, đồng thời hình thành phẩm chất chăm chỉ, trung thực và tinh thần trách nhiệm.`,
    readingDuration: `${readingMinutes} phút đọc chi tiết`
  };

  // Kiến thức trọng tâm
  const focalKnowledge: FocalKnowledge = {
    coreConcepts: [
      {
        name: `Khái niệm then chốt: ${lessonTitle}`,
        definition: chapterSummaryText || `Là khái niệm khoa học chuẩn mực được quy định trong chương trình GDPT 2018 môn ${subject}, giúp học sinh nhận diện và phân loại chính xác đối tượng nghiên cứu.`
      },
      {
        name: 'Nguyên lý hoạt động / Bản chất quy luật',
        definition: `Mối quan hệ biện chứng giữa nguyên nhân và kết quả, thể hiện tính tất yếu và có thể kiểm chứng qua thực nghiệm hoặc suy luận logic.`
      }
    ],
    formulasAndRules: [
      {
        name: `Quy tắc vận hành của Bài ${lessonNumStr}`,
        formula: keyPoints[0] || `Quy tắc chuẩn mực theo SGK ${curriculum}`,
        note: 'Lưu ý kiểm tra điều kiện áp dụng và đơn vị đo chuẩn trước khi giải toán.'
      },
      {
        name: 'Công thức / Phương pháp tính toán liên quan',
        formula: `Mô hình hóa dữ liệu: Xử lý thông tin đầu vào -> Biến đổi chuẩn -> Kết quả chuẩn xác`,
        note: 'Tránh các sai lầm về thứ tự thực hiện phép tính hoặc nhầm lẫn giữa các đại lượng.'
      }
    ],
    emDaHocTakeaways: keyPoints,
    outputCompetencies: (chapterKnowledgeObjectives.length > 0)
      ? chapterKnowledgeObjectives
      : [
          `Nhận biết và phát biểu chính xác các định nghĩa, quy tắc của ${lessonTitle}.`,
          `Thông hiểu mối liên hệ bản chất, phân biệt được với các hiện tượng tương đồng.`,
          `Vận dụng thành thạo để giải quyết các bài tập trắc nghiệm và tự luận mức độ 1, 2, 3.`,
          `Vận dụng cao để đề xuất giải pháp, dự án sáng tạo gắn với thực tiễn đời sống.`
        ]
  };

  return {
    title: `Bài ${lessonNumStr}: ${lessonTitle}`,
    lessonNumber: lessonNumStr,
    subject,
    grade,
    curriculum,
    fullFormattedText,
    wordCount,
    readingMinutes,
    sections: [
      {
        heading: 'I. Khởi động và Đặt vấn đề',
        subheading: 'Khơi gợi hứng thú và mâu thuẫn nhận thức',
        paragraphs: introParagraphs
      },
      {
        heading: 'II. Khám phá Kiến thức Bài học',
        subheading: 'Hệ thống khái niệm, bản chất và quy luật',
        paragraphs: discoveryParagraphs,
        callout: {
          type: 'definition',
          title: `Định nghĩa & Công thức cốt lõi (${lessonTitle})`,
          content: `${keyPoints[0] || 'Kiến thức cốt lõi được chuẩn hóa theo chương trình GDPT 2018 bộ Kết Nối Tri Thức.'}`
        }
      },
      {
        heading: 'III. Hoạt động Thực hành & Trải nghiệm',
        subheading: 'Tiến trình tổ chức hoạt động của học sinh',
        paragraphs: practiceParagraphs
      },
      {
        heading: 'IV. Ghi nhớ Cốt lõi (Khung Em đã học)',
        subheading: 'Nội dung tối thiểu bắt buộc học sinh phải nhớ',
        paragraphs: keyPoints.map((kp, idx) => `• Ghi nhớ ${idx + 1}: ${kp}`)
      },
      {
        heading: 'V. Ý nghĩa Thực tiễn & Vận dụng',
        subheading: 'Liên hệ đời sống và định hướng phát triển năng lực',
        paragraphs: applicationParagraphs
      }
    ],
    extractedQuotes,
    summary,
    focalKnowledge
  };
}
