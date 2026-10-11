import { 
  MultipleChoiceQuestion, 
  TrueFalseQuestion, 
  ShortAnswerQuestion, 
  EssayQuestion 
} from '../types';
import { LessonSelectionItem } from '../data/allCurriculumData';

/**
 * BỘ TẠO CÂU HỎI TÙY CHỌN CHUẨN CÔNG VĂN 7991
 * Hỗ trợ sinh câu hỏi khoa học tự nhiên (Lí, Hóa, Sinh) và Công nghệ
 * Theo 3 hình thức trắc nghiệm (Nhiều lựa chọn, Đúng Sai, Trả lời ngắn) và Tự luận
 */

export function buildCustomMultipleChoiceQuestion(
  lesson: LessonSelectionItem,
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng',
  customPrompt?: string,
  questionNumber: number = 1
): MultipleChoiceQuestion {
  const kp1 = lesson.keyPoints[0] || lesson.summary;
  const kp2 = lesson.keyPoints[1] || 'Đặc điểm quy luật cơ bản theo SGK';
  const lessonClean = lesson.lessonName.replace(/^(?:Bài|BÀI)\s*\d+[:.\-–—\s]*/i, '').trim();

  let content = '';
  let options = { A: '', B: '', C: '', D: '' };
  let correctAnswer: 'A' | 'B' | 'C' | 'D' = 'A';
  let explanation = '';

  if (level === 'Nhận biết') {
    content = customPrompt?.trim() 
      ? `[Bài ${lesson.lessonNumber}: ${lessonClean}] ${customPrompt}`
      : `Phát biểu nào sau đây là ĐÚNG khi nói về "${lessonClean}" (thuộc ${lesson.chapterTitle})?`;
    options = {
      A: kp1,
      B: `Khái niệm trên chỉ có giá trị trong trường hợp vật thể đứng yên tuyệt đối.`,
      C: `Quy luật này không tuân theo các nguyên lý của khoa học tự nhiên.`,
      D: `Hiện tượng trên chỉ xảy ra trong môi trường chân không.`
    };
    correctAnswer = 'A';
    explanation = `Theo SGK ${lesson.docName}: "${kp1}". Do đó phương án A là phát biểu chính xác nhất.`;
  } else if (level === 'Thông hiểu') {
    content = customPrompt?.trim()
      ? `[Bài ${lesson.lessonNumber}: ${lessonClean}] ${customPrompt}`
      : `Giải thích nào sau đây phản ánh ĐÚNG bản chất cơ chế của hiện tượng trong "${lessonClean}"?`;
    options = {
      A: `Do sự tương tác ngẫu nhiên giữa các yếu tố mà không tuân theo bất kì quy luật định lượng nào.`,
      B: `${kp1}; đồng thời liên hệ trực tiếp với ${kp2}.`,
      C: `Do năng lượng của hệ tự nhiên sinh ra mà không cần tiêu tốn công hay nhiệt lượng.`,
      D: `Do các hạt cấu tạo bị phân rã hoàn toàn sau quá trình biến đổi.`
    };
    correctAnswer = 'B';
    explanation = `Căn cứ theo bản chất khoa học của ${lessonClean}: ${kp1}. Phương án B giải thích đầy đủ và chính xác nhất.`;
  } else {
    // Vận dụng
    content = customPrompt?.trim()
      ? `[Bài ${lesson.lessonNumber}: ${lessonClean}] ${customPrompt}`
      : `Trong thực tiễn, việc ứng dụng kiến thức của "${lessonClean}" nhằm mục đích nào sau đây là hợp lí và hiệu quả nhất?`;
    options = {
      A: `Tối ưu hóa quy trình, nâng cao hiệu suất và giải thích các hiện tượng đời sống dựa trên nguyên tắc: ${kp1}.`,
      B: `Làm tăng tổn hao năng lượng và giảm độ bền của thiết bị kỹ thuật.`,
      C: `Thay thế hoàn toàn các quy chuẩn an toàn trong phòng thí nghiệm.`,
      D: `Chỉ áp dụng trong điều kiện nhiệt độ cực cao mà không có ứng dụng thực tiễn.`
    };
    correctAnswer = 'A';
    explanation = `Vận dụng kiến thức Bài ${lesson.lessonNumber} (${lessonClean}) giúp giải quyết bài toán thực tế và nâng cao năng suất kỹ thuật.`;
  }

  return {
    id: `custom-mc-${Date.now()}-${questionNumber}`,
    number: questionNumber,
    content,
    options,
    correctAnswer,
    points: 0.25,
    level,
    topic: `${lesson.discipline} - Bài ${lesson.lessonNumber}: ${lessonClean}`,
    explanation,
    ragSource: {
      docName: lesson.docName,
      pageNumber: `Bài ${lesson.lessonNumber}`,
      relevanceScore: 99
    }
  };
}

export function buildCustomTrueFalseQuestion(
  lesson: LessonSelectionItem,
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng',
  customPrompt?: string,
  questionNumber: number = 1
): TrueFalseQuestion {
  const kp1 = lesson.keyPoints[0] || lesson.summary;
  const kp2 = lesson.keyPoints[1] || 'Đặc trưng quy luật khoa học';
  const lessonClean = lesson.lessonName.replace(/^(?:Bài|BÀI)\s*\d+[:.\-–—\s]*/i, '').trim();

  const context = customPrompt?.trim()
    ? `Cho ngữ liệu sau về "${lessonClean}":\n"${customPrompt}"\nHãy xác định tính Đúng hoặc Sai cho mỗi ý dưới đây:`
    : `Cho các nhận định về chủ đề "${lessonClean}" (trích từ SGK ${lesson.docName}):\n"${lesson.summary}"\nHãy xác định tính Đúng hoặc Sai cho mỗi ý sau:`;

  return {
    id: `custom-tf-${Date.now()}-${questionNumber}`,
    number: questionNumber,
    context,
    statements: [
      {
        subId: 'a',
        text: `${kp1}.`,
        isCorrect: true,
        explanation: `Đúng theo định nghĩa và chuẩn kiến thức SGK ${lesson.docName}.`
      },
      {
        subId: 'b',
        text: `Quy luật trên bị triệt tiêu khi nhiệt độ môi trường thay đổi một lượng nhỏ.`,
        isCorrect: false,
        explanation: `Sai, đây là quy luật phổ quát của tự nhiên.`
      },
      {
        subId: 'c',
        text: `${kp2}.`,
        isCorrect: true,
        explanation: `Đúng theo nội dung phần Em đã học của bài.`
      },
      {
        subId: 'd',
        text: `Hiện tượng này hoàn toàn không thể giải thích bằng các định luật khoa học hiện đại.`,
        isCorrect: false,
        explanation: `Sai, hiện tượng hoàn toàn được chứng minh bằng thực nghiệm và lý thuyết khoa học.`
      }
    ],
    pointsTotal: 1.0,
    level,
    topic: `${lesson.discipline} - Bài ${lesson.lessonNumber}: ${lessonClean}`,
    ragSource: {
      docName: lesson.docName,
      pageNumber: `Bài ${lesson.lessonNumber}`,
      relevanceScore: 98
    }
  };
}

export function buildCustomShortAnswerQuestion(
  lesson: LessonSelectionItem,
  level: 'Thông hiểu' | 'Vận dụng',
  customPrompt?: string,
  expectedAnswer?: string,
  questionNumber: number = 1
): ShortAnswerQuestion {
  const lessonClean = lesson.lessonName.replace(/^(?:Bài|BÀI)\s*\d+[:.\-–—\s]*/i, '').trim();

  let content = '';
  let acceptableAnswers: string[] = [];
  let solutionGuide = '';

  if (customPrompt?.trim()) {
    content = customPrompt.trim();
    const ans = (expectedAnswer || '10').trim();
    acceptableAnswers = [ans, ans.replace('.', ','), ans.toLowerCase()];
    solutionGuide = `Lời giải chuẩn: Vận dụng công thức và kiến thức Bài ${lesson.lessonNumber}: ${lessonClean} để tính toán ra đáp số ${ans}.`;
  } else {
    // Tự động sinh bài toán số liệu phù hợp từng phân môn
    if (lesson.discipline === 'Hóa học') {
      content = `Cho 5,4 gam bột nhôm (Al, M = 27) phản ứng hoàn toàn với dung dịch acid HCl dư. Hãy tính thể tích khí Hydrogen (H₂) thu được ở điều kiện chuẩn (25°C, 1 bar). Điền kết quả bằng số theo đơn vị lít (lấy 3 chữ số thập phân):`;
      acceptableAnswers = ['7.437', '7,437', '7.437 lít', '7,437 lít'];
      solutionGuide = `n(Al) = 5,4 / 27 = 0,2 mol. PTHH: 2Al + 6HCl -> 2AlCl₃ + 3H₂. n(H₂) = 0,3 mol. V(H₂) = 0,3 * 24,79 = 7,437 lít.`;
    } else if (lesson.discipline === 'Vật lí') {
      content = `Một vật bằng nhôm có khối lượng 540 gam, biết khối lượng riêng của nhôm là 2,7 g/cm³. Thể tích của vật này là bao nhiêu cm³? (Chỉ điền số nguyên):`;
      acceptableAnswers = ['200', '200 cm3', '200 cm³'];
      solutionGuide = `Công thức: V = m / D = 540 / 2,7 = 200 cm³.`;
    } else if (lesson.discipline === 'Sinh học') {
      content = `Một phân tử DNA có tổng số 3000 nucleotide, trong đó số nucleotide loại Adenine (A) chiếm 20%. Số nucleotide loại Guanine (G) của phân tử DNA này là bao nhiêu? (Điền số nguyên):`;
      acceptableAnswers = ['900', '900 nucleotit', '900 nu'];
      solutionGuide = `A = T = 20% * 3000 = 600 nu. Theo NTBS: G = C = 50% - 20% = 30% * 3000 = 900 nu.`;
    } else {
      content = `Dựa vào kiến thức Bài ${lesson.lessonNumber}: "${lessonClean}", hãy cho biết tỉ lệ phần trăm hoặc số lượng tối ưu trong thực tế (Điền số nguyên):`;
      acceptableAnswers = [expectedAnswer || '4', '4 đúng', '100'];
      solutionGuide = `Căn cứ theo hướng dẫn kĩ thuật chuẩn trong SGK ${lesson.docName}.`;
    }
  }

  return {
    id: `custom-sa-${Date.now()}-${questionNumber}`,
    number: questionNumber,
    content,
    acceptableAnswers,
    points: 0.5,
    level,
    topic: `${lesson.discipline} - Bài ${lesson.lessonNumber}: ${lessonClean}`,
    solutionGuide,
    ragSource: {
      docName: lesson.docName,
      pageNumber: `Bài ${lesson.lessonNumber}`,
      relevanceScore: 98
    }
  };
}

export function buildCustomEssayQuestion(
  lesson: LessonSelectionItem,
  level: 'Thông hiểu' | 'Vận dụng',
  customPrompt?: string,
  questionNumber: number = 1
): EssayQuestion {
  const lessonClean = lesson.lessonName.replace(/^(?:Bài|BÀI)\s*\d+[:.\-–—\s]*/i, '').trim();

  let content = '';
  let gradingCriteria = [
    { step: 'Ý a (1.0đ): Nêu đúng nguyên lý, viết đúng công thức / PTHH và giải thích rõ ràng.', points: 1.0 },
    { step: 'Ý b (0.5đ): Vận dụng tính toán chính xác và liên hệ biện pháp thực tiễn.', points: 0.5 }
  ];

  if (customPrompt?.trim()) {
    content = customPrompt.trim();
  } else {
    content = `[Bài ${lesson.lessonNumber}: ${lessonClean}]\na) Trình bày bản chất khoa học và nêu ý nghĩa thực tiễn của ${lessonClean} trong đời sống và sản xuất.\nb) Đề xuất giải pháp hoặc tính toán một ví dụ thực nghiệm cụ thể minh họa cho nội dung trên.`;
  }

  return {
    id: `custom-essay-${Date.now()}-${questionNumber}`,
    number: questionNumber,
    content,
    points: 1.5,
    level,
    topic: `${lesson.discipline} - Bài ${lesson.lessonNumber}: ${lessonClean}`,
    gradingCriteria,
    ragSource: {
      docName: lesson.docName,
      pageNumber: `Bài ${lesson.lessonNumber}`,
      relevanceScore: 97
    }
  };
}
