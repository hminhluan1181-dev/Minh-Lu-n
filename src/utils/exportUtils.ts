import { WorkspaceState, MatrixRowItem, SpecSheetRow } from '../types';

/**
 * Xuất tài liệu Microsoft Word (.doc) định dạng HTML hoàn chỉnh
 * Có hỗ trợ bảng biểu, ngắt trang, font Times New Roman chuẩn văn bản hành chính Việt Nam.
 */
export function exportToWord(filename: string, contentHtml: string, title: string = 'TÀI LIỆU DẠY HỌC CHUẨN BGDĐT') {
  const header = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
      <style>
        @page {
          size: A4;
          margin: 20mm 20mm 20mm 25mm;
          mso-page-orientation: portrait;
        }
        body {
          font-family: 'Times New Roman', Times, serif;
          font-size: 13pt;
          line-height: 1.35;
          color: #000000;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 12pt 0;
          font-size: 11pt;
        }
        th, td {
          border: 1px solid #000000;
          padding: 5pt 6pt;
          vertical-align: top;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
          text-align: center;
        }
        h1 { font-size: 15pt; text-align: center; text-transform: uppercase; margin: 12pt 0 6pt 0; font-weight: bold; }
        h2 { font-size: 14pt; margin: 10pt 0 4pt 0; font-weight: bold; }
        h3 { font-size: 13pt; margin: 8pt 0 3pt 0; font-weight: bold; }
        p { margin: 4pt 0; text-align: justify; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
        .italic { font-style: italic; }
        .page-break { page-break-before: always; }
      </style>
    </head>
    <body>
      ${contentHtml}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', header], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Xuất Ma trận và Bản đặc tả đề kiểm tra định kì chuẩn Phụ lục 1 & 2 CV 7991 sang Word
 */
export function exportMatrixSpecWord(subject: string, grade: string, matrixRows: MatrixRowItem[], specRows: SpecSheetRow[]) {
  const contentHtml = `
    <div style="text-align: center; margin-bottom: 20px;">
      <p style="font-weight: bold; margin: 0;">BỘ GIÁO DỤC VÀ ĐÀO TẠO</p>
      <p style="margin: 0; font-style: italic;">(Kèm theo Công văn số 7991/BGDĐT-GDTrH ngày 17/12/2024 của Bộ GDĐT)</p>
      <h1 style="margin: 15px 0 5px 0;">1. MA TRẬN ĐỀ KIỂM TRA ĐỊNH KÌ</h1>
      <p style="margin: 0;">Môn: <b>${subject}</b> - Khối: <b>${grade}</b> (Khung tỉ lệ: 40% Biết - 30% Hiểu - 30% Vận dụng)</p>
    </div>

    <table>
      <thead>
        <tr>
          <th rowspan="3">TT</th>
          <th rowspan="3">Chủ đề/Chương</th>
          <th rowspan="3">Nội dung/đơn vị kiến thức</th>
          <th colspan="12">Mức độ đánh giá</th>
          <th colspan="3" rowspan="2">Tổng</th>
          <th rowspan="3">Tỉ lệ %</th>
        </tr>
        <tr>
          <th colspan="9">TNKQ</th>
          <th colspan="3">Tự luận</th>
        </tr>
        <tr>
          <th>Nhiều lựa chọn</th>
          <th>Đúng - Sai</th>
          <th>Trả lời ngắn</th>
          <th>Biết</th><th>Hiểu</th><th>VD</th>
          <th>Biết</th><th>Hiểu</th><th>VD</th>
          <th>Biết</th><th>Hiểu</th><th>VD</th>
          <th>Biết</th><th>Hiểu</th><th>VD</th>
        </tr>
      </thead>
      <tbody>
        ${matrixRows.map((r, i) => `
          <tr>
            <td style="text-align: center;">${i + 1}</td>
            <td>${r.chapter}</td>
            <td>${r.unit}</td>
            <td style="text-align: center;">${r.tnkq_nhieuLuaChon.biet + r.tnkq_nhieuLuaChon.hieu}</td>
            <td style="text-align: center;">${r.tnkq_dungSai.biet + r.tnkq_dungSai.hieu + r.tnkq_dungSai.vanDung}</td>
            <td style="text-align: center;">${r.tnkq_traLoiNgan.biet + r.tnkq_traLoiNgan.hieu + r.tnkq_traLoiNgan.vanDung}</td>
            <td style="text-align: center;">${r.tnkq_nhieuLuaChon.biet}</td>
            <td style="text-align: center;">${r.tnkq_nhieuLuaChon.hieu}</td>
            <td style="text-align: center;">${r.tnkq_nhieuLuaChon.vanDung}</td>
            <td style="text-align: center;">${r.tnkq_dungSai.biet}</td>
            <td style="text-align: center;">${r.tnkq_dungSai.hieu}</td>
            <td style="text-align: center;">${r.tnkq_dungSai.vanDung}</td>
            <td style="text-align: center;">${r.tuLuan.biet}</td>
            <td style="text-align: center;">${r.tuLuan.hieu}</td>
            <td style="text-align: center;">${r.tuLuan.vanDung}</td>
            <td style="text-align: center; font-weight: bold;">${r.tnkq_nhieuLuaChon.biet + r.tnkq_dungSai.biet}</td>
            <td style="text-align: center; font-weight: bold;">${r.tnkq_nhieuLuaChon.hieu + r.tnkq_dungSai.hieu + r.tuLuan.hieu}</td>
            <td style="text-align: center; font-weight: bold;">${r.tnkq_dungSai.vanDung + r.tuLuan.vanDung}</td>
            <td style="text-align: center;">${(i === 0 ? 25 : i === 1 ? 45 : 30)}%</td>
          </tr>
        `).join('')}
        <tr style="font-weight: bold; background-color: #f2f2f2;">
          <td colspan="3" style="text-align: right;">Tổng số điểm:</td>
          <td colspan="3" style="text-align: center;">7,0 điểm</td>
          <td colspan="3" style="text-align: center;">3,0 điểm</td>
          <td colspan="3" style="text-align: center;">4,0 điểm</td>
          <td colspan="3" style="text-align: center;">3,0 điểm</td>
          <td colspan="3" style="text-align: center;">3,0 điểm</td>
          <td style="text-align: center;">10,0 điểm</td>
        </tr>
      </tbody>
    </table>

    <div class="page-break"></div>

    <div style="text-align: center; margin: 30px 0 20px 0;">
      <h1 style="margin: 0;">2. BẢN ĐẶC TẢ ĐỀ KIỂM TRA ĐỊNH KÌ</h1>
      <p style="margin: 5px 0 0 0;">(Kèm theo Công văn số 7991/BGDĐT-GDTrH ngày 17/12/2024)</p>
    </div>

    <table>
      <thead>
        <tr>
          <th>TT</th>
          <th>Chủ đề/Chương</th>
          <th>Nội dung/đơn vị kiến thức</th>
          <th>Yêu cầu cần đạt</th>
          <th>Số câu TNKQ</th>
          <th>Số câu Tự luận</th>
        </tr>
      </thead>
      <tbody>
        ${specRows.map((s, i) => `
          <tr>
            <td style="text-align: center;">${i + 1}</td>
            <td><b>${s.chapter}</b></td>
            <td>${s.unit}</td>
            <td>
              <p><b>- Nhận biết:</b> ${s.learningOutcomes.biet.join('; ')}</p>
              <p><b>- Thông hiểu:</b> ${s.learningOutcomes.hieu.join('; ')}</p>
              <p><b>- Vận dụng:</b> ${s.learningOutcomes.vanDung.join('; ')}</p>
            </td>
            <td style="text-align: center;">
              ${s.numberOfQuestions.tnkq_nhieuLuaChon.biet + s.numberOfQuestions.tnkq_nhieuLuaChon.hieu + s.numberOfQuestions.tnkq_dungSai.biet + s.numberOfQuestions.tnkq_dungSai.hieu + s.numberOfQuestions.tnkq_traLoiNgan.hieu}
            </td>
            <td style="text-align: center;">
              ${s.numberOfQuestions.tuLuan.hieu + s.numberOfQuestions.tuLuan.vanDung}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  exportToWord(`MA_TRAN_DAC_TA_7991_${subject}_${grade}`, contentHtml, `MA TRẬN VÀ BẢN ĐẶC TẢ CV 7991 - ${subject}`);
}

/**
 * Xuất file JSON State để lưu trữ hoặc bàn giao phiên làm việc
 */
export function exportWorkspaceToJson(state: WorkspaceState) {
  const jsonStr = JSON.stringify(state, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  a.href = url;
  a.download = `EdTech_SessionState_${state.lessonPlan.subject}_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Xuất Single-File HTML tự hành độc lập (Standalone Single-File HTML)
 * Cho phép giáo viên lưu và mở trực tiếp bằng trình duyệt mà không cần cài đặt Node.js hay dòng lệnh.
 */
export async function exportStandaloneHtmlFile(state: WorkspaceState) {
  try {
    const res = await fetch('/edtech_shell.html');
    if (res.ok) {
      const htmlText = await res.text();
      const blob = new Blob([htmlText], { type: 'text/html;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `EduStandard_VN_${state.lessonPlan.subject}_${state.lessonPlan.grade}_SingleFile.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }
  } catch (err) {
    console.warn('Fallback direct link for edtech_shell.html', err);
  }

  // Fallback direct download link
  const a = document.createElement('a');
  a.href = '/edtech_shell.html';
  a.download = `EduStandard_VN_${state.lessonPlan.subject}_SingleFile.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
