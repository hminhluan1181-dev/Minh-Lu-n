import { UploadedDocument } from '../types';

export const CONG_NGHE_7_LIBRARY: UploadedDocument[] = [
  // =========================================================================
  // SGK CÔNG NGHỆ 7 (KẾT NỐI TRI THỨC VỚI CUỘC SỐNG)
  // =========================================================================
  {
    id: 'doc-sgk-cong-nghe-7',
    name: 'SGK Công nghệ 7 (Kết Nối Tri Thức Với Cuộc Sống)',
    category: 'sgk',
    subject: 'Công nghệ',
    grade: 'Lớp 7',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-01',
    fileSize: '15.6 MB',
    pageCount: 128,
    status: 'indexed',
    rawTextPreview: 'Chương trình Công nghệ 7 KNTT gồm 2 phần lớn: Phần 1: Trồng trọt (Giới thiệu trồng trọt, làm đất, gieo trồng chăm sóc và phòng trừ sâu bệnh, thu hoạch, nhân giống vô tính giâm chiết ghép cành, trồng và bảo vệ rừng); Phần 2: Chăn nuôi & Thủy sản (Chăn nuôi vật nuôi, phòng trị bệnh gia súc gia cầm, nuôi gà thả vườn, nuôi cá nước ngọt và quản lý môi trường ao nuôi)...',
    chapters: [
      // -------------------------------------------------------------
      // PHẦN 1: TRỒNG TRỌT
      // -------------------------------------------------------------
      {
        id: 'cn7-ch-1',
        chapterNumber: 1,
        chapterTitle: 'Chương 1: Mở đầu về trồng trọt (Công nghệ 7)',
        lessonNumber: '1',
        lessonName: 'Giới thiệu về trồng trọt',
        summary: 'Trồng trọt có vai trò cung cấp lương thực, thực phẩm cho con người, thức ăn cho chăn nuôi, nguyên liệu cho công nghiệp chế biến và nông sản xuất khẩu; các nhóm cây trồng: Cây lương thực, cây công nghiệp, cây ăn quả, cây rau, cây hoa cây cảnh.',
        keyPoints: [
          '4 vai trò cốt lõi của ngành trồng trọt trong nền kinh tế quốc dân',
          'Phân loại cây trồng theo mục đích sử dụng (lương thực, thực phẩm, công nghiệp, cảnh quan)',
          'Các phương thức trồng trọt phổ biến: Trồng ngoài tự nhiên và trồng trong nhà có mái che (nhà kính, nhà màng công nghệ cao)',
          'Triển vọng phát triển của ngành trồng trọt: Nông nghiệp công nghệ cao, nông nghiệp hữu cơ, tự động hóa'
        ],
        objectives: {
          knowledge: [
            'Nêu được vai trò, triển vọng của trồng trọt và các nhóm cây trồng phổ biến.',
            'Phân biệt được phương thức trồng trọt ngoài tự nhiên và trong nhà có mái che.'
          ],
          competenciesSpecific: [
            'Năng lực công nghệ: Nhận diện các ngành nghề liên quan đến trồng trọt tại địa phương.'
          ]
        }
      },
      {
        id: 'cn7-ch-2',
        chapterNumber: 1,
        chapterTitle: 'Chương 1: Mở đầu về trồng trọt (Công nghệ 7)',
        lessonNumber: '2',
        lessonName: 'Làm đất trồng cây',
        summary: 'Mục đích của làm đất là làm cho đất tơi xốp, thoáng khí, giữ ẩm tốt và diệt trừ cỏ dại mầm mống sâu bệnh; các khâu làm đất: Cày đất, bừa và đập nhỏ đất, lên luống; bón phân lót.',
        keyPoints: [
          'Thành phần của đất trồng: Phần khí, phần rắn (chất vô cơ và chất hữu cơ), phần lỏng',
          'Các công đoạn làm đất: Cày đất (lật đất), bừa và đập đất (làm nhỏ hạt đất), lên luống (chống úng, dễ chăm sóc)',
          'Kĩ thuật bón lót: Bón phân hữu cơ hoai mục, phân lân hoặc vôi bột trước khi gieo trồng'
        ],
        objectives: {
          knowledge: [
            'Trình bày được mục đích và quy trình các bước làm đất trồng cây.',
            'Giải thích được tại sao cần bón phân lót trước khi gieo hạt hoặc trồng cây con.'
          ]
        }
      },
      {
        id: 'cn7-ch-3',
        chapterNumber: 1,
        chapterTitle: 'Chương 1: Mở đầu về trồng trọt (Công nghệ 7)',
        lessonNumber: '3',
        lessonName: 'Gieo trồng, chăm sóc và phòng trừ sâu, bệnh hại cây trồng',
        summary: 'Thời vụ gieo trồng; kĩ thuật chăm sóc: Tỉa, dặm cây, làm cỏ, vun xới, tưới tiêu nước, bón phân thúc; các biện pháp phòng trừ sâu bệnh: Biện pháp canh tác, cơ giới, sinh học, hóa học (ưu tiên biện pháp an toàn sinh học IPM).',
        keyPoints: [
          'Thời vụ gieo trồng phụ thuộc vào khí hậu và đặc tính từng loại cây',
          'Kĩ thuật chăm sóc: Tưới nước đúng thời điểm (tưới rãnh, tưới phun mưa, tưới nhỏ giọt tiết kiệm nước)',
          'Các biện pháp phòng trừ sâu bệnh: Biện pháp canh tác (luân canh cây trồng), cơ giới (bắt sâu, bẫy đèn), sinh học (dùng thiên địch ong mắt đỏ, bọ rùa), hóa học (chỉ dùng thuốc BVTV khi thật cần thiết theo nguyên tắc 4 đúng)'
        ],
        objectives: {
          knowledge: [
            'Mô tả được các công việc chăm sóc cây trồng phổ biến.',
            'Trình bày được các biện pháp phòng trừ sâu, bệnh hại và nguyên tắc 4 đúng khi dùng thuốc BVTV.'
          ]
        }
      },
      {
        id: 'cn7-ch-4',
        chapterNumber: 1,
        chapterTitle: 'Chương 1: Mở đầu về trồng trọt (Công nghệ 7)',
        lessonNumber: '4',
        lessonName: 'Thu hoạch sản phẩm trồng trọt',
        summary: 'Yêu cầu thu hoạch đúng độ chín, nhanh gọn, cẩn thận tránh làm dập nát; các phương pháp thu hoạch: Hái (chè, đậu), nhổ (khoai lang, củ cải), đốn cắt (mía, hoa, lúa), đào (khoai tây); các phương pháp bảo quản và chế biến sau thu hoạch.',
        keyPoints: [
          'Thu hoạch đúng thời điểm giúp đạt năng suất cao nhất và phẩm chất nông sản tốt nhất',
          '4 phương pháp thu hoạch chính: Hái, nhổ, cắt, đào',
          'Bảo quản nông sản: Bảo quản thoáng tự nhiên, bảo quản lạnh, sấy khô, chiếu xạ',
          'Chế biến nông sản: Muối chua, làm mứt, sấy dẻo, đóng hộp'
        ],
        objectives: {
          knowledge: [
            'Nêu được mục đích và các phương pháp thu hoạch sản phẩm trồng trọt.',
            'Lựa chọn được phương pháp thu hoạch và bảo quản phù hợp cho một số loại nông sản quen thuộc.'
          ]
        }
      },
      {
        id: 'cn7-ch-5',
        chapterNumber: 1,
        chapterTitle: 'Chương 1: Mở đầu về trồng trọt (Công nghệ 7)',
        lessonNumber: '5',
        lessonName: 'Nhân giống vô tính cây trồng (Giâm cành, Ghép cành, Chiết cành)',
        summary: 'Nhân giống vô tính tạo cây con từ các bộ phận sinh dưỡng của cây mẹ (thân, cành, mắt ghép); ưu điểm giữ nguyên đặc tính tốt của cây mẹ, ra hoa kết quả sớm; quy trình giâm cành, chiết cành và ghép mắt.',
        keyPoints: [
          'Giâm cành: Cắt đoạn cành bánh tẻ cắm vào đất ẩm tạo rễ mới (khoai lang, sắn, hoa hồng)',
          'Chiết cành: Bóc khoanh vỏ trên cành cây mẹ, bó bầu đất ẩm cho ra rễ rồi cắt đem trồng (cam, chanh, bưởi)',
          'Ghép cành / ghép mắt: Gắn mắt ghép hoặc cành ghép vào gốc ghép cùng họ (ghép hoa hồng, xoài, mít)',
          'Lưu ý kĩ thuật: Dụng cụ sắc bén khử trùng, bóc sạch tầng tượng tầng khi chiết cành'
        ],
        objectives: {
          knowledge: [
            'Trình bày được khái niệm và ưu nhược điểm của giâm cành, chiết cành, ghép cành.',
            'Thực hiện được thao tác giâm cành hoặc chiết cành một loại cây tại vườn trường hoặc gia đình.'
          ]
        }
      },
      {
        id: 'cn7-ch-6',
        chapterNumber: 2,
        chapterTitle: 'Chương 2: Lâm nghiệp và Rừng (Công nghệ 7)',
        lessonNumber: '6',
        lessonName: 'Rừng ở Việt Nam và Quản lí bảo vệ rừng',
        summary: 'Vai trò của rừng trong bảo vệ môi trường, giữ nước, chống xói mòn, chắn sóng chắn gió; phân loại 3 loại rừng: Rừng đặc dụng, rừng phòng hộ, rừng sản xuất; các biện pháp bảo vệ và phục hồi rừng đầu nguồn.',
        keyPoints: [
          'Vai trò sinh thái của rừng: "Lá phổi xanh" lọc không khí, điều hòa nguồn nước, bảo tồn đa dạng sinh học',
          '3 loại rừng theo Luật Lâm nghiệp: Rừng đặc dụng (vườn quốc gia, khu bảo tồn), rừng phòng hộ (đầu nguồn, chắn sóng ven biển), rừng sản xuất (lấy gỗ, tre nứa)',
          'Các nguyên nhân làm suy giảm diện tích rừng: Chặt phá bừa bãi, cháy rừng, du canh du cư',
          'Các biện pháp bảo vệ rừng và phòng chống cháy rừng'
        ],
        objectives: {
          knowledge: [
            'Nêu được vai trò của rừng và phân biệt được 3 loại rừng chính ở Việt Nam.',
            'Có ý thức bảo vệ cây xanh và tài nguyên rừng.'
          ]
        }
      },

      // -------------------------------------------------------------
      // PHẦN 2: CHĂN NUÔI & THỦY SẢN
      // -------------------------------------------------------------
      {
        id: 'cn7-ch-8',
        chapterNumber: 3,
        chapterTitle: 'Chương 3: Mở đầu về chăn nuôi (Công nghệ 7)',
        lessonNumber: '8',
        lessonName: 'Giới thiệu về chăn nuôi',
        summary: 'Chăn nuôi cung cấp thực phẩm dinh dưỡng giàu đạm (thịt, trứng, sữa), sức kéo, phân bón cho trồng trọt và nguyên liệu cho công nghiệp; các phương thức chăn nuôi phổ biến: Chăn thả tự do, nuôi nhốt bán công nghiệp và chăn nuôi công nghiệp trang trại.',
        keyPoints: [
          'Vai trò của ngành chăn nuôi đối với đời sống và nền kinh tế',
          'Các nhóm vật nuôi phổ biến: Gia súc lớn (trâu, bò), gia súc nhỏ (lợn, dê), gia cầm (gà, vịt, ngan)',
          'So sánh phương thức chăn thả truyền thống và chăn nuôi trang trại khép kín công nghệ cao'
        ],
        objectives: {
          knowledge: [
            'Trình bày được vai trò và triển vọng phát triển của ngành chăn nuôi.',
            'Phân biệt được các phương thức chăn nuôi phổ biến ở nước ta.'
          ]
        }
      },
      {
        id: 'cn7-ch-9',
        chapterNumber: 3,
        chapterTitle: 'Chương 3: Mở đầu về chăn nuôi (Công nghệ 7)',
        lessonNumber: '9',
        lessonName: 'Nuôi dưỡng và chăm sóc vật nuôi',
        summary: 'Nuôi dưỡng là cung cấp đủ dinh dưỡng cho vật nuôi; chăm sóc là tạo điều kiện môi trường sống thuận lợi; kĩ thuật nuôi dưỡng theo giai đoạn: Nuôi dưỡng vật nuôi non, nuôi dưỡng vật nuôi sinh sản, nuôi dưỡng vật nuôi vỗ béo lấy thịt.',
        keyPoints: [
          'Thức ăn vật nuôi gồm: Thức ăn thô xanh, thức ăn tinh bột, thức ăn giàu đạm, khoáng và vitamin',
          'Chăm sóc vật nuôi non: Giữ ấm, cho bú sữa đầu giàu kháng thể, tập ăn sớm',
          'Vệ sinh chuồng trại: Chuồng quay hướng Nam hoặc Đông Nam mát về mùa hè ấm về mùa đông'
        ],
        objectives: {
          knowledge: [
            'Trình bày được kĩ thuật nuôi dưỡng và chăm sóc các đối tượng vật nuôi.',
            'Giải thích được tầm quan trọng của sữa đầu đối với vật nuôi sơ sinh.'
          ]
        }
      },
      {
        id: 'cn7-ch-10',
        chapterNumber: 3,
        chapterTitle: 'Chương 3: Mở đầu về chăn nuôi (Công nghệ 7)',
        lessonNumber: '10',
        lessonName: 'Phòng và trị bệnh cho vật nuôi',
        summary: 'Bệnh làm giảm sức sản xuất, gây chết vật nuôi và có thể lây sang người; nguyên nhân sinh bệnh: Yếu tố bên trong (di truyền) và yếu tố môi trường (vi khuẩn, virus, kí sinh trùng); biện pháp phòng bệnh an toàn sinh học và tiêm vắc xin định kì.',
        keyPoints: [
          'Nguyên nhân gây bệnh: Bệnh truyền nhiễm (do virus, vi khuẩn lây lan nhanh thành dịch) và bệnh không truyền nhiễm',
          'Biện pháp phòng bệnh tổng hợp: Vệ sinh khử trùng chuồng trại định kì, tiêm phòng vắc xin đúng lịch',
          'Cách xử lí khi có dịch bệnh: Cách li vật nuôi ốm, báo cáo thú y, tuyệt đối không vứt xác vật nuôi bừa bãi ra kênh rạch'
        ],
        objectives: {
          knowledge: [
            'Nêu được nguyên nhân gây bệnh và các biện pháp phòng trị bệnh cho vật nuôi.',
            'Hiểu được vai trò của tiêm phòng vắc xin trong phòng chống dịch bệnh gia súc, gia cầm.'
          ]
        }
      },
      {
        id: 'cn7-ch-11',
        chapterNumber: 3,
        chapterTitle: 'Chương 3: Mở đầu về chăn nuôi (Công nghệ 7)',
        lessonNumber: '11',
        lessonName: 'Kĩ thuật chăn nuôi gà thịt thả vườn',
        summary: 'Mô hình nuôi gà thả vườn kết hợp chuồng trại và vườn thả tạo thịt gà thơm ngon, săn chắc; các khâu kĩ thuật: Chọn giống gà con, úm gà con, chăm sóc giai đoạn nuôi thả, phòng bệnh vắc xin Newcastle và Gumboro.',
        keyPoints: [
          'Chuẩn bị chuồng nuôi và vườn chăn thả có bóng mát râm',
          'Kĩ thuật úm gà con (giai đoạn 1 - 4 tuần tuổi): Sưởi ấm bằng đèn hồng ngoại, quây úm kín gió',
          'Khẩu phần thức ăn và kĩ thuật cho ăn tự do kết hợp rau xanh, giun trùn quế'
        ],
        objectives: {
          knowledge: [
            'Mô tả được các bước kĩ thuật chăn nuôi gà thịt thả vườn đạt hiệu quả cao.',
            'Vận dụng vào mô hình chăn nuôi nhỏ lẻ tại gia đình.'
          ]
        }
      },
      {
        id: 'cn7-ch-12',
        chapterNumber: 4,
        chapterTitle: 'Chương 4: Thủy sản (Công nghệ 7)',
        lessonNumber: '12',
        lessonName: 'Nuôi cá nước ngọt',
        summary: 'Vai trò ngành thủy sản cung cấp thực phẩm giàu protein; quy trình nuôi cá nước ngọt trong ao: Chuẩn bị ao nuôi (tát cạn, dọn cỏ, rắc vôi khử trùng, bón lót gây màu nước), chọn và thả cá giống, cho cá ăn và chăm sóc ao nuôi.',
        keyPoints: [
          'Các loài cá nước ngọt phổ biến: Cá chép, cá mè, cá trôi, cá trắm cỏ, cá rô phi',
          'Chuẩn bị ao nuôi: Tẩy vôi bột (7 - 10 kg/100 m²) để diệt khuẩn, lấy nước qua lưới lọc',
          'Kĩ thuật thả cá giống: Thả vào lúc sáng sớm hoặc chiều mát, ngâm bao cá trong nước ao 15 - 20 phút trước khi mở miệng bao thả cá'
        ],
        objectives: {
          knowledge: [
            'Trình bày được quy trình chuẩn bị ao và kĩ thuật thả cá giống nước ngọt.',
            'Giải thích được tại sao cần ngâm bao chứa cá giống trong ao trước khi thả.'
          ]
        }
      }
    ]
  },

  // =========================================================================
  // SBT CÔNG NGHỆ 7 (KẾT NỐI TRI THỨC VỚI CUỘC SỐNG)
  // =========================================================================
  {
    id: 'doc-sbt-cong-nghe-7',
    name: 'SBT Công nghệ 7 (Sách Bài Tập Kết Nối Tri Thức)',
    category: 'sbt',
    subject: 'Công nghệ',
    grade: 'Lớp 7',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-01',
    fileSize: '11.8 MB',
    pageCount: 96,
    status: 'indexed',
    rawTextPreview: 'Ngân hàng câu hỏi trắc nghiệm nhiều lựa chọn, đúng sai, trả lời ngắn và tình huống thực tiễn môn Công nghệ 7: Kĩ thuật trồng cây, nhận diện phương pháp nhân giống, phòng trừ sâu bệnh, quy trình nuôi dưỡng gia cầm và chăm sóc ao cá...',
    chapters: [
      {
        id: 'sbt-cn7-ch-1',
        chapterNumber: 1,
        chapterTitle: 'Chương 1: Bài tập Trồng trọt',
        lessonNumber: '1',
        lessonName: 'Bài tập: Mở đầu về trồng trọt & Nhân giống',
        summary: 'Hệ thống câu hỏi rèn luyện kiến thức về làm đất, bón phân lót, kĩ thuật giâm cành và chiết cành.',
        keyPoints: [
          'Trắc nghiệm nhận biết các phương pháp nhân giống vô tính',
          'Bài tập tính toán lượng phân bón lót cho diện tích 500 m²',
          'Tình huống giải thích hiện tượng cành chiết bị thối rễ'
        ]
      },
      {
        id: 'sbt-cn7-ch-3',
        chapterNumber: 3,
        chapterTitle: 'Chương 3: Bài tập Chăn nuôi & Thủy sản',
        lessonNumber: '8',
        lessonName: 'Bài tập: Kĩ thuật chăn nuôi & Nuôi cá nước ngọt',
        summary: 'Hệ thống câu hỏi đánh giá về phòng trị bệnh cho gia súc, kĩ thuật úm gà con và tẩy dọn ao nuôi cá.',
        keyPoints: [
          'Câu hỏi trắc nghiệm Đúng/Sai về lịch tiêm vắc xin cho gà',
          'Bài tập tình huống phát hiện cá nổi đầu vào buổi sáng sớm và cách xử lý bổ sung oxy'
        ]
      }
    ]
  }
];
