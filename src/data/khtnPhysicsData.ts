import { UploadedDocument } from '../types';

export const KHTN_PHYSICS_LIBRARY: UploadedDocument[] = [
  // =========================================================================
  // 1. VẬT LÍ TRONG KHTN 6 (KẾT NỐI TRI THỨC VỚI CUỘC SỐNG)
  // =========================================================================
  {
    id: 'doc-sgk-khtn-6-phys',
    name: 'SGK Khoa học tự nhiên 6 - Phân môn Vật lí (Kết Nối Tri Thức)',
    category: 'sgk',
    subject: 'Khoa học tự nhiên',
    grade: 'Lớp 6',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-01',
    fileSize: '16.8 MB',
    pageCount: 168,
    status: 'indexed',
    rawTextPreview: 'Chương trình Vật lí trong KHTN 6 gồm: Các phép đo (chiều dài, khối lượng, thời gian, nhiệt độ); Lực trong đời sống (Lực, biểu diễn lực, biến dạng lò xo, trọng lực, lực ma sát, lực cản của nước); Năng lượng và sự truyền năng lượng; Trái Đất và bầu trời...',
    chapters: [
      {
        id: 'khtn6-phys-ch-4',
        chapterNumber: 2,
        chapterTitle: 'Chương 2: Các phép đo (Vật lí)',
        lessonNumber: '4',
        lessonName: 'Đo chiều dài',
        summary: 'Đơn vị đo chiều dài trong hệ SI là mét (m); dụng cụ đo là thước; cách xác định GHĐ và ĐCNN; các bước đo chiều dài đúng quy trình tránh sai số.',
        keyPoints: [
          'Đơn vị đo độ dài hợp pháp là mét (m), kí hiệu là m',
          'Giới hạn đo (GHĐ) là độ dài lớn nhất ghi trên thước',
          'Độ chia nhỏ nhất (ĐCNN) là độ dài giữa hai vạch chia liên tiếp',
          'Quy tắc 5 bước đo: Ước lượng → Chọn thước → Đặt thước dọc vật → Đặt mắt vuông góc → Đọc và ghi kết quả'
        ],
        objectives: {
          knowledge: [
            'Nêu được đơn vị đo chiều dài và dụng cụ thường dùng để đo chiều dài.',
            'Hiểu được cách xác định GHĐ và ĐCNN của thước đo.',
            'Thực hiện được phép đo chiều dài một số vật dụng thông thường đúng cách.'
          ],
          competenciesSpecific: [
            'Năng lực tìm hiểu tự nhiên: Lựa chọn thước đo phù hợp với kích thước vật thể.',
            'Năng lực tính toán: Đổi đơn vị đo từ m sang mm, cm, dm, km.'
          ]
        }
      },
      {
        id: 'khtn6-phys-ch-5',
        chapterNumber: 2,
        chapterTitle: 'Chương 2: Các phép đo (Vật lí)',
        lessonNumber: '5',
        lessonName: 'Đo khối lượng',
        summary: 'Khối lượng là số đo lượng chất chứa trong vật; đơn vị kilôgam (kg); dụng cụ là các loại cân (cân Roborval, cân đồng hồ, cân điện tử).',
        keyPoints: [
          'Mọi vật đều có khối lượng, đơn vị đo chuẩn là kilôgam (kg)',
          'Dụng cụ đo khối lượng thông dụng: Cân đồng hồ, cân y tế, cân điện tử',
          'Các bước đo khối lượng: Hiệu chỉnh kim cân về số 0 trước khi đo, đặt mắt vuông góc kim cân'
        ],
        objectives: {
          knowledge: [
            'Nêu được định nghĩa khối lượng của một vật.',
            'Sử dụng thành thạo cân đồng hồ và cân điện tử để đo khối lượng vật thể.'
          ]
        }
      },
      {
        id: 'khtn6-phys-ch-7',
        chapterNumber: 2,
        chapterTitle: 'Chương 2: Các phép đo (Vật lí)',
        lessonNumber: '7',
        lessonName: 'Thang nhiệt độ Celsius. Đo nhiệt độ',
        summary: 'Nhiệt độ là số đo độ nóng, lạnh của một vật; thang nhiệt độ Celsius quy ước 0°C là nhiệt độ đóng băng và 100°C là nhiệt độ sôi của nước tinh khiết; dụng cụ là nhiệt kế.',
        keyPoints: [
          'Nhiệt độ đo bằng nhiệt kế (nhiệt kế thủy ngân, nhiệt kế rượu, nhiệt kế hồng ngoại)',
          'Nguyên tắc hoạt động của nhiệt kế chất lỏng dựa trên sự nở vì nhiệt của chất lỏng',
          'Thang đo Celsius (°C) có điểm 0°C và 100°C làm mốc chuẩn'
        ],
        objectives: {
          knowledge: [
            'Nêu được nguyên tắc hoạt động của nhiệt kế chất lỏng.',
            'Biết cách đọc và đo nhiệt độ cơ thể bằng nhiệt kế y tế an toàn.'
          ]
        }
      },
      {
        id: 'khtn6-phys-ch-40',
        chapterNumber: 8,
        chapterTitle: 'Chương 8: Lực trong đời sống (Vật lí)',
        lessonNumber: '40',
        lessonName: 'Lực là gì?',
        summary: 'Tác dụng đẩy, kéo của vật này lên vật khác gọi là lực; lực làm vật biến đổi chuyển động (nhanh lên, chậm đi, đổi hướng) hoặc làm vật bị biến dạng.',
        keyPoints: [
          'Lực là tác dụng đẩy hoặc kéo của vật này lên vật khác',
          'Tác dụng của lực: Làm thay đổi vận tốc (biến đổi chuyển động) hoặc làm vật biến dạng',
          'Phân biệt lực tiếp xúc (lực đẩy xe) và lực không tiếp xúc (lực hút nam châm, lực hút Trái Đất)'
        ],
        objectives: {
          knowledge: [
            'Nêu được khái niệm lực và hai kết quả tác dụng của lực.',
            'Lấy được ví dụ về lực tiếp xúc và lực không tiếp xúc trong đời sống.'
          ]
        }
      },
      {
        id: 'khtn6-phys-ch-41',
        chapterNumber: 8,
        chapterTitle: 'Chương 8: Lực trong đời sống (Vật lí)',
        lessonNumber: '41',
        lessonName: 'Biểu diễn lực',
        summary: 'Lực là một đại lượng vectơ có độ lớn, phương và chiều; lực được biểu diễn bằng một mũi tên có gốc tại điểm đặt của lực, hướng theo chiều của lực và độ dài tỉ lệ với độ lớn; đơn vị đo là Newton (N).',
        keyPoints: [
          'Đơn vị đo lực trong hệ SI là Newton (kí hiệu N)',
          'Lực là đại lượng vectơ đặc trưng bởi: Điểm đặt, phương, chiều và độ lớn',
          'Cách vẽ mũi tên biểu diễn lực với tỉ xích cho trước (VD: 1 cm ứng với 10 N)'
        ],
        objectives: {
          knowledge: [
            'Mô tả được các yếu tố của một lực.',
            'Vẽ được mũi tên biểu diễn một lực theo tỉ xích xác định.'
          ]
        }
      },
      {
        id: 'khtn6-phys-ch-43',
        chapterNumber: 8,
        chapterTitle: 'Chương 8: Lực trong đời sống (Vật lí)',
        lessonNumber: '43',
        lessonName: 'Trọng lực. Lực hấp dẫn',
        summary: 'Lực hút của Trái Đất tác dụng lên mọi vật gọi là trọng lực; trọng lực có phương thẳng đứng, chiều từ trên xuống dưới; độ lớn của trọng lực tác dụng lên vật gọi là trọng lượng P = 10.m.',
        keyPoints: [
          'Trọng lực là lực hút của Trái Đất tác dụng lên vật',
          'Phương thẳng đứng, chiều hướng về tâm Trái Đất (từ trên xuống)',
          'Công thức liên hệ trọng lượng và khối lượng: P = 10 . m (m tính bằng kg, P tính bằng N)'
        ],
        objectives: {
          knowledge: [
            'Nêu được phương, chiều của trọng lực.',
            'Vận dụng công thức P = 10.m để tính trọng lượng của vật khi biết khối lượng và ngược lại.'
          ]
        }
      },
      {
        id: 'khtn6-phys-ch-44',
        chapterNumber: 8,
        chapterTitle: 'Chương 8: Lực trong đời sống (Vật lí)',
        lessonNumber: '44',
        lessonName: 'Lực ma sát',
        summary: 'Lực ma sát xuất hiện ở bề mặt tiếp xúc giữa hai vật cản trở chuyển động; gồm ma sát trượt và ma sát nghỉ; vai trò có lợi và có hại trong đời sống.',
        keyPoints: [
          'Lực ma sát trượt xuất hiện khi một vật trượt trên bề mặt vật khác',
          'Lực ma sát nghỉ giữ cho vật đứng yên khi có lực tác dụng',
          'Cách làm tăng ma sát có lợi (khía rãnh lốp xe, đế giày) và giảm ma sát có hại (tra dầu mỡ, dùng ổ bi)'
        ],
        objectives: {
          knowledge: [
            'Giải thích được nguyên nhân sinh ra lực ma sát.',
            'Nêu được ví dụ về lực ma sát có lợi và có hại, biện pháp tăng giảm ma sát.'
          ]
        }
      },
      {
        id: 'khtn6-phys-ch-48',
        chapterNumber: 9,
        chapterTitle: 'Chương 9: Năng lượng và sự chuyển hóa năng lượng (Vật lí)',
        lessonNumber: '48',
        lessonName: 'Sự chuyển hóa năng lượng và Định luật bảo toàn năng lượng',
        summary: 'Năng lượng có thể chuyển hóa từ dạng này sang dạng khác hoặc truyền từ vật này sang vật khác; năng lượng không tự sinh ra cũng không tự mất đi.',
        keyPoints: [
          'Định luật bảo toàn năng lượng: Năng lượng không tự nhiên sinh ra hay mất đi, chỉ biến đổi từ dạng này sang dạng khác',
          'Sự chuyển hóa giữa cơ năng, điện năng, hóa năng, nhiệt năng',
          'Năng lượng có ích và năng lượng hao phí (thường tỏa nhiệt ra môi trường)'
        ],
        objectives: {
          knowledge: [
            'Phát biểu được định luật bảo toàn năng lượng.',
            'Phân tích sự chuyển hóa năng lượng trong các thiết bị quen thuộc (quạt điện, xe máy, bóng đèn).'
          ]
        }
      }
    ]
  },

  // =========================================================================
  // 2. VẬT LÍ TRONG KHTN 7 (KẾT NỐI TRI THỨC VỚI CUỘC SỐNG)
  // =========================================================================
  {
    id: 'doc-sgk-khtn-7-phys',
    name: 'SGK Khoa học tự nhiên 7 - Phân môn Vật lí (Kết Nối Tri Thức)',
    category: 'sgk',
    subject: 'Khoa học tự nhiên',
    grade: 'Lớp 7',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-01',
    fileSize: '18.4 MB',
    pageCount: 180,
    status: 'indexed',
    rawTextPreview: 'Chương trình Vật lí KHTN 7 gồm: Tốc độ chuyển động (Công thức v = s/t, đo tốc độ, đồ thị s - t); Âm thanh (Sóng âm, độ to, độ cao, phản xạ âm); Ánh sáng (Tia sáng, định luật phản xạ ánh sáng, gương phẳng); Từ trường (Nam châm, từ phổ, nam châm điện)...',
    chapters: [
      {
        id: 'khtn7-phys-ch-8',
        chapterNumber: 3,
        chapterTitle: 'Chương 3: Tốc độ (Vật lí 7)',
        lessonNumber: '8',
        lessonName: 'Tốc độ chuyển động',
        summary: 'Tốc độ là đại lượng cho biết mức độ nhanh hay chậm của chuyển động; công thức tính tốc độ v = s/t; đơn vị đo là m/s hoặc km/h (1 m/s = 3,6 km/h).',
        keyPoints: [
          'Công thức tính tốc độ: v = s / t (s là quãng đường, t là thời gian)',
          'Đơn vị chuẩn: m/s (mét trên giây) và km/h (kilômét trên giờ)',
          'Quy tắc chuyển đổi đơn vị: 1 m/s = 3,6 km/h; 1 km/h = 1/3,6 m/s',
          'Ý nghĩa: Cùng quãng đường s, vật nào đi mất ít thời gian hơn thì tốc độ lớn hơn'
        ],
        objectives: {
          knowledge: [
            'Nêu được ý nghĩa của tốc độ đối với sự chuyển động nhanh hay chậm.',
            'Vận dụng công thức v = s/t để tính tốc độ, quãng đường, thời gian chuyển động.'
          ],
          competenciesSpecific: [
            'Năng lực tính toán khoa học: Giải bài toán chuyển động đều và so sánh tốc độ các phương tiện giao thông.'
          ]
        }
      },
      {
        id: 'khtn7-phys-ch-10',
        chapterNumber: 3,
        chapterTitle: 'Chương 3: Tốc độ (Vật lí 7)',
        lessonNumber: '10',
        lessonName: 'Đồ thị quãng đường – thời gian',
        summary: 'Đồ thị quãng đường – thời gian mô tả mối quan hệ giữa quãng đường đi được và thời gian chuyển động; trục hoành Ot biểu diễn thời gian, trục tung Os biểu diễn quãng đường; đường thẳng dốc lên biểu diễn chuyển động thẳng đều.',
        keyPoints: [
          'Đồ thị s - t của chuyển động thẳng đều là một đường thẳng đi qua gốc tọa độ O',
          'Đường nằm ngang song song với trục Ot biểu thị vật đang đứng yên (s không đổi)',
          'Từ đồ thị s - t có thể xác định được vị trí của vật tại thời điểm bất kì và tính tốc độ v'
        ],
        objectives: {
          knowledge: [
            'Vẽ và đọc được đồ thị quãng đường – thời gian đơn giản.',
            'Xác định được tốc độ của vật từ độ dốc của đồ thị s - t.'
          ]
        }
      },
      {
        id: 'khtn7-phys-ch-12',
        chapterNumber: 4,
        chapterTitle: 'Chương 4: Âm thanh (Vật lí 7)',
        lessonNumber: '12',
        lessonName: 'Sóng âm',
        summary: 'Dao động của vật phát ra âm thanh; sóng âm truyền được trong các môi trường rắn, lỏng, khí nhưng không truyền được trong chân không; tốc độ truyền âm: Rắn > Lỏng > Khí.',
        keyPoints: [
          'Nguồn âm là các vật phát ra âm thanh, các nguồn âm đều dao động',
          'Sóng âm lan truyền dao động âm qua các môi trường chất',
          'Sóng âm không truyền được trong chân không',
          'Thứ tự tốc độ truyền âm: v(rắn) > v(lỏng) > v(khí)'
        ],
        objectives: {
          knowledge: [
            'Nêu được nguồn âm là gì và chỉ ra bộ phận dao động phát ra âm.',
            'So sánh được tốc độ truyền sóng âm trong các môi trường khác nhau.'
          ]
        }
      },
      {
        id: 'khtn7-phys-ch-13',
        chapterNumber: 4,
        chapterTitle: 'Chương 4: Âm thanh (Vật lí 7)',
        lessonNumber: '13',
        lessonName: 'Độ to và độ cao của âm',
        summary: 'Tần số là số dao động trong 1 giây (đơn vị Hertz - Hz); âm phát ra càng cao (bổng) khi tần số càng lớn; biên độ dao động càng lớn thì âm phát ra càng to (đơn vị decibel - dB).',
        keyPoints: [
          'Độ cao của âm phụ thuộc vào tần số dao động (Hz): Tần số càng lớn âm càng bổng, tần số nhỏ âm càng trầm',
          'Độ to của âm phụ thuộc vào biên độ dao động: Biên độ dao động càng lớn thì âm càng to',
          'Tai người bình thường nghe được âm có tần số từ 20 Hz đến 20 000 Hz'
        ],
        objectives: {
          knowledge: [
            'Phân biệt được độ cao và độ to của âm thanh.',
            'Giải thích được hiện tượng âm trầm, âm bổng trong đàn guitar, trống, sáo.'
          ]
        }
      },
      {
        id: 'khtn7-phys-ch-16',
        chapterNumber: 5,
        chapterTitle: 'Chương 5: Ánh sáng (Vật lí 7)',
        lessonNumber: '16',
        lessonName: 'Sự phản xạ ánh sáng',
        summary: 'Hiện tượng ánh sáng bị đổi hướng khi gặp bề mặt nhẵn bóng; Định luật phản xạ ánh sáng: Tia phản xạ nằm trong mặt phẳng tới; Góc phản xạ bằng góc tới (i\' = i).',
        keyPoints: [
          'Tia sáng tới (SI), tia phản xạ (IR), pháp tuyến (IN) tại điểm tới I',
          'Mặt phẳng tới chứa tia tới và pháp tuyến tại điểm tới',
          'Định luật phản xạ ánh sáng: Tia phản xạ nằm trong mặt phẳng tới; Góc phản xạ bằng góc tới (i\' = i)',
          'Phân biệt phản xạ gương (trên mặt gương nhẵn) và phản xạ khuếch tán (trên mặt sần sùi)'
        ],
        objectives: {
          knowledge: [
            'Phát biểu được định luật phản xạ ánh sáng.',
            'Vẽ được hình biểu diễn tia tới, tia phản xạ và tính được góc phản xạ khi biết góc tới.'
          ]
        }
      },
      {
        id: 'khtn7-phys-ch-17',
        chapterNumber: 5,
        chapterTitle: 'Chương 5: Ánh sáng (Vật lí 7)',
        lessonNumber: '17',
        lessonName: 'Ảnh của vật tạo bởi gương phẳng',
        summary: 'Gương phẳng là bề mặt nhẵn phẳng phản xạ ánh sáng; Ảnh tạo bởi gương phẳng là ảnh ảo không hứng được trên màn chắn, có kích thước bằng vật và đối xứng với vật qua gương.',
        keyPoints: [
          'Ảnh của vật tạo bởi gương phẳng là ảnh ảo (không hứng được trên màn chắn)',
          'Độ lớn của ảnh ảo bằng độ lớn của vật (A\'B\' = AB)',
          'Khoảng cách từ ảnh đến gương bằng khoảng cách từ vật đến gương (đối xứng qua gương phẳng)'
        ],
        objectives: {
          knowledge: [
            'Nêu được tính chất ảnh tạo bởi gương phẳng.',
            'Dựng được ảnh của một điểm sáng và một vật sáng qua gương phẳng.'
          ]
        }
      },
      {
        id: 'khtn7-phys-ch-19',
        chapterNumber: 6,
        chapterTitle: 'Chương 6: Từ trường (Vật lí 7)',
        lessonNumber: '19',
        lessonName: 'Từ trường',
        summary: 'Không gian xung quanh nam châm có từ trường; kim nam châm chịu tác dụng lực từ khi đặt trong từ trường; đường sức từ có chiều đi ra từ cực Bắc (N) và đi vào cực Nam (S).',
        keyPoints: [
          'Từ trường là môi trường vật chất tồn tại xung quanh nam châm hoặc dòng điện',
          'Kim nam châm là dụng cụ nhận biết sự tồn tại của từ trường',
          'Quy ước chiều đường sức từ: Đi ra từ cực Bắc (North - N) và đi vào cực Nam (South - S)',
          'Trái Đất là một nam châm khổng lồ có cực từ Nam gần cực Bắc địa lí'
        ],
        objectives: {
          knowledge: [
            'Nêu được khái niệm từ trường và cách nhận biết từ trường.',
            'Vẽ và xác định được chiều đường sức từ của thanh nam châm thẳng.'
          ]
        }
      }
    ]
  },

  // =========================================================================
  // 3. VẬT LÍ TRONG KHTN 8 (KẾT NỐI TRI THỨC VỚI CUỘC SỐNG)
  // =========================================================================
  {
    id: 'doc-sgk-khtn-8-phys',
    name: 'SGK Khoa học tự nhiên 8 - Phân môn Vật lí (Kết Nối Tri Thức)',
    category: 'sgk',
    subject: 'Khoa học tự nhiên',
    grade: 'Lớp 8',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-01',
    fileSize: '21.2 MB',
    pageCount: 200,
    status: 'indexed',
    rawTextPreview: 'Chương trình Vật lí KHTN 8 gồm: Khối lượng riêng & Áp suất (D = m/V, áp suất chất lỏng, áp suất khí quyển, lực đẩy Archimedes); Tác dụng làm quay của lực (Moment lực, đòn bẩy); Điện học (Mạch điện, cường độ dòng điện, hiệu điện thế); Nhiệt học (Nhiệt năng, các hình thức truyền nhiệt)...',
    chapters: [
      {
        id: 'khtn8-phys-ch-14',
        chapterNumber: 3,
        chapterTitle: 'Chương 3: Khối lượng riêng và Áp suất (Vật lí 8)',
        lessonNumber: '14',
        lessonName: 'Khối lượng riêng',
        summary: 'Khối lượng riêng của một chất là khối lượng của một đơn vị thể tích (1 m³) chất đó; công thức D = m/V; đơn vị đo là kg/m³ hoặc g/cm³ (1 g/cm³ = 1000 kg/m³).',
        keyPoints: [
          'Công thức tính khối lượng riêng: D = m / V (m là khối lượng, V là thể tích)',
          'Đơn vị đo chuẩn: kg/m³ và g/cm³ (1 g/cm³ = 1000 kg/m³)',
          'Trọng lượng riêng: d = 10.D = P / V (đơn vị N/m³)',
          'Phương pháp đo khối lượng riêng của vật rắn bất kì bằng cân và bình chia độ'
        ],
        objectives: {
          knowledge: [
            'Nêu được định nghĩa khối lượng riêng của một chất.',
            'Vận dụng công thức D = m/V để tính khối lượng, thể tích hoặc khối lượng riêng của các vật.'
          ]
        }
      },
      {
        id: 'khtn8-phys-ch-16',
        chapterNumber: 3,
        chapterTitle: 'Chương 3: Khối lượng riêng và Áp suất (Vật lí 8)',
        lessonNumber: '16',
        lessonName: 'Áp suất chất lỏng. Áp suất khí quyển',
        summary: 'Chất lỏng gây áp suất theo mọi phương lên đáy bình, thành bình và các vật nhúng trong lòng nó; công thức p = d.h; khí quyển gây áp suất lên mọi vật trên Trái Đất theo mọi hướng.',
        keyPoints: [
          'Áp suất chất lỏng tác dụng theo mọi phương: p = d . h (d là trọng lượng riêng, h là độ sâu tính từ mặt thoáng)',
          'Càng xuống sâu áp suất chất lỏng càng lớn',
          'Bình thông nhau: Trong bình thông nhau chứa cùng một chất lỏng đứng yên, các mặt thoáng đều ở cùng độ cao',
          'Áp suất khí quyển đo bằng khí áp kế, có giá trị xấp xỉ 101 300 Pa (760 mmHg)'
        ],
        objectives: {
          knowledge: [
            'Giải thích được nguyên nhân gây ra áp suất chất lỏng và áp suất khí quyển.',
            'Vận dụng công thức p = d.h để giải thích thiết kế đập thủy điện và hiện tượng hút nước bằng ống hút.'
          ]
        }
      },
      {
        id: 'khtn8-phys-ch-17',
        chapterNumber: 3,
        chapterTitle: 'Chương 3: Khối lượng riêng và Áp suất (Vật lí 8)',
        lessonNumber: '17',
        lessonName: 'Lực đẩy Ác-si-mét (Archimedes)',
        summary: 'Mọi vật nhúng trong chất lỏng đều bị chất lỏng tác dụng một lực đẩy hướng thẳng đứng từ dưới lên; công thức FA = d.V; điều kiện chìm, lơ lửng, nổi của vật.',
        keyPoints: [
          'Lực đẩy Ác-si-mét có phương thẳng đứng, chiều từ dưới lên trên',
          'Công thức: F_A = d . V (d là trọng lượng riêng chất lỏng, V là thể tích phần vật chìm)',
          'Điều kiện vật nổi: P < F_A (hoặc d_vật < d_lỏng)',
          'Điều kiện vật chìm: P > F_A (hoặc d_vật > d_lỏng)',
          'Điều kiện vật lơ lửng: P = F_A (hoặc d_vật = d_lỏng)'
        ],
        objectives: {
          knowledge: [
            'Phát biểu được định luật Ác-si-mét và viết công thức FA = d.V.',
            'Giải thích được nguyên lý nổi của tàu thủy và khinh khí cầu.'
          ]
        }
      },
      {
        id: 'khtn8-phys-ch-18',
        chapterNumber: 4,
        chapterTitle: 'Chương 4: Tác dụng làm quay của lực (Vật lí 8)',
        lessonNumber: '18',
        lessonName: 'Tác dụng làm quay của lực. Moment lực',
        summary: 'Lực tác dụng lên vật có trục quay cố định có thể làm vật quay; moment lực đặc trưng cho tác dụng làm quay của lực; công thức M = F.d (d là cánh tay đòn, khoảng cách từ trục quay đến giá của lực).',
        keyPoints: [
          'Lực có giá song song hoặc cắt trục quay thì không làm vật quay',
          'Moment lực M = F . d (F là độ lớn lực tính bằng N, d là cánh tay đòn tính bằng m)',
          'Đơn vị của moment lực là Newton mét (N.m)',
          'Điều kiện cân bằng của vật có trục quay cố định (Quy tắc moment lực)'
        ],
        objectives: {
          knowledge: [
            'Nêu được khái niệm moment lực và công thức M = F.d.',
            'Giải thích nguyên lý mở cửa, vặn ốc vít bằng mỏ lết.'
          ]
        }
      },
      {
        id: 'khtn8-phys-ch-44',
        chapterNumber: 6,
        chapterTitle: 'Chương 6: Nhiệt học (Vật lí 8)',
        lessonNumber: '44',
        lessonName: 'Nhiệt lượng và Sự truyền nhiệt',
        summary: 'Nhiệt năng là tổng động năng của các phân tử cấu tạo nên vật; 3 hình thức truyền nhiệt: Dẫn nhiệt (chất rắn), đối lưu (chất lỏng, khí), bức xạ nhiệt (qua chân không).',
        keyPoints: [
          'Nhiệt năng có thể biến đổi bằng hai cách: Thực hiện công và truyền nhiệt',
          'Dẫn nhiệt là hình thức truyền nhiệt chủ yếu của chất rắn (kim loại dẫn nhiệt tốt nhất)',
          'Đối lưu là hình thức truyền nhiệt chủ yếu của chất lỏng và chất khí',
          'Bức xạ nhiệt là hình thức truyền nhiệt bằng các tia nhiệt đi thẳng, truyền được trong chân không (ánh nắng mặt trời)'
        ],
        objectives: {
          knowledge: [
            'Phân biệt được 3 hình thức truyền nhiệt: Dẫn nhiệt, đối lưu và bức xạ nhiệt.',
            'Giải thích được cấu tạo của phích nước (bình thủy), mặc áo ấm mùa đông và sơn nhà chống nóng.'
          ]
        }
      }
    ]
  },

  // =========================================================================
  // 4. VẬT LÍ TRONG KHTN 9 (KẾT NỐI TRI THỨC VỚI CUỘC SỐNG)
  // =========================================================================
  {
    id: 'doc-sgk-khtn-9-phys',
    name: 'SGK Khoa học tự nhiên 9 - Phân môn Vật lí (Kết Nối Tri Thức)',
    category: 'sgk',
    subject: 'Khoa học tự nhiên',
    grade: 'Lớp 9',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-01',
    fileSize: '23.5 MB',
    pageCount: 220,
    status: 'indexed',
    rawTextPreview: 'Chương trình Vật lí KHTN 9 gồm: Cơ học (Công cơ học, công suất, cơ năng, động năng, thế năng); Quang học (Khúc xạ ánh sáng, phản xạ toàn phần, thấu kính hội tụ, thấu kính phân kì, kính lúp); Điện học (Định luật Ohm, đoạn mạch nối tiếp song song, công suất điện, hiện tượng cảm ứng điện từ, máy biến áp)...',
    chapters: [
      {
        id: 'khtn9-phys-ch-1',
        chapterNumber: 1,
        chapterTitle: 'Chương 1: Công và Năng lượng (Vật lí 9)',
        lessonNumber: '1',
        lessonName: 'Công và Công suất',
        summary: 'Công cơ học xuất hiện khi có lực tác dụng vào vật và vật chuyển dời theo phương của lực; công thức A = F.s (Joule - J); công suất là công thực hiện được trong một đơn vị thời gian; công thức P = A/t (Watt - W).',
        keyPoints: [
          'Điều kiện có công cơ học: Phải có lực F tác dụng và vật dịch chuyển quãng đường s',
          'Công thức tính công: A = F . s (F tính bằng N, s tính bằng m, A tính bằng J)',
          'Công suất P = A / t đặc trưng cho tốc độ sinh công (đơn vị Watt - W, 1 kW = 1000 W)',
          'Mối liên hệ giữa công suất, lực và vận tốc: P = F . v'
        ],
        objectives: {
          knowledge: [
            'Nêu được điều kiện để có công cơ học và ý nghĩa của công suất.',
            'Vận dụng công thức A = F.s và P = A/t để tính toán các đại lượng trong thực tế cần trục, động cơ xe hơi.'
          ]
        }
      },
      {
        id: 'khtn9-phys-ch-2',
        chapterNumber: 1,
        chapterTitle: 'Chương 1: Công và Năng lượng (Vật lí 9)',
        lessonNumber: '2',
        lessonName: 'Cơ năng (Động năng và Thế năng)',
        summary: 'Cơ năng của vật là tổng động năng và thế năng; động năng do chuyển động mà có (phụ thuộc khối lượng và vận tốc); thế năng trọng trường do vị trí so với mặt đất (phụ thuộc khối lượng và độ cao); bảo toàn cơ năng khi bỏ qua ma sát.',
        keyPoints: [
          'Động năng: Năng lượng vật có được do đang chuyển động W_đ = 1/2 m.v²',
          'Thế năng trọng trường: Năng lượng vật có được do độ cao so với mốc thế năng W_t = m.g.h',
          'Cơ năng: W = W_đ + W_t',
          'Định luật bảo toàn cơ năng: Trong quá trình chuyển động, nếu chỉ chịu tác dụng của trọng lực thì cơ năng được bảo toàn (động năng giảm thì thế năng tăng và ngược lại)'
        ],
        objectives: {
          knowledge: [
            'Nêu được khái niệm động năng, thế năng và cơ năng.',
            'Giải thích sự chuyển hóa qua lại giữa động năng và thế năng của con lắc đơn hoặc vật rơi tự do.'
          ]
        }
      },
      {
        id: 'khtn9-phys-ch-3',
        chapterNumber: 2,
        chapterTitle: 'Chương 2: Ánh sáng (Quang học 9)',
        lessonNumber: '3',
        lessonName: 'Khúc xạ ánh sáng',
        summary: 'Hiện tượng tia sáng bị gãy khúc tại mặt phân cách giữa hai môi trường trong suốt gọi là hiện tượng khúc xạ ánh sáng; tia khúc xạ nằm trong mặt phẳng tới; khi truyền từ không khí vào nước, góc khúc xạ nhỏ hơn góc tới (r < i).',
        keyPoints: [
          'Khúc xạ ánh sáng là hiện tượng tia sáng bị đổi phương đột ngột khi truyền xiên góc qua mặt phân cách giữa 2 môi trường trong suốt',
          'Tia khúc xạ nằm trong mặt phẳng tới (tạo bởi tia tới và pháp tuyến)',
          'Khi ánh sáng truyền từ không khí vào nước hoặc thủy tinh: r < i',
          'Khi ánh sáng truyền từ nước hoặc thủy tinh ra không khí: r > i'
        ],
        objectives: {
          knowledge: [
            'Mô tả được hiện tượng khúc xạ ánh sáng.',
            'Phân biệt được hiện tượng phản xạ ánh sáng và hiện tượng khúc xạ ánh sáng.'
          ]
        }
      },
      {
        id: 'khtn9-phys-ch-5',
        chapterNumber: 2,
        chapterTitle: 'Chương 2: Ánh sáng (Quang học 9)',
        lessonNumber: '5',
        lessonName: 'Thấu kính hội tụ và Thấu kính phân kì',
        summary: 'Thấu kính hội tụ có phần rìa mỏng hơn phần giữa, chùm tia tới song song cho chùm tia ló hội tụ tại tiêu điểm F; Thấu kính phân kì có phần rìa dày hơn phần giữa, chùm tia tới song song cho chùm tia ló phân kì.',
        keyPoints: [
          'Trục chính, quang tâm O, tiêu điểm F và F\', tiêu cự f = OF = OF\'',
          '3 tia sáng đặc biệt qua thấu kính hội tụ: (1) Tia tới qua quang tâm O truyền thẳng; (2) Tia tới song song trục chính cho tia ló qua F\'; (3) Tia tới qua F cho tia ló song song trục chính',
          'Đặc điểm ảnh qua thấu kính hội tụ: Vật đặt ngoài tiêu cự (d > f) cho ảnh thật ngược chiều; vật đặt trong tiêu cự (d < f) cho ảnh ảo cùng chiều lớn hơn vật',
          'Thấu kính phân kì luôn cho ảnh ảo, cùng chiều và nhỏ hơn vật'
        ],
        objectives: {
          knowledge: [
            'Nêu được đặc điểm quang học của thấu kính hội tụ và phân kì.',
            'Vẽ được đường truyền của các tia sáng đặc biệt và xác định ảnh của một vật qua thấu kính.'
          ]
        }
      },
      {
        id: 'khtn9-phys-ch-8',
        chapterNumber: 3,
        chapterTitle: 'Chương 3: Điện (Điện học 9)',
        lessonNumber: '8',
        lessonName: 'Định luật Ohm. Điện trở của dây dẫn',
        summary: 'Cường độ dòng điện chạy qua dây dẫn tỉ lệ thuận với hiệu điện thế giữa hai đầu dây và tỉ lệ nghịch với điện trở của dây; công thức I = U/R; đơn vị điện trở là Ohm (Ω).',
        keyPoints: [
          'Định luật Ohm: I = U / R (U tính bằng Vôn - V, R tính bằng Ohm - Ω, I tính bằng Ampe - A)',
          'Điện trở R = U / I đặc trưng cho mức độ cản trở dòng điện của vật dẫn',
          'Điện trở của dây dẫn phụ thuộc chiều dài l, tiết diện S và vật liệu: R = ρ . l / S (ρ là điện trở suất)'
        ],
        objectives: {
          knowledge: [
            'Phát biểu được định luật Ohm và viết hệ thức I = U/R.',
            'Vận dụng định luật Ohm để giải các bài toán mạch điện đơn giản.'
          ]
        }
      },
      {
        id: 'khtn9-phys-ch-9',
        chapterNumber: 3,
        chapterTitle: 'Chương 3: Điện (Điện học 9)',
        lessonNumber: '9',
        lessonName: 'Đoạn mạch nối tiếp và Đoạn mạch song song',
        summary: 'Đoạn mạch nối tiếp: I = I1 = I2, U = U1 + U2, R_td = R1 + R2; Đoạn mạch song song: U = U1 = U2, I = I1 + I2, 1/R_td = 1/R1 + 1/R2.',
        keyPoints: [
          'Đoạn mạch nối tiếp: I = I1 = I2; U = U1 + U2; R_td = R1 + R2',
          'Đoạn mạch song song: U = U1 = U2; I = I1 + I2; 1/R_td = 1/R1 + 1/R2 (với 2 điện trở: R_td = R1.R2 / (R1 + R2))',
          'Hệ quả: Mắc nối tiếp thì điện trở tương đương tăng lên; mắc song song thì điện trở tương đương giảm đi'
        ],
        objectives: {
          knowledge: [
            'Viết được các công thức tính I, U, R_td cho đoạn mạch nối tiếp và song song.',
            'Tính toán thành thạo các thông số trong mạch điện gia đình.'
          ]
        }
      },
      {
        id: 'khtn9-phys-ch-11',
        chapterNumber: 4,
        chapterTitle: 'Chương 4: Điện từ học (Vật lí 9)',
        lessonNumber: '11',
        lessonName: 'Hiện tượng cảm ứng điện từ và Dòng điện xoay chiều',
        summary: 'Dòng điện cảm ứng xuất hiện trong cuộn dây dẫn kín khi số đường sức từ xuyên qua tiết diện cuộn dây biến thiên; dòng điện luân phiên đổi chiều gọi là dòng điện xoay chiều (AC).',
        keyPoints: [
          'Hiện tượng cảm ứng điện từ: Xuất hiện khi đưa nam châm lại gần hoặc ra xa cuộn dây kín',
          'Điều kiện sinh dòng điện cảm ứng: Số đường sức từ xuyên qua tiết diện S biến thiên',
          'Dòng điện xoay chiều (AC) có chiều luân phiên thay đổi theo chu kì (dòng điện lưới 220V - 50Hz)',
          'Máy biến áp: Hoạt động dựa trên cảm ứng điện từ, tỉ số điện áp U1/U2 = N1/N2'
        ],
        objectives: {
          knowledge: [
            'Giải thích được điều kiện xuất hiện dòng điện cảm ứng.',
            'Nêu được nguyên tắc hoạt động của máy phát điện xoay chiều và máy biến áp.'
          ]
        }
      }
    ]
  }
];
