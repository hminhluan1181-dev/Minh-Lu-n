import { 
  LessonPlan5512, 
  SlideDeck, 
  Exam7991, 
  MatrixRowItem, 
  SpecSheetRow, 
  WorkspaceState,
  TeacherProfile,
  UploadedDocument,
  SavedCloudProject
} from '../types';

export const DEFAULT_TEACHER_PROFILE: TeacherProfile = {
  name: 'Hồ Minh Luân',
  academicDegree: 'Thạc sĩ Sư phạm Toán',
  title: 'Giáo viên Toán - Tin học',
  school: 'TRƯỜNG THPT CHUYÊN NGUYỄN HUỆ',
  department: 'TỔ TOÁN - TIN HỌC',
  email: 'H.Minhluan1181@gmail.com',
  phone: '0912 345 678',
  academicYear: '2024 - 2025',
  notes: 'Chuyên trách đổi mới phương pháp giảng dạy THPT và số hóa học liệu SGK 2018.'
};

export const DEFAULT_UPLOADED_DOCUMENTS: UploadedDocument[] = [
  {
    id: 'doc-sgk-toan-10',
    name: 'SGK Toán 10 - Tập 2 (Kết Nối Tri Thức)',
    category: 'sgk',
    subject: 'Toán học',
    grade: 'Lớp 10',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-05',
    fileSize: '14.8 MB',
    pageCount: 136,
    status: 'indexed',
    rawTextPreview: 'Chương VI: Hàm số và Đồ thị. Bài 15: Hàm số bậc hai y = ax² + bx + c (a ≠ 0). Đỉnh parabol I(-b/2a; -Δ/4a), trục đối xứng x = -b/2a. Bảng biến thiên và các bước khảo sát...',
    chapters: [
      {
        id: 'ch-15',
        chapterNumber: 6,
        chapterTitle: 'Chương VI: Hàm số, Đồ thị và Ứng dụng',
        lessonNumber: '15',
        lessonName: 'Hàm số bậc hai và đồ thị',
        summary: 'Khái niệm hàm số bậc hai, tọa độ đỉnh, trục đối xứng, bảng biến thiên và vẽ đồ thị parabol.',
        keyPoints: [
          'Hàm số bậc hai: y = ax² + bx + c (a ≠ 0)',
          'Đỉnh Parabol: I(-b/2a; -Δ/4a)',
          'Trục đối xứng: đường thẳng x = -b/2a',
          'Bề lõm quay lên khi a > 0, quay xuống khi a < 0'
        ]
      },
      {
        id: 'ch-16',
        chapterNumber: 6,
        chapterTitle: 'Chương VI: Hàm số, Đồ thị và Ứng dụng',
        lessonNumber: '16',
        lessonName: 'Dấu của tam thức bậc hai',
        summary: 'Định lý về dấu tam thức bậc hai, giải bất phương trình bậc hai một ẩn.',
        keyPoints: [
          'Tam thức bậc hai f(x) = ax² + bx + c',
          'Định lý dấu tam thức dựa trên biệt thức Δ',
          'Ứng dụng giải bất phương trình bậc hai f(x) > 0'
        ]
      }
    ]
  },
  {
    id: 'doc-sgv-toan-10',
    name: 'SGV Toán 10 (Sách Giáo Viên Hướng Dẫn Dạy Học)',
    category: 'sgv',
    subject: 'Toán học',
    grade: 'Lớp 10',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-08',
    fileSize: '18.2 MB',
    pageCount: 224,
    status: 'indexed',
    rawTextPreview: 'Gợi ý tiến trình dạy học Bài 15 theo Công văn 5512/BGDĐT-GDTrH. Hoạt động Khởi động: Cho học sinh quan sát chuyển động ném bóng rổ. Hoạt động Khám phá: Hướng dẫn học sinh biến đổi tọa độ đỉnh...',
    chapters: [
      {
        id: 'sgv-ch-15',
        chapterNumber: 6,
        chapterTitle: 'Chương VI: Phương pháp dạy học Hàm số',
        lessonNumber: '15',
        lessonName: 'Gợi ý thiết kế Bài 15 chuẩn 5512',
        summary: 'Kế hoạch sư phạm 4 hoạt động, cách tổ chức thảo luận nhóm và tiêu chí đánh giá năng lực toán học.',
        keyPoints: [
          'Tổ chức 4 hoạt động: Khởi động, Khám phá, Luyện tập, Vận dụng',
          'Phân công 4 bước thực hiện cho từng hoạt động',
          'Dự kiến sai lầm phổ biến của học sinh khi vẽ parabol'
        ]
      }
    ]
  },
  {
    id: 'doc-sbt-toan-10',
    name: 'SBT Toán 10 (Sách Bài Tập Phân Hóa Câu Hỏi)',
    category: 'sbt',
    subject: 'Toán học',
    grade: 'Lớp 10',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-10',
    fileSize: '11.5 MB',
    pageCount: 160,
    status: 'indexed',
    rawTextPreview: 'Tuyển chọn bài tập tự luyện và đánh giá năng lực: 12 câu trắc nghiệm nhiều lựa chọn, câu trắc nghiệm Đúng/Sai 4 ý, bài tập thực tế tính diện tích mảnh vườn...',
    chapters: [
      {
        id: 'sbt-ch-15',
        chapterNumber: 6,
        chapterTitle: 'Chương VI: Bài tập rèn luyện',
        lessonNumber: '15',
        lessonName: 'Bài tập Bài 15: Hàm số bậc hai',
        summary: 'Ngân hàng bài tập 4 mức độ: Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao.',
        keyPoints: [
          'Dạng 1: Xác định tọa độ đỉnh, trục đối xứng và hệ số a, b, c',
          'Dạng 2: Khảo sát sự biến thiên và vẽ đồ thị parabol',
          'Dạng 3: Bài toán thực tế tìm giá trị lớn nhất, nhỏ nhất'
        ]
      }
    ]
  },
  // --- CÁC MÔN HỌC KHỐI THCS CHƯƠNG TRÌNH PHỔ THÔNG 2018 (KẾT NỐI TRI THỨC) ---
  {
    id: 'doc-sgk-khtn-6',
    name: 'SGK Khoa học tự nhiên 6 (Kết Nối Tri Thức)',
    category: 'sgk',
    subject: 'Khoa học tự nhiên',
    grade: 'Lớp 6',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-01',
    fileSize: '19.4 MB',
    pageCount: 204,
    status: 'indexed',
    rawTextPreview: 'Chương trình Khoa học tự nhiên lớp 6 tích hợp các phân môn Vật lí, Hóa học, Sinh học theo chương trình GDPT 2018. Gồm các chủ đề: Các phép đo, Chất và sự biến đổi của chất, Tế bào - Đơn vị cơ sở của sự sống, Lực trong đời sống...',
    chapters: [
      {
        id: 'khtn6-ch-1',
        chapterNumber: 1,
        chapterTitle: 'Chương 1: Mở đầu về Khoa học tự nhiên',
        lessonNumber: '1',
        lessonName: 'Mở đầu về Khoa học tự nhiên',
        summary: 'Khái niệm KHTN, vai trò của KHTN trong cuộc sống, các lĩnh vực chủ yếu và phương pháp nghiên cứu tự nhiên.',
        keyPoints: [
          'Khoa học tự nhiên nghiên cứu các hiện tượng tự nhiên',
          'Vai trò ứng dụng công nghệ và bảo vệ môi trường',
          'Quy định an toàn trong phòng thực hành KHTN'
        ]
      },
      {
        id: 'khtn6-ch-4',
        chapterNumber: 2,
        chapterTitle: 'Chương 2: Các phép đo',
        lessonNumber: '4',
        lessonName: 'Đo chiều dài',
        summary: 'Đơn vị đo chiều dài (m), giới hạn đo (GHĐ), độ chia nhỏ nhất (ĐCNN) và các bước đo bằng thước.',
        keyPoints: [
          'Cách ước lượng chiều dài trước khi đo',
          'Đặt thước và đọc kết quả theo vạch chia chính xác',
          'Thực hành đo chiều dài bàn học và phòng thí nghiệm'
        ]
      },
      {
        id: 'khtn6-ch-12',
        chapterNumber: 5,
        chapterTitle: 'Chương 5: Tế bào – Đơn vị cơ sở của sự sống',
        lessonNumber: '12',
        lessonName: 'Tế bào – Đơn vị cơ sở của sự sống',
        summary: 'Khái niệm tế bào, hình dạng, kích thước hiển vi và vai trò là đơn vị cấu tạo của mọi sinh vật.',
        keyPoints: [
          'Mọi cơ thể sinh vật đều được cấu tạo từ tế bào',
          'Kích thước tế bào rất nhỏ cần kính hiển vi quan sát',
          'Cấu tạo màng tế bào, tế bào chất và nhân'
        ]
      },
      {
        id: 'khtn6-ch-18',
        chapterNumber: 8,
        chapterTitle: 'Chương 8: Lực trong đời sống',
        lessonNumber: '18',
        lessonName: 'Lực và tác dụng của lực',
        summary: 'Khái niệm lực là tác dụng đẩy hoặc kéo, tác dụng làm biến đổi chuyển động hoặc biến dạng vật.',
        keyPoints: [
          'Biểu diễn lực bằng một mũi tên có gốc, hướng và độ dài',
          'Đơn vị đo lực là Newton (N)',
          'Ứng dụng đo lực bằng lực kế lò xo'
        ]
      }
    ]
  },
  {
    id: 'doc-sgk-lsdl-6',
    name: 'SGK Lịch sử và Địa lí 6 (Kết Nối Tri Thức)',
    category: 'sgk',
    subject: 'Lịch sử & Địa lí',
    grade: 'Lớp 6',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-02',
    fileSize: '17.8 MB',
    pageCount: 188,
    status: 'indexed',
    rawTextPreview: 'Chương trình môn Lịch sử và Địa lí lớp 6 cấp THCS: Phần Lịch sử (Từ nguồn gốc loài người đến các quốc gia cổ đại và Nhà nước Văn Lang, Âu Lạc); Phần Địa lí (Hệ thống kinh vĩ tuyến, Bản đồ, Trái Đất và các hiện tượng tự nhiên)...',
    chapters: [
      {
        id: 'lsdl6-ch-1',
        chapterNumber: 1,
        chapterTitle: 'Phần Lịch sử - Chương 1: Vì sao cần học Lịch sử?',
        lessonNumber: '1',
        lessonName: 'Lịch sử và cuộc sống',
        summary: 'Khái niệm lịch sử, đối tượng nghiên cứu và ý nghĩa của việc gìn giữ cội nguồn dân tộc.',
        keyPoints: [
          'Lịch sử là tất cả những gì đã diễn ra trong quá khứ',
          'Các nguồn tư liệu lịch sử: hiện vật, chữ viết, truyền miệng',
          'Học lịch sử để hiểu quá khứ và định hướng tương lai'
        ]
      },
      {
        id: 'lsdl6-ch-14',
        chapterNumber: 4,
        chapterTitle: 'Phần Lịch sử - Chương 4: Đông Nam Á từ thế kỉ tiếp giáp CN đến thế kỉ X',
        lessonNumber: '14',
        lessonName: 'Nhà nước Văn Lang, Âu Lạc',
        summary: 'Sự ra đời của nhà nước Văn Lang thời các vua Hùng, tổ chức bộ máy và đời sống cư dân Đông Sơn.',
        keyPoints: [
          'Kinh đô Phong Châu và thành Cổ Loa',
          'Trống đồng Đông Sơn và đời sống nông nghiệp lúa nước',
          'Truyền thuyết Hùng Vương dựng nước'
        ]
      },
      {
        id: 'lsdl6-ch-geo-1',
        chapterNumber: 1,
        chapterTitle: 'Phần Địa lí - Chương 1: Bản đồ',
        lessonNumber: '1',
        lessonName: 'Hệ thống kinh, vĩ tuyến. Tọa độ địa lí',
        summary: 'Kinh tuyến gốc (Greenwich), vĩ tuyến gốc (Xích đạo) và cách xác định tọa độ địa lí trên bản đồ.',
        keyPoints: [
          'Kinh độ và vĩ độ địa lí',
          'Xác định phương hướng trên bản đồ bằng kim la bàn hoặc kinh tuyến',
          'Thực hành tìm tọa độ một số thành phố'
        ]
      }
    ]
  },
  {
    id: 'doc-sgk-congnghe-6',
    name: 'SGK Công nghệ 6 (Kết Nối Tri Thức)',
    category: 'sgk',
    subject: 'Công nghệ',
    grade: 'Lớp 6',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-03',
    fileSize: '15.2 MB',
    pageCount: 120,
    status: 'indexed',
    rawTextPreview: 'Chương trình Công nghệ 6 THCS: Nhà ở, Bảo quản và chế biến thực phẩm, Trang phục và thời trang, Đồ dùng điện trong gia đình...',
    chapters: [
      {
        id: 'cn6-ch-1',
        chapterNumber: 1,
        chapterTitle: 'Chương 1: Nhà ở',
        lessonNumber: '1',
        lessonName: 'Khái quát về nhà ở',
        summary: 'Vai trò của nhà ở đối với con người, cấu tạo chung và các kiến trúc nhà ở đặc trưng của Việt Nam.',
        keyPoints: [
          'Bảo vệ con người trước các tác động thời tiết',
          'Kiến trúc nhà nông thôn, đô thị và nhà nổi',
          'Sử dụng năng lượng tiết kiệm trong gia đình'
        ]
      },
      {
        id: 'cn6-ch-3',
        chapterNumber: 1,
        chapterTitle: 'Chương 1: Nhà ở',
        lessonNumber: '3',
        lessonName: 'Ngôi nhà thông minh',
        summary: 'Đặc điểm của ngôi nhà thông minh: tiện nghi, tiết kiệm năng lượng, an ninh an toàn với các thiết bị cảm ứng.',
        keyPoints: [
          'Hệ thống điều khiển chiếu sáng, rèm cửa tự động',
          'Camera an ninh và chuông báo động thông minh',
          'Thiết bị cảm biến nhiệt độ và khói'
        ]
      }
    ]
  },
  {
    id: 'doc-sgk-gdcd-6',
    name: 'SGK Giáo dục công dân 6 (Kết Nối Tri Thức)',
    category: 'sgk',
    subject: 'Giáo dục công dân',
    grade: 'Lớp 6',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-04',
    fileSize: '13.6 MB',
    pageCount: 110,
    status: 'indexed',
    rawTextPreview: 'Chương trình Giáo dục công dân lớp 6 THCS: Chuẩn mực đạo đức, Kĩ năng sống phòng chống nguy hiểm, Quyền và nghĩa vụ công dân, Quyền cơ bản của trẻ em...',
    chapters: [
      {
        id: 'gdcd6-ch-1',
        chapterNumber: 1,
        chapterTitle: 'Chủ đề: Tự hào truyền thống',
        lessonNumber: '1',
        lessonName: 'Tự hào về truyền thống gia đình, dòng họ',
        summary: 'Ý nghĩa của việc kế thừa, phát huy truyền thống yêu nước, hiếu học, cần cù lao động và giữ gìn danh dự gia đình.',
        keyPoints: [
          'Nhận biết các giá trị truyền thống tốt đẹp',
          'Hành động cụ thể thể hiện lòng tự hào và trách nhiệm của học sinh',
          'Phát huy truyền thống hiếu học của dân tộc'
        ]
      },
      {
        id: 'gdcd6-ch-7',
        chapterNumber: 5,
        chapterTitle: 'Chủ đề: Kĩ năng sống',
        lessonNumber: '7',
        lessonName: 'Ứng phó với các tình huống nguy hiểm',
        summary: 'Nhận biết tình huống nguy hiểm do con người và thiên tai; cách tự bảo vệ và thoát hiểm an toàn.',
        keyPoints: [
          'Bình tĩnh tìm cách thoát khỏi đám cháy hoặc lũ quét',
          'Ghi nhớ số điện thoại cứu nạn: 111, 113, 114, 115',
          'Kĩ năng tự vệ và tìm sự trợ giúp của người lớn'
        ]
      }
    ]
  },
  {
    id: 'doc-sgk-tinhoc-6',
    name: 'SGK Tin học 6 (Kết Nối Tri Thức)',
    category: 'sgk',
    subject: 'Tin học',
    grade: 'Lớp 6',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-05',
    fileSize: '16.5 MB',
    pageCount: 128,
    status: 'indexed',
    rawTextPreview: 'Chương trình Tin học lớp 6 THCS: Thông tin và dữ liệu, Mạng máy tính và Internet, Tổ chức lưu trữ, Soạn thảo văn bản và Sơ đồ tư duy, Thuật toán và Lập trình trực quan Scratch...',
    chapters: [
      {
        id: 'th6-ch-1',
        chapterNumber: 1,
        chapterTitle: 'Chủ đề 1: Máy tính và cộng đồng',
        lessonNumber: '1',
        lessonName: 'Thông tin và dữ liệu',
        summary: 'Phân biệt thông tin và dữ liệu, quá trình xử lí thông tin trong máy tính điện tử.',
        keyPoints: [
          'Thông tin là những hiểu biết con người thu nhận được',
          'Dữ liệu là thông tin được lưu trữ dưới dạng bit',
          'Đơn vị đo dung lượng thông tin: B, KB, MB, GB'
        ]
      },
      {
        id: 'th6-ch-10',
        chapterNumber: 4,
        chapterTitle: 'Chủ đề 4: Ứng dụng tin học',
        lessonNumber: '10',
        lessonName: 'Sơ đồ tư duy',
        summary: 'Khái niệm Mindmap, cấu trúc phân nhánh và phần mềm vẽ sơ đồ tư duy phục vụ học tập.',
        keyPoints: [
          'Chủ đề trung tâm và các nhánh ý tưởng',
          'Sử dụng hình ảnh và màu sắc kích thích tư duy',
          'Thực hành tóm tắt bài học bằng sơ đồ tư duy'
        ]
      }
    ]
  },
  {
    id: 'doc-sgk-toan-6',
    name: 'SGK Toán 6 - Tập 1 (Kết Nối Tri Thức)',
    category: 'sgk',
    subject: 'Toán học',
    grade: 'Lớp 6',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-06',
    fileSize: '18.1 MB',
    pageCount: 144,
    status: 'indexed',
    rawTextPreview: 'Chương trình Toán 6 Tập 1 KNTT: Tập hợp các số tự nhiên, Phép tính lũy thừa, Tính chia hết và Ước chung lớn nhất, Số nguyên và Phép tính trên tập Z, Hình học trực quan (Tam giác đều, Hình vuông, Lục giác đều)...',
    chapters: [
      {
        id: 'toan6-ch-1',
        chapterNumber: 1,
        chapterTitle: 'Chương I: Tập hợp các số tự nhiên',
        lessonNumber: '1',
        lessonName: 'Tập hợp',
        summary: 'Khái niệm tập hợp, phần tử thuộc (∈) và không thuộc (∉), cách viết tập hợp.',
        keyPoints: [
          'Kí hiệu phần tử và tập hợp hoa A, B, N, N*',
          'Cách viết tập hợp bằng liệt kê hoặc chỉ ra tính chất đặc trưng',
          'Biểu diễn tập hợp bằng sơ đồ Venn'
        ]
      },
      {
        id: 'toan6-ch-12',
        chapterNumber: 1,
        chapterTitle: 'Chương I: Tập hợp các số tự nhiên',
        lessonNumber: '12',
        lessonName: 'Ước chung và Ước chung lớn nhất',
        summary: 'Khái niệm ước chung, ƯCLN và phương pháp tìm ƯCLN bằng phân tích thừa số nguyên tố.',
        keyPoints: [
          'Cách tìm ƯCLN của hai hay nhiều số',
          'Hai số nguyên tố cùng nhau có ƯCLN = 1',
          'Ứng dụng rút gọn phân số về tối giản'
        ]
      }
    ]
  },
  {
    id: 'doc-sgk-nguvan-6',
    name: 'SGK Ngữ văn 6 - Tập 1 (Kết Nối Tri Thức)',
    category: 'sgk',
    subject: 'Ngữ văn',
    grade: 'Lớp 6',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-07',
    fileSize: '17.3 MB',
    pageCount: 152,
    status: 'indexed',
    rawTextPreview: 'Chương trình Ngữ văn 6 Tập 1: Bài 1: Tôi và các bạn; Bài 2: Gõ cửa trái tim; Bài 3: Yêu thương và chia sẻ; Bài 4: Quê hương yêu dấu; Bài 5: Những nẻo đường xứ sở...',
    chapters: [
      {
        id: 'van6-ch-1',
        chapterNumber: 1,
        chapterTitle: 'Bài 1: Tôi và các bạn',
        lessonNumber: '1',
        lessonName: 'Bài học đường đời đầu tiên (Dế Mèn phiêu lưu kí)',
        summary: 'Vẻ đẹp cường tráng của Dế Mèn, trò đùa tai hại với Dế Choắt và bài học đắt giá về sự khiêm tốn, vị tha.',
        keyPoints: [
          'Nghệ thuật miêu tả nhân vật loài vật độc đáo của Tô Hoài',
          'Bài học về lối sống khiêm tốn, biết thương yêu đồng loại',
          'Biện pháp tu từ so sánh và nhân hóa'
        ]
      },
      {
        id: 'van6-ch-3',
        chapterNumber: 3,
        chapterTitle: 'Bài 3: Yêu thương và chia sẻ',
        lessonNumber: '3',
        lessonName: 'Cô bé bán diêm (Andersen)',
        summary: 'Số phận bất hạnh của cô bé bán diêm trong đêm giao thừa giá rét và thông điệp nhân đạo sâu sắc.',
        keyPoints: [
          'Nghệ thuật tương phản đối lập trong truyện cổ tích hiện đại',
          'Lòng trắc ẩn và tình yêu thương con người',
          'Ý nghĩa của những que diêm thắp sáng ước mơ'
        ]
      }
    ]
  },
  {
    id: 'doc-sgk-tienganh-6',
    name: 'SGK Tiếng Anh 6 - Global Success (Kết Nối Tri Thức)',
    category: 'sgk',
    subject: 'Tiếng Anh',
    grade: 'Lớp 6',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-08',
    fileSize: '18.9 MB',
    pageCount: 160,
    status: 'indexed',
    rawTextPreview: 'Bộ sách Tiếng Anh 6 Global Success theo chương trình GDPT 2018: Unit 1: My New School, Unit 2: My House, Unit 3: My Friends, Unit 4: My Neighbourhood...',
    chapters: [
      {
        id: 'eng6-ch-1',
        chapterNumber: 1,
        chapterTitle: 'Unit 1: My New School',
        lessonNumber: '1',
        lessonName: 'Unit 1: My New School (Trường học mới của em)',
        summary: 'Từ vựng chủ đề trường học, đồ dùng học tập; Ngữ pháp thì hiện tại đơn với các động từ thường gặp.',
        keyPoints: [
          'Vocabulary: compass, calculator, uniform, pencil sharpener',
          'Grammar: Present Simple tense and verbs play, do, have, study',
          'Pronunciation: sounds /ɑː/ and /ʌ/'
        ]
      },
      {
        id: 'eng6-ch-2',
        chapterNumber: 2,
        chapterTitle: 'Unit 2: My House',
        lessonNumber: '2',
        lessonName: 'Unit 2: My House (Ngôi nhà của em)',
        summary: 'Từ vựng các phòng, đồ gia dụng; Ngữ pháp giới từ chỉ nơi chốn và sở hữu cách.',
        keyPoints: [
          'Vocabulary: hall, living room, microwave, wardrobe',
          'Grammar: Prepositions of place (in, on, behind, between)',
          'Pronunciation: sounds /s/ and /z/'
        ]
      }
    ]
  },
  {
    id: 'doc-sgk-hdtn-6',
    name: 'SGK Hoạt động trải nghiệm, hướng nghiệp 6 (Kết Nối Tri Thức)',
    category: 'sgk',
    subject: 'Hoạt động trải nghiệm, hướng nghiệp',
    grade: 'Lớp 6',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-09',
    fileSize: '14.1 MB',
    pageCount: 96,
    status: 'indexed',
    rawTextPreview: 'Chương trình Hoạt động trải nghiệm, hướng nghiệp 6 KNTT: Khám phá bản thân, Thích ứng với môi trường THCS, Trách nhiệm với bản thân và gia đình, Tìm hiểu thế giới nghề nghiệp...',
    chapters: [
      {
        id: 'hdtn6-ch-1',
        chapterNumber: 1,
        chapterTitle: 'Chủ đề 1: Khám phá lứa tuổi và môi trường mới',
        lessonNumber: '1',
        lessonName: 'Thích ứng với môi trường học tập THCS',
        summary: 'Làm quen với thầy cô bộ môn, phương pháp tự học và thời khóa biểu cấp Trung học cơ sở.',
        keyPoints: [
          'Rèn luyện kĩ năng ghi chép và tự quản lí thời gian',
          'Xây dựng tình bạn trong sáng, đoàn kết tập thể lớp',
          'Kĩ năng lắng nghe và tương tác tích cực với thầy cô'
        ]
      },
      {
        id: 'hdtn6-ch-2',
        chapterNumber: 2,
        chapterTitle: 'Chủ đề 2: Khám phá bản thân',
        lessonNumber: '2',
        lessonName: 'Nhận diện điểm mạnh và điểm cần hoàn thiện',
        summary: 'Tự đánh giá sở thích, năng khiếu cá nhân và lập kế hoạch rèn luyện thói quen tích cực mỗi ngày.',
        keyPoints: [
          'Tự tin thể hiện năng khiếu trước tập thể',
          'Biết nhận lỗi và sửa chữa hạn chế của bản thân',
          'Lập bảng theo dõi thói quen học tập tốt'
        ]
      }
    ]
  }
];

export const DEFAULT_SAVED_PROJECTS: SavedCloudProject[] = [
  {
    id: 'proj-khbd-15',
    title: 'KHBD 5512 - Bài 15: Hàm số bậc hai và đồ thị',
    type: 'khbd',
    subject: 'Toán học',
    grade: 'Lớp 10',
    curriculum: 'Kết nối tri thức với cuộc sống',
    savedAt: '2025-10-02 14:30',
    fileSize: '185 KB',
    sourceDocName: 'SGK Toán 10 & SGV Toán 10',
    teacherName: 'Hồ Minh Luân',
    cloudSyncStatus: 'synced',
    downloadFormats: ['word', 'pdf', 'json']
  },
  {
    id: 'proj-slides-15',
    title: 'Slide Bài Giảng 16:9 - Bài 15: Hàm số bậc hai',
    type: 'slides',
    subject: 'Toán học',
    grade: 'Lớp 10',
    curriculum: 'Kết nối tri thức với cuộc sống',
    savedAt: '2025-10-02 15:15',
    fileSize: '420 KB',
    sourceDocName: 'SGV Toán 10',
    teacherName: 'Hồ Minh Luân',
    cloudSyncStatus: 'synced',
    downloadFormats: ['pptx', 'pdf', 'json']
  },
  {
    id: 'proj-exam-7991',
    title: 'Đề Kiểm Tra Định Kì 45p - Chuẩn Công văn 7991',
    type: 'exam',
    subject: 'Toán học',
    grade: 'Lớp 10',
    curriculum: 'Kết nối tri thức với cuộc sống',
    savedAt: '2025-10-02 16:00',
    fileSize: '290 KB',
    sourceDocName: 'SBT Toán 10',
    teacherName: 'Hồ Minh Luân',
    cloudSyncStatus: 'synced',
    downloadFormats: ['word', 'pdf', 'json']
  }
];

export const SAMPLE_MATH_10: WorkspaceState = {
  version: '2025.1-CV7991-5512',
  timestamp: new Date().toISOString(),
  activeTab: 'library', // Mặc định mở Kho Học Liệu Số trước để tải/chọn sách
  teacherProfile: DEFAULT_TEACHER_PROFILE,
  uploadedDocuments: DEFAULT_UPLOADED_DOCUMENTS,
  savedProjects: DEFAULT_SAVED_PROJECTS,
  lessonPlan: {
    schoolName: DEFAULT_TEACHER_PROFILE.school,
    department: DEFAULT_TEACHER_PROFILE.department,
    teacherName: DEFAULT_TEACHER_PROFILE.name,
    subject: 'Toán học',
    grade: 'Lớp 10',
    curriculum: 'Kết nối tri thức với cuộc sống',
    lessonName: 'BÀI 15: HÀM SỐ BẬC HAI VÀ ĐỒ THỊ',
    durationInPeriods: 2,
    academicYear: DEFAULT_TEACHER_PROFILE.academicYear,
    appendixTitle: 'Phụ lục I: KHUNG KẾ HOẠCH BÀI DẠY (Kèm theo Công văn số 5512/BGDĐT-GDTrH)',

    objectives: {
      knowledge: [
        'Nhận biết được hàm số bậc hai y = ax² + bx + c (a ≠ 0), tập xác định, đỉnh parabol, trục đối xứng.',
        'Thiết lập được bảng biến thiên và vẽ thành thạo đồ thị hàm số bậc hai trong mặt phẳng toạ độ Oxy.',
        'Vận dụng tính chất hàm số bậc hai để giải quyết bài toán cực trị trong thực tế (quỹ đạo chuyển động parabol, tối ưu hoá diện tích, chi phí sản xuất).'
      ],
      competencies: {
        general: [
          'Năng lực tự chủ và tự học: Tự giác tìm hiểu tài liệu trước giờ học, chủ động vẽ phác đồ thị và nhận xét hình dạng parabol.',
          'Năng lực giao tiếp và hợp tác: Tương tác nhóm 4 học sinh để phân tích bài toán thực tế quỹ đạo bắn bóng rổ và cổng vòm Parabol St. Louis.',
          'Năng lực giải quyết vấn đề và sáng tạo: Khái quát hóa được dấu của hệ số a với bề lõm của parabol và toạ độ đỉnh I(-b/(2a); -Δ/(4a)).'
        ],
        specific: [
          'Năng lực tư duy và lập luận toán học: Lập luận chặt chẽ khoảng đồng biến, nghịch biến thông qua quan sát đồ thị và bảng biến thiên.',
          'Năng lực mô hình hoá toán học: Chuyển đổi bài toán thực tế cây cầu dây võng parabol thành phương trình toán học để tính chiều cao thanh đỡ.'
        ]
      },
      qualities: [
        'Chăm chỉ: Tích cực hoàn thành phiếu học tập cá nhân và nhiệm vụ thực hành vẽ đồ thị.',
        'Trung thực: Khách quan trong việc tự đánh giá và đánh giá chéo sản phẩm của các nhóm bạn.',
        'Trách nhiệm: Có ý thức hợp tác nghiêm túc khi thảo luận nhóm và chuẩn bị học liệu số.'
      ]
    },

    equipments: {
      teacher: [
        'Kế hoạch bài dạy chuẩn CV 5512, máy chiếu, laptop kết nối Internet.',
        'Học liệu số: Phần mềm GeoGebra trực quan hoá đồ thị parabol tương tác khi thay đổi tham số a, b, c.',
        'Phiếu học tập số 1 (Khám phá toạ độ đỉnh), Phiếu học tập số 2 (Bảng biến thiên và vẽ đồ thị).'
      ],
      students: [
        'Sách giáo khoa Toán 10 (Bộ Kết nối tri thức với cuộc sống), vở ghi, thước kẻ parabol kẻ toạ độ.',
        'Điện thoại thông minh/máy tính bảng (mỗi bàn 1 thiết bị) truy cập ứng dụng GeoGebra theo điều phối của GV.'
      ]
    },

    activities: [
      {
        id: 'act-1',
        code: 'ACT_1',
        title: 'Hoạt động 1: Xác định vấn đề / Khởi động (Mở đầu)',
        duration: '10 phút',
        goal: 'Tạo tâm thế hứng thú, kết nối kiến thức thực tế (quỹ đạo bay của quả bóng rổ, cổng vòm cầu Parabol) với hàm số bậc hai y = ax² + bx + c (a ≠ 0).',
        content: 'Học sinh quan sát video clip ngắn về cú ném 3 điểm trong bóng rổ và hình ảnh cổng vòm St. Louis. Trả lời câu hỏi: Quỹ đạo của quả bóng có dạng đường cong gì? Liệu đường cong đó có phương trình như thế nào?',
        product: 'Câu trả lời của học sinh: Quỹ đạo là đường cong parabol uốn cong xuống dưới; đỉnh bóng đạt độ cao lớn nhất tại điểm chính giữa.',
        implementation: {
          step1_assign: 'Giáo viên trình chiếu video clip và phát Phiếu khởi động: "Hãy dự đoán dạng hình học quỹ đạo quả bóng và nêu yếu tố quyết định độ cao lớn nhất của quả bóng". Chia lớp thành các cặp đôi.',
          step2_execute: 'Học sinh quan sát, thảo luận cặp đôi trong 3 phút, ghi nhận xét nhanh vào góc học tập cá nhân. Giáo viên quan sát, khích lệ các em liên hệ với đồ thị hàm số y = ax² đã học ở lớp 9.',
          step3_report: 'Đại diện 2 cặp đôi phát biểu ý kiến. Các học sinh khác nhận xét, bổ sung: "Đường cong có một điểm cao nhất rồi rơi xuống mặt đất, giống parabol úp ngược".',
          step4_conclude: 'Giáo viên nhận xét tinh thần thảo luận, chuẩn hoá: Đường cong này chính là parabol - đồ thị của hàm số bậc hai tổng quát y = ax² + bx + c (a ≠ 0). Dẫn dắt vào bài mới.'
        },
        studentNotes: '* TÌNH HUỐNG THỰC TIỄN MỞ ĐẦU:\n- Quỹ đạo của quả bóng rổ khi ném vào rổ, cổng vòm Gateway Arch (St. Louis), tia nước phun từ vòi nước đều có dạng đường cong parabol uốn cong.\n- Câu hỏi đặt ra: Mối quan hệ toán học giữa đường cong parabol với phương trình hàm số đại số y = ax² + bx + c (a ≠ 0) là gì?',
        illustrations: [
          {
            id: 'ill-default-1',
            caption: 'Hình 1: Cổng vòm Gateway Arch (St. Louis) dạng Parabol trong thực tế',
            url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
            description: 'Hình ảnh thực tế minh họa kiến trúc vòm parabol chịu lực tối ưu.',
            type: 'photo',
            source: 'SGK Toán 10 KNTT - Trang 39'
          }
        ]
      },
      {
        id: 'act-2',
        code: 'ACT_2',
        title: 'Hoạt động 2: Hình thành kiến thức mới (Khám phá)',
        duration: '35 phút',
        goal: 'Học sinh nắm vững định nghĩa hàm số bậc hai; xác định được toạ độ đỉnh I(-b/(2a); -Δ/(4a)), trục đối xứng x = -b/(2a); lập được bảng biến thiên khi a > 0 và a < 0.',
        content: 'Nhiệm vụ 1: Nhận diện hàm số bậc hai trong các công thức cho trước. Nhiệm vụ 2: Sử dụng công cụ GeoGebra trên máy chiếu, điều khiển thanh trượt các hệ số a, b, c để rút ra nhận xét toạ độ đỉnh, trục đối xứng và hướng bề lõm.',
        product: 'Bảng tổng hợp kiến thức trên vở ghi và bảng phụ nhóm: Đỉnh I, trục đối xứng x = -b/(2a), bảng biến thiên đầy đủ cho 2 trường hợp a > 0 (bề lõm quay lên) và a < 0 (bề lõm quay xuống).',
        implementation: {
          step1_assign: 'GV chia lớp thành 4 nhóm chuyên sâu. Giao Phiếu học tập số 1 yêu cầu hoàn thành phép biến đổi hoàn thành bình phương: y = a[x + b/(2a)]² - Δ/(4a), từ đó chỉ ra giá trị lớn nhất/nhỏ nhất và toạ độ điểm cực trị.',
          step2_execute: 'Các nhóm thực hiện tính toán biến đổi đại số; phân công 1 thành viên quan sát mô phỏng GeoGebra trực tuyến để đối chiếu tọa độ đỉnh thực nghiệm với công thức lý thuyết.',
          step3_report: 'Nhóm 1 và Nhóm 3 dán kết quả lên bảng, cử đại diện thuyết minh về trục đối xứng x = -b/(2a) và toạ độ đỉnh. Nhóm 2 và Nhóm 4 đặt câu hỏi phản biện về trường hợp hệ số a < 0.',
          step4_conclude: 'GV chốt kiến thức chuẩn mực: Định lý về tọa độ đỉnh Parabol, trục đối xứng và vẽ sơ đồ bảng biến thiên chuẩn. Học sinh ghi chép vào vở các công thức then chốt.'
        },
        studentNotes: 'I. KIẾN THỨC CỐT LÕI (HỌC SINH GHI VÀO VỞ / BẢNG GHI):\n1. Định nghĩa hàm số bậc hai:\n- Hàm số bậc hai là hàm số được cho bằng công thức: y = ax² + bx + c (trong đó x là biến số; a, b, c là các hằng số với a ≠ 0).\n- Tập xác định: D = ℝ.\n\n2. Đồ thị hàm số bậc hai (Parabol):\n- Tọa độ đỉnh Parabol: I(-b / (2a); -Δ / (4a)) với biệt thức Δ = b² - 4ac.\n- Trục đối xứng: Đường thẳng x = -b / (2a) đi qua đỉnh I và song song với trục Oy.\n- Hướng bề lõm: Quay lên trên khi a > 0; quay xuống dưới khi a < 0.\n\n3. Bảng biến thiên:\n* Khi a > 0: Hàm số nghịch biến trên (-∞; -b/(2a)), đồng biến trên (-b/(2a); +∞). Giá trị nhỏ nhất là y_min = -Δ/(4a) tại x = -b/(2a).\n* Khi a < 0: Hàm số đồng biến trên (-∞; -b/(2a)), nghịch biến trên (-b/(2a); +∞). Giá trị lớn nhất là y_max = -Δ/(4a) tại x = -b/(2a).\n\n4. Quy trình 4 bước vẽ đồ thị parabol (P):\n- Bước 1: Xác định tọa độ đỉnh I(-b/(2a); -Δ/(4a)).\n- Bước 2: Vẽ trục đối xứng x = -b/(2a).\n- Bước 3: Tìm giao điểm của (P) với trục Oy (điểm (0; c)) và trục Ox (nếu có).\n- Bước 4: Lấy thêm điểm phụ đối xứng qua trục x = -b/(2a) và nối nét cong đều.',
        illustrations: [
          {
            id: 'ill-default-2',
            caption: 'Hình 2: Sơ đồ khảo sát đồ thị Parabol và Bảng biến thiên (a > 0 và a < 0)',
            url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
            description: 'Trục đối xứng x = -b/2a và tọa độ đỉnh I của Parabol theo chuẩn SGK Kết Nối Tri Thức.',
            type: 'diagram',
            source: 'SGK Toán 10 KNTT - Trang 41'
          }
        ]
      },
      {
        id: 'act-3',
        code: 'ACT_3',
        title: 'Hoạt động 3: Luyện tập (Củng cố kĩ năng)',
        duration: '25 phút',
        goal: 'Rèn luyện kĩ năng xác định tọa độ đỉnh, trục đối xứng, vẽ nhanh đồ thị hàm số bậc hai và lập bảng biến thiên với các hàm số cụ thể.',
        content: 'Bài tập 1: Khảo sát sự biến thiên và vẽ đồ thị hàm số (P): y = x² - 4x + 3. Bài tập 2: Xác định parabol y = ax² + bx + 2 biết parabol đi qua điểm A(1; 0) và có trục đối xứng x = 2.',
        product: 'Bài làm chi tiết trong vở học sinh: Đỉnh I(2; -1), trục đối xứng x = 2, các giao điểm với trục toạ độ (0; 3), (1; 0), (3; 0); hình vẽ đồ thị parabol chính xác, thẩm mỹ.',
        implementation: {
          step1_assign: 'GV trình chiếu đề bài luyện tập, yêu cầu học sinh thực hiện cá nhân trong 7 phút đầu, sau đó trao đổi chéo bài làm với bạn cùng bàn để chấm chéo theo barem tiêu chí.',
          step2_execute: 'Học sinh độc lập làm bài, kẻ hệ trục toạ độ và xác định 5 điểm đặc biệt. GV đi quanh lớp bao quát, hỗ trợ học sinh còn lúng túng trong việc tìm giao điểm với trục Ox, Oy.',
          step3_report: 'Gọi 2 học sinh lên bảng trình bày 2 bài tập. Lớp trưởng điều hành lấy ý kiến nhận xét của các bạn dưới lớp về độ chính xác của các điểm đặc biệt và tính đối xứng của nét vẽ.',
          step4_conclude: 'GV chỉnh sửa lỗi sai hay gặp (quên vẽ trục đối xứng nét đứt, nhầm dấu toạ độ đỉnh), khen ngợi những bài làm vẽ đúng tỉ lệ và chuyển nét cong mượt mà.'
        },
        studentNotes: 'II. BÀI TẬP VÀ PHƯƠNG PHÁP GIẢI (HỌC SINH CHÉP LỜI GIẢI MẪU):\n* Lời giải mẫu Bài 1: Khảo sát và vẽ (P): y = x² - 4x + 3\n- Hệ số: a = 1 > 0, b = -4, c = 3. Biệt thức Δ = (-4)² - 4.1.3 = 4.\n- Tọa độ đỉnh: I(2; -1).\n- Trục đối xứng: Đường thẳng x = 2.\n- Bề lõm quay lên trên.\n- Các điểm đặc biệt:\n  + Giao với Oy tại (0; 3).\n  + Giao với Ox: x² - 4x + 3 = 0 ⇔ x = 1 hoặc x = 3 => (1; 0) và (3; 0).\n  + Điểm đối xứng với (0; 3) qua x = 2 là điểm (4; 3).',
        illustrations: [
          {
            id: 'ill-default-3',
            caption: 'Hình 3: Đồ thị hàm số y = x² - 4x + 3 trên mặt phẳng toạ độ Oxy',
            url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
            description: 'Đồ thị Parabol đi qua 5 điểm đặc biệt và có đỉnh I(2; -1).',
            type: 'diagram',
            source: 'SGK Toán 10 KNTT - Bài tập 6.8'
          }
        ]
      },
      {
        id: 'act-4',
        code: 'ACT_4',
        title: 'Hoạt động 4: Vận dụng (Gắn với thực tiễn)',
        duration: '20 phút',
        goal: 'Vận dụng hàm số bậc hai để mô hình hóa và giải quyết bài toán thực tế về bài toán tối ưu diện tích khu vườn hình chữ nhật có chu vi cố định.',
        content: 'Bài toán thực tế: Một người nông dân có 40 mét lưới thép muốn rào một mảnh vườn hình chữ nhật tiếp giáp với bờ tường thẳng (không cần rào phía bờ tường). Hãy tìm kích thước để diện tích khu vườn đạt lớn nhất.',
        product: 'Mô hình hóa toán học: Đặt chiều rộng là x (m), chiều dài là 40 - 2x (m) với 0 < x < 20. Diện tích S(x) = x(40 - 2x) = -2x² + 40x. Tìm đỉnh Parabol ta được x = 10 (m), chiều dài 20 (m), diện tích cực đại S_max = 200 m².',
        implementation: {
          step1_assign: 'GV giao nhiệm vụ dự án mini: "Kĩ sư nông nghiệp trẻ". Trình chiếu sơ đồ khu đất giáp bờ tường và phát phiếu bài tập vận dụng.',
          step2_execute: 'Học sinh thảo luận theo nhóm 4, phân tích ẩn số, thiết lập hàm số bậc hai biểu thị diện tích theo một kích thước và xác định điều kiện xác định của ẩn.',
          step3_report: 'Đại diện nhóm 4 trình bày cách đặt ẩn và lời giải tìm giá trị lớn nhất dựa vào tọa độ đỉnh I(10; 200). Các nhóm khác phản biện phương án đặt ẩn khác.',
          step4_conclude: 'GV đánh giá năng lực mô hình hóa của cả lớp; dặn dò nhiệm vụ về nhà: Tìm hiểu thêm ứng dụng parabol của gương cầu phản xạ và ăng-ten vệ tinh parabol.'
        },
        studentNotes: 'III. VẬN DỤNG THỰC TIỄN VÀ HƯỚNG DẪN TỰ HỌC:\n* Bài toán cực trị thực tiễn:\n- Hàm diện tích khu vườn: S(x) = -2x² + 40x (với 0 < x < 20).\n- Vì hệ số a = -2 < 0 nên parabol đạt giá trị lớn nhất tại đỉnh: x = -b/(2a) = -40 / (2.(-2)) = 10 (m).\n- Chiều dài mảnh vườn là: 40 - 2.(10) = 20 (m).\n- Diện tích lớn nhất đạt được: S_max = S(10) = 200 (m²).\n- Kết luận: Để diện tích lớn nhất, người nông dân cần rào mảnh đất có kích thước 10 m × 20 m.'
      }
    ],
    boardPlanSummary: {
      title: 'NỘI DUNG GHI BẢNG / VỞ GHI CỐT LÕI CỦA HỌC SINH - BÀI 15: HÀM SỐ BẬC HAI VÀ ĐỒ THỊ',
      sections: [
        {
          heading: '1. Định nghĩa hàm số bậc hai',
          content: 'y = ax² + bx + c (a ≠ 0). Tập xác định D = ℝ.',
          bulletPoints: [
            'Hệ số a, b, c là các số thực, a bắt buộc khác 0.',
            'Khi b = 0, c = 0 ta nhận lại hàm số y = ax² đã học ở lớp 9.'
          ]
        },
        {
          heading: '2. Đồ thị và Bảng biến thiên',
          content: 'Đồ thị là đường cong parabol có đỉnh I(-b/(2a); -Δ/(4a)), trục đối xứng x = -b/(2a).',
          bulletPoints: [
            'a > 0: Bề lõm quay lên, hàm số đạt giá trị nhỏ nhất tại đỉnh I.',
            'a < 0: Bề lõm quay xuống, hàm số đạt giá trị lớn nhất tại đỉnh I.',
            'Trục đối xứng đi qua đỉnh I và song song với trục Oy.'
          ]
        },
        {
          heading: '3. Quy trình 4 bước vẽ parabol',
          content: 'Xác định đỉnh I -> Vẽ trục đối xứng -> Tìm các giao điểm đặc biệt -> Nối đường cong mượt mà.',
          bulletPoints: [
            'Giao với Oy: (0; c). Giao với Ox: nghiệm phương trình ax² + bx + c = 0.',
            'Lấy ít nhất 5 điểm đối xứng để đường vẽ cân đối và chính xác.'
          ]
        },
        {
          heading: '4. Vận dụng thực tiễn',
          content: 'Ứng dụng tìm giá trị lớn nhất, nhỏ nhất của hàm số bậc hai trong đời sống và kỹ thuật (quỹ đạo chuyển động, tối ưu hóa kích thước).',
          bulletPoints: [
            'Công thức tọa độ đỉnh giúp tìm cực trị nhanh chóng không cần đạo hàm.'
          ]
        }
      ]
    }
  },

  slides: {
    title: 'HÀM SỐ BẬC HAI VÀ ĐỒ THỊ (TOÁN 10)',
    author: 'Tổ Toán - Tin học | THPT Chuyên Nguyễn Huệ',
    slides: [
      {
        id: 'sl-1',
        activityCode: 'INTRO',
        stageLabel: 'Mở đầu',
        title: 'BÀI 15: HÀM SỐ BẬC HAI VÀ ĐỒ THỊ',
        subtitle: 'Chương trình GDPT 2018 · Bộ sách Kết nối tri thức với cuộc sống',
        bulletPoints: [
          'Thời lượng: 2 tiết học (90 phút)',
          'Chuẩn năng lực: Mô hình hoá toán học & Tư duy lập luận',
          'Tích hợp công nghệ học liệu số: GeoGebra & Quần thể đồ thị'
        ],
        calloutBox: {
          title: 'Thông điệp mở đầu',
          text: 'Toán học không nằm ngoài cuộc sống: Từ vòm cầu St. Louis đến đường bay của quả bóng rổ, tất cả đều tuân theo quỹ đạo Parabol!',
          type: 'info'
        },
        speakerNotes: 'Giới thiệu mục tiêu bài học ngắn gọn trong 1 phút, ổn định trật tự lớp.'
      },
      {
        id: 'sl-2',
        activityCode: 'ACT_1',
        stageLabel: 'Khởi động',
        title: 'KHỞI ĐỘNG: ĐƯỜNG CONG KỲ DIỆU',
        subtitle: 'Khám phá chuyển động thực tế xung quanh chúng ta',
        bulletPoints: [
          'Hình ảnh cú ném 3 điểm trong bóng rổ: Quả bóng bay lên đạt đỉnh rồi hạ dần vào rổ.',
          'Cổng vòm Gateway Arch tại Mỹ: Thiết kế chịu lực tối ưu dạng Parabol.',
          'Câu hỏi thảo luận: Điểm chung về hình dáng quỹ đạo của các hiện tượng trên là gì?'
        ],
        calloutBox: {
          title: 'Câu hỏi gợi mở',
          text: 'Nếu gắn hệ trục toạ độ Oxy vào chân cổng vòm, phương trình đại số của đường cong này sẽ có dạng như thế nào?',
          type: 'key-concept'
        },
        speakerNotes: 'Cho học sinh xem hình minh hoạ, khơi gợi ký ức hàm số y = ax² ở lớp 9.'
      },
      {
        id: 'sl-3',
        activityCode: 'ACT_2',
        stageLabel: 'Hình thành kiến thức',
        title: 'I. ĐỊNH NGHĨA HÀM SỐ BẬC HAI',
        subtitle: 'Tổng quát hoá cấu trúc đại số',
        bulletPoints: [
          'Định nghĩa: Hàm số bậc hai là hàm số được cho bởi công thức y = ax² + bx + c (a ≠ 0).',
          'Tập xác định của hàm số: D = ℝ.',
          'Ví dụ: y = 2x² - 3x + 1 là hàm số bậc hai với a = 2, b = -3, c = 1.'
        ],
        formulaOrCode: 'y = a x² + b x + c  (a ≠ 0)',
        calloutBox: {
          title: 'Lưu ý sư phạm',
          text: 'Điều kiện a ≠ 0 là bắt buộc. Nếu a = 0 thì hàm số trở thành hàm số bậc nhất y = bx + c.',
          type: 'warning'
        },
        speakerNotes: 'Nhấn mạnh điều kiện hệ số a khác 0.'
      },
      {
        id: 'sl-4',
        activityCode: 'ACT_2',
        stageLabel: 'Hình thành kiến thức',
        title: 'II. ĐỒ THỊ VÀ TOẠ ĐỘ ĐỈNH PARABOL',
        subtitle: 'Trục đối xứng và hướng bề lõm',
        bulletPoints: [
          'Đồ thị là một đường Parabol có đỉnh I(-b/(2a); -Δ/(4a)).',
          'Trục đối xứng là đường thẳng vuông góc với trục Ox: x = -b/(2a).',
          'Bề lõm: Quay lên trên khi a > 0 (đỉnh I là điểm thấp nhất); quay xuống dưới khi a < 0 (đỉnh I là điểm cao nhất).'
        ],
        formulaOrCode: 'I(-b / (2a); -Δ / (4a)),  với Δ = b² - 4ac',
        speakerNotes: 'Sử dụng phần mềm GeoGebra chiếu màn hình, trượt thử tham số a > 0 và a < 0 cho học sinh thấy bề lõm lật ngược.'
      },
      {
        id: 'sl-5',
        activityCode: 'ACT_2',
        stageLabel: 'Hình thành kiến thức',
        title: 'BẢNG BIẾN THIÊN HÀM SỐ BẬC HAI',
        subtitle: 'Quy luật đồng biến và nghịch biến',
        bulletPoints: [
          'Khi a > 0: Hàm số nghịch biến trên (-∞; -b/(2a)) và đồng biến trên (-b/(2a); +∞). Giá trị nhỏ nhất là y_min = -Δ/(4a).',
          'Khi a < 0: Hàm số đồng biến trên (-∞; -b/(2a)) và nghịch biến trên (-b/(2a); +∞). Giá trị lớn nhất là y_max = -Δ/(4a).'
        ],
        calloutBox: {
          title: 'Mẹo ghi nhớ nhanh',
          text: '"a dương ngửa mặt lên trời (hình chữ U) - a âm cúi mặt xuống đất (hình chữ ∩)"',
          type: 'key-concept'
        },
        interactiveQuestion: {
          question: 'Hàm số y = -x² + 4x - 3 đồng biến trên khoảng nào sau đây?',
          options: ['A. (-∞; 2)', 'B. (2; +∞)', 'C. (-∞; -2)', 'D. (1; 3)'],
          correctIndex: 0,
          explanation: 'Vì a = -1 < 0 và -b/(2a) = -4 / [2(-1)] = 2, nên hàm số đồng biến trên khoảng (-∞; 2).'
        },
        speakerNotes: 'Tổ chức cho cả lớp bấm chọn câu hỏi trắc nghiệm tương tác ngay trên slide.'
      },
      {
        id: 'sl-6',
        activityCode: 'ACT_3',
        stageLabel: 'Luyện tập',
        title: 'III. CÁC BƯỚC VẼ ĐỒ THỊ PARABOL',
        subtitle: 'Quy trình 5 điểm chuẩn hoá',
        bulletPoints: [
          'Bước 1: Xác định tọa độ đỉnh I(-b/(2a); -Δ/(4a)).',
          'Bước 2: Vẽ trục đối xứng x = -b/(2a) (nét đứt mờ).',
          'Bước 3: Tìm giao điểm với trục Oy là (0; c) và điểm đối xứng qua trục.',
          'Bước 4: Tìm giao điểm với trục Ox (nếu có, bằng giải phương trình ax² + bx + c = 0).',
          'Bước 5: Nối các điểm bằng đường cong parabol trơn mượt đối xứng.'
        ],
        speakerNotes: 'Học sinh làm theo mẫu vào vở ghi chép.'
      },
      {
        id: 'sl-7',
        activityCode: 'ACT_4',
        stageLabel: 'Vận dụng',
        title: 'IV. BÀI TOÁN TỐI ƯU THỰC TẾ',
        subtitle: 'Ứng dụng tìm giá trị lớn nhất / nhỏ nhất',
        bulletPoints: [
          'Đề bài: Rào khu vườn HCN có 3 mặt bằng 40m lưới thép giáp bờ tường.',
          'Hàm diện tích: S(x) = x(40 - 2x) = -2x² + 40x với 0 < x < 20.',
          'Phân tích: Hệ số a = -2 < 0 nên Parabol đạt cực đại tại đỉnh x = -b/(2a) = -40 / [2(-2)] = 10m.',
          'Kết luận: Chiều rộng 10m, chiều dài 20m. Diện tích tối đa đạt 200 m².'
        ],
        calloutBox: {
          title: 'Năng lực mô hình hoá',
          text: 'Chuyển đổi bài toán lời văn thực tế -> Biểu thức toán học -> Khảo sát đỉnh Parabol -> Kết luận thực tế.',
          type: 'info'
        },
        speakerNotes: 'Gọi một học sinh nhắc lại các bước mô hình hóa.'
      },
      {
        id: 'sl-8',
        activityCode: 'ACT_4',
        stageLabel: 'Tổng kết',
        title: 'TỔNG KẾT VÀ NHIỆM VỤ VỀ NHÀ',
        subtitle: 'Khắc sâu kiến thức trọng tâm',
        bulletPoints: [
          'Nắm vững 3 từ khoá: Đỉnh Parabol, Trục đối xứng, Hướng bề lõm.',
          'Hoàn thành bài tập SGK trang 67 - 68.',
          'Chuẩn bị cho bài kiểm tra định kì theo định dạng chuẩn CV 7991 mới nhất!'
        ],
        speakerNotes: 'Nhắc học sinh xem lại bài và dặn dò lịch kiểm tra.'
      }
    ]
  },

  matrixRows: [
    {
      id: 'mat-1',
      chapter: 'Chương III: Hàm số và đồ thị',
      unit: '1. Khái niệm hàm số và đồ thị',
      tnkq_nhieuLuaChon: { biet: 2, hieu: 1, vanDung: 0 },
      tnkq_dungSai: { biet: 0, hieu: 0, vanDung: 0 },
      tnkq_traLoiNgan: { biet: 0, hieu: 1, vanDung: 0 },
      tuLuan: { biet: 0, hieu: 0, vanDung: 0 }
    },
    {
      id: 'mat-2',
      chapter: 'Chương III: Hàm số và đồ thị',
      unit: '2. Hàm số bậc hai, tọa độ đỉnh và bảng biến thiên',
      tnkq_nhieuLuaChon: { biet: 4, hieu: 2, vanDung: 0 },
      tnkq_dungSai: { biet: 1, hieu: 1, vanDung: 0 }, // 1 câu đúng sai gồm 4 ý
      tnkq_traLoiNgan: { biet: 0, hieu: 1, vanDung: 1 },
      tuLuan: { biet: 0, hieu: 1, vanDung: 0 }
    },
    {
      id: 'mat-3',
      chapter: 'Chương III: Hàm số và đồ thị',
      unit: '3. Ứng dụng thực tế của hàm số bậc hai (Tối ưu hóa)',
      tnkq_nhieuLuaChon: { biet: 2, hieu: 1, vanDung: 0 },
      tnkq_dungSai: { biet: 0, hieu: 1, vanDung: 1 }, // 1 câu đúng sai gồm 4 ý
      tnkq_traLoiNgan: { biet: 0, hieu: 0, vanDung: 1 },
      tuLuan: { biet: 0, hieu: 0, vanDung: 1 }
    }
  ],

  specRows: [
    {
      id: 'spec-1',
      chapter: 'Chương III: Hàm số và đồ thị',
      unit: '1. Khái niệm hàm số và đồ thị',
      learningOutcomes: {
        biet: ['Nhận biết được định nghĩa hàm số, tập xác định, đồ thị hàm số.'],
        hieu: ['Tìm được tập xác định của các hàm số phân thức, hàm chứa căn thức đơn giản.'],
        vanDung: ['Giải quyết bài toán tương giao đồ thị ở mức độ đơn giản.']
      },
      numberOfQuestions: {
        tnkq_nhieuLuaChon: { biet: 2, hieu: 1, vanDung: 0 },
        tnkq_dungSai: { biet: 0, hieu: 0, vanDung: 0 },
        tnkq_traLoiNgan: { biet: 0, hieu: 1, vanDung: 0 },
        tuLuan: { biet: 0, hieu: 0, vanDung: 0 }
      }
    },
    {
      id: 'spec-2',
      chapter: 'Chương III: Hàm số và đồ thị',
      unit: '2. Hàm số bậc hai, tọa độ đỉnh và bảng biến thiên',
      learningOutcomes: {
        biet: [
          'Nhận biết được hàm số bậc hai, hệ số a, b, c.',
          'Nhớ công thức toạ độ đỉnh I(-b/(2a); -Δ/(4a)) và phương trình trục đối xứng x = -b/(2a).'
        ],
        hieu: [
          'Lập được bảng biến thiên của hàm số bậc hai khi a > 0 và a < 0.',
          'Xác định được parabol đi qua các điểm cho trước hoặc có đỉnh cho trước.'
        ],
        vanDung: [
          'Vẽ thành thạo đồ thị parabol và tìm tọa độ giao điểm với đường thẳng y = kx + m.'
        ]
      },
      numberOfQuestions: {
        tnkq_nhieuLuaChon: { biet: 4, hieu: 2, vanDung: 0 },
        tnkq_dungSai: { biet: 1, hieu: 1, vanDung: 0 },
        tnkq_traLoiNgan: { biet: 0, hieu: 1, vanDung: 1 },
        tuLuan: { biet: 0, hieu: 1, vanDung: 0 }
      }
    },
    {
      id: 'spec-3',
      chapter: 'Chương III: Hàm số và đồ thị',
      unit: '3. Ứng dụng thực tế của hàm số bậc hai (Tối ưu hóa)',
      learningOutcomes: {
        biet: ['Nhận biết dạng đường cong thực tế liên quan đến parabol.'],
        hieu: ['Xác định được giá trị lớn nhất, giá trị nhỏ nhất của hàm số trên một đoạn [α; β].'],
        vanDung: ['Mô hình hóa bài toán cực trị thực tế (quỹ đạo ném, tối ưu hoá lợi nhuận, diện tích).']
      },
      numberOfQuestions: {
        tnkq_nhieuLuaChon: { biet: 2, hieu: 1, vanDung: 0 },
        tnkq_dungSai: { biet: 0, hieu: 1, vanDung: 1 },
        tnkq_traLoiNgan: { biet: 0, hieu: 0, vanDung: 1 },
        tuLuan: { biet: 0, hieu: 0, vanDung: 1 }
      }
    }
  ],

  exam: {
    title: 'ĐỀ KIỂM TRA ĐỊNH KÌ GIỮA HỌC KÌ I - MÔN TOÁN 10',
    examType: 'Kiểm tra giữa học kì 1',
    durationMinutes: 45,
    academicYear: 'Năm học 2024 - 2025',
    totalScore: 10.0,
    weighting: {
      recognition: 40,   // 4.0 điểm Nhận biết
      comprehension: 30, // 3.0 điểm Thông hiểu
      application: 30    // 3.0 điểm Vận dụng
    },

    // PHẦN I: TRẮC NGHIỆM NHIỀU LỰA CHỌN (3.0 ĐIỂM) - 12 câu, mỗi câu 0.25đ
    partI_MultipleChoice: [
      {
        id: 'q1',
        number: 1,
        content: 'Hàm số nào sau đây là hàm số bậc hai?',
        options: {
          A: 'y = 2x + 1',
          B: 'y = 3x² - 5x + 2',
          C: 'y = x³ - 2x + 1',
          D: 'y = 1 / (x² + 1)'
        },
        correctAnswer: 'B',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Định nghĩa hàm số bậc hai',
        explanation: 'Hàm số bậc hai có dạng y = ax² + bx + c với a ≠ 0. Ở phương án B, a = 3 ≠ 0.'
      },
      {
        id: 'q2',
        number: 2,
        content: 'Tọa độ đỉnh I của parabol (P): y = x² - 4x + 3 là:',
        options: {
          A: 'I(2; -1)',
          B: 'I(-2; 15)',
          C: 'I(4; 3)',
          D: 'I(-4; 35)'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Tọa độ đỉnh',
        explanation: 'x_I = -b/(2a) = -(-4)/(2*1) = 2. Thay x = 2 vào ta được y_I = 2² - 4(2) + 3 = -1. Vậy I(2; -1).'
      },
      {
        id: 'q3',
        number: 3,
        content: 'Trục đối xứng của đồ thị parabol y = -2x² + 6x - 1 là đường thẳng:',
        options: {
          A: 'x = 3/2',
          B: 'x = -3/2',
          C: 'x = 3',
          D: 'y = 7/2'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Trục đối xứng',
        explanation: 'Trục đối xứng là x = -b/(2a) = -6 / [2*(-2)] = 3/2.'
      },
      {
        id: 'q4',
        number: 4,
        content: 'Bề lõm của đồ thị hàm số y = 3x² - 2x + 5 quay về phía nào?',
        options: {
          A: 'Quay xuống dưới',
          B: 'Quay lên trên',
          C: 'Quay sang phải',
          D: 'Quay sang trái'
        },
        correctAnswer: 'B',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Bề lõm parabol',
        explanation: 'Vì hệ số a = 3 > 0 nên parabol có bề lõm quay lên trên.'
      },
      {
        id: 'q5',
        number: 5,
        content: 'Tập xác định D của hàm số y = √(x - 3) là:',
        options: {
          A: 'D = [3; +∞)',
          B: 'D = (3; +∞)',
          C: 'D = (-∞; 3]',
          D: 'D = ℝ \\ {3}'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Tập xác định',
        explanation: 'Điều kiện x - 3 ≥ 0 ⇔ x ≥ 3. Vậy D = [3; +∞).'
      },
      {
        id: 'q6',
        number: 6,
        content: 'Giao điểm của parabol y = x² - 3x + 2 với trục tung Oy có toạ độ là:',
        options: {
          A: '(0; 2)',
          B: '(2; 0)',
          C: '(1; 0)',
          D: '(0; -3)'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Giao điểm trục toạ độ',
        explanation: 'Cho x = 0 ⇒ y = 0² - 3(0) + 2 = 2. Giao điểm với Oy là (0; 2).'
      },
      {
        id: 'q7',
        number: 7,
        content: 'Hàm số y = x² - 2x + 4 nghịch biến trên khoảng nào sau đây?',
        options: {
          A: '(-∞; 1)',
          B: '(1; +∞)',
          C: '(-∞; 2)',
          D: '(2; +∞)'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'Sự biến thiên',
        explanation: 'Vì a = 1 > 0 và x_I = -(-2)/(2*1) = 1, nên hàm số nghịch biến trên khoảng (-∞; 1).'
      },
      {
        id: 'q8',
        number: 8,
        content: 'Cho hàm số y = ax² + bx + c có đồ thị như hình chữ U và đi qua gốc tọa độ O(0; 0). Khẳng định nào sau đây đúng?',
        options: {
          A: 'a > 0 và c = 0',
          B: 'a < 0 và c = 0',
          C: 'a > 0 và c > 0',
          D: 'a < 0 và c < 0'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'Dấu các hệ số',
        explanation: 'Bề lõm quay lên nên a > 0. Đi qua gốc tọa độ O(0;0) nên c = 0.'
      },
      {
        id: 'q9',
        number: 9,
        content: 'Tìm giá trị nhỏ nhất của hàm số y = x² - 6x + 11 trên tập số thực ℝ:',
        options: {
          A: 'y_min = 2',
          B: 'y_min = 3',
          C: 'y_min = 11',
          D: 'y_min = -2'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'Giá trị nhỏ nhất',
        explanation: 'y = (x - 3)² + 2 ≥ 2 với mọi x. Dấu bằng xảy ra khi x = 3.'
      },
      {
        id: 'q10',
        number: 10,
        content: 'Số giao điểm của parabol y = x² - 4x + 4 và đường thẳng y = 0 (trục Ox) là:',
        options: {
          A: '1 giao điểm',
          B: '2 giao điểm',
          C: '0 giao điểm',
          D: '3 giao điểm'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'Tương giao đồ thị',
        explanation: 'Phương trình hoành độ: x² - 4x + 4 = 0 ⇔ (x - 2)² = 0 ⇔ x = 2. Có 1 giao điểm (tiếp xúc).'
      },
      {
        id: 'q11',
        number: 11,
        content: 'Đồ thị hàm số y = -x² + 2x + 3 cắt trục hoành Ox tại hai điểm có hoành độ x₁, x₂. Tổng x₁ + x₂ bằng:',
        options: {
          A: '2',
          B: '-2',
          C: '-3',
          D: '3'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Định lý Vi-et',
        explanation: 'Theo định lý Vi-et cho phương trình -x² + 2x + 3 = 0, x₁ + x₂ = -b/a = -2/(-1) = 2.'
      },
      {
        id: 'q12',
        number: 12,
        content: 'Một vật được ném lên thẳng đứng có độ cao h(t) = -5t² + 20t (m) với t tính bằng giây. Sau bao lâu vật đạt độ cao lớn nhất?',
        options: {
          A: 't = 2 giây',
          B: 't = 4 giây',
          C: 't = 20 giây',
          D: 't = 1 giây'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'Bài toán thực tế',
        explanation: 'Hàm số bậc hai với a = -5 < 0 đạt cực đại tại t = -b/(2a) = -20 / [2*(-5)] = 2 giây.'
      }
    ],

    // PHẦN II: TRẮC NGHIỆM ĐÚNG / SAI (2.0 ĐIỂM) - 2 câu, mỗi câu 4 lệnh a-b-c-d (Mỗi câu 1.0đ)
    // Quy tắc chấm chuẩn BGDĐT: Đúng 1 ý = 0.1đ; Đúng 2 ý = 0.25đ; Đúng 3 ý = 0.5đ; Đúng 4 ý = 1.0đ
    partII_TrueFalse: [
      {
        id: 'tf-1',
        number: 1,
        context: 'Cho parabol (P) có phương trình y = f(x) = x² - 2x - 3. Xét tính Đúng/Sai của các mệnh đề sau:',
        level: 'Thông hiểu',
        topic: 'Khảo sát và tính chất parabol',
        pointsTotal: 1.0,
        statements: [
          {
            subId: 'a',
            text: 'Tọa độ đỉnh của parabol (P) là I(1; -4).',
            isCorrect: true,
            explanation: 'x_I = -(-2)/2 = 1; y_I = 1² - 2(1) - 3 = -4. Mệnh đề ĐÚNG.'
          },
          {
            subId: 'b',
            text: 'Trục đối xứng của parabol (P) là đường thẳng y = 1.',
            isCorrect: false,
            explanation: 'Trục đối xứng là đường thẳng x = 1 (song song hoặc trùng trục tung), không phải y = 1. Mệnh đề SAI.'
          },
          {
            subId: 'c',
            text: 'Hàm số f(x) đồng biến trên khoảng (1; +∞).',
            isCorrect: true,
            explanation: 'Vì a = 1 > 0 nên hàm số đồng biến trên khoảng (x_I; +∞) tức là (1; +∞). Mệnh đề ĐÚNG.'
          },
          {
            subId: 'd',
            text: 'Đồ thị parabol (P) cắt trục hoành Ox tại hai điểm phân biệt có toạ độ là (-1; 0) và (3; 0).',
            isCorrect: true,
            explanation: 'Phương trình x² - 2x - 3 = 0 có nghiệm x = -1 và x = 3. Hai giao điểm là (-1; 0) và (3; 0). Mệnh đề ĐÚNG.'
          }
        ]
      },
      {
        id: 'tf-2',
        number: 2,
        context: 'Một chiếc cổng hình parabol có chiều rộng hai chân cổng AB = 8 mét và chiều cao tại điểm chính giữa cổng là 4 mét. Chọn hệ trục toạ độ Oxy sao cho gốc toạ độ O là trung điểm đoạn AB, trục Oy hướng thẳng đứng lên trên qua đỉnh cổng.',
        level: 'Vận dụng',
        topic: 'Mô hình hóa cổng parabol',
        pointsTotal: 1.0,
        statements: [
          {
            subId: 'a',
            text: 'Tọa độ đỉnh của parabol đại diện cho vòm cổng là I(0; 4).',
            isCorrect: true,
            explanation: 'Theo cách chọn hệ trục, điểm chính giữa cao 4m nằm trên trục Oy nên toạ độ đỉnh là I(0; 4). Mệnh đề ĐÚNG.'
          },
          {
            subId: 'b',
            text: 'Phương trình của đường viền cổng parabol có dạng y = -1/4 x² + 4.',
            isCorrect: true,
            explanation: 'Parabol có dạng y = ax² + 4. Hai chân cổng có hoành độ x = ±4. Khi x = 4 thì y = 0 ⇒ a(4)² + 4 = 0 ⇒ 16a = -4 ⇒ a = -1/4. Vậy y = -1/4 x² + 4. Mệnh đề ĐÚNG.'
          },
          {
            subId: 'c',
            text: 'Tại vị trí cách tâm cổng 2 mét về phía chân cổng, chiều cao của cổng là 2 mét.',
            isCorrect: false,
            explanation: 'Tại x = 2: y = -1/4*(2)² + 4 = -1 + 4 = 3 mét (không phải 2 mét). Mệnh đề SAI.'
          },
          {
            subId: 'd',
            text: 'Một chiếc xe tải thùng hình chữ nhật có chiều rộng 4 mét và chiều cao 3.2 mét có thể đi lọt qua cổng mà không chạm thành cổng.',
            isCorrect: false,
            explanation: 'Xe tải rộng 4m thì mép thùng xe ở x = 2m. Tại x = 2m, chiều cao cổng chỉ là y = 3m < 3.2m, xe sẽ bị va chạm. Mệnh đề SAI.'
          }
        ]
      }
    ],

    // PHẦN III: TRẮC NGHIỆM TRẢ LỜI NGẮN (2.0 ĐIỂM) - 4 câu, mỗi câu 0.5đ
    partIII_ShortAnswer: [
      {
        id: 'sa-1',
        number: 1,
        content: 'Biết đồ thị hàm số y = ax² + bx + 3 đi qua điểm A(1; 4) và có trục đối xứng x = 2. Tính giá trị biểu thức P = a + b.',
        acceptableAnswers: ['1', 'P = 1', 'P=1'],
        points: 0.5,
        level: 'Thông hiểu',
        topic: 'Xác định hệ số parabol',
        solutionGuide: 'Đi qua A(1; 4) ⇒ a(1)² + b(1) + 3 = 4 ⇒ a + b + 3 = 4 ⇒ a + b = 1. Kết quả điền số: 1'
      },
      {
        id: 'sa-2',
        number: 2,
        content: 'Tìm giá trị lớn nhất của hàm số y = -2x² + 8x - 1 trên toàn trục số thực.',
        acceptableAnswers: ['7', 'y_max = 7', '7.0'],
        points: 0.5,
        level: 'Thông hiểu',
        topic: 'Giá trị lớn nhất',
        solutionGuide: 'x_I = -8 / [2*(-2)] = 2. Thay x = 2 vào y = -2(4) + 8(2) - 1 = -8 + 16 - 1 = 7. Kết quả điền số: 7'
      },
      {
        id: 'sa-3',
        number: 3,
        content: 'Tìm tọa độ hoành độ dương x mà tại đó đồ thị hàm số y = x² - 5x + 6 cắt trục hoành Ox.',
        acceptableAnswers: ['3', 'x = 3', '3 hoặc 2'],
        points: 0.5,
        level: 'Thông hiểu',
        topic: 'Giao điểm trục hoành',
        solutionGuide: 'Phương trình x² - 5x + 6 = 0 cho 2 nghiệm x = 2 và x = 3. Hoành độ lớn hơn là 3.'
      },
      {
        id: 'sa-4',
        number: 4,
        content: 'Một mảnh đất hình chữ nhật có chu vi bằng 60 mét. Diện tích lớn nhất của mảnh đất này có thể đạt được là bao nhiêu mét vuông?',
        acceptableAnswers: ['225', '225 m²', '225m2'],
        points: 0.5,
        level: 'Vận dụng',
        topic: 'Bài toán cực trị chu vi diện tích',
        solutionGuide: 'Nửa chu vi a + b = 30 ⇒ b = 30 - a. Diện tích S = a(30 - a) = -a² + 30a. Đỉnh parabol tại a = 15 ⇒ S_max = 15*15 = 225. Kết quả điền số: 225'
      }
    ],

    // PHẦN IV: TỰ LUẬN (3.0 ĐIỂM) - 2 câu
    partIV_Essay: [
      {
        id: 'es-1',
        number: 1,
        content: 'Cho hàm số bậc hai y = x² - 4x + 3.\na) Lập bảng biến thiên và vẽ đồ thị (P) của hàm số trên mặt phẳng toạ độ Oxy.\nb) Tìm tất cả các giá trị của tham số m để đường thẳng d: y = m cắt parabol (P) tại hai điểm phân biệt có hoành độ cùng dương.',
        points: 1.5,
        level: 'Thông hiểu',
        topic: 'Khảo sát hàm số và biện luận tương giao',
        gradingCriteria: [
          {
            step: 'Ý a (1.0đ): Xác định tọa độ đỉnh I(2; -1), trục đối xứng x = 2, giao Oy (0; 3), giao Ox tại (1; 0) và (3; 0).',
            points: 0.5
          },
          {
            step: 'Ý a (tiếp): Lập đúng bảng biến thiên (mũi tên giảm từ +∞ xuống -1, tăng lên +∞) và vẽ đồ thị (P) chuẩn xác, đối xứng.',
            points: 0.5
          },
          {
            step: 'Ý b (0.5đ): Phương trình hoành độ giao điểm x² - 4x + 3 - m = 0. Để có 2 nghiệm phân biệt cùng dương: Δ\' = 4 - (3 - m) = 1 + m > 0 ⇔ m > -1; S = 4 > 0 (thỏa mãn); P = 3 - m > 0 ⇔ m < 3. Kết luận: -1 < m < 3.',
            points: 0.5
          }
        ]
      },
      {
        id: 'es-2',
        number: 2,
        content: 'Một doanh nghiệp may mặc sản xuất áo sơ mi cao cấp. Chi phí sản xuất x chiếc áo mỗi ngày được ước tính bởi hàm số C(x) = x² + 20x + 400 (nghìn đồng). Mỗi chiếc áo bán ra với giá niêm yết cố định là 120 nghìn đồng.\na) Lập hàm số biểu diễn lợi nhuận L(x) hàng ngày của doanh nghiệp theo số lượng áo x bán được (giả định sản xuất bao nhiêu bán hết bấy nhiêu).\nb) Doanh nghiệp cần sản xuất và bán bao nhiêu chiếc áo mỗi ngày để thu được lợi nhuận lớn nhất? Tính giá trị lợi nhuận tối đa đó.',
        points: 1.5,
        level: 'Vận dụng',
        topic: 'Ứng dụng kinh tế tối ưu hoá lợi nhuận',
        gradingCriteria: [
          {
            step: 'Ý a (0.5đ): Doanh thu R(x) = 120x. Lợi nhuận L(x) = R(x) - C(x) = 120x - (x² + 20x + 400) = -x² + 100x - 400 (nghìn đồng) với x ∈ ℕ*.',
            points: 0.5
          },
          {
            step: 'Ý b (0.75đ): Hàm số L(x) là hàm số bậc hai có hệ số a = -1 < 0 nên đạt giá trị lớn nhất tại đỉnh của parabol: x = -b/(2a) = -100 / [2*(-1)] = 50.',
            points: 0.75
          },
          {
            step: 'Ý b (tiếp, 0.25đ): Lợi nhuận tối đa L_max = -(50)² + 100(50) - 400 = -2500 + 5000 - 400 = 2100 nghìn đồng (tức 2.100.000 VNĐ). Kết luận rõ ràng cho doanh nghiệp.',
            points: 0.25
          }
        ]
      }
    ]
  }
};
