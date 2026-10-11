import { LessonPlan5512, SlideDeck, SlideItem, TeacherProfile } from '../types';

/**
 * Trích xuất công thức, phương trình hóa học hoặc khái niệm then chốt từ Kế hoạch bài dạy
 */
function extractKeyFormulaOrConcept(lp: LessonPlan5512): string | undefined {
  const text = `${lp.lessonName} ${lp.objectives.knowledge.join(' ')} ${lp.activities.map(a => a.content).join(' ')}`;
  
  // Phát hiện Hóa học
  if (text.includes('Acid') || text.includes('acid') || text.includes('HCl') || text.includes('H₂SO₄')) {
    return 'Zn + 2HCl → ZnCl₂ + H₂↑  |  Fe + H₂SO₄ (loãng) → FeSO₄ + H₂↑  |  CuO + 2HCl → CuCl₂ + H₂O';
  }
  if (text.includes('Kim loại') || text.includes('kim loại') || text.includes('dãy hoạt động')) {
    return 'Dãy HĐHH: K > Na > Ca > Mg > Al > Zn > Fe > Pb > (H) > Cu > Ag > Au';
  }
  if (text.includes('Base') || text.includes('base') || text.includes('pH')) {
    return 'pH < 7: Môi trường Acid (quỳ hóa đỏ) | pH = 7: Trung tính | pH > 7: Môi trường Base (quỳ hóa xanh)';
  }
  if (text.includes('Hydrocarbon') || text.includes('Methane') || text.includes('Alkane') || text.includes('Ethylene')) {
    return 'CH₄ + 2O₂ → CO₂ + 2H₂O (t°)  |  CH₂=CH₂ + Br₂ → CH₂Br-CH₂Br (mất màu da cam)';
  }
  if (text.includes('Rượu') || text.includes('alcohol') || text.includes('Acetic acid')) {
    return '2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂↑  |  CH₃COOH + C₂H₅OH ⇄ CH₃COOC₂H₅ + H₂O (H₂SO₄ đặc, t°)';
  }

  // Phát hiện Vật lí
  if (text.includes('Khối lượng riêng') || text.includes('khối lượng riêng')) {
    return 'D = m / V (D: kg/m³, m: kg, V: m³)  |  Trọng lượng riêng: d = 10.D = P / V (N/m³)';
  }
  if (text.includes('Áp suất') || text.includes('áp suất')) {
    return 'Áp suất chất lỏng: p = d . h (d: trọng lượng riêng, h: độ sâu tính từ mặt thoáng)';
  }
  if (text.includes('Lực đẩy') || text.includes('Archimedes') || text.includes('Ác-si-mét')) {
    return 'Lực đẩy Ác-si-mét: F_A = d . V  (Vật nổi: P < F_A, Vật chìm: P > F_A, Lơ lửng: P = F_A)';
  }
  if (text.includes('Tác dụng làm quay') || text.includes('Moment') || text.includes('moment')) {
    return 'Moment lực: M = F . d (F tính bằng N, d là cánh tay đòn tính bằng m, M tính bằng N.m)';
  }
  if (text.includes('Tốc độ') || text.includes('tốc độ')) {
    return 'v = s / t (v: m/s hoặc km/h; Quy tắc chuyển đổi: 1 m/s = 3,6 km/h)';
  }
  if (text.includes('Công') || text.includes('Công suất') || text.includes('công suất')) {
    return 'Công cơ học: A = F . s (Joule - J)  |  Công suất: P = A / t (Watt - W, 1 kW = 1000 W)';
  }
  if (text.includes('Cơ năng') || text.includes('Động năng') || text.includes('Thế năng')) {
    return 'Cơ năng: W = W_đ + W_t = 1/2 m.v² + m.g.h (Bảo toàn cơ năng khi bỏ qua ma sát)';
  }
  if (text.includes('Định luật Ohm') || text.includes('Điện trở')) {
    return 'Định luật Ohm: I = U / R  |  Đoạn mạch nối tiếp: R_tđ = R₁ + R₂  |  Song song: 1/R_tđ = 1/R₁ + 1/R₂';
  }

  // Phát hiện Sinh học
  if (text.includes('Tế bào') || text.includes('tế bào')) {
    return 'Thành phần tế bào: Màng sinh chất (bảo vệ) + Tế bào chất (chứa bào quan) + Nhân/Vùng nhân (chứa DNA)';
  }
  if (text.includes('Quang hợp') || text.includes('quang hợp')) {
    return 'Quang hợp: Nước + Carbon dioxide ──(Ánh sáng, Diệp lục)──> Glucose + Oxygen';
  }
  if (text.includes('Hô hấp') || text.includes('hô hấp tế bào')) {
    return 'Hô hấp tế bào: Glucose + Oxygen ──(Ti thể)──> Carbon dioxide + Nước + Năng lượng (ATP)';
  }
  if (text.includes('Tuần hoàn') || text.includes('máu') || text.includes('Máu')) {
    return 'Máu = Huyết tương (55%) + Tế bào máu (45%: Hồng cầu, Bạch cầu, Tiểu cầu) | Hệ nhóm máu: A, B, AB, O';
  }
  if (text.includes('Mendel') || text.includes('Di truyền') || text.includes('Lai')) {
    return 'Quy luật phân li Mendel: P thuần chủng (AA x aa) → F1: 100% Aa (đồng tính) → F2: 1 AA : 2 Aa : 1 aa (3 trội : 1 lặn)';
  }
  if (text.includes('DNA') || text.includes('RNA')) {
    return 'Nguyên tắc bổ sung: A liên kết với T (2 liên kết H), G liên kết với C (3 liên kết H)  ⇒  A + G = T + C';
  }

  return undefined;
}

/**
 * Sinh danh sách Slide dạng TĨNH (Static Content) hoàn toàn
 * Không giấu nội dung sau các nút bấm, tương tác hay hiệu ứng động
 * Đảm bảo khi xuất sang PowerPoint PPTX hoặc in PDF giữ nguyên 100% nội dung.
 */
export function generateStaticSlideDeck(
  lessonPlan: LessonPlan5512,
  teacher: TeacherProfile,
  slideCount: number = 8
): SlideDeck {
  const lp = lessonPlan;
  const acts = lp.activities;
  const slides: SlideItem[] = [];
  const keyFormula = extractKeyFormulaOrConcept(lp);

  // SLIDE 1: BÌA BÀI HỌC VÀ MỤC TIÊU BÀI DẠY (TĨNH)
  slides.push({
    id: `slide-1-cover`,
    stageLabel: 'Mở Đầu & Mục Tiêu',
    title: lp.lessonName.toUpperCase(),
    subtitle: `Môn: ${lp.subject} · ${lp.grade} · Bộ sách: ${lp.curriculum} · Thời lượng: ${lp.durationInPeriods} tiết`,
    bulletPoints: [
      `Mục tiêu kiến thức: ${lp.objectives.knowledge[0] || 'Nắm vững kiến thức cốt lõi theo chuẩn chương trình GDPT 2018.'}`,
      `Năng lực đặc thù: ${lp.objectives.competencies?.specific?.[0] || 'Năng lực nhận thức và tìm hiểu khoa học tự nhiên.'}`,
      `Năng lực chung: ${lp.objectives.competencies?.general?.[0] || 'Tự chủ, tự học, giao tiếp và hợp tác nhóm.'}`,
      `Phẩm chất chủ yếu: ${lp.objectives.qualities?.[0] || 'Chăm chỉ, trung thực, trách nhiệm và bảo vệ tự nhiên.'}`
    ],
    calloutBox: {
      title: 'ĐỊNH HƯỚNG SƯ PHẠM',
      text: 'Tiết học triển khai theo tiến trình 4 hoạt động bài học chuẩn Công văn 5512/BGDĐT-GDTrH kết hợp trực quan hóa và thực nghiệm khoa học.',
      type: 'info'
    },
    speakerNotes: `Giáo viên ${teacher.name} (${teacher.school}) ổn định lớp, tổ chức hoạt động và phổ biến mục tiêu bài học trong 3 phút đầu giờ.`
  });

  if (slideCount <= 4) {
    // 4 SLIDES: Tối giản - Đủ 4 hoạt động sư phạm chuẩn 5512
    slides.push({
      id: 'slide-act-1',
      stageLabel: 'Hoạt Động 1: Khởi Động',
      title: `${lp.lessonName.toUpperCase()} - MỞ ĐẦU`,
      subtitle: `Thời lượng: ${acts[0]?.duration || '7-10 phút'} · Kích hoạt tư duy`,
      bulletPoints: [
        `Mục tiêu: ${acts[0]?.goal || lp.objectives.knowledge[0]}`,
        `Tình huống mở đầu: ${acts[0]?.content || 'Quan sát hiện tượng thực tế, xem video thí nghiệm mở đầu và đặt vấn đề cần giải quyết.'}`,
        `Sản phẩm dự kiến: ${acts[0]?.product || 'Dự đoán ban đầu và câu trả lời trong phiếu học tập của học sinh.'}`
      ],
      calloutBox: {
        title: 'CHUYỂN GIAO NHIỆM VỤ',
        text: acts[0]?.implementation?.step1_assign || 'Chiếu hình ảnh trực quan, giao nhiệm vụ thảo luận nhóm đôi tìm hiểu hiện tượng.',
        type: 'info'
      },
      speakerNotes: `Giáo viên ${teacher.name} đặt câu hỏi gợi mở, kích hoạt kiến thức nền tảng.`
    });

    slides.push({
      id: 'slide-act-2',
      stageLabel: 'Hoạt Động 2: Khám Phá Kiến Thức',
      title: acts[1]?.title || 'HÌNH THÀNH KIẾN THỨC MỚI',
      subtitle: `Thời lượng: ${acts[1]?.duration || '25-30 phút'} · Trọng tâm bài học`,
      bulletPoints: [
        `Mục tiêu bài học: ${acts[1]?.goal || lp.objectives.knowledge.join('; ')}`,
        `Nhiệm vụ học tập: ${acts[1]?.content || 'Nghiên cứu thông tin SGK, quan sát thí nghiệm và rút ra kết luận.'}`,
        `Sản phẩm học sinh: ${acts[1]?.product || 'Báo cáo kết quả, vở ghi nội dung cốt lõi và kết luận khoa học.'}`,
        'Tiến trình 4 bước: (1) Chuyển giao → (2) Thực hiện → (3) Báo cáo/Thảo luận → (4) Đánh giá/Kết luận.'
      ],
      formulaOrCode: keyFormula,
      calloutBox: {
        title: 'KIẾN THỨC CỐT LÕI',
        text: lp.objectives.knowledge[0] || 'Nắm vững bản chất hiện tượng và quy luật khoa học tự nhiên.',
        type: 'key-concept'
      },
      speakerNotes: 'Hướng dẫn học sinh thảo luận nhóm, ghi nhận hiện tượng và rút ra nhận xét.'
    });

    slides.push({
      id: 'slide-act-3',
      stageLabel: 'Hoạt Động 3: Luyện Tập',
      title: acts[2]?.title || 'LUYỆN TẬP & CỦNG CỐ',
      subtitle: `Thời lượng: ${acts[2]?.duration || '10-15 phút'} · Rèn kỹ năng`,
      bulletPoints: [
        `Mục tiêu: ${acts[2]?.goal || 'Củng cố kiến thức qua hệ thống câu hỏi trắc nghiệm và bài tập.'}`,
        `Nội dung luyện tập: ${acts[2]?.content || 'Thực hiện bài tập trong SGK/SBT, giải thích hiện tượng và viết phương trình/công thức.'}`,
        `Sản phẩm học sinh: ${acts[2]?.product || 'Bài giải chi tiết trong vở hoặc trên bảng nhóm của học sinh.'}`
      ],
      calloutBox: {
        title: 'QUY TRÌNH THỰC HIỆN',
        text: acts[2]?.implementation?.step1_assign || 'Học sinh làm việc cá nhân 5 phút, sau đó thảo luận cặp đôi đối chiếu kết quả.',
        type: 'info'
      },
      speakerNotes: 'Nhận xét và uốn nắn các lỗi sai phổ biến của học sinh trong quá trình giải bài.'
    });

    slides.push({
      id: 'slide-act-4',
      stageLabel: 'Hoạt Động 4: Vận Dụng & Dặn Dò',
      title: acts[3]?.title || 'VẬN DỤNG THỰC TIỄN & TỰ HỌC',
      subtitle: `Thời lượng: ${acts[3]?.duration || '5-10 phút'} · Liên hệ đời sống`,
      bulletPoints: [
        `Nhiệm vụ thực tế: ${acts[3]?.content || 'Vận dụng kiến thức bài học giải thích các hiện tượng trong tự nhiên và đời sống.'}`,
        `Sản phẩm học tập: ${acts[3]?.product || 'Bản thu hoạch cá nhân, sản phẩm dự án STEM hoặc bài tập nghiên cứu tại nhà.'}`,
        'Nhiệm vụ về nhà: Học bài, làm bài tập trong SGK/SBT và chuẩn bị bài học tiếp theo.'
      ],
      calloutBox: {
        title: 'THÔNG ĐIỆP SƯ PHẠM',
        text: `Giáo viên: ${teacher.name} chúc các em học sinh học tốt môn ${lp.subject} ${lp.grade}!`,
        type: 'key-concept'
      },
      speakerNotes: 'Tổng kết giờ dạy, khen ngợi các nhóm tích cực và giao bài tập về nhà.'
    });

    return {
      title: `${lp.lessonName} (BÀI GIẢNG TĨNH 4 SLIDE)`,
      author: `${teacher.name} · ${teacher.school}`,
      slides: slides.slice(0, 4)
    };
  }

  if (slideCount <= 6) {
    // 6 SLIDES: 1 Cover + 4 Activities + 1 Summary
    acts.forEach((act, idx) => {
      slides.push({
        id: `slide-act-${idx + 1}`,
        activityCode: act.code,
        stageLabel: idx === 0 ? 'Hoạt Động 1: Khởi Động' : idx === 1 ? 'Hoạt Động 2: Khám Phá' : idx === 2 ? 'Hoạt Động 3: Luyện Tập' : 'Hoạt Động 4: Vận Dụng',
        title: act.title,
        subtitle: `Thời lượng dự kiến: ${act.duration} · Khung tiến trình chuẩn 5512`,
        bulletPoints: [
          `Mục tiêu: ${act.goal}`,
          `Nội dung nhiệm vụ: ${act.content}`,
          `Sản phẩm học tập: ${act.product}`,
          `Tiến trình 4 bước: (1) Chuyển giao → (2) Thực hiện → (3) Báo cáo/Thảo luận → (4) Đánh giá.`
        ],
        calloutBox: {
          title: 'TỔ CHỨC THỰC HIỆN TĨNH',
          text: `Bước 1 (Chuyển giao): ${act.implementation.step1_assign.slice(0, 110)}...\nBước 4 (Kết luận): ${act.implementation.step4_conclude.slice(0, 110)}...`,
          type: 'key-concept'
        },
        formulaOrCode: idx === 1 ? keyFormula : undefined,
        speakerNotes: `Tổ chức hoạt động ${idx + 1} theo đúng 4 bước quy định của Bộ GD&ĐT.`
      });
    });

    // Slide tổng kết
    slides.push({
      id: `slide-summary`,
      stageLabel: 'Tổng Kết & Dặn Dò',
      title: 'TỔNG KẾT BÀI HỌC VÀ NHIỆM VỤ VỀ NHÀ',
      subtitle: `Củng cố kiến thức ${lp.lessonName}`,
      bulletPoints: [
        `Ghi nhớ các khái niệm cốt lõi: ${lp.objectives.knowledge.slice(0, 2).join('; ')}.`,
        'Hoàn thành đầy đủ các bài tập trong Sách Giáo Khoa và Sách Bài Tập.',
        'Tự đánh giá theo 4 mức độ: Nhận biết, Thông hiểu, Vận dụng và Vận dụng cao.',
        'Chuẩn bị dụng cụ thí nghiệm và đọc trước bài học tiếp theo trong chương trình.'
      ],
      calloutBox: {
        title: 'DẶN DÒ TỰ HỌC',
        text: 'Tìm hiểu ứng dụng thực tiễn của bài học trong đời sống, môi trường và khoa học kỹ thuật.',
        type: 'info'
      },
      speakerNotes: 'Dặn dò nhiệm vụ về nhà và nhận xét tinh thần học tập của cả lớp.'
    });

  } else if (slideCount <= 8) {
    // 8 SLIDES: Chuẩn đầy đủ phân tách hoạt động 2 và 3
    // Slide 2: Khởi động
    slides.push({
      id: 'slide-act-1',
      stageLabel: 'Hoạt Động 1: Khởi Động',
      title: acts[0]?.title || 'Hoạt động 1: Mở đầu / Khởi động bài học',
      subtitle: `Thời lượng: ${acts[0]?.duration || '10 phút'} · Tình huống gợi mở`,
      bulletPoints: [
        `Mục tiêu: ${acts[0]?.goal || 'Tạo tâm thế hứng thú, kết nối kiến thức thực tế với bài học mới.'}`,
        `Tình huống thực tiễn: ${acts[0]?.content || 'Quan sát hiện tượng và đặt câu hỏi định hướng.'}`,
        `Sản phẩm học sinh: ${acts[0]?.product || 'Dự đoán và phác họa ban đầu của học sinh.'}`
      ],
      calloutBox: {
        title: 'HƯỚNG DẪN TỔ CHỨC',
        text: acts[0]?.implementation?.step1_assign || 'Chiếu hình ảnh trực quan, giao phiếu học tập khởi động theo cặp.',
        type: 'info'
      },
      speakerNotes: 'Khơi gợi trí tò mò, không chấm điểm đúng sai ngay ở bước này.'
    });

    // Slide 3: Khám phá 1 - Khái niệm & Hiện tượng
    slides.push({
      id: 'slide-act-2a',
      stageLabel: 'Hoạt Động 2: Khám Phá Kiến Thức',
      title: 'KHÁM PHÁ HIỆN TƯỢNG VÀ KHÁI NIỆM CỐT LÕI',
      subtitle: 'Nghiên cứu thông tin và thực nghiệm SGK',
      bulletPoints: [
        `Nhiệm vụ: ${acts[1]?.content?.slice(0, 160) || 'Tiếp cận kiến thức qua hoạt động thực nghiệm và nghiên cứu tài liệu.'}`,
        `Khái niệm trọng tâm: ${lp.objectives.knowledge[0] || 'Mô tả bản chất quy luật tự nhiên.'}`,
        `Sản phẩm đạt được: ${acts[1]?.product?.slice(0, 150) || 'Ghi chép hiện tượng, rút ra kết luận khoa học.'}`
      ],
      formulaOrCode: keyFormula,
      calloutBox: {
        title: 'KIẾN THỨC CỐT LÕI (SGK)',
        text: lp.objectives.knowledge[0] || 'Nắm vững bản chất hiện tượng và nội dung trọng tâm.',
        type: 'key-concept'
      },
      speakerNotes: 'Dành thời gian cho học sinh quan sát, trao đổi nhóm và ghi chép vào phiếu học tập.'
    });

    // Slide 4: Khám phá 2 - Quy luật, Công thức & Phương trình
    slides.push({
      id: 'slide-act-2b',
      stageLabel: 'Hoạt Động 2: Khám Phá Kiến Thức',
      title: 'QUY LUẬT KHOA HỌC & CÔNG THỨC/PTHH ĐẶC TRƯNG',
      subtitle: 'Khắc sâu kiến thức lý thuyết trọng tâm',
      bulletPoints: [
        `Yêu cầu cần đạt: ${lp.objectives.knowledge[1] || lp.objectives.knowledge[0] || 'Viết công thức, phương trình và giải thích bản chất.'}`,
        'Các bước tiến hành: Quan sát thí nghiệm → Phân tích hiện tượng → Khái quát hóa quy luật.',
        'Điều kiện áp dụng và lưu ý an toàn thực nghiệm trong phòng thực hành.',
        'Mối liên hệ giữa cấu tạo/bản chất và tính chất/hiện tượng quan sát được.'
      ],
      formulaOrCode: keyFormula,
      calloutBox: {
        title: 'LƯU Ý SƯ PHẠM & AN TOÀN',
        text: 'Tuân thủ quy tắc an toàn thí nghiệm, chú ý đơn vị đo và điều kiện phản ứng/hiện tượng xảy ra.',
        type: 'warning'
      },
      speakerNotes: 'Yêu cầu cả lớp thực hành ghi nhớ công thức/phương trình vào vở.'
    });

    // Slide 5: Luyện tập 1 - Bài tập mẫu & Thảo luận
    slides.push({
      id: 'slide-act-3a',
      stageLabel: 'Hoạt Động 3: Luyện Tập',
      title: 'BÀI TẬP MẪU MINH HỌA & HƯỚNG DẪN GIẢI',
      subtitle: 'Rèn luyện kỹ năng thực hành chuẩn xác',
      bulletPoints: [
        `Nhiệm vụ luyện tập: ${acts[2]?.content?.slice(0, 160) || 'Thực hiện bài tập củng cố trong SGK/SBT.'}`,
        'Bước 1: Tóm tắt bài toán, xác định các đại lượng đã cho và đại lượng cần tìm.',
        'Bước 2: Lựa chọn công thức / phương trình hóa học / quy luật di truyền tương ứng.',
        `Sản phẩm yêu cầu: ${acts[2]?.product?.slice(0, 150) || 'Lời giải chi tiết và câu trả lời hoàn chỉnh.'}`
      ],
      calloutBox: {
        title: 'TIÊU CHÍ ĐÁNH GIÁ',
        text: 'Đúng phương pháp (0.5đ), tính toán/viết PTHH chính xác (0.25đ), có giải thích và đơn vị rõ ràng (0.25đ).',
        type: 'info'
      },
      speakerNotes: 'Trình bày mẫu cẩn thận trên bảng để học sinh theo dõi quy chuẩn.'
    });

    // Slide 6: Luyện tập 2 - Hệ thống câu hỏi củng cố (7991)
    slides.push({
      id: 'slide-act-3b',
      stageLabel: 'Hoạt Động 3: Luyện Tập',
      title: 'HỆ THỐNG CÂU HỎI TRẮC NGHIỆM & TỰ LUYỆN (7991)',
      subtitle: 'Phân hóa theo mức độ Nhận biết - Thông hiểu - Vận dụng',
      bulletPoints: [
        `Phần I: Câu hỏi trắc nghiệm nhiều lựa chọn 4 phương án (A, B, C, D).`,
        `Phần II: Câu hỏi trắc nghiệm Đúng/Sai kiểm tra hiểu sâu bản chất kiến thức.`,
        `Phần III: Câu hỏi trắc nghiệm trả lời ngắn (tính toán con số, điền từ khuyết).`,
        'Phương pháp: Đọc kĩ đề, loại trừ phương án nhiễu và đối chiếu kiến thức SGK.'
      ],
      calloutBox: {
        title: 'ĐÁP ÁN & GIẢI THÍCH',
        text: 'Học sinh kiểm tra chéo đáp án theo nhóm, giáo viên chốt đáp số và giải thích các câu khó.',
        type: 'key-concept'
      },
      speakerNotes: 'Học sinh làm bài cá nhân 5 phút, đổi chéo vở chấm điểm nhanh.'
    });

    // Slide 7: Vận dụng thực tế
    slides.push({
      id: 'slide-act-4',
      stageLabel: 'Hoạt Động 4: Vận Dụng',
      title: acts[3]?.title || 'Hoạt động 4: Vận dụng giải quyết tình huống thực tế',
      subtitle: 'Kết nối bài học với đời sống và giáo dục STEM',
      bulletPoints: [
        `Nhiệm vụ thực tiễn: ${acts[3]?.content || 'Vận dụng kiến thức bài học giải thích các hiện tượng thực tế và bảo vệ môi trường.'}`,
        'Ý nghĩa khoa học: Hiểu rõ cơ chế tự nhiên giúp con người ứng xử đúng đắn và an toàn.',
        `Sản phẩm kỳ vọng: ${acts[3]?.product || 'Bản báo cáo ngắn, poster tuyên truyền hoặc sản phẩm STEM ứng dụng.'}`
      ],
      calloutBox: {
        title: 'Ý NGHĨA THỰC TIỄN & MÔI TRƯỜNG',
        text: 'Gắn kết tri thức khoa học với bảo vệ sức khỏe con người và phát triển bền vững.',
        type: 'info'
      },
      speakerNotes: 'Nhấn mạnh năng lực giải quyết vấn đề thực tiễn cho học sinh.'
    });

    // Slide 8: Tổng kết & Dặn dò
    slides.push({
      id: 'slide-summary-8',
      stageLabel: 'Tổng Kết & Dặn Dò',
      title: 'TỔNG KẾT BÀI HỌC VÀ HƯỚNG DẪN TỰ HỌC',
      subtitle: 'Khắc sâu kiến thức trọng tâm',
      bulletPoints: [
        `1. Ghi nhớ các kiến thức cốt lõi: ${lp.objectives.knowledge.slice(0, 2).join('; ')}.`,
        '2. Hoàn thành hệ thống bài tập trong Sách Giáo Khoa và Sách Bài Tập.',
        '3. Tự ôn luyện lại các dạng câu hỏi trắc nghiệm chuẩn Công văn 7991.',
        '4. Chuẩn bị bài học tiếp theo theo đúng kế hoạch dạy học của tổ bộ môn.'
      ],
      calloutBox: {
        title: 'THÔNG ĐIỆP SƯ PHẠM',
        text: `Giáo viên: ${teacher.name} chúc các em học sinh học tốt và say mê môn ${lp.subject}!`,
        type: 'info'
      },
      speakerNotes: 'Dặn dò thời hạn nộp bài tập và tổng kết tiết dạy.'
    });

  } else {
    // 10, 12 HOẶC 16 SLIDES: Mở rộng chuyên sâu theo đặc thù môn KHTN
    const base8 = generateStaticSlideDeck(lessonPlan, teacher, 8).slides;
    slides.push(...base8.slice(0, 7));

    const extraCount = slideCount - 8;
    for (let k = 1; k <= extraCount; k++) {
      slides.push({
        id: `slide-extra-${k}`,
        stageLabel: 'Mở Rộng & Chuyên Sâu',
        title: `CHUYÊN ĐỀ MỞ RỘNG ${k}: ỨNG DỤNG STEM & PHÂN HÓA NÂNG CAO`,
        subtitle: `Phát triển năng lực nghiên cứu khoa học cho học sinh`,
        bulletPoints: [
          `Nhiệm vụ phân hóa ${k}: Tìm hiểu cơ chế chuyên sâu và giải quyết bài toán thực nghiệm nâng cao.`,
          'Ứng dụng phương pháp thực nghiệm khoa học: Xây dựng giả thuyết → Thiết kế thí nghiệm → Phân tích dữ liệu.',
          'Kết nối liên môn: Tích hợp kiến thức Vật lí - Hóa học - Sinh học giải quyết bài toán phức tạp.',
          'Thảo luận các giải pháp bảo vệ môi trường, tiết kiệm năng lượng và phát triển bền vững.'
        ],
        formulaOrCode: keyFormula,
        calloutBox: {
          title: 'CHIẾN THUẬT TƯ DUY',
          text: 'Phân tích bản chất hiện tượng từ cấp độ vĩ mô đến vi mô để tìm ra giải pháp tối ưu.',
          type: 'key-concept'
        },
        speakerNotes: 'Dành cho các lớp chất lượng cao, học sinh khá giỏi hoặc hoạt động câu lạc bộ STEM.'
      });
    }

    // Slide tổng kết
    slides.push(base8[7]);
  }

  return {
    title: `${lp.lessonName} (SLIDE BÀI GIẢNG TĨNH ${slideCount} SLIDE)`,
    author: `${teacher.name} · ${teacher.department}`,
    slides: slides.slice(0, slideCount)
  };
}
