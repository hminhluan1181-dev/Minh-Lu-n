import { UploadedDocument, MatrixRowItem, SpecSheetRow, GradeLevel, Subject, WorkspaceState } from '../types';
import { KHTN_FULL_LIBRARY, SAMPLE_KHTN_HOA_8 } from './khtnChemistryData';
import { DEFAULT_UPLOADED_DOCUMENTS } from './defaultData';

/**
 * Danh mục hợp nhất toàn bộ tài liệu SGK, SBT, SGV của bộ sách Kết Nối Tri Thức Với Cuộc Sống
 * Bao gồm đầy đủ 4 khối lớp 6, 7, 8, 9 cho các phân môn Hóa học, Vật lí, Sinh học và môn Công nghệ 7
 */
export const ALL_CURRICULUM_DOCUMENTS: UploadedDocument[] = (() => {
  const combined: UploadedDocument[] = [
    ...KHTN_FULL_LIBRARY,
    ...DEFAULT_UPLOADED_DOCUMENTS.filter(d => !d.id.startsWith('doc-sgk-khtn'))
  ];
  const seenIds = new Set<string>();
  return combined.filter(doc => {
    if (seenIds.has(doc.id)) return false;
    seenIds.add(doc.id);
    return true;
  });
})();

export interface LessonSelectionItem {
  id: string;
  docId: string;
  docName: string;
  grade: GradeLevel;
  subject: Subject;
  discipline: 'Hóa học' | 'Vật lí' | 'Sinh học' | 'Công nghệ' | 'Toán học' | 'Chung';
  chapterTitle: string;
  chapterNumber: number;
  lessonNumber: string;
  lessonName: string;
  summary: string;
  keyPoints: string[];
  objectives?: {
    knowledge?: string[];
    competenciesSpecific?: string[];
  };
}

/**
 * Trích xuất danh sách tất cả bài học SGK khả dụng theo khối lớp và phân môn
 */
export function getAvailableLessonsForExam(
  grade: GradeLevel,
  disciplineFilter: 'Tất cả' | 'Hóa học' | 'Vật lí' | 'Sinh học' | 'Công nghệ' = 'Tất cả'
): LessonSelectionItem[] {
  const result: LessonSelectionItem[] = [];
  const seenLessons = new Set<string>();

  for (const doc of ALL_CURRICULUM_DOCUMENTS) {
    if (doc.category !== 'sgk') continue; // Ưu tiên SGK làm chuẩn kiến thức
    if (doc.grade !== grade) continue;

    for (const ch of doc.chapters) {
      let discipline: 'Hóa học' | 'Vật lí' | 'Sinh học' | 'Công nghệ' | 'Toán học' | 'Chung' = 'Chung';

      if (doc.subject === 'Công nghệ') {
        discipline = 'Công nghệ';
      } else if (doc.subject === 'Toán học') {
        discipline = 'Toán học';
      } else {
        // Phân môn trong KHTN
        const textToTest = `${doc.name} ${ch.chapterTitle} ${ch.lessonName}`.toLowerCase();
        if (/hóa học|chất|nguyên tử|nguyên tố|bảng tuần hoàn|phản ứng|acid|base|muối|oxide|kim loại|phi kim|alkane|polymer/i.test(textToTest)) {
          discipline = 'Hóa học';
        } else if (/vật lí|lực|đo|nhiệt độ|năng lượng|tốc độ|âm thanh|ánh sáng|quang|từ trường|áp suất|điện|công|thấu kính/i.test(textToTest)) {
          discipline = 'Vật lí';
        } else if (/sinh học|tế bào|sinh vật|thực vật|động vật|quang hợp|hô hấp|máu|vận động|quần thể|di truyền|adn|gen|nhiễm sắc thể|tiến hóa/i.test(textToTest)) {
          discipline = 'Sinh học';
        }
      }

      if (disciplineFilter !== 'Tất cả' && discipline !== disciplineFilter) {
        continue;
      }

      const key = `${grade}-${discipline}-${ch.lessonNumber}-${ch.lessonName}`;
      if (seenLessons.has(key)) continue;
      seenLessons.add(key);

      result.push({
        id: `sel-${doc.id}-${ch.id}`,
        docId: doc.id,
        docName: doc.name,
        grade: doc.grade,
        subject: doc.subject,
        discipline,
        chapterTitle: ch.chapterTitle,
        chapterNumber: ch.chapterNumber,
        lessonNumber: String(ch.lessonNumber || '1'),
        lessonName: ch.lessonName,
        summary: ch.summary || '',
        keyPoints: ch.keyPoints || [],
        objectives: ch.objectives
      });
    }
  }

  // Sắp xếp theo số chương và số bài
  return result.sort((a, b) => {
    if (a.chapterNumber !== b.chapterNumber) return a.chapterNumber - b.chapterNumber;
    return parseInt(a.lessonNumber || '0') - parseInt(b.lessonNumber || '0');
  });
}

/**
 * ĐỀ XUẤT MA TRẬN & BẢN ĐẶC TẢ TỰ ĐỘNG THEO CÔNG VĂN 7991 DỰA TRÊN CÁC BÀI ĐÃ CHỌN
 * Bám sát định lượng chuẩn:
 * - Khung tỉ lệ: 40% Nhận biết (4.0đ) - 30% Thông hiểu (3.0đ) - 30% Vận dụng (3.0đ)
 * - 4 dạng thức:
 *   + TNKQ nhiều lựa chọn: 12 câu x 0.25đ = 3.0đ (8 Biết, 4 Hiểu)
 *   + TNKQ đúng/sai: 2 câu (8 ý) x 1.0đ = 2.0đ (1 câu 4 ý cấp Biết/Hiểu, 1 câu 4 ý cấp Hiểu/VD)
 *   + TNKQ trả lời ngắn: 4 câu x 0.5đ = 2.0đ (2 Hiểu, 2 Vận dụng)
 *   + Tự luận: 2 câu x 1.5đ = 3.0đ (1 Hiểu, 1 Vận dụng)
 */
export function generateMatrixAndSpecForSelectedLessons(
  selectedLessons: LessonSelectionItem[],
  examScopeTitle: string = 'ĐỀ KIỂM TRA ĐỊNH KÌ THEO CÔNG VĂN 7991'
): {
  matrixRows: MatrixRowItem[];
  specRows: SpecSheetRow[];
} {
  if (selectedLessons.length === 0) {
    return { matrixRows: [], specRows: [] };
  }

  const numLessons = selectedLessons.length;

  // Phân bổ câu hỏi đều cho các bài học được chọn
  // Tổng câu cần đạt:
  // TNKQ nhiều lựa chọn: 12 câu (8 Biết, 4 Hiểu)
  // TNKQ đúng sai: 2 câu (8 ý) -> phân bổ cho 2 bài trọng tâm
  // TNKQ trả lời ngắn: 4 câu (2 Hiểu, 2 VD)
  // Tự luận: 2 câu (1 Hiểu, 1 VD)

  const matrixRows: MatrixRowItem[] = [];
  const specRows: SpecSheetRow[] = [];

  // Mảng phân bổ hạn ngạch câu hỏi
  let remTnkqBiet = 8;
  let remTnkqHieu = 4;
  let remDungSai = 2; // Số câu đúng sai (mỗi câu 4 ý)
  let remTlNganHieu = 2;
  let remTlNganVd = 2;
  let remTuLuanHieu = 1;
  let remTuLuanVd = 1;

  selectedLessons.forEach((lesson, index) => {
    const isLast = index === numLessons - 1;

    // Tính quota TNKQ nhiều lựa chọn cho bài này
    const tnkqBietThis = isLast 
      ? remTnkqBiet 
      : Math.max(0, Math.min(remTnkqBiet, Math.round(remTnkqBiet / (numLessons - index))));
    remTnkqBiet -= tnkqBietThis;

    const tnkqHieuThis = isLast 
      ? remTnkqHieu 
      : Math.max(0, Math.min(remTnkqHieu, Math.round(remTnkqHieu / (numLessons - index))));
    remTnkqHieu -= tnkqHieuThis;

    // Quota Đúng Sai (ưu tiên các bài giữa hoặc bài cuối)
    let dungSaiBiet = 0;
    let dungSaiHieu = 0;
    if (remDungSai > 0 && (index === 0 || index === Math.floor(numLessons / 2) || isLast)) {
      if (remDungSai === 2) {
        dungSaiBiet = 1; // 1 câu đúng sai thiên về Biết
        remDungSai--;
      } else if (remDungSai === 1) {
        dungSaiHieu = 1; // 1 câu đúng sai thiên về Hiểu
        remDungSai--;
      }
    }

    // Quota Trả lời ngắn
    const tlNganHieuThis = (remTlNganHieu > 0 && (index % 2 === 0 || isLast)) ? 1 : 0;
    remTlNganHieu -= tlNganHieuThis;

    const tlNganVdThis = (remTlNganVd > 0 && (index % 2 === 1 || isLast)) ? 1 : 0;
    remTlNganVd -= tlNganVdThis;

    // Quota Tự luận
    let tuLuanHieuThis = 0;
    let tuLuanVdThis = 0;
    if (remTuLuanHieu > 0 && index === Math.floor(numLessons / 2)) {
      tuLuanHieuThis = 1;
      remTuLuanHieu--;
    }
    if (remTuLuanVd > 0 && (isLast || (index === numLessons - 1))) {
      tuLuanVdThis = 1;
      remTuLuanVd--;
    }

    // Tạo dòng ma trận Phụ lục 1
    const matRow: MatrixRowItem = {
      id: `mat-gen-${lesson.id}-${index}`,
      chapter: lesson.chapterTitle,
      unit: `Bài ${lesson.lessonNumber}: ${lesson.lessonName}`,
      tnkq_nhieuLuaChon: {
        biet: tnkqBietThis,
        hieu: tnkqHieuThis,
        vanDung: 0
      },
      tnkq_dungSai: {
        biet: dungSaiBiet,
        hieu: dungSaiHieu,
        vanDung: 0
      },
      tnkq_traLoiNgan: {
        biet: 0,
        hieu: tlNganHieuThis,
        vanDung: tlNganVdThis
      },
      tuLuan: {
        biet: 0,
        hieu: tuLuanHieuThis,
        vanDung: tuLuanVdThis
      }
    };
    matrixRows.push(matRow);

    // Xây dựng Yêu cầu cần đạt chuẩn GDPT 2018 cho Bản đặc tả Phụ lục 2
    const knowList = (lesson.objectives?.knowledge && lesson.objectives.knowledge.length > 0)
      ? lesson.objectives.knowledge
      : lesson.keyPoints.slice(0, 2);

    const compList = (lesson.objectives?.competenciesSpecific && lesson.objectives.competenciesSpecific.length > 0)
      ? lesson.objectives.competenciesSpecific
      : [
          `Giải thích được hiện tượng, cơ chế và bản chất quy luật của ${lesson.lessonName}.`,
          `Mô tả được các đại lượng hoặc cấu trúc đặc trưng trong SGK ${lesson.docName}.`
        ];

    const specRow: SpecSheetRow = {
      id: `spec-gen-${lesson.id}-${index}`,
      chapter: lesson.chapterTitle,
      unit: `Bài ${lesson.lessonNumber}: ${lesson.lessonName}`,
      learningOutcomes: {
        biet: knowList.length > 0 ? knowList : [`Nhận biết được các khái niệm và định nghĩa cơ bản của ${lesson.lessonName}.`],
        hieu: compList.length > 0 ? compList : [`Hiểu và giải thích được mối quan hệ giữa các yếu tố trong bài học.`],
        vanDung: [
          `Vận dụng kiến thức Bài ${lesson.lessonNumber} (${lesson.lessonName}) để giải quyết bài tập định lượng và giải thích hiện tượng thực tiễn đời sống.`
        ]
      },
      numberOfQuestions: {
        tnkq_nhieuLuaChon: {
          biet: tnkqBietThis,
          hieu: tnkqHieuThis,
          vanDung: 0
        },
        tnkq_dungSai: {
          biet: dungSaiBiet,
          hieu: dungSaiHieu,
          vanDung: 0
        },
        tnkq_traLoiNgan: {
          biet: 0,
          hieu: tlNganHieuThis,
          vanDung: tlNganVdThis
        },
        tuLuan: {
          biet: 0,
          hieu: tuLuanHieuThis,
          vanDung: tuLuanVdThis
        }
      }
    };
    specRows.push(specRow);
  });

  return { matrixRows, specRows };
}

// =========================================================================
// PRESET MẪU CHO KHTN 8 (PHÂN MÔN VẬT LÍ - BÀI 14: KHỐI LƯỢNG RIÊNG & ÁP SUẤT)
// =========================================================================
export const SAMPLE_KHTN_VATLI_8: WorkspaceState = {
  ...SAMPLE_KHTN_HOA_8,
  lessonPlan: {
    ...SAMPLE_KHTN_HOA_8.lessonPlan,
    grade: 'Lớp 8',
    lessonName: 'BÀI 14: KHỐI LƯỢNG RIÊNG VÀ ÁP SUẤT',
    durationInPeriods: 2,
    objectives: {
      knowledge: [
        'Nêu được định nghĩa khối lượng riêng của một chất (khối lượng của một đơn vị thể tích).',
        'Viết được công thức tính khối lượng riêng D = m/V và trọng lượng riêng d = P/V.',
        'Đo được khối lượng riêng của vật rắn bất kì bằng cân và bình chia độ.',
        'Vận dụng công thức để giải thích tại sao tàu thủy bằng thép lại nổi trên mặt nước.'
      ],
      competencies: {
        general: [
          'Năng lực tự chủ và tự học: Tìm hiểu bảng khối lượng riêng các chất trong SGK KNTT.',
          'Năng lực giao tiếp và hợp tác: Làm việc nhóm thực hành đo thể tích hòn sỏi bằng bình chia độ.'
        ],
        specific: [
          'Năng lực nhận thức khoa học tự nhiên: So sánh khối lượng riêng của nhôm, sắt, chì.',
          'Năng lực tìm hiểu tự nhiên: Kĩ năng sử dụng cân Roborval và bình tràn.'
        ]
      },
      qualities: [
        'Cẩn thận, chính xác khi đọc thể tích chất lỏng ngang vạch chia.'
      ]
    }
  },
  matrixRows: [
    {
      id: 'mat-phys8-1',
      chapter: 'Chương 3: Khối lượng riêng và Áp suất (Vật lí 8)',
      unit: 'Bài 14 & 16: Khối lượng riêng, Áp suất và Lực đẩy Archimedes',
      tnkq_nhieuLuaChon: { biet: 8, hieu: 4, vanDung: 0 },
      tnkq_dungSai: { biet: 1, hieu: 1, vanDung: 0 },
      tnkq_traLoiNgan: { biet: 0, hieu: 2, vanDung: 2 },
      tuLuan: { biet: 0, hieu: 1, vanDung: 1 }
    }
  ],
  specRows: [
    {
      id: 'spec-phys8-1',
      chapter: 'Chương 3: Khối lượng riêng và Áp suất (Vật lí 8)',
      unit: 'Bài 14 & 16: Khối lượng riêng, Áp suất và Lực đẩy Archimedes',
      learningOutcomes: {
        biet: [
          'Nêu được định nghĩa khối lượng riêng D = m/V và đơn vị đo chuẩn (kg/m³, g/cm³).',
          'Nêu được công thức tính áp suất p = F/S và áp suất chất lỏng p = d.h.',
          'Chỉ ra được phương và chiều của lực đẩy Ác-si-mét (thẳng đứng, hướng từ dưới lên).'
        ],
        hieu: [
          'Giải thích được tại sao vật chìm, nổi hoặc lơ lửng khi nhúng trong chất lỏng (so sánh d_vật và d_lỏng).',
          'Mô tả được nguyên lý hoạt động của bình thông nhau và kích thủy lực.'
        ],
        vanDung: [
          'Tính được khối lượng riêng, khối lượng hoặc thể tích của một vật theo công thức D = m/V.',
          'Tính được độ lớn lực đẩy Archimedes F_A = d.V và giải thích nguyên lý nổi của tàu thuyền.'
        ]
      },
      numberOfQuestions: {
        tnkq_nhieuLuaChon: { biet: 8, hieu: 4, vanDung: 0 },
        tnkq_dungSai: { biet: 1, hieu: 1, vanDung: 0 },
        tnkq_traLoiNgan: { biet: 0, hieu: 2, vanDung: 2 },
        tuLuan: { biet: 0, hieu: 1, vanDung: 1 }
      }
    }
  ],
  exam: {
    title: 'ĐỀ KIỂM TRA ĐỊNH KÌ GIỮA HỌC KÌ I - MÔN KHOA HỌC TỰ NHIÊN 8 (PHÂN MÔN VẬT LÍ)',
    examType: 'Kiểm tra giữa học kì 1',
    durationMinutes: 45,
    academicYear: 'Năm học 2024 - 2025',
    totalScore: 10.0,
    weighting: {
      recognition: 40,
      comprehension: 30,
      application: 30
    },
    partI_MultipleChoice: [
      {
        id: 'q-phys8-1',
        number: 1,
        content: 'Khối lượng riêng của một chất được xác định bằng công thức nào sau đây?',
        options: {
          A: 'D = m / V',
          B: 'D = m . V',
          C: 'D = V / m',
          D: 'D = P / V'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Định nghĩa Khối lượng riêng',
        explanation: 'Khối lượng riêng D = m/V (trong đó m là khối lượng, V là thể tích).'
      },
      {
        id: 'q-phys8-2',
        number: 2,
        content: 'Đơn vị hợp pháp của khối lượng riêng trong hệ đo lường chuẩn SI là:',
        options: {
          A: 'kg/m³',
          B: 'g/cm³',
          C: 'N/m³',
          D: 'kg/L'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Đơn vị đo khối lượng riêng',
        explanation: 'Đơn vị chuẩn SI là kg/m³. 1 g/cm³ = 1000 kg/m³.'
      },
      {
        id: 'q-phys8-3',
        number: 3,
        content: 'Đơn vị đo của áp suất trong hệ đo lường quốc tế SI là:',
        options: {
          A: 'Pascal (Pa) hoặc N/m²',
          B: 'Newton (N)',
          C: 'Joule (J)',
          D: 'Watt (W)'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Đơn vị áp suất',
        explanation: '1 Pa = 1 N/m².'
      },
      {
        id: 'q-phys8-4',
        number: 4,
        content: 'Chất lỏng gây ra áp suất theo phương nào lên đáy và thành bình?',
        options: {
          A: 'Chất lỏng gây áp suất theo mọi phương lên đáy bình, thành bình và các vật nhúng trong nó.',
          B: 'Chỉ gây áp suất thẳng đứng hướng xuống đáy bình.',
          C: 'Chỉ gây áp suất vuông góc với thành bình.',
          D: 'Chỉ gây áp suất hướng thẳng đứng từ dưới lên.'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Áp suất chất lỏng',
        explanation: 'Chất lỏng gây áp suất theo mọi phương lên đáy, thành bình và vật nhúng trong lòng nó.'
      },
      {
        id: 'q-phys8-5',
        number: 5,
        content: 'Lực đẩy Ác-si-mét (Archimedes) tác dụng lên vật nhúng trong chất lỏng có phương và chiều như thế nào?',
        options: {
          A: 'Phương thẳng đứng, chiều từ dưới lên trên.',
          B: 'Phương thẳng đứng, chiều từ trên xuống dưới.',
          C: 'Phương nằm ngang, chiều từ trái sang phải.',
          D: 'Phương xiên góc 45 độ.'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Đặc điểm lực đẩy Ác-si-mét',
        explanation: 'Lực đẩy Ác-si-mét luôn có phương thẳng đứng, chiều từ dưới lên trên.'
      },
      {
        id: 'q-phys8-6',
        number: 6,
        content: 'Công thức tính độ lớn của lực đẩy Ác-si-mét là:',
        options: {
          A: 'F_A = d . V',
          B: 'F_A = D . V',
          C: 'F_A = P / V',
          D: 'F_A = m . g'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Công thức lực đẩy Ác-si-mét',
        explanation: 'F_A = d . V, trong đó d là trọng lượng riêng chất lỏng, V là thể tích phần vật chìm trong chất lỏng.'
      },
      {
        id: 'q-phys8-7',
        number: 7,
        content: 'Điều kiện để một vật nổi lên trên mặt nước khi thả vào chậu nước là:',
        options: {
          A: 'Trọng lượng riêng của vật nhỏ hơn trọng lượng riêng của nước (d_vật < d_nước).',
          B: 'Trọng lượng riêng của vật lớn hơn trọng lượng riêng của nước (d_vật > d_nước).',
          C: 'Trọng lượng riêng của vật bằng trọng lượng riêng của nước (d_vật = d_nước).',
          D: 'Khối lượng của vật phải rất nhỏ.'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Điều kiện vật nổi',
        explanation: 'Khi d_vật < d_lỏng thì lực đẩy Ác-si-mét lớn hơn trọng lực, vật sẽ nổi lên mặt thoáng.'
      },
      {
        id: 'q-phys8-8',
        number: 8,
        content: 'Dụng cụ nào sau đây dùng để đo áp suất khí quyển?',
        options: {
          A: 'Khí áp kế',
          B: 'Lực kế',
          C: 'Nhiệt kế',
          D: 'Oát kế'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Dụng cụ đo áp suất khí quyển',
        explanation: 'Khí áp kế (barometer) là dụng cụ chuyên dụng đo áp suất khí quyển.'
      },
      {
        id: 'q-phys8-9',
        number: 9,
        content: 'Khi lặn sâu dần xuống đáy biển, áp suất do nước biển tác dụng lên người thợ lặn thay đổi như thế nào?',
        options: {
          A: 'Càng lặn sâu thì áp suất càng tăng vì p = d.h (độ sâu h tăng).',
          B: 'Càng lặn sâu thì áp suất càng giảm.',
          C: 'Áp suất không thay đổi ở mọi độ sâu.',
          D: 'Áp suất chỉ tăng khi bơi nhanh.'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'Áp suất chất lỏng theo độ sâu',
        explanation: 'Công thức p = d . h cho thấy áp suất tỉ lệ thuận với độ sâu h tính từ mặt thoáng.'
      },
      {
        id: 'q-phys8-10',
        number: 10,
        content: 'Tại sao chân tường nhà hoặc đập chắn nước thủy điện thường được xây rộng hơn ở phần chân đáy?',
        options: {
          A: 'Để tăng diện tích mặt bị ép S, làm giảm áp suất tác dụng lên nền đất (p = F/S) và chịu áp suất nước lớn ở đáy.',
          B: 'Để tiết kiệm vật liệu xây dựng.',
          C: 'Để cho chân tường nhẹ hơn phần trên.',
          D: 'Chỉ vì tính thẩm mỹ kiến trúc.'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'Vận dụng nguyên lý áp suất',
        explanation: 'Đáy đập chịu áp suất chất lỏng lớn nhất (p = d.h), đồng thời tăng diện tích tiếp xúc S giúp giảm áp suất lên nền móng.'
      },
      {
        id: 'q-phys8-11',
        number: 11,
        content: 'Một khối nhôm có thể tích V = 0,02 m³, biết khối lượng riêng của nhôm D = 2700 kg/m³. Khối lượng của khối nhôm là:',
        options: {
          A: '54 kg',
          B: '27 kg',
          C: '135 kg',
          D: '540 kg'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'Tính khối lượng từ D và V',
        explanation: 'm = D . V = 2700 * 0,02 = 54 kg.'
      },
      {
        id: 'q-phys8-12',
        number: 12,
        content: 'Một thỏi đồng có thể tích 100 cm³ được nhúng chìm hoàn toàn trong nước (trọng lượng riêng của nước d = 10 000 N/m³). Lực đẩy Ác-si-mét tác dụng lên thỏi đồng là:',
        options: {
          A: '1,0 N',
          B: '10 N',
          C: '0,1 N',
          D: '100 N'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'Tính lực đẩy Ác-si-mét',
        explanation: 'Đổi V = 100 cm³ = 0,0001 m³. F_A = d . V = 10 000 * 0,0001 = 1,0 N.'
      }
    ],
    partII_TrueFalse: [
      {
        id: 'tf-phys8-1',
        number: 1,
        context: 'Thực hiện thí nghiệm nhúng một khối kim loại đặc có trọng lượng P = 7,8 N vào bình chia độ đựng nước (trọng lượng riêng của nước d = 10 000 N/m³). Nước trong bình dâng lên thêm 100 cm³. Xét tính Đúng/Sai của các mệnh đề sau:',
        level: 'Thông hiểu',
        topic: 'Lực đẩy Archimedes & Sự chìm nổi',
        pointsTotal: 1.0,
        statements: [
          {
            subId: 'a',
            text: 'Thể tích phần nước dâng lên đúng bằng thể tích của khối kim loại (V = 100 cm³ = 0,0001 m³).',
            isCorrect: true,
            explanation: 'Đúng. Khối kim loại chìm hoàn toàn nên thể tích nước tràn/dâng đúng bằng thể tích vật.'
          },
          {
            subId: 'b',
            text: 'Độ lớn của lực đẩy Ác-si-mét tác dụng lên khối kim loại là 1,0 N.',
            isCorrect: true,
            explanation: 'Đúng. F_A = d . V = 10 000 * 0,0001 = 1,0 N.'
          },
          {
            subId: 'c',
            text: 'Khi buông tay, khối kim loại sẽ nổi lên mặt nước vì chịu lực đẩy từ dưới lên.',
            isCorrect: false,
            explanation: 'Sai. Trọng lượng P = 7,8 N > F_A = 1,0 N nên vật chìm xuống đáy bình.'
          },
          {
            subId: 'd',
            text: 'Nếu nhúng khối kim loại này vào dầu hỏa (d_dầu = 8 000 N/m³), lực đẩy Ác-si-mét sẽ nhỏ hơn khi nhúng trong nước.',
            isCorrect: true,
            explanation: 'Đúng. Vì d_dầu < d_nước nên F_A(dầu) = 8 000 * 0,0001 = 0,8 N < 1,0 N.'
          }
        ]
      },
      {
        id: 'tf-phys8-2',
        number: 2,
        context: 'Về ứng dụng của áp suất khí quyển và áp suất chất lỏng trong đời sống hàng ngày:',
        level: 'Thông hiểu',
        topic: 'Áp suất khí quyển & Ứng dụng',
        pointsTotal: 1.0,
        statements: [
          {
            subId: 'a',
            text: 'Hiện tượng nước dâng lên trong ống hút khi hút nước giải khát là do áp suất khí quyển bên ngoài lớn hơn áp suất trong miệng.',
            isCorrect: true,
            explanation: 'Đúng. Khi hút, áp suất trong miệng giảm, áp suất khí quyển nén mặt nước đẩy nước dâng lên.'
          },
          {
            subId: 'b',
            text: 'Khi lên càng cao trên đỉnh núi, áp suất khí quyển càng tăng khiến con người dễ thở hơn.',
            isCorrect: false,
            explanation: 'Sai. Càng lên cao không khí càng loãng, áp suất khí quyển càng giảm.'
          },
          {
            subId: 'c',
            text: 'Núm giác hút cao su bám chặt vào bề mặt kính là nhờ tác dụng của áp suất khí quyển nén chặt bên ngoài.',
            isCorrect: true,
            explanation: 'Đúng. Không khí bên trong giác hút bị ép ra ngoài, áp suất khí quyển bên ngoài ép núm dính chặt.'
          },
          {
            subId: 'd',
            text: 'Trong bình thông nhau chứa cùng một chất lỏng đứng yên, mực chất lỏng ở nhánh hẹp luôn cao hơn mực chất lỏng ở nhánh rộng.',
            isCorrect: false,
            explanation: 'Sai. Trong bình thông nhau, các mặt thoáng của cùng một chất lỏng luôn ở cùng một độ cao.'
          }
        ]
      }
    ],
    partIII_ShortAnswer: [
      {
        id: 'sa-phys8-1',
        number: 1,
        content: 'Một thùng chứa đầy nước cao 1,2 m. Biết trọng lượng riêng của nước là 10 000 N/m³. Tính áp suất của nước tác dụng lên đáy thùng (theo đơn vị Pascal - Pa).',
        acceptableAnswers: ['12000', '12 000', '12000 Pa', '12 kPa'],
        points: 0.5,
        level: 'Thông hiểu',
        topic: 'Tính áp suất chất lỏng đáy bình',
        solutionGuide: 'Áp dụng công thức p = d . h = 10 000 * 1,2 = 12 000 Pa.'
      },
      {
        id: 'sa-phys8-2',
        number: 2,
        content: 'Một người tác dụng lên sàn nhà một áp lực 600 N. Diện tích tiếp xúc của hai bàn chân với sàn là 0,03 m². Áp suất của người đó tác dụng lên sàn nhà là bao nhiêu Pa?',
        acceptableAnswers: ['20000', '20 000', '20000 Pa', '20 kPa'],
        points: 0.5,
        level: 'Thông hiểu',
        topic: 'Tính áp suất p = F/S',
        solutionGuide: 'p = F / S = 600 / 0,03 = 20 000 Pa.'
      },
      {
        id: 'sa-phys8-3',
        number: 3,
        content: 'Một quả cầu bằng sắt có thể tích V = 0,005 m³ được nhúng chìm hoàn toàn trong nước (d_nước = 10 000 N/m³). Độ lớn của lực đẩy Ác-si-mét tác dụng lên quả cầu là bao nhiêu Newton (N)?',
        acceptableAnswers: ['50', '50 N'],
        points: 0.5,
        level: 'Vận dụng',
        topic: 'Tính lực đẩy Archimedes',
        solutionGuide: 'F_A = d . V = 10 000 * 0,005 = 50 N.'
      },
      {
        id: 'sa-phys8-4',
        number: 4,
        content: 'Khối gỗ hình lập phương có cạnh 10 cm chìm một nửa trong nước. Tính thể tích phần gỗ chìm trong nước ra đơn vị cm³.',
        acceptableAnswers: ['500', '500 cm3', '500 cm³'],
        points: 0.5,
        level: 'Vận dụng',
        topic: 'Tính thể tích phần vật chìm',
        solutionGuide: 'Thể tích khối gỗ: V = 10 * 10 * 10 = 1000 cm³. Phần gỗ chìm: V_chìm = 1000 / 2 = 500 cm³.'
      }
    ],
    partIV_Essay: [
      {
        id: 'es-phys8-1',
        number: 1,
        content: 'a) Phát biểu định luật Ác-si-mét và viết công thức tính lực đẩy Ác-si-mét (nêu rõ tên và đơn vị các đại lượng trong công thức).\nb) Giải thích tại sao một chiếc đinh sắt thả vào nước thì chìm, nhưng một con tàu thủy khổng lồ làm bằng thép lại nổi trên mặt biển?',
        points: 1.5,
        level: 'Thông hiểu',
        topic: 'Nguyên lý lực đẩy Archimedes và ứng dụng tàu thủy',
        gradingCriteria: [
          { step: 'Ý a (1.0đ): Nêu đúng định luật (vật nhúng trong chất lỏng bị lực đẩy hướng thẳng đứng từ dưới lên) và viết đúng F_A = d.V với d (N/m³), V (m³).', points: 1.0 },
          { step: 'Ý b (0.5đ): Giải thích: Đinh sắt đặc nên d_đinh > d_nước → chìm; tàu thủy có khoang rỗng lớn chứa không khí nên trọng lượng riêng trung bình d_tàu < d_nước → nổi.', points: 0.5 }
        ]
      },
      {
        id: 'es-phys8-2',
        number: 2,
        content: 'Một vật bằng kim loại có khối lượng m = 1,56 kg và thể tích V = 0,0002 m³.\na) Tính khối lượng riêng của kim loại đó (theo kg/m³) và cho biết kim loại đó là gì (biết D_sắt = 7800 kg/m³, D_nhôm = 2700 kg/m³).\nb) Thả vật đó vào nước (d_nước = 10 000 N/m³). Vật đó chìm hay nổi? Tính lực đẩy Ác-si-mét tác dụng lên vật khi chìm hoàn toàn trong nước.',
        points: 1.5,
        level: 'Vận dụng',
        topic: 'Bài toán khối lượng riêng và sự chìm nổi',
        gradingCriteria: [
          { step: 'Ý a (0.75đ): D = m / V = 1,56 / 0,0002 = 7800 kg/m³. Kết luận kim loại đó là Sắt (Iron).', points: 0.75 },
          { step: 'Ý b (0.75đ): Trọng lượng vật P = 10m = 15,6 N. F_A = d.V = 10 000 * 0,0002 = 2 N. Vì P > F_A nên vật chìm xuống đáy.', points: 0.75 }
        ]
      }
    ]
  }
};

// =========================================================================
// PRESET MẪU CHO KHTN 8 (PHÂN MÔN SINH HỌC - BÀI 30: MÁU & HỆ TUẦN HOÀN)
// =========================================================================
export const SAMPLE_KHTN_SINH_8: WorkspaceState = {
  ...SAMPLE_KHTN_HOA_8,
  lessonPlan: {
    ...SAMPLE_KHTN_HOA_8.lessonPlan,
    grade: 'Lớp 8',
    lessonName: 'BÀI 30: MÁU VÀ HỆ TUẦN HOÀN Ở NGƯỜI',
    durationInPeriods: 2,
    objectives: {
      knowledge: [
        'Mô tả được các thành phần của máu gồm huyết tương (55%) và các tế bào máu (hồng cầu, bạch cầu, tiểu cầu).',
        'Nêu được chức năng của từng thành phần máu: Hồng cầu vận chuyển khí, bạch cầu bảo vệ miễn dịch, tiểu cầu đông máu.',
        'Trình bày được cấu tạo của tim (4 ngăn: 2 tâm nhĩ, 2 tâm thất) và hệ mạch (động mạch, mao mạch, tĩnh mạch).',
        'Giải thích được sơ đồ truyền máu ABO và các biện pháp bảo vệ hệ tim mạch khỏe mạnh.'
      ],
      competencies: {
        general: [
          'Năng lực tự chủ và tự học: Tìm hiểu bảng nhóm máu ABO trong SGK KNTT.',
          'Năng lực giao tiếp và hợp tác: Hoạt động nhóm mô phỏng đường đi của máu trong 2 vòng tuần hoàn.'
        ],
        specific: [
          'Năng lực nhận thức sinh học: Đọc kết quả xét nghiệm máu đơn giản.',
          'Năng lực vận dụng: Biết cách sơ cứu cầm máu khi bị trầy xước hoặc đứt tay.'
        ]
      },
      qualities: [
        'Có ý thức chăm sóc sức khỏe tim mạch, không hút thuốc lá, tập thể dục đều đặn.'
      ]
    }
  },
  matrixRows: [
    {
      id: 'mat-bio8-1',
      chapter: 'Chương 7: Sinh học cơ thể người (Sinh học 8)',
      unit: 'Bài 30: Máu và Hệ tuần hoàn ở người',
      tnkq_nhieuLuaChon: { biet: 8, hieu: 4, vanDung: 0 },
      tnkq_dungSai: { biet: 1, hieu: 1, vanDung: 0 },
      tnkq_traLoiNgan: { biet: 0, hieu: 2, vanDung: 2 },
      tuLuan: { biet: 0, hieu: 1, vanDung: 1 }
    }
  ],
  specRows: [
    {
      id: 'spec-bio8-1',
      chapter: 'Chương 7: Sinh học cơ thể người (Sinh học 8)',
      unit: 'Bài 30: Máu và Hệ tuần hoàn ở người',
      learningOutcomes: {
        biet: [
          'Nêu được các thành phần chính của máu (huyết tương, hồng cầu, bạch cầu, tiểu cầu).',
          'Nêu được 4 nhóm máu trong hệ nhóm máu ABO (A, B, AB, O).',
          'Chỉ ra được 4 ngăn của tim người (tâm nhĩ phải, tâm thất phải, tâm nhĩ trái, tâm thất trái).'
        ],
        hieu: [
          'Giải thích được chức năng vận chuyển O2 và CO2 của huyết sắc tố hemoglobin trong hồng cầu.',
          'Phân biệt được vòng tuần hoàn lớn (nuôi cơ thể) và vòng tuần hoàn nhỏ (trao đổi khí ở phổi).'
        ],
        vanDung: [
          'Vận dụng nguyên tắc truyền máu không để kháng nguyên gặp kháng thể tương ứng gây ngưng kết.',
          'Đề xuất các biện pháp phòng chống bệnh cao huyết áp và xơ vữa động mạch.'
        ]
      },
      numberOfQuestions: {
        tnkq_nhieuLuaChon: { biet: 8, hieu: 4, vanDung: 0 },
        tnkq_dungSai: { biet: 1, hieu: 1, vanDung: 0 },
        tnkq_traLoiNgan: { biet: 0, hieu: 2, vanDung: 2 },
        tuLuan: { biet: 0, hieu: 1, vanDung: 1 }
      }
    }
  ],
  exam: {
    title: 'ĐỀ KIỂM TRA ĐỊNH KÌ GIỮA HỌC KÌ I - MÔN KHOA HỌC TỰ NHIÊN 8 (PHÂN MÔN SINH HỌC)',
    examType: 'Kiểm tra giữa học kì 1',
    durationMinutes: 45,
    academicYear: 'Năm học 2024 - 2025',
    totalScore: 10.0,
    weighting: {
      recognition: 40,
      comprehension: 30,
      application: 30
    },
    partI_MultipleChoice: [
      {
        id: 'q-bio8-1',
        number: 1,
        content: 'Thành phần nào chiếm tỉ lệ lớn nhất (khoảng 55%) trong thể tích máu người bình thường?',
        options: {
          A: 'Huyết tương',
          B: 'Hồng cầu',
          C: 'Bạch cầu',
          D: 'Tiểu cầu'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Thành phần của máu',
        explanation: 'Máu gồm 55% huyết tương và 45% các tế bào máu.'
      },
      {
        id: 'q-bio8-2',
        number: 2,
        content: 'Tế bào máu nào đóng vai trò vận chuyển khí Oxygen (O₂) từ phổi đến tế bào và khí Carbon dioxide (CO₂) từ tế bào về phổi?',
        options: {
          A: 'Hồng cầu',
          B: 'Bạch cầu',
          C: 'Tiểu cầu',
          D: 'Tế bào biểu bì'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Chức năng hồng cầu',
        explanation: 'Hồng cầu chứa hemoglobin có khả năng kết hợp thuận nghịch với O₂ và CO₂.'
      },
      {
        id: 'q-bio8-3',
        number: 3,
        content: 'Thành phần nào trong máu tham gia trực tiếp vào quá trình đông máu giúp ngăn chặn sự mất máu khi bị thương?',
        options: {
          A: 'Tiểu cầu',
          B: 'Bạch cầu mono',
          C: 'Hồng cầu',
          D: 'Kháng thể'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Cơ chế đông máu',
        explanation: 'Tiểu cầu vỡ giải phóng enzyme hình thành búi tơ máu giữ các tế bào máu tạo thành cục máu đông.'
      },
      {
        id: 'q-bio8-4',
        number: 4,
        content: 'Tim của người bình thường được cấu tạo gồm mấy ngăn?',
        options: {
          A: '4 ngăn (2 tâm nhĩ và 2 tâm thất)',
          B: '2 ngăn (1 tâm nhĩ và 1 tâm thất)',
          C: '3 ngăn (2 tâm nhĩ và 1 tâm thất)',
          D: '1 ngăn duy nhất'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Cấu tạo tim người',
        explanation: 'Tim người có 4 ngăn: tâm nhĩ phải, tâm nhĩ trái, tâm thất phải, tâm thất trái.'
      },
      {
        id: 'q-bio8-5',
        number: 5,
        content: 'Trong hệ nhóm máu ABO, người mang nhóm máu nào được gọi là "nhóm máu chuyên cho" vì hồng cầu không chứa kháng nguyên A và B?',
        options: {
          A: 'Nhóm máu O',
          B: 'Nhóm máu AB',
          C: 'Nhóm máu A',
          D: 'Nhóm máu B'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Hệ nhóm máu ABO',
        explanation: 'Hồng cầu nhóm máu O không có kháng nguyên A và B nên có thể truyền cho các nhóm máu khác.'
      },
      {
        id: 'q-bio8-6',
        number: 6,
        content: 'Mạch máu nào có chức năng đưa máu từ tim đến các cơ quan và có thành dày, tính đàn hồi cao nhất?',
        options: {
          A: 'Động mạch',
          B: 'Tĩnh mạch',
          C: 'Mao mạch',
          D: 'Mạch bạch huyết'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Cấu tạo hệ mạch',
        explanation: 'Động mạch chịu áp lực co bóp lớn từ tim nên có thành dày và lớp cơ trơn đàn hồi tốt.'
      },
      {
        id: 'q-bio8-7',
        number: 7,
        content: 'Vòng tuần hoàn nhỏ ở người có vai trò chính là gì?',
        options: {
          A: 'Dẫn máu qua phổi để thực hiện trao đổi khí (nhận O₂ và thải CO₂).',
          B: 'Dẫn máu đi nuôi toàn bộ các cơ quan trong cơ thể.',
          C: 'Dẫn máu qua hệ tiêu hóa để hấp thu chất dinh dưỡng.',
          D: 'Dẫn máu qua thận để lọc chất cặn bã.'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Vòng tuần hoàn nhỏ',
        explanation: 'Vòng tuần hoàn nhỏ bơm máu từ tâm thất phải lên phổi để trao đổi khí rồi về tâm nhĩ trái.'
      },
      {
        id: 'q-bio8-8',
        number: 8,
        content: 'Van tim nào nằm giữa tâm nhĩ trái và tâm thất trái đảm bảo máu chỉ chảy một chiều?',
        options: {
          A: 'Van hai lá',
          B: 'Van ba lá',
          C: 'Van tổ chim động mạch chủ',
          D: 'Van tĩnh mạch'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Hệ thống van tim',
        explanation: 'Nửa trái của tim có van hai lá ngăn giữa tâm nhĩ trái và tâm thất trái.'
      },
      {
        id: 'q-bio8-9',
        number: 9,
        content: 'Tại sao thành tâm thất trái lại dày hơn nhiều so với thành tâm thất phải?',
        options: {
          A: 'Vì tâm thất trái phải co bóp tạo áp lực lớn đẩy máu đi nuôi toàn bộ cơ thể theo vòng tuần hoàn lớn.',
          B: 'Vì tâm thất trái chứa lượng máu nhiều gấp đôi tâm thất phải.',
          C: 'Vì tâm thất trái tiếp nhận máu giàu CO₂.',
          D: 'Vì tâm thất trái bơm máu lên phổi gần tim.'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'Cấu tạo phù hợp chức năng của tim',
        explanation: 'Tâm thất trái bơm máu đi khắp cơ thể nên cần lớp cơ tim dày và khỏe nhất.'
      },
      {
        id: 'q-bio8-10',
        number: 10,
        content: 'Hiện tượng ngưng kết hồng cầu nguy hiểm đến tính mạng khi truyền máu xảy ra do:',
        options: {
          A: 'Kháng nguyên trên hồng cầu người cho gặp kháng thể tương ứng trong huyết tương người nhận.',
          B: 'Máu người cho bị nhiễm vi khuẩn.',
          C: 'Máu người nhận thiếu chất sắt.',
          D: 'Truyền lượng máu quá ít.'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'Nguyên tắc truyền máu',
        explanation: 'Kháng nguyên A gặp kháng thể α (hoặc B gặp β) sẽ gây phản ứng ngưng kết làm vỡ hồng cầu.'
      },
      {
        id: 'q-bio8-11',
        number: 11,
        content: 'Một người có nhóm máu B. Khi cần truyền máu khẩn cấp, người này có thể tiếp nhận an toàn máu từ người cho mang nhóm máu nào?',
        options: {
          A: 'Nhóm máu B hoặc nhóm máu O',
          B: 'Chỉ nhóm máu A',
          C: 'Nhóm máu AB hoặc A',
          D: 'Chỉ nhóm máu AB'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'Sơ đồ truyền máu ABO',
        explanation: 'Người nhóm máu B có kháng thể anti-A trong huyết tương, nên có thể nhận nhóm B hoặc nhóm O.'
      },
      {
        id: 'q-bio8-12',
        number: 12,
        content: 'Biện pháp nào sau đây là khoa học nhất giúp rèn luyện và bảo vệ hệ tim mạch khỏe mạnh?',
        options: {
          A: 'Tập thể dục thể thao đều đặn vừa sức, hạn chế thức ăn nhiều mỡ động vật và không hút thuốc lá.',
          B: 'Ăn thật nhiều đồ ngọt và nằm nghỉ ngơi cả ngày.',
          C: 'Uống nhiều nước ngọt có gas và thức khuya.',
          D: 'Lao động quá sức liên tục không nghỉ ngơi.'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'Vệ sinh hệ tim mạch',
        explanation: 'Thể thao điều độ tăng cường sức co bóp cơ tim, giảm cholesterol và chống xơ vữa động mạch.'
      }
    ],
    partII_TrueFalse: [
      {
        id: 'tf-bio8-1',
        number: 1,
        context: 'Một bệnh nhân đi khám bệnh được bác sĩ làm xét nghiệm công thức máu và nhóm máu. Xét tính Đúng/Sai của các nhận định y học sau:',
        level: 'Thông hiểu',
        topic: 'Ý nghĩa xét nghiệm máu và nhóm máu',
        pointsTotal: 1.0,
        statements: [
          {
            subId: 'a',
            text: 'Số lượng hồng cầu giảm thấp hơn mức bình thường là dấu hiệu cơ thể bị thiếu máu (thường do thiếu sắt).',
            isCorrect: true,
            explanation: 'Đúng. Thiếu sắt dẫn đến giảm tổng hợp hemoglobin khiến số lượng và chất lượng hồng cầu giảm.'
          },
          {
            subId: 'b',
            text: 'Số lượng bạch cầu tăng đột biến là phản ứng bình thường chứng tỏ cơ thể không bị nhiễm trùng.',
            isCorrect: false,
            explanation: 'Sai. Bạch cầu tăng cao là dấu hiệu cơ thể đang phản ứng viêm hoặc nhiễm trùng.'
          },
          {
            subId: 'c',
            text: 'Nếu bệnh nhân có nhóm máu AB, bệnh nhân có thể nhận máu từ người mang nhóm máu A, B, AB hoặc O khi cần thiết.',
            isCorrect: true,
            explanation: 'Đúng. Người nhóm máu AB không có kháng thể anti-A và anti-B nên là người nhận phổ thông.'
          },
          {
            subId: 'd',
            text: 'Huyết tương chiếm 45% thể tích máu và chỉ chứa nước nguyên chất.',
            isCorrect: false,
            explanation: 'Sai. Huyết tương chiếm 55% thể tích máu, ngoài nước (90%) còn chứa protein, kháng thể, hormone và khoáng chất.'
          }
        ]
      },
      {
        id: 'tf-bio8-2',
        number: 2,
        context: 'Về hoạt động của tim và sự vận chuyển máu trong cơ thể người:',
        level: 'Thông hiểu',
        topic: 'Chu kì tim và hệ mạch',
        pointsTotal: 1.0,
        statements: [
          {
            subId: 'a',
            text: 'Chu kì hoạt động của tim người trưởng thành kéo dài khoảng 0,8 giây gồm 3 pha: pha co tâm nhĩ (0,1s), pha co tâm thất (0,3s), pha giãn chung (0,4s).',
            isCorrect: true,
            explanation: 'Đúng. Nhờ pha giãn chung kéo dài 0,4s nên tim được nghỉ ngơi phục hồi liên tục suốt đời.'
          },
          {
            subId: 'b',
            text: 'Huyết áp là áp lực của máu tác dụng lên thành mạch, huyết áp ở mao mạch là cao nhất trong toàn bộ hệ mạch.',
            isCorrect: false,
            explanation: 'Sai. Huyết áp cao nhất ở động mạch chủ và giảm dần qua tiểu động mạch, mao mạch, thấp nhất ở tĩnh mạch.'
          },
          {
            subId: 'c',
            text: 'Mao mạch có đường kính rất nhỏ và thành chỉ gồm một lớp tế bào nội mô giúp các chất dễ dàng khuếch tán trao đổi với tế bào.',
            isCorrect: true,
            explanation: 'Đúng. Cấu tạo thành mao mạch mỏng tạo điều kiện thuận lợi cho trao đổi chất và khí.'
          },
          {
            subId: 'd',
            text: 'Tất cả các tĩnh mạch trong cơ thể người đều luôn luôn vận chuyển máu đỏ tươi giàu khí O₂.',
            isCorrect: false,
            explanation: 'Sai. Tĩnh mạch chủ dẫn máu đỏ thẫm giàu CO₂ về tim; chỉ có tĩnh mạch phổi dẫn máu đỏ tươi giàu O₂.'
          }
        ]
      }
    ],
    partIII_ShortAnswer: [
      {
        id: 'sa-bio8-1',
        number: 1,
        content: 'Một người trưởng thành khi nghỉ ngơi có nhịp tim trung bình là 75 nhịp/phút. Mỗi nhịp tim bơm được 70 mL máu vào động mạch chủ. Tính thể tích máu (theo lít) mà tim người này bơm được trong 1 phút.',
        acceptableAnswers: ['5,25', '5.25', '5,25 lít', '5.25 l'],
        points: 0.5,
        level: 'Thông hiểu',
        topic: 'Tính lưu lượng tim',
        solutionGuide: 'Lưu lượng tim = 75 nhịp * 70 mL = 5250 mL = 5,25 lít/phút.'
      },
      {
        id: 'sa-bio8-2',
        number: 2,
        content: 'Trong hệ nhóm máu ABO có bao nhiêu nhóm máu chính?',
        acceptableAnswers: ['4', '4 nhóm', 'bốn'],
        points: 0.5,
        level: 'Thông hiểu',
        topic: 'Số lượng nhóm máu ABO',
        solutionGuide: 'Có 4 nhóm máu: A, B, AB, O.'
      },
      {
        id: 'sa-bio8-3',
        number: 3,
        content: 'Chu kì co giãn của tim người kéo dài bao nhiêu giây?',
        acceptableAnswers: ['0,8', '0.8', '0,8 giây', '0.8s'],
        points: 0.5,
        level: 'Vận dụng',
        topic: 'Thời gian một chu kì tim',
        solutionGuide: 'Một chu kì tim kéo dài 0,8 giây (0,1s co nhĩ + 0,3s co thất + 0,4s giãn chung).'
      },
      {
        id: 'sa-bio8-4',
        number: 4,
        content: 'Chỉ số huyết áp bình thường của một thanh niên khỏe mạnh khi đo ở cánh tay là bao nhiêu mmHg (ghi dạng huyết áp tối đa / huyết áp tối thiểu)?',
        acceptableAnswers: ['120/80', '110/70', '120/80 mmHg'],
        points: 0.5,
        level: 'Vận dụng',
        topic: 'Chỉ số huyết áp chuẩn',
        solutionGuide: 'Chỉ số huyết áp chuẩn bình thường là 120/80 mmHg.'
      }
    ],
    partIV_Essay: [
      {
        id: 'es-bio8-1',
        number: 1,
        content: 'a) Mô tả đường đi của máu trong vòng tuần hoàn lớn (bắt đầu từ tim đi nuôi cơ thể rồi trở về tim).\nb) Tại sao khi bị thương chảy máu mao mạch ta chỉ cần sát trùng rồi băng gạc ép chặt, nhưng chảy máu động mạch thì phải ép garo phía trên vết thương và đưa ngay đến cơ sở y tế?',
        points: 1.5,
        level: 'Thông hiểu',
        topic: 'Vòng tuần hoàn và kĩ năng sơ cứu cầm máu',
        gradingCriteria: [
          { step: 'Ý a (1.0đ): Nêu đúng: Tâm thất trái → Động mạch chủ → Các cơ quan trao đổi chất → Tĩnh mạch chủ → Tâm nhĩ phải.', points: 1.0 },
          { step: 'Ý b (0.5đ): Giải thích: Máu mao mạch chảy chậm, áp lực thấp nên dễ tự đông; máu động mạch có áp lực rất lớn phun thành tia gây mất máu ồ ạt nguy hiểm tính mạng.', points: 0.5 }
        ]
      },
      {
        id: 'es-bio8-2',
        number: 2,
        content: 'Một bệnh nhân cấp cứu cần truyền máu gấp nhưng bệnh viện tạm thời hết nhóm máu dự trữ cùng loại với bệnh nhân.\na) Nêu nguyên tắc cơ bản nhất khi truyền máu theo hệ nhóm máu ABO để đảm bảo tính mạng cho bệnh nhân.\nb) Giả sử bệnh nhân có nhóm máu B. Hãy lập bảng các khả năng tiếp nhận máu từ người cho có nhóm máu O, A, B, AB và giải thích vì sao.',
        points: 1.5,
        level: 'Vận dụng',
        topic: 'Nguyên tắc an toàn truyền máu',
        gradingCriteria: [
          { step: 'Ý a (0.75đ): Nguyên tắc: Không để kháng nguyên trên hồng cầu người cho gặp kháng thể tương ứng trong huyết tương người nhận gây ngưng kết hồng cầu.', points: 0.75 },
          { step: 'Ý b (0.75đ): Bệnh nhân nhóm máu B (có kháng thể anti-A) nên: Nhận được nhóm O (không có kháng nguyên) và nhóm B (kháng nguyên B). Không nhận nhóm A và AB vì chứa kháng nguyên A gây ngưng kết.', points: 0.75 }
        ]
      }
    ]
  }
};

// =========================================================================
// PRESET MẪU CHO KHTN 9 (PHÂN MÔN VẬT LÍ - BÀI 1: CÔNG VÀ NĂNG LƯỢNG)
// =========================================================================
export const SAMPLE_KHTN_VATLI_9: WorkspaceState = {
  ...SAMPLE_KHTN_HOA_8,
  lessonPlan: {
    ...SAMPLE_KHTN_HOA_8.lessonPlan,
    grade: 'Lớp 9',
    lessonName: 'BÀI 1: CÔNG CƠ HỌC VÀ CƠ NĂNG',
    durationInPeriods: 2,
    objectives: {
      knowledge: [
        'Nêu được điều kiện xuất hiện công cơ học (có lực tác dụng F và vật chuyển dời s).',
        'Viết được công thức tính công cơ học A = F.s và công suất P = A/t.',
        'Phân biệt được động năng (W_đ = 1/2 m.v²) và thế năng trọng trường (W_t = m.g.h).',
        'Phát biểu được định luật bảo toàn cơ năng trong trường hợp chỉ có trọng lực tác dụng.'
      ],
      competencies: {
        general: [
          'Năng lực tự chủ và tự học: Tìm hiểu các dạng năng lượng và định luật bảo toàn cơ năng.',
          'Năng lực tính toán: Vận dụng công thức tính công và hiệu suất của máy cơ đơn giản.'
        ],
        specific: [
          'Năng lực nhận thức vật lí: Phân tích sự chuyển hóa qua lại giữa động năng và thế năng.',
          'Năng lực giải quyết vấn đề: Đề xuất giải pháp tiết kiệm năng lượng điện trong đời sống.'
        ]
      },
      qualities: [
        'Ý thức sử dụng năng lượng tiết kiệm và hiệu quả, bảo vệ môi trường.'
      ]
    }
  },
  matrixRows: [
    {
      id: 'mat-phys9-1',
      chapter: 'Chương 1: Công và Năng lượng (Vật lí 9)',
      unit: 'Bài 1 & 2: Công cơ học, Công suất và Cơ năng',
      tnkq_nhieuLuaChon: { biet: 8, hieu: 4, vanDung: 0 },
      tnkq_dungSai: { biet: 1, hieu: 1, vanDung: 0 },
      tnkq_traLoiNgan: { biet: 0, hieu: 2, vanDung: 2 },
      tuLuan: { biet: 0, hieu: 1, vanDung: 1 }
    }
  ],
  specRows: [
    {
      id: 'spec-phys9-1',
      chapter: 'Chương 1: Công và Năng lượng (Vật lí 9)',
      unit: 'Bài 1 & 2: Công cơ học, Công suất và Cơ năng',
      learningOutcomes: {
        biet: [
          'Nêu được định nghĩa công cơ học A = F.s và đơn vị chuẩn Joule (J).',
          'Nêu được định nghĩa công suất P = A/t và đơn vị chuẩn Watt (W).',
          'Chỉ ra được động năng phụ thuộc vào khối lượng và vận tốc của vật.'
        ],
        hieu: [
          'Giải thích được các trường hợp lực tác dụng nhưng không sinh công (vật đứng yên hoặc lực vuông góc hướng chuyển động).',
          'Phân tích được sự chuyển hóa giữa động năng và thế năng khi vật rơi tự do hoặc dao động con lắc.'
        ],
        vanDung: [
          'Tính được công cơ học và công suất của các động cơ máy móc kéo vật nặng.',
          'Vận dụng định luật bảo toàn cơ năng tính vận tốc của vật ở vị trí chân dốc.'
        ]
      },
      numberOfQuestions: {
        tnkq_nhieuLuaChon: { biet: 8, hieu: 4, vanDung: 0 },
        tnkq_dungSai: { biet: 1, hieu: 1, vanDung: 0 },
        tnkq_traLoiNgan: { biet: 0, hieu: 2, vanDung: 2 },
        tuLuan: { biet: 0, hieu: 1, vanDung: 1 }
      }
    }
  ],
  exam: {
    title: 'ĐỀ KIỂM TRA ĐỊNH KÌ GIỮA HỌC KÌ I - MÔN KHOA HỌC TỰ NHIÊN 9 (PHÂN MÔN VẬT LÍ)',
    examType: 'Kiểm tra giữa học kì 1',
    durationMinutes: 45,
    academicYear: 'Năm học 2024 - 2025',
    totalScore: 10.0,
    weighting: {
      recognition: 40,
      comprehension: 30,
      application: 30
    },
    partI_MultipleChoice: [
      {
        id: 'q-phys9-1',
        number: 1,
        content: 'Công cơ học được thực hiện khi có điều kiện nào sau đây?',
        options: {
          A: 'Có lực tác dụng vào vật và vật chuyển dời theo phương không vuông góc với lực.',
          B: 'Có lực tác dụng vào vật nhưng vật vẫn đứng yên.',
          C: 'Vật chuyển động theo quán tính không có lực tác dụng.',
          D: 'Lực tác dụng có phương vuông góc với quãng đường dịch chuyển.'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Điều kiện có công cơ học',
        explanation: 'Điều kiện sinh công là có lực F và quãng đường dịch chuyển s.'
      },
      {
        id: 'q-phys9-2',
        number: 2,
        content: 'Công thức tính công cơ học của một lực F làm vật dịch chuyển quãng đường s cùng hướng với lực là:',
        options: {
          A: 'A = F . s',
          B: 'A = F / s',
          C: 'A = s / F',
          D: 'A = F + s'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Công thức tính công',
        explanation: 'A = F . s (trong đó F tính bằng N, s tính bằng m, A tính bằng J).'
      },
      {
        id: 'q-phys9-3',
        number: 3,
        content: 'Đơn vị đo công trong hệ đo lường quốc tế SI là:',
        options: {
          A: 'Joule (J)',
          B: 'Watt (W)',
          C: 'Newton (N)',
          D: 'Pascal (Pa)'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Đơn vị của công',
        explanation: '1 J = 1 N.m.'
      },
      {
        id: 'q-phys9-4',
        number: 4,
        content: 'Công suất P đặc trưng cho đại lượng nào sau đây?',
        options: {
          A: 'Tốc độ thực hiện công nhanh hay chậm của máy móc (công thực hiện trong 1 giây).',
          B: 'Độ lớn của lực tác dụng.',
          C: 'Quãng đường vật dịch chuyển.',
          D: 'Khối lượng của vật.'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Ý nghĩa của công suất',
        explanation: 'P = A / t biểu thị công thực hiện được trong một đơn vị thời gian.'
      },
      {
        id: 'q-phys9-5',
        number: 5,
        content: 'Đơn vị đo công suất trong hệ SI là:',
        options: {
          A: 'Watt (W)',
          B: 'Joule (J)',
          C: 'Kilôgam (kg)',
          D: 'Mã lực (HP)'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Đơn vị công suất',
        explanation: 'Đơn vị chuẩn SI là Watt (W), 1 W = 1 J/s.'
      },
      {
        id: 'q-phys9-6',
        number: 6,
        content: 'Dạng năng lượng mà một vật có được do nó đang chuyển động được gọi là gì?',
        options: {
          A: 'Động năng',
          B: 'Thế năng trọng trường',
          C: 'Thế năng đàn hồi',
          D: 'Nhiệt năng'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Khái niệm động năng',
        explanation: 'Động năng là năng lượng của vật do chuyển động mà có.'
      },
      {
        id: 'q-phys9-7',
        number: 7,
        content: 'Thế năng trọng trường của một vật phụ thuộc vào hai yếu tố nào?',
        options: {
          A: 'Khối lượng của vật và độ cao của vật so với mốc thế năng.',
          B: 'Khối lượng và vận tốc chuyển động.',
          C: 'Thể tích và diện tích bề mặt.',
          D: 'Vận tốc và gia tốc.'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Yếu tố ảnh hưởng thế năng',
        explanation: 'W_t = m . g . h phụ thuộc vào khối lượng m và độ cao h.'
      },
      {
        id: 'q-phys9-8',
        number: 8,
        content: 'Cơ năng của một vật chuyển động là tổng của:',
        options: {
          A: 'Động năng và thế năng của vật.',
          B: 'Nhiệt năng và quang năng.',
          C: 'Hóa năng và điện năng.',
          D: 'Động năng và công suất.'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Khái niệm cơ năng',
        explanation: 'W = W_đ + W_t.'
      },
      {
        id: 'q-phys9-9',
        number: 9,
        content: 'Khi một quả dừa rơi từ trên cành cây xuống đất (bỏ qua sức cản của không khí), sự biến đổi năng lượng diễn ra như thế nào?',
        options: {
          A: 'Thế năng giảm dần và chuyển hóa thành động năng tăng dần.',
          B: 'Động năng giảm dần chuyển hóa thành thế năng.',
          C: 'Cả động năng và thế năng đều cùng tăng.',
          D: 'Cả động năng và thế năng đều không đổi.'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'Chuyển hóa cơ năng vật rơi',
        explanation: 'Khi rơi, độ cao giảm nên thế năng giảm, vận tốc tăng nên động năng tăng.'
      },
      {
        id: 'q-phys9-10',
        number: 10,
        content: 'Một lực kế kéo một kiện hàng với lực F = 50 N đi được quãng đường s = 10 m trên mặt sàn theo hướng của lực. Công thực hiện là:',
        options: {
          A: '500 J',
          B: '5 J',
          C: '50 J',
          D: '0,5 J'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'Tính công cơ học',
        explanation: 'A = F . s = 50 * 10 = 500 J.'
      },
      {
        id: 'q-phys9-11',
        number: 11,
        content: 'Một động cơ điện thực hiện được một công A = 12 000 J trong thời gian t = 60 giây. Công suất của động cơ là:',
        options: {
          A: '200 W',
          B: '20 W',
          C: '720 000 W',
          D: '2000 W'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'Tính công suất',
        explanation: 'P = A / t = 12 000 / 60 = 200 W.'
      },
      {
        id: 'q-phys9-12',
        number: 12,
        content: 'Một chiếc ô tô và một chiếc xe máy chạy cùng vận tốc v trên đường cao tốc. Khẳng định nào sau đây là ĐÚNG?',
        options: {
          A: 'Ô tô có động năng lớn hơn xe máy vì ô tô có khối lượng lớn hơn nhiều.',
          B: 'Xe máy có động năng lớn hơn vì nhẹ hơn.',
          C: 'Hai xe có động năng bằng nhau vì cùng vận tốc.',
          D: 'Không so sánh được động năng.'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'So sánh động năng',
        explanation: 'Động năng W_đ tỉ lệ thuận với khối lượng m khi cùng vận tốc v.'
      }
    ],
    partII_TrueFalse: [
      {
        id: 'tf-phys9-1',
        number: 1,
        context: 'Một cần cẩu nâng một khối bê tông có khối lượng m = 1000 kg (trọng lượng P = 10 000 N) lên cao đều 12 m trong thời gian 20 giây. Bỏ qua ma sát. Xét tính Đúng/Sai của các mệnh đề sau:',
        level: 'Thông hiểu',
        topic: 'Công và Công suất của cần cẩu',
        pointsTotal: 1.0,
        statements: [
          {
            subId: 'a',
            text: 'Lực nâng của cần cẩu tác dụng lên khối bê tông có độ lớn tối thiểu bằng 10 000 N.',
            isCorrect: true,
            explanation: 'Đúng. Để nâng vật lên đều thì lực kéo tối thiểu bằng trọng lượng F = P = 10 000 N.'
          },
          {
            subId: 'b',
            text: 'Công mà cần cẩu thực hiện để nâng khối bê tông lên cao 12 m là 120 000 J.',
            isCorrect: true,
            explanation: 'Đúng. A = F . s = 10 000 * 12 = 120 000 J (120 kJ).'
          },
          {
            subId: 'c',
            text: 'Công suất của cần cẩu trong quá trình nâng là 6 000 W (6 kW).',
            isCorrect: true,
            explanation: 'Đúng. P = A / t = 120 000 / 20 = 6000 W.'
          },
          {
            subId: 'd',
            text: 'Ở độ cao 12 m, khối bê tông có thế năng trọng trường bằng 0.',
            isCorrect: false,
            explanation: 'Sai. Ở độ cao 12 m thế năng đạt cực đại W_t = m.g.h = 10 000 * 12 = 120 000 J.'
          }
        ]
      },
      {
        id: 'tf-phys9-2',
        number: 2,
        context: 'Về định luật bảo toàn cơ năng và chuyển hóa năng lượng trong cơ học:',
        level: 'Thông hiểu',
        topic: 'Định luật bảo toàn cơ năng',
        pointsTotal: 1.0,
        statements: [
          {
            subId: 'a',
            text: 'Trong quá trình chuyển động, nếu vật chỉ chịu tác dụng của trọng lực thì cơ năng của vật được bảo toàn.',
            isCorrect: true,
            explanation: 'Đúng. Định luật bảo toàn cơ năng: Cơ năng W = W_đ + W_t không đổi khi bỏ qua ma sát.'
          },
          {
            subId: 'b',
            text: 'Khi một vật ném thẳng đứng lên cao, tại điểm cao nhất thì vận tốc bằng 0 nên cơ năng của vật bằng 0.',
            isCorrect: false,
            explanation: 'Sai. Tại điểm cao nhất động năng bằng 0 nhưng thế năng đạt cực đại, cơ năng vẫn được bảo toàn.'
          },
          {
            subId: 'c',
            text: 'Nếu có lực ma sát cản trở chuyển động thì một phần cơ năng sẽ bị chuyển hóa thành nhiệt năng.',
            isCorrect: true,
            explanation: 'Đúng. Ma sát làm hao phí cơ năng biến thành nhiệt năng làm nóng bề mặt tiếp xúc.'
          },
          {
            subId: 'd',
            text: 'Thủy điện khai thác thế năng của nước chứa trong hồ trên cao chuyển hóa thành động năng quay tuabin phát điện.',
            isCorrect: true,
            explanation: 'Đúng. Thế năng nước → Động năng dòng chảy → Cơ năng tuabin → Điện năng.'
          }
        ]
      }
    ],
    partIII_ShortAnswer: [
      {
        id: 'sa-phys9-1',
        number: 1,
        content: 'Một lực F = 150 N kéo một xe hàng chuyển động thẳng đều trên đoạn đường s = 20 m. Tính công của lực kéo sinh ra (theo đơn vị Joule - J).',
        acceptableAnswers: ['3000', '3 000', '3000 J', '3 kJ'],
        points: 0.5,
        level: 'Thông hiểu',
        topic: 'Tính công kéo xe',
        solutionGuide: 'A = F . s = 150 * 20 = 3000 J.'
      },
      {
        id: 'sa-phys9-2',
        number: 2,
        content: 'Một vận động viên cử tạ nâng quả tạ có trọng lượng P = 1200 N lên cao 2 m trong thời gian 1,5 giây. Tính công suất trung bình của lực nâng (theo đơn vị Watt - W).',
        acceptableAnswers: ['1600', '1 600', '1600 W', '1.6 kW'],
        points: 0.5,
        level: 'Thông hiểu',
        topic: 'Tính công suất nâng tạ',
        solutionGuide: 'A = 1200 * 2 = 2400 J. P = A / t = 2400 / 1,5 = 1600 W.'
      },
      {
        id: 'sa-phys9-3',
        number: 3,
        content: 'Một vật có khối lượng m = 2 kg đang ở độ cao h = 5 m so với mặt đất (lấy g = 10 m/s²). Tính thế năng trọng trường của vật so với mặt đất (theo đơn vị Joule - J).',
        acceptableAnswers: ['100', '100 J'],
        points: 0.5,
        level: 'Vận dụng',
        topic: 'Tính thế năng W_t',
        solutionGuide: 'W_t = m . g . h = 2 * 10 * 5 = 100 J.'
      },
      {
        id: 'sa-phys9-4',
        number: 4,
        content: 'Một vật rơi tự do từ độ cao có thế năng W_t = 200 J xuống đất (bỏ qua ma sát). Khi rơi đến vị trí có thế năng bằng 50 J thì động năng của vật tại đó bằng bao nhiêu Joule (J)?',
        acceptableAnswers: ['150', '150 J'],
        points: 0.5,
        level: 'Vận dụng',
        topic: 'Bảo toàn cơ năng tính W_đ',
        solutionGuide: 'Cơ năng bảo toàn W = 200 J. Động năng W_đ = W - W_t = 200 - 50 = 150 J.'
      }
    ],
    partIV_Essay: [
      {
        id: 'es-phys9-1',
        number: 1,
        content: 'a) Nêu định nghĩa và viết công thức tính công suất. Nêu ý nghĩa con số ghi trên động cơ điện: 1500 W.\nb) Một máy bơm nước có công suất P = 1,2 kW bơm nước từ giếng sâu lên bồn cao 10 m. Trong 30 phút, máy bơm thực hiện được một công là bao nhiêu kJ?',
        points: 1.5,
        level: 'Thông hiểu',
        topic: 'Công suất và điện năng tiêu thụ',
        gradingCriteria: [
          { step: 'Ý a (0.75đ): Định nghĩa P = A/t. Ý nghĩa: Trong 1 giây động cơ thực hiện được công 1500 J.', points: 0.75 },
          { step: 'Ý b (0.75đ): Đổi t = 30 phút = 1800 s; P = 1200 W. A = P.t = 1200 * 1800 = 2 160 000 J = 2 160 kJ.', points: 0.75 }
        ]
      },
      {
        id: 'es-phys9-2',
        number: 2,
        content: 'Một viên bi sắt có khối lượng m = 0,2 kg được thả rơi không vận tốc đầu từ độ cao h = 10 m so với mặt đất. Lấy g = 10 m/s², bỏ qua sức cản không khí.\na) Tính cơ năng của viên bi tại vị trí bắt đầu thả rơi.\nb) Áp dụng định luật bảo toàn cơ năng, tính vận tốc của viên bi ngay trước khi chạm đất.',
        points: 1.5,
        level: 'Vận dụng',
        topic: 'Bài toán bảo toàn cơ năng vật rơi tự do',
        gradingCriteria: [
          { step: 'Ý a (0.75đ): Tại đỉnh, W_đ = 0. W = W_t = m.g.h = 0,2 * 10 * 10 = 20 J.', points: 0.75 },
          { step: 'Ý b (0.75đ): Khi chạm đất, h = 0 → W = W_đ = 1/2 m.v² = 20 J → v² = 20 * 2 / 0,2 = 200 → v ≈ 14,14 m/s.', points: 0.75 }
        ]
      }
    ]
  }
};

// =========================================================================
// PRESET MẪU CHO KHTN 9 (PHÂN MÔN SINH HỌC - BÀI 30: DI TRUYỀN HỌC MENDEL & DNA)
// =========================================================================
export const SAMPLE_KHTN_SINH_9: WorkspaceState = {
  ...SAMPLE_KHTN_HOA_8,
  lessonPlan: {
    ...SAMPLE_KHTN_HOA_8.lessonPlan,
    grade: 'Lớp 9',
    lessonName: 'BÀI 30: DI TRUYỀN HỌC MENDEL VÀ CẤU TRÚC PHÂN TỬ DNA',
    durationInPeriods: 2,
    objectives: {
      knowledge: [
        'Nêu được phương pháp nghiên cứu di truyền của Gregor Mendel trên cây đậu Hà Lan.',
        'Phát biểu được quy luật phân li của Mendel (tỉ lệ kiểu hình F2 là 3 trội : 1 lặn).',
        'Mô tả được cấu trúc chuỗi xoắn kép của phân tử DNA theo mô hình Watson - Crick.',
        'Vận dụng nguyên tắc bổ sung A - T, G - C để xác định trình tự chuỗi polynucleotide.'
      ],
      competencies: {
        general: [
          'Năng lực tự chủ và tự học: Đọc hiểu các thuật ngữ kiểu gene, kiểu hình, tính trạng trội, tính trạng lặn.',
          'Năng lực tư duy logic: Viết sơ đồ lai và dự đoán tỉ lệ phân li đời con.'
        ],
        specific: [
          'Năng lực nhận thức sinh học: Phân tích cơ chế truyền đạt thông tin di truyền qua nguyên phân và giảm phân.',
          'Năng lực thực hành: Lắp ráp mô hình cấu trúc phân tử DNA.'
        ]
      },
      qualities: [
        'Tôn trọng thành tựu khoa học và sự chính xác, khách quan trong nghiên cứu quy luật tự nhiên.'
      ]
    }
  },
  matrixRows: [
    {
      id: 'mat-bio9-1',
      chapter: 'Chương 5: Di truyền học Mendel & Cấu trúc DNA (Sinh học 9)',
      unit: 'Bài 30 & 34: Quy luật phân li Mendel và Cấu trúc chức năng của DNA',
      tnkq_nhieuLuaChon: { biet: 8, hieu: 4, vanDung: 0 },
      tnkq_dungSai: { biet: 1, hieu: 1, vanDung: 0 },
      tnkq_traLoiNgan: { biet: 0, hieu: 2, vanDung: 2 },
      tuLuan: { biet: 0, hieu: 1, vanDung: 1 }
    }
  ],
  specRows: [
    {
      id: 'spec-bio9-1',
      chapter: 'Chương 5: Di truyền học Mendel & Cấu trúc DNA (Sinh học 9)',
      unit: 'Bài 30 & 34: Quy luật phân li Mendel và Cấu trúc chức năng của DNA',
      learningOutcomes: {
        biet: [
          'Nêu được 4 loại nucleotide cấu tạo nên phân tử DNA (Adenine, Thymine, Guanine, Cytosine).',
          'Nêu được nguyên tắc bổ sung trong chuỗi xoắn kép DNA (A liên kết T bằng 2 liên kết hydro, G liên kết C bằng 3 liên kết hydro).',
          'Nêu được tỉ lệ phân li kiểu hình ở F2 trong phép lai một cặp tính trạng của Mendel (3 trội : 1 lặn).'
        ],
        hieu: [
          'Giải thích được ý nghĩa của phép lai phân tích (dùng kiểm tra kiểu gene của cá thể mang tính trạng trội là đồng hợp hay dị hợp).',
          'Mô tả được chức năng lưu giữ và truyền đạt thông tin di truyền của phân tử DNA.'
        ],
        vanDung: [
          'Xác định được trình tự các nucleotide trên mạch bổ sung khi biết mạch gốc của gene.',
          'Giải được bài toán lai một cặp tính trạng xác định tỉ lệ kiểu gene và kiểu hình đời con.'
        ]
      },
      numberOfQuestions: {
        tnkq_nhieuLuaChon: { biet: 8, hieu: 4, vanDung: 0 },
        tnkq_dungSai: { biet: 1, hieu: 1, vanDung: 0 },
        tnkq_traLoiNgan: { biet: 0, hieu: 2, vanDung: 2 },
        tuLuan: { biet: 0, hieu: 1, vanDung: 1 }
      }
    }
  ],
  exam: {
    title: 'ĐỀ KIỂM TRA ĐỊNH KÌ GIỮA HỌC KÌ I - MÔN KHOA HỌC TỰ NHIÊN 9 (PHÂN MÔN SINH HỌC)',
    examType: 'Kiểm tra giữa học kì 1',
    durationMinutes: 45,
    academicYear: 'Năm học 2024 - 2025',
    totalScore: 10.0,
    weighting: {
      recognition: 40,
      comprehension: 30,
      application: 30
    },
    partI_MultipleChoice: [
      {
        id: 'q-bio9-1',
        number: 1,
        content: 'Nhà khoa học nào được vinh danh là "người đặt nền móng cho di truyền học hiện đại"?',
        options: {
          A: 'Gregor Johann Mendel',
          B: 'Charles Darwin',
          C: 'James Watson',
          D: 'Louis Pasteur'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Lịch sử di truyền học',
        explanation: 'Gregor Mendel là người phát hiện ra các quy luật di truyền cơ bản trên cây đậu Hà Lan.'
      },
      {
        id: 'q-bio9-2',
        number: 2,
        content: 'Đơn phân cấu tạo nên phân tử DNA (Deoxyribonucleic acid) gồm 4 loại nucleotide là:',
        options: {
          A: 'Adenine (A), Thymine (T), Guanine (G), Cytosine (C)',
          B: 'Adenine (A), Uracil (U), Guanine (G), Cytosine (C)',
          C: 'Glucose, Fructose, Galactose, Ribose',
          D: 'Alanine, Glycine, Valine, Leucine'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Đơn phân của DNA',
        explanation: '4 loại nucleotide của DNA là A, T, G, C. Uracil (U) chỉ có trong RNA.'
      },
      {
        id: 'q-bio9-3',
        number: 3,
        content: 'Theo mô hình Watson - Crick, các nucleotide trên 2 mạch đơn của phân tử DNA liên kết với nhau theo nguyên tắc nào?',
        options: {
          A: 'Nguyên tắc bổ sung: A liên kết với T, G liên kết với C',
          B: 'A liên kết với G, T liên kết với C',
          C: 'A liên kết với C, T liên kết với G',
          D: 'Liên kết ngẫu nhiên không theo quy tắc'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Nguyên tắc bổ sung trong DNA',
        explanation: 'Nguyên tắc bổ sung quy định A liên kết với T bằng 2 liên kết hydro, G liên kết với C bằng 3 liên kết hydro.'
      },
      {
        id: 'q-bio9-4',
        number: 4,
        content: 'Khi cho lai hai bố mẹ thuần chủng khác nhau về một cặp tính trạng tương phản (hoa đỏ x hoa trắng), tỉ lệ kiểu hình thu được ở F2 theo Mendel là:',
        options: {
          A: '3 hoa đỏ : 1 hoa trắng (3 trội : 1 lặn)',
          B: '1 hoa đỏ : 1 hoa trắng',
          C: '100% hoa đỏ',
          D: '9 hoa đỏ : 7 hoa trắng'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Quy luật phân li của Mendel',
        explanation: 'F2 phân li kiểu hình theo tỉ lệ 3 trội : 1 lặn; tỉ lệ kiểu gene là 1 AA : 2 Aa : 1 aa.'
      },
      {
        id: 'q-bio9-5',
        number: 5,
        content: 'Phép lai phân tích là phép lai giữa cá thể mang tính trạng trội cần xác định kiểu gene với:',
        options: {
          A: 'Cá thể mang tính trạng lặn (đồng hợp lặn aa)',
          B: 'Cá thể mang tính trạng trội đồng hợp (AA)',
          C: 'Cá thể dị hợp (Aa)',
          D: 'Bất kì cá thể nào'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Khái niệm phép lai phân tích',
        explanation: 'Lai phân tích là lai cá thể mang tính trạng trội với cá thể đồng hợp lặn để kiểm tra kiểu gene.'
      },
      {
        id: 'q-bio9-6',
        number: 6,
        content: 'Đặc điểm nào sau đây là đặc điểm của phân tử RNA so với DNA?',
        options: {
          A: 'Chỉ có 1 chuỗi polynucleotide và thay nucleotide Thymine (T) bằng Uracil (U)',
          B: 'Gồm 2 mạch xoắn kép song song',
          C: 'Có khối lượng phân tử lớn hơn DNA nhiều lần',
          D: 'Chứa đường Deoxyribose'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Cấu tạo phân tử RNA',
        explanation: 'RNA là phân tử mạch đơn, đường ribose và nucleotide U thay cho T.'
      },
      {
        id: 'q-bio9-7',
        number: 7,
        content: 'Chức năng sinh học cốt lõi của phân tử DNA trong tế bào là:',
        options: {
          A: 'Lưu giữ, bảo quản và truyền đạt thông tin di truyền',
          B: 'Xúc tác cho các phản ứng sinh hóa như enzyme',
          C: 'Cung cấp năng lượng trực tiếp cho hoạt động co cơ',
          D: 'Vận chuyển các chất qua màng tế bào'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Chức năng của DNA',
        explanation: 'DNA là vật chất di truyền ở cấp độ phân tử lưu giữ thông tin di truyền của cơ thể.'
      },
      {
        id: 'q-bio9-8',
        number: 8,
        content: 'Tập hợp toàn bộ các tính trạng biểu hiện ra bên ngoài của cơ thể được gọi là gì?',
        options: {
          A: 'Kiểu hình',
          B: 'Kiểu gene',
          C: 'Bộ nhiễm sắc thể',
          D: 'Alen'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Khái niệm kiểu hình',
        explanation: 'Kiểu hình là tổ hợp toàn bộ các tính trạng của cơ thể (như màu hoa, hình dạng hạt).'
      },
      {
        id: 'q-bio9-9',
        number: 9,
        content: 'Một phân tử DNA có 20% nucleotide loại Adenine (A). Tỉ lệ phần trăm nucleotide loại Guanine (G) của phân tử DNA này là:',
        options: {
          A: '30%',
          B: '20%',
          C: '50%',
          D: '40%'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'Tính tỉ lệ % nucleotide DNA',
        explanation: 'Theo nguyên tắc bổ sung: %A = %T = 20% → %G = %C = 50% - 20% = 30%.'
      },
      {
        id: 'q-bio9-10',
        number: 10,
        content: 'Một đoạn mạch đơn của gene có trình tự: 5\'- A - G - T - C - A - 3\'. Trình tự các nucleotide trên mạch bổ sung là:',
        options: {
          A: '3\'- T - C - A - G - T - 5\'',
          B: '3\'- A - G - T - C - A - 5\'',
          C: '3\'- U - C - A - G - U - 5\'',
          D: '3\'- G - A - C - T - G - 5\''
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'Xác định mạch bổ sung DNA',
        explanation: 'Theo nguyên tắc bổ sung: A liên kết T, G liên kết C → T - C - A - G - T.'
      },
      {
        id: 'q-bio9-11',
        number: 11,
        content: 'Ở cà chua, gene A quy định quả đỏ là trội hoàn toàn so với gene a quy định quả vàng. Khi lai cây cà chua quả đỏ dị hợp (Aa) với cây quả vàng (aa), tỉ lệ phân li kiểu hình ở đời con là:',
        options: {
          A: '1 quả đỏ : 1 quả vàng',
          B: '3 quả đỏ : 1 quả vàng',
          C: '100% quả đỏ',
          D: '100% quả vàng'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'Sơ đồ lai phân tích',
        explanation: 'Aa x aa → 1 Aa (đỏ) : 1 aa (vàng), tỉ lệ 1 : 1.'
      },
      {
        id: 'q-bio9-12',
        number: 12,
        content: 'Tại sao Mendel lại chọn cây đậu Hà Lan (Pisum sativum) làm đối tượng chính cho các thí nghiệm di truyền của mình?',
        options: {
          A: 'Vì đậu Hà Lan là cây tự thụ phấn nghiêm ngặt, có vòng đời ngắn và nhiều cặp tính trạng tương phản rõ rệt.',
          B: 'Vì đậu Hà Lan khó thụ phấn nhân tạo.',
          C: 'Vì đậu Hà Lan chỉ có duy nhất 1 tính trạng.',
          D: 'Vì kích thước hạt rất to dễ quan sát bằng mắt thường.'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'Đối tượng nghiên cứu của Mendel',
        explanation: 'Cây đậu Hà Lan tự thụ phấn nghiêm ngặt giúp dễ dàng tạo các dòng thuần chủng.'
      }
    ],
    partII_TrueFalse: [
      {
        id: 'tf-bio9-1',
        number: 1,
        context: 'Xét một đoạn phân tử DNA có tổng số 3000 nucleotide, trong đó số nucleotide loại Adenine chiếm 20% tổng số nucleotide. Xét tính Đúng/Sai của các mệnh đề sau:',
        level: 'Thông hiểu',
        topic: 'Cấu trúc số lượng nucleotide của DNA',
        pointsTotal: 1.0,
        statements: [
          {
            subId: 'a',
            text: 'Số lượng nucleotide loại Adenine (A) bằng số lượng nucleotide loại Thymine (T) và bằng 600 nucleotide.',
            isCorrect: true,
            explanation: 'Đúng. A = T = 20% * 3000 = 600 nucleotide.'
          },
          {
            subId: 'b',
            text: 'Số lượng nucleotide loại Guanine (G) bằng số lượng Cytosine (C) và bằng 900 nucleotide.',
            isCorrect: true,
            explanation: 'Đúng. G = C = (3000 - 600*2) / 2 = 900 nucleotide.'
          },
          {
            subId: 'c',
            text: 'Tổng số liên kết hydro giữa hai mạch của đoạn DNA này là 3900 liên kết.',
            isCorrect: true,
            explanation: 'Đúng. H = 2A + 3G = 2*600 + 3*900 = 1200 + 2700 = 3900 liên kết hydro.'
          },
          {
            subId: 'd',
            text: 'Chiều dài của đoạn phân tử DNA này là 10 200 Ångström (Å).',
            isCorrect: false,
            explanation: 'Sai. Chiều dài L = (N / 2) * 3,4 Å = (3000 / 2) * 3,4 = 5100 Å.'
          }
        ]
      },
      {
        id: 'tf-bio9-2',
        number: 2,
        context: 'Ở đậu Hà Lan, xét phép lai giữa hai cây thuần chủng hạt vàng (AA) và hạt xanh (aa). Thu được F1 100% hạt vàng, cho F1 tự thụ phấn thu được F2:',
        level: 'Thông hiểu',
        topic: 'Quy luật di truyền Mendel',
        pointsTotal: 1.0,
        statements: [
          {
            subId: 'a',
            text: 'Kiểu gene của cây F1 là dị hợp tử Aa mang kiểu hình hạt vàng.',
            isCorrect: true,
            explanation: 'Đúng. P: AA x aa → F1: 100% Aa (hạt vàng).'
          },
          {
            subId: 'b',
            text: 'Tỉ lệ kiểu gene ở đời F2 là 1 AA : 2 Aa : 1 aa.',
            isCorrect: true,
            explanation: 'Đúng. F1 tự thụ Aa x Aa cho F2 có tỉ lệ kiểu gene 1 : 2 : 1.'
          },
          {
            subId: 'c',
            text: 'Tất cả các cây hạt vàng ở F2 đều có kiểu gene thuần chủng giống nhau.',
            isCorrect: false,
            explanation: 'Sai. Trong số các cây hạt vàng ở F2 có 1/3 cây thuần chủng AA và 2/3 cây không thuần chủng Aa.'
          },
          {
            subId: 'd',
            text: 'Nếu cho cây F1 (Aa) lai phân tích với cây hạt xanh (aa), đời con sẽ thu được tỉ lệ 1 hạt vàng : 1 hạt xanh.',
            isCorrect: true,
            explanation: 'Đúng. Lai phân tích Aa x aa cho tỉ lệ kiểu hình 1 : 1.'
          }
        ]
      }
    ],
    partIII_ShortAnswer: [
      {
        id: 'sa-bio9-1',
        number: 1,
        content: 'Một gene có chiều dài L = 4080 Ångström (Å). Biết mỗi nucleotide dài 3,4 Å. Tính tổng số nucleotide (N) của gene này.',
        acceptableAnswers: ['2400', '2 400', '2400 nu'],
        points: 0.5,
        level: 'Thông hiểu',
        topic: 'Tính số nucleotide từ chiều dài gene',
        solutionGuide: 'N = (2 * L) / 3,4 = (2 * 4080) / 3,4 = 2400 nucleotide.'
      },
      {
        id: 'sa-bio9-2',
        number: 2,
        content: 'Một phân tử DNA có 800 nucleotide loại A và 1200 nucleotide loại G. Tính tổng số liên kết hydro (H) nối giữa hai mạch của phân tử DNA này.',
        acceptableAnswers: ['5200', '5 200', '5200 liên kết'],
        points: 0.5,
        level: 'Thông hiểu',
        topic: 'Tính số liên kết hydro',
        solutionGuide: 'H = 2A + 3G = 2*800 + 3*1200 = 1600 + 3600 = 5200 liên kết hydro.'
      },
      {
        id: 'sa-bio9-3',
        number: 3,
        content: 'Trong thí nghiệm lai một cặp tính trạng của Mendel, tỉ lệ phần trăm kiểu hình mang tính trạng trội ở thế hệ F2 là bao nhiêu %?',
        acceptableAnswers: ['75', '75%', '75 %'],
        points: 0.5,
        level: 'Vận dụng',
        topic: 'Tỉ lệ % tính trạng trội F2',
        solutionGuide: 'Tỉ lệ 3 trội : 1 lặn tương ứng với 75% trội và 25% lặn.'
      },
      {
        id: 'sa-bio9-4',
        number: 4,
        content: 'Ở người, bộ nhiễm sắc thể lưỡng bội bình thường 2n chứa bao nhiêu chiếc nhiễm sắc thể?',
        acceptableAnswers: ['46', '46 chiếc', '46 NST', '23 cặp'],
        points: 0.5,
        level: 'Vận dụng',
        topic: 'Bộ NST người bình thường',
        solutionGuide: 'Bộ NST lưỡng bội 2n của người gồm 46 chiếc (23 cặp).'
      }
    ],
    partIV_Essay: [
      {
        id: 'es-bio9-1',
        number: 1,
        content: 'a) Nêu các đặc điểm cơ bản trong mô hình cấu trúc không gian của phân tử DNA theo Watson - Crick (đường kính, chu kì xoắn, số cặp nu trong 1 chu kì).\nb) Nêu nguyên tắc bổ sung trong phân tử DNA và giải thích hệ quả: A + G = T + C.',
        points: 1.5,
        level: 'Thông hiểu',
        topic: 'Cấu trúc xoắn kép Watson - Crick',
        gradingCriteria: [
          { step: 'Ý a (0.75đ): Mô hình xoắn kép: 2 mạch polynucleotide chạy song song ngược chiều; đường kính 20 Å; mỗi chu kì xoắn cao 34 Å gồm 10 cặp nucleotide.', points: 0.75 },
          { step: 'Ý b (0.75đ): Nguyên tắc bổ sung: A liên kết T, G liên kết C. Hệ quả: A = T và G = C → A + G = T + C (tổng số purine bằng tổng số pyrimidine).', points: 0.75 }
        ]
      },
      {
        id: 'es-bio9-2',
        number: 2,
        content: 'Ở chuột lang, gene B quy định lông đen là trội hoàn toàn so với gene b quy định lông trắng.\na) Cho chuột lông đen thuần chủng giao phối với chuột lông trắng. Viết sơ đồ lai từ P đến F2.\nb) Làm thế nào để biết một con chuột lông đen ở đời F2 là thuần chủng hay không thuần chủng? Giải thích phương pháp.',
        points: 1.5,
        level: 'Vận dụng',
        topic: 'Bài toán lai di truyền và phép lai phân tích',
        gradingCriteria: [
          { step: 'Ý a (0.75đ): P: BB (đen) x bb (trắng) → F1: Bb (100% đen). F1 x F1: Bb x Bb → F2 tỉ lệ kiểu gene 1 BB : 2 Bb : 1 bb; kiểu hình 3 đen : 1 trắng.', points: 0.75 },
          { step: 'Ý b (0.75đ): Thực hiện phép lai phân tích: Cho chuột đen F2 lai với chuột lông trắng (bb). Nếu đời con 100% đen → chuột F2 là thuần chủng (BB). Nếu đời con phân li 1 đen : 1 trắng → chuột F2 là dị hợp (Bb).', points: 0.75 }
        ]
      }
    ]
  }
};

// =========================================================================
// PRESET MẪU CHO KHTN 7 (PHÂN MÔN SINH HỌC - BÀI 22: QUANG HỢP Ở THỰC VẬT)
// =========================================================================
export const SAMPLE_KHTN_SINH_7: WorkspaceState = {
  ...SAMPLE_KHTN_HOA_8,
  lessonPlan: {
    ...SAMPLE_KHTN_HOA_8.lessonPlan,
    grade: 'Lớp 7',
    lessonName: 'BÀI 22: QUANG HỢP Ở THỰC VẬT',
    durationInPeriods: 2,
    objectives: {
      knowledge: [
        'Nêu được khái niệm quang hợp ở thực vật và viết phương trình tổng quát: Nước + CO2 -> Glucose + O2.',
        'Mô tả được cấu tạo của lục lạp phù hợp với chức năng quang hợp.',
        'Phân tích được vai trò của quang hợp đối với sinh giới và điều hòa khí hậu Trái Đất.',
        'Nêu được các biện pháp bảo vệ cây xanh và trồng rừng để bảo vệ môi trường.'
      ],
      competencies: {
        general: [
          'Năng lực giải quyết vấn đề: Giải thích hiện tượng lá cây có màu xanh lục.'
        ],
        specific: [
          'Năng lực tìm hiểu tự nhiên: Tiến hành thí nghiệm phát hiện tinh bột trong lá cây.'
        ]
      },
      qualities: [
        'Yêu thiên nhiên, có ý thức trồng và chăm sóc cây xanh trong khuôn viên trường học.'
      ]
    }
  }
};

// =========================================================================
// PRESET MẪU CHO CÔNG NGHỆ 7 (BÀI 1: GIỚI THIỆU VỀ TRỒNG TRỌT)
// =========================================================================
export const SAMPLE_CONG_NGHE_7: WorkspaceState = {
  ...SAMPLE_KHTN_HOA_8,
  lessonPlan: {
    ...SAMPLE_KHTN_HOA_8.lessonPlan,
    subject: 'Công nghệ',
    grade: 'Lớp 7',
    lessonName: 'BÀI 1: GIỚI THIỆU VỀ TRỒNG TRỌT',
    durationInPeriods: 2,
    objectives: {
      knowledge: [
        'Trình bày được 4 vai trò của trồng trọt đối với đời sống con người và nền kinh tế.',
        'Phân loại được các nhóm cây trồng phổ biến ở Việt Nam.',
        'Mô tả được các phương thức trồng trọt phổ biến: Ngoài tự nhiên và trong nhà có mái che.',
        'Nhận thức được triển vọng của ngành trồng trọt công nghệ cao tại địa phương.'
      ],
      competencies: {
        general: [
          'Năng lực tự chủ và tự học: Tìm hiểu các mô hình trồng trọt hữu cơ và nhà kính.'
        ],
        specific: [
          'Năng lực công nghệ: Lựa chọn được nhóm cây trồng phù hợp với điều kiện gia đình.'
        ]
      },
      qualities: [
        'Yêu lao động, trân trọng sản phẩm nông nghiệp và người nông dân.'
      ]
    }
  }
};
