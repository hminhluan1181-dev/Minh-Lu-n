import { WorkspaceState } from '../types';

export const SAMPLE_PHYSICS_10: WorkspaceState = {
  version: '2025.1-CV7991-5512',
  timestamp: new Date().toISOString(),
  activeTab: 'library',
  teacherProfile: {
    name: 'Hồ Minh Luân',
    academicDegree: 'Thạc sĩ Khoa học Giáo dục',
    title: 'Giáo viên Vật lí - Khoa học Tự nhiên',
    school: 'TRƯỜNG THPT CHUYÊN LÊ HỒNG PHONG',
    department: 'TỔ VẬT LÍ - KHTN',
    email: 'H.Minhluan1181@gmail.com',
    phone: '0912 345 678',
    academicYear: '2024 - 2025',
    notes: 'Phụ trách chuyên đề Vật lí thực nghiệm và luyện thi HSG.'
  },
  uploadedDocuments: [
    {
      id: 'doc-sgk-vatly-10',
      name: 'SGK Vật lí 10 (Kết Nối Tri Thức Với Cuộc Sống)',
      category: 'sgk',
      subject: 'Vật lí',
      grade: 'Lớp 10',
      curriculum: 'Kết nối tri thức với cuộc sống',
      uploadDate: '2025-09-02',
      fileSize: '16.2 MB',
      pageCount: 148,
      status: 'indexed',
      rawTextPreview: 'Chương 2: Động lực học. Bài 10: Ba định luật Newton. Định luật II Newton: Gia tốc của một vật cùng hướng với lực tác dụng...',
      chapters: [
        {
          id: 'vl-ch-10',
          chapterNumber: 2,
          chapterTitle: 'Chương 2: Động lực học',
          lessonNumber: '10',
          lessonName: 'Bài 10: Định luật II Newton và Gia tốc',
          summary: 'Định luật II Newton F = ma, mối quan hệ giữa lực tác dụng và sự biến thiên gia tốc.',
          keyPoints: [
            'Công thức F = m.a',
            'Đơn vị đo lực là Newton (N)',
            'Ứng dụng tính quãng đường hãm phanh ô tô'
          ]
        }
      ]
    }
  ],
  savedProjects: [
    {
      id: 'proj-vl-khbd',
      title: 'KHBD 5512 - Bài 10: Định luật II Newton',
      type: 'khbd',
      subject: 'Vật lí',
      grade: 'Lớp 10',
      curriculum: 'Kết nối tri thức với cuộc sống',
      savedAt: '2025-10-01 10:20',
      fileSize: '192 KB',
      teacherName: 'Hồ Minh Luân',
      cloudSyncStatus: 'synced',
      downloadFormats: ['word', 'pdf', 'json']
    }
  ],
  lessonPlan: {
    schoolName: 'TRƯỜNG THPT CHUYÊN LÊ HỒNG PHONG',
    department: 'TỔ VẬT LÍ - KHTN',
    teacherName: 'Hồ Minh Luân',
    subject: 'Vật lí',
    grade: 'Lớp 10',
    curriculum: 'Kết nối tri thức với cuộc sống',
    lessonName: 'BÀI 10: ĐỊNH LUẬT II NEWTON VÀ GIA TỐC',
    durationInPeriods: 2,
    academicYear: '2024 - 2025',

    objectives: {
      knowledge: [
        'Phát biểu được định luật II Newton: Gia tốc của một vật cùng hướng với lực tác dụng và tỉ lệ thuận với độ lớn của lực, tỉ lệ nghịch với khối lượng của vật.',
        'Viết được công thức định luật II Newton: a = F / m hay F = m.a và nêu rõ đơn vị từng đại lượng.',
        'Vận dụng định luật II Newton để giải thích các hiện tượng va chạm giao thông, đệm khí cứu hộ và tính toán gia tốc trong các bài toán cơ học chuyển động.'
      ],
      competencies: {
        general: [
          'Năng lực tự chủ và tự học: Tìm hiểu qua SGK và làm trước thí nghiệm ảo PhET Interactive Simulations.',
          'Năng lực giao tiếp và hợp tác: Làm việc nhóm 4 học sinh lắp ráp bộ cảm biến quang điện đo gia tốc.'
        ],
        specific: [
          'Năng lực tìm hiểu thế giới tự nhiên dưới góc độ vật lí: Thu thập và xử lý số liệu thực nghiệm mối quan hệ giữa lực F, khối lượng m và gia tốc a.',
          'Năng lực vận dụng kiến thức kĩ năng: Giải thích nguyên lý túi khí ô tô và dây đai an toàn.'
        ]
      },
      qualities: [
        'Cẩn thận, chính xác khi đọc số liệu đo trên đồng hồ hiện số.',
        'Trung thực trong việc ghi nhận và xử lý số liệu sai số thí nghiệm.'
      ]
    },

    equipments: {
      teacher: [
        'Bộ thí nghiệm đệm không khí, máng nghiêng, cổng quang điện, đồng hồ đo thời gian hiện số MC-963A.',
        'Mô phỏng máy tính thí nghiệm ảo PhET: Forces and Motion (Basics).'
      ],
      students: [
        'SGK Vật lí 10, vở bài tập, thước đo độ dài, máy tính cầm tay Casio fx-580VN X.'
      ]
    },

    activities: [
      {
        id: 'phys-act-1',
        code: 'ACT_1',
        title: 'Hoạt động 1: Khởi động (Mở đầu / Tạo tình huống có vấn đề)',
        duration: '10 phút',
        goal: 'Khơi gợi mâu thuẫn nhận thức: Tại sao xe chở hàng nặng lại khó tăng tốc và khó phanh dừng hơn xe tải rỗng?',
        content: 'Xem video va chạm thử nghiệm an toàn xe hơi (Crash Test) giữa xe bán tải nặng và xe hơi cỡ nhỏ. Học sinh thảo luận câu hỏi: Đại lượng nào đã cản trở sự thay đổi vận tốc của vật nặng hơn?',
        product: 'Ý kiến thảo luận của học sinh: Khối lượng càng lớn thì vật càng khó thay đổi vận tốc; quán tính lớn hơn.',
        implementation: {
          step1_assign: 'GV chiếu clip thử nghiệm phanh khẩn cấp của hai xe khác tải trọng và phát câu hỏi cho từng bàn.',
          step2_execute: 'Học sinh trao đổi cặp đôi 3 phút, ghi câu trả lời nhanh vào thẻ màu.',
          step3_report: '3 đại diện phát biểu so sánh quán tính và gia tốc thu được.',
          step4_conclude: 'GV kết luận: Giữa lực, khối lượng và gia tốc có mối quan hệ định lượng chặt chẽ mà Isaac Newton đã khám phá. Vào bài mới.'
        }
      },
      {
        id: 'phys-act-2',
        code: 'ACT_2',
        title: 'Hoạt động 2: Hình thành kiến thức mới (Thực nghiệm & Rút ra định luật)',
        duration: '35 phút',
        goal: 'Học sinh phân tích bảng số liệu thực nghiệm để rút ra tỉ lệ a ∝ F và a ∝ 1/m, từ đó phát biểu Định luật II Newton.',
        content: 'Học sinh làm việc với mô phỏng xe lăn trên đệm khí chịu lực kéo của các quả cân m₁ = 50g, 100g, 150g.',
        product: 'Đồ thị biểu diễn mối quan hệ a - F (đường thẳng đi qua gốc toạ độ) và công thức vector F = m.a.',
        implementation: {
          step1_assign: 'GV giao bảng số liệu đo từ cổng quang điện cho 4 nhóm, yêu cầu vẽ đồ thị a theo F khi m không đổi.',
          step2_execute: 'Các nhóm phân công vẽ đồ thị và tính thương số F/a trên giấy kẻ ô milimét.',
          step3_report: 'Đại diện nhóm 2 báo cáo kết quả: Khi tăng lực F lên 2 lần thì gia tốc a cũng tăng 2 lần. Khi tăng khối lượng m thì gia tốc giảm tương ứng.',
          step4_conclude: 'GV chuẩn hoá định luật II Newton: Vectơ gia tốc cùng hướng với vectơ hợp lực tác dụng: a = F/m hay F = m.a. Định nghĩa 1 Newton: 1 N = 1 kg.m/s².'
        }
      },
      {
        id: 'phys-act-3',
        code: 'ACT_3',
        title: 'Hoạt động 3: Luyện tập (Vận dụng công thức cơ bản)',
        duration: '25 phút',
        goal: 'Rèn luyện kĩ năng tính lực, khối lượng và gia tốc theo công thức F = m.a.',
        content: 'Bài 1: Một vật khối lượng 2 kg chuyển động với gia tốc 1.5 m/s². Tính độ lớn lực tác dụng. Bài 2: Xe ô tô 1000 kg đang chạy với v = 20 m/s thì hãm phanh dừng lại sau 5 giây.',
        product: 'Lời giải chi tiết bài toán động lực học cơ bản trong vở học sinh.',
        implementation: {
          step1_assign: 'GV giao bài tập luyện tập trên màn chiếu.',
          step2_execute: 'Học sinh giải độc lập 7 phút, đổi chéo chấm chữa cho bạn.',
          step3_report: 'Gọi 2 học sinh lên bảng giải, lớp nhận xét.',
          step4_conclude: 'GV chốt phương pháp chọn hệ quy chiếu, chiều dương và phân tích lực.'
        }
      },
      {
        id: 'phys-act-4',
        code: 'ACT_4',
        title: 'Hoạt động 4: Vận dụng (An toàn giao thông và công nghệ)',
        duration: '20 phút',
        goal: 'Giải thích tác dụng của dây an toàn và túi khí trong xe hơi dưới góc độ định luật II Newton.',
        content: 'Bài toán: Khi va chạm xảy ra, người ngồi trên xe tiếp tục lao về phía trước. Túi khí bung ra làm tăng thời gian hãm vận tốc từ 0.02s lên 0.2s. Hãy so sánh lực tác dụng lên người lái xe.',
        product: 'Báo cáo mini phân tích: F = m.(Δv / Δt), khi thời gian Δt tăng lên 10 lần thì lực F va đập giảm 10 lần, bảo vệ tính mạng tài xế.',
        implementation: {
          step1_assign: 'GV nêu tình huống thực tiễn và giao bài tập phân tích an toàn kỹ thuật.',
          step2_execute: 'Học sinh thảo luận nhóm, áp dụng công thức F = m.Δv/Δt.',
          step3_report: 'Đại diện nhóm phát biểu giải thích khoa học.',
          step4_conclude: 'GV tổng kết bài học, giáo dục ý thức chấp hành luật an toàn giao thông đường bộ khi đi xe máy, ô tô.'
        }
      }
    ]
  },

  slides: {
    title: 'ĐỊNH LUẬT II NEWTON (VẬT LÍ 10)',
    author: 'Tổ Vật lí - KHTN | THPT Chuyên Lê Hồng Phong',
    slides: [
      {
        id: 'phys-sl-1',
        activityCode: 'INTRO',
        stageLabel: 'Mở đầu',
        title: 'BÀI 10: ĐỊNH LUẬT II NEWTON',
        subtitle: 'Chương trình GDPT 2018 · Chân trời sáng tạo',
        bulletPoints: [
          'Trọng tâm: Mối quan hệ giữa Lực, Khối lượng và Gia tốc',
          'Thời lượng: 2 tiết học (90 phút)',
          'Ứng dụng: An toàn giao thông & Cơ học động lực học'
        ],
        calloutBox: {
          title: 'Khái niệm chìa khoá',
          text: 'Lực không phải là nguyên nhân duy trì chuyển động, mà là nguyên nhân làm biến đổi vận tốc (gây ra gia tốc)!',
          type: 'key-concept'
        },
        speakerNotes: 'Nhấn mạnh quan niệm sai lầm phổ biến của Aristotle trước khi Newton ra đời.'
      },
      {
        id: 'phys-sl-2',
        activityCode: 'ACT_1',
        stageLabel: 'Khởi động',
        title: 'TẠI SAO XE TẢI KHÓ PHANH HƠN XE CON?',
        subtitle: 'Khám phá quán tính và khối lượng trong thực tế',
        bulletPoints: [
          'Hai xe chạy cùng vận tốc 60 km/h: Xe máy và Xe container chở thép.',
          'Khi gặp vật cản phía trước, xe nào mất quãng đường phanh dài hơn?',
          'Vật có khối lượng càng lớn thì khả năng giữ nguyên trạng thái vận tốc (mức quán tính) càng lớn.'
        ],
        speakerNotes: 'Gợi mở cho học sinh về khái niệm mức quán tính.'
      },
      {
        id: 'phys-sl-3',
        activityCode: 'ACT_2',
        stageLabel: 'Hình thành kiến thức',
        title: 'NỘI DUNG ĐỊNH LUẬT II NEWTON',
        subtitle: 'Phát biểu định luật và công thức cơ bản',
        bulletPoints: [
          'Phát biểu: Vectơ gia tốc của một vật luôn cùng hướng với lực tác dụng lên vật. Độ lớn của gia tốc tỉ lệ thuận với độ lớn của lực và tỉ lệ nghịch với khối lượng của vật.',
          'Công thức: a = F / m  ⇔  F = m . a (khi F là hợp lực tác dụng).'
        ],
        formulaOrCode: 'F = m · a   [với 1 N = 1 kg·m/s²]',
        speakerNotes: 'Nhắc học sinh đơn vị chuẩn quốc tế SI: m tính bằng kg, a tính bằng m/s2.'
      },
      {
        id: 'phys-sl-4',
        activityCode: 'ACT_3',
        stageLabel: 'Luyện tập',
        title: 'BÀI TẬP VÍ DỤ MINH HOẠ',
        subtitle: 'Vận dụng định luật II tính toán lực kéo',
        bulletPoints: [
          'Một vật khối lượng m = 5 kg đứng yên trên mặt sàn nằm ngang không ma sát.',
          'Tác dụng lực kéo F = 15 N song song mặt sàn. Tính gia tốc của vật.',
          'Sau 4 giây kể từ lúc bắt đầu chuyển động, vật đạt vận tốc bằng bao nhiêu?'
        ],
        calloutBox: {
          title: 'Hướng dẫn giải',
          text: 'a = F / m = 15 / 5 = 3 m/s². Vận tốc sau 4s: v = v₀ + a.t = 0 + 3.4 = 12 m/s.',
          type: 'info'
        },
        speakerNotes: 'Cho học sinh 2 phút tự nhẩm rồi công bố lời giải.'
      }
    ]
  },

  matrixRows: [
    {
      id: 'phys-mat-1',
      chapter: 'Chương 2: Động lực học',
      unit: '1. Ba định luật Newton',
      tnkq_nhieuLuaChon: { biet: 4, hieu: 2, vanDung: 0 },
      tnkq_dungSai: { biet: 1, hieu: 1, vanDung: 0 },
      tnkq_traLoiNgan: { biet: 0, hieu: 1, vanDung: 1 },
      tuLuan: { biet: 0, hieu: 1, vanDung: 0 }
    },
    {
      id: 'phys-mat-2',
      chapter: 'Chương 2: Động lực học',
      unit: '2. Các lực trong tự nhiên & Ứng dụng an toàn giao thông',
      tnkq_nhieuLuaChon: { biet: 4, hieu: 2, vanDung: 0 },
      tnkq_dungSai: { biet: 0, hieu: 1, vanDung: 1 },
      tnkq_traLoiNgan: { biet: 0, hieu: 1, vanDung: 1 },
      tuLuan: { biet: 0, hieu: 0, vanDung: 1 }
    }
  ],

  specRows: [
    {
      id: 'phys-spec-1',
      chapter: 'Chương 2: Động lực học',
      unit: '1. Ba định luật Newton',
      learningOutcomes: {
        biet: ['Nhận biết phát biểu định luật II Newton, đơn vị của lực (Newton).'],
        hieu: ['Hiểu và áp dụng mối liên hệ giữa vectơ lực và vectơ gia tốc a = F/m.'],
        vanDung: ['Giải bài toán chuyển động có nhiều lực tác dụng tác dụng đồng thời.']
      },
      numberOfQuestions: {
        tnkq_nhieuLuaChon: { biet: 4, hieu: 2, vanDung: 0 },
        tnkq_dungSai: { biet: 1, hieu: 1, vanDung: 0 },
        tnkq_traLoiNgan: { biet: 0, hieu: 1, vanDung: 1 },
        tuLuan: { biet: 0, hieu: 1, vanDung: 0 }
      }
    },
    {
      id: 'phys-spec-2',
      chapter: 'Chương 2: Động lực học',
      unit: '2. Các lực trong tự nhiên & An toàn giao thông',
      learningOutcomes: {
        biet: ['Nhận biết lực cản không khí, lực ma sát trượt.'],
        hieu: ['Giải thích nguyên nhân tai nạn do không giữ khoảng cách phanh.'],
        vanDung: ['Tính lực va chạm của người lái xe trong trường hợp có và không có túi khí.']
      },
      numberOfQuestions: {
        tnkq_nhieuLuaChon: { biet: 4, hieu: 2, vanDung: 0 },
        tnkq_dungSai: { biet: 0, hieu: 1, vanDung: 1 },
        tnkq_traLoiNgan: { biet: 0, hieu: 1, vanDung: 1 },
        tuLuan: { biet: 0, hieu: 0, vanDung: 1 }
      }
    }
  ],

  exam: {
    title: 'ĐỀ KIỂM TRA ĐỊNH KÌ GIỮA HỌC KÌ I - VẬT LÍ 10',
    examType: 'Kiểm tra giữa học kì 1',
    durationMinutes: 45,
    academicYear: 'Năm học 2024 - 2025',
    totalScore: 10.0,
    weighting: { recognition: 40, comprehension: 30, application: 30 },
    partI_MultipleChoice: [
      {
        id: 'pq-1',
        number: 1,
        content: 'Đơn vị của lực trong hệ SI là gì?',
        options: { A: 'Joule (J)', B: 'Newton (N)', C: 'Watt (W)', D: 'Pascal (Pa)' },
        correctAnswer: 'B',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Đơn vị lực',
        explanation: 'Đơn vị chuẩn của lực trong hệ SI là Newton (kí hiệu N).'
      },
      {
        id: 'pq-2',
        number: 2,
        content: 'Gia tốc của một vật có cùng hướng với vectơ nào sau đây?',
        options: { A: 'Vectơ vận tốc', B: 'Vectơ vị trí', C: 'Vectơ hợp lực tác dụng', D: 'Vectơ trọng lượng' },
        correctAnswer: 'C',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Định luật II Newton',
        explanation: 'Theo định luật II Newton, vectơ gia tốc luôn cùng hướng với vectơ hợp lực tác dụng lên vật.'
      },
      {
        id: 'pq-3',
        number: 3,
        content: 'Biểu thức nào sau đây biểu diễn định luật II Newton?',
        options: { A: 'F = m / a', B: 'a = F / m', C: 'm = a . F', D: 'F = m . v' },
        correctAnswer: 'B',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Công thức định luật',
        explanation: 'a = F / m.'
      },
      {
        id: 'pq-4',
        number: 4,
        content: 'Khi một lực F không đổi tác dụng lên một vật, gia tốc của vật sẽ thay đổi như thế nào nếu khối lượng của vật tăng lên 2 lần?',
        options: { A: 'Tăng lên 2 lần', B: 'Giảm đi 2 lần', C: 'Không đổi', D: 'Tăng lên 4 lần' },
        correctAnswer: 'B',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'Quan hệ tỉ lệ',
        explanation: 'Vì a = F/m, gia tốc tỉ lệ nghịch với khối lượng m. Khi m tăng 2 lần thì a giảm đi 2 lần.'
      },
      {
        id: 'pq-5',
        number: 5,
        content: 'Một vật có khối lượng 500 g chuyển động với gia tốc 2 m/s². Độ lớn hợp lực tác dụng vào vật là:',
        options: { A: '1000 N', B: '1 N', C: '250 N', D: '0.25 N' },
        correctAnswer: 'B',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Tính độ lớn lực',
        explanation: 'm = 500 g = 0.5 kg. F = m.a = 0.5 * 2 = 1 N.'
      },
      {
        id: 'pq-6',
        number: 6,
        content: 'Đại lượng nào sau đây đặc trưng cho mức quán tính của vật?',
        options: { A: 'Trọng lượng', B: 'Vận tốc', C: 'Khối lượng', D: 'Thể tích' },
        correctAnswer: 'C',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Mức quán tính',
        explanation: 'Khối lượng là đại lượng đặc trưng cho mức quán tính của vật.'
      },
      {
        id: 'pq-7',
        number: 7,
        content: 'Lực 1 Newton tương đương với:',
        options: { A: '1 kg.m/s', B: '1 kg.m/s²', C: '1 kg.m²/s²', D: '1 kg/m.s' },
        correctAnswer: 'B',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Thứ nguyên Newton',
        explanation: '1 N = 1 kg . 1 m/s² = 1 kg.m/s².'
      },
      {
        id: 'pq-8',
        number: 8,
        content: 'Một chiếc ô tô đang chuyển động thẳng đều thì hợp lực tác dụng lên ô tô bằng bao nhiêu?',
        options: { A: 'Lớn hơn 0', B: 'Bằng 0', C: 'Nhỏ hơn 0', D: 'Không xác định' },
        correctAnswer: 'B',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'Chuyển động thẳng đều',
        explanation: 'Chuyển động thẳng đều có gia tốc a = 0 ⇒ Hợp lực F = m.a = 0.'
      },
      {
        id: 'pq-9',
        number: 9,
        content: 'Túi khí ô tô bung ra trong lúc va chạm có tác dụng quan trọng nhất là gì?',
        options: {
          A: 'Làm tăng lực va đập',
          B: 'Kéo dài thời gian va chạm nhằm giảm độ lớn lực tác dụng lên người',
          C: 'Giúp người lái giữ nguyên tốc độ',
          D: 'Tăng gia tốc hãm của người lái'
        },
        correctAnswer: 'B',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'Túi khí ô tô',
        explanation: 'Tăng thời gian va đập Δt làm giảm xung lực tác dụng F = Δp / Δt.'
      },
      {
        id: 'pq-10',
        number: 10,
        content: 'Tác dụng một lực 10 N vào một vật thì nó thu được gia tốc 2.5 m/s². Nếu muốn vật thu được gia tốc 5 m/s² thì cần tác dụng lực có độ lớn bằng:',
        options: { A: '20 N', B: '5 N', C: '15 N', D: '25 N' },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'Tỉ lệ thuận',
        explanation: 'F tỉ lệ thuận với a. Gia tốc tăng gấp đôi thì lực cũng phải tăng gấp đôi: 10 * 2 = 20 N.'
      },
      {
        id: 'pq-11',
        number: 11,
        content: 'Một vật rơi tự do trong chân không tại nơi có g = 9.8 m/s². Lực gây ra gia tốc rơi tự do của vật là:',
        options: { A: 'Lực đẩy Ac-si-met', B: 'Trọng lực', C: 'Lực đàn hồi', D: 'Lực cản' },
        correctAnswer: 'B',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Rơi tự do',
        explanation: 'Trọng lực là lực hút của Trái Đất gây ra gia tốc rơi tự do g.'
      },
      {
        id: 'pq-12',
        number: 12,
        content: 'Hai vật có khối lượng m₁ = 2 kg và m₂ = 4 kg chịu tác dụng của hai lực cùng độ lớn F. Tỉ số gia tốc a₁ / a₂ bằng:',
        options: { A: '2', B: '0.5', C: '4', D: '1' },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'So sánh gia tốc',
        explanation: 'a₁/a₂ = m₂/m₁ = 4/2 = 2.'
      }
    ],

    partII_TrueFalse: [
      {
        id: 'ptf-1',
        number: 1,
        context: 'Một xe lăn khối lượng m = 2 kg đặt trên một sàn nằm ngang không ma sát. Tại thời điểm t = 0, tác dụng một lực kéo F = 6 N không đổi theo phương ngang làm xe bắt đầu chuyển động.',
        level: 'Thông hiểu',
        topic: 'Chuyển động có lực kéo',
        pointsTotal: 1.0,
        statements: [
          {
            subId: 'a',
            text: 'Gia tốc mà xe lăn thu được có độ lớn là 3 m/s².',
            isCorrect: true,
            explanation: 'a = F / m = 6 / 2 = 3 m/s². Mệnh đề ĐÚNG.'
          },
          {
            subId: 'b',
            text: 'Vận tốc của xe lăn tại thời điểm t = 4 giây là 12 m/s.',
            isCorrect: true,
            explanation: 'v = v₀ + a.t = 0 + 3 * 4 = 12 m/s. Mệnh đề ĐÚNG.'
          },
          {
            subId: 'c',
            text: 'Quãng đường xe lăn đi được trong 4 giây đầu tiên là 48 mét.',
            isCorrect: false,
            explanation: 's = 0.5 * a * t² = 0.5 * 3 * 16 = 24 mét (không phải 48m). Mệnh đề SAI.'
          },
          {
            subId: 'd',
            text: 'Nếu sau 4 giây, ta ngừng tác dụng lực kéo F thì xe sẽ lập tức dừng lại ngay.',
            isCorrect: false,
            explanation: 'Theo định luật I Newton (quán tính), khi ngừng tác dụng lực trên mặt phẳng không ma sát, xe sẽ tiếp tục chuyển động thẳng đều với vận tốc 12 m/s chứ không dừng lại ngay. Mệnh đề SAI.'
          }
        ]
      },
      {
        id: 'ptf-2',
        number: 2,
        context: 'Một quả bóng khối lượng m = 400 g bay theo phương ngang với vận tốc 20 m/s tới đập vuông góc vào một bức tường phẳng rồi bật ngược trở lại theo phương cũ với cùng tốc độ 20 m/s. Thời gian va chạm giữa bóng và tường là 0.05 giây.',
        level: 'Vận dụng',
        topic: 'Lực va chạm và xung lượng',
        pointsTotal: 1.0,
        statements: [
          {
            subId: 'a',
            text: 'Chọn chiều dương là chiều bay ban đầu của quả bóng, vận tốc của quả bóng sau khi bật ngược trở lại là -20 m/s.',
            isCorrect: true,
            explanation: 'Chiều ngược lại có giá trị âm nên v₂ = -20 m/s. Mệnh đề ĐÚNG.'
          },
          {
            subId: 'b',
            text: 'Độ biến thiên vận tốc của quả bóng trong suốt quá trình va chạm là 0 m/s vì tốc độ không đổi.',
            isCorrect: false,
            explanation: 'Vận tốc là đại lượng vectơ: Δv = v₂ - v₁ = -20 - 20 = -40 m/s (độ biến thiên tốc độ khác độ biến thiên vận tốc). Mệnh đề SAI.'
          },
          {
            subId: 'c',
            text: 'Gia tốc trung bình của quả bóng trong thời gian va chạm với bức tường có độ lớn là 800 m/s².',
            isCorrect: true,
            explanation: '|a| = |Δv| / Δt = 40 / 0.05 = 800 m/s². Mệnh đề ĐÚNG.'
          },
          {
            subId: 'd',
            text: 'Lực trung bình do tường tác dụng lên quả bóng có độ lớn là 320 N.',
            isCorrect: true,
            explanation: 'F = m . |a| = 0.4 kg * 800 m/s² = 320 N. Mệnh đề ĐÚNG.'
          }
        ]
      }
    ],

    partIII_ShortAnswer: [
      {
        id: 'psa-1',
        number: 1,
        content: 'Một vật khối lượng 4 kg đang nằm yên thì chịu tác dụng của lực kéo 16 N. Tính gia tốc của vật theo đơn vị m/s².',
        acceptableAnswers: ['4', '4 m/s2', '4 m/s²'],
        points: 0.5,
        level: 'Thông hiểu',
        topic: 'Tính gia tốc',
        solutionGuide: 'a = F/m = 16/4 = 4 m/s².'
      },
      {
        id: 'psa-2',
        number: 2,
        content: 'Xe tải 2000 kg phanh gấp từ vận tốc 15 m/s đến dừng hẳn sau 3 giây. Độ lớn lực hãm phanh trung bình tác dụng lên xe là bao nhiêu Newton?',
        acceptableAnswers: ['10000', '10000 N', '10,000'],
        points: 0.5,
        level: 'Thông hiểu',
        topic: 'Lực hãm phanh',
        solutionGuide: '|a| = 15/3 = 5 m/s². F = m.|a| = 2000 * 5 = 10000 N.'
      },
      {
        id: 'psa-3',
        number: 3,
        content: 'Khi hợp lực tác dụng lên một vật là 50 N thì nó chuyển động với gia tốc 2.5 m/s². Khối lượng của vật đó là bao nhiêu kg?',
        acceptableAnswers: ['20', '20 kg'],
        points: 0.5,
        level: 'Thông hiểu',
        topic: 'Khối lượng vật',
        solutionGuide: 'm = F/a = 50 / 2.5 = 20 kg.'
      },
      {
        id: 'psa-4',
        number: 4,
        content: 'Một lực kéo 25 N tác dụng lên một vật đặt trên sàn có ma sát. Biết lực ma sát cản trở chuyển động là 5 N, khối lượng vật là 5 kg. Gia tốc chuyển động của vật là bao nhiêu m/s²?',
        acceptableAnswers: ['4', '4 m/s2', '4 m/s²'],
        points: 0.5,
        level: 'Vận dụng',
        topic: 'Hợp lực ma sát',
        solutionGuide: 'Hợp lực F_hl = F_k - F_ms = 25 - 5 = 20 N. Gia tốc a = F_hl / m = 20 / 5 = 4 m/s².'
      }
    ],

    partIV_Essay: [
      {
        id: 'pes-1',
        number: 1,
        content: 'Một người tác dụng lực kéo F = 120 N hợp với phương ngang một góc 30° để kéo một thùng gỗ khối lượng m = 20 kg trượt trên sàn nhà nằm ngang.\na) Phân tích các lực tác dụng lên thùng gỗ và biểu diễn chúng trên hình vẽ.\nb) Bỏ qua mọi ma sát và sức cản. Tính gia tốc chuyển động của thùng gỗ trên sàn (lấy cos 30° ≈ 0.866).',
        points: 1.5,
        level: 'Thông hiểu',
        topic: 'Phân tích lực và định luật II',
        gradingCriteria: [
          {
            step: 'Ý a (0.75đ): Nêu đủ và vẽ đúng 4 lực: Trọng lực P hướng thẳng đứng xuống, Phản lực N hướng thẳng đứng lên, Lực kéo F xiên góc 30° so với phương ngang.',
            points: 0.75
          },
          {
            step: 'Ý b (0.75đ): Chiếu lên phương chuyển động Ox: F_x = F . cos 30° = 120 * 0.866 = 103.92 N. Gia tốc a = F_x / m = 103.92 / 20 ≈ 5.2 m/s².',
            points: 0.75
          }
        ]
      },
      {
        id: 'pes-2',
        number: 2,
        content: 'Trong một bài kiểm tra an toàn va chạm ô tô, một hình nhân ngồi trong xe thắt dây an toàn khi xe đang chạy với vận tốc 72 km/h (20 m/s) va vào chướng ngại vật cố định.\na) Nếu người lái không thắt dây an toàn, va đập trực tiếp vào vô lăng làm thời gian dừng lại chỉ vỏn vẹn 0.02 giây. Biết khối lượng phần thân người va đập là 40 kg, hãy tính độ lớn lực va chạm cực mạnh này.\nb) Nhờ có hệ thống dây đai an toàn và túi khí thông minh bung nở, thời gian hãm vận tốc được kéo dài thành 0.25 giây. Hãy tính lại lực tác dụng trong trường hợp này và nhận xét về vai trò bảo vệ tính mạng của công nghệ túi khí.',
        points: 1.5,
        level: 'Vận dụng',
        topic: 'Bài toán an toàn va chạm giao thông',
        gradingCriteria: [
          {
            step: 'Ý a (0.75đ): Gia tốc hãm |a₁| = |v - v₀| / Δt₁ = 20 / 0.02 = 1000 m/s². Lực va đập F₁ = m . |a₁| = 40 * 1000 = 40.000 N (tương đương trọng lượng của vật nặng 4 tấn đè lên ngực, gây nguy hiểm chết người).',
            points: 0.75
          },
          {
            step: 'Ý b (0.75đ): Khi có túi khí, gia tốc hãm |a₂| = 20 / 0.25 = 80 m/s². Lực tác dụng F₂ = 40 * 80 = 3200 N. Lực va đập đã giảm đi 12.5 lần, phân tán đều áp lực lên cơ thể giúp bảo toàn tính mạng của người lái.',
            points: 0.75
          }
        ]
      }
    ]
  }
};
