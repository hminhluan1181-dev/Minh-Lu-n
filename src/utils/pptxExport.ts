import pptxgen from 'pptxgenjs';
import { SlideDeck, TeacherProfile } from '../types';

/**
 * Xuất tệp Microsoft PowerPoint chuẩn (.pptx) định dạng 16:9
 * Toàn bộ nội dung hiển thị dạng tĩnh (Static Content), không bị mất chữ hay phụ thuộc hiệu ứng động.
 */
export async function exportToPowerPointPPTX(
  deck: SlideDeck,
  teacher: TeacherProfile,
  lessonName: string
): Promise<void> {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = teacher.name || 'EduStandard VN';
  pptx.company = teacher.school || 'Bộ Giáo dục & Đào tạo';
  pptx.title = deck.title || lessonName;

  // Màu sắc chủ đạo sư phạm (Slate, Navy Blue, Emerald, Amber)
  const COLOR_PRIMARY = '1E3A8A';   // Blue 900
  const COLOR_ACCENT = '2563EB';    // Blue 600
  const COLOR_TEXT_DARK = '0F172A'; // Slate 900
  const COLOR_TEXT_MUTED = '475569';// Slate 600
  const COLOR_BG_LIGHT = 'F8FAFC';  // Slate 50
  const COLOR_CARD_BG = 'FFFFFF';
  const COLOR_BORDER = 'CBD5E1';

  deck.slides.forEach((s, idx) => {
    const slide = pptx.addSlide();

    // 1. Nền slide 16:9
    slide.background = { color: idx === 0 ? '0F172A' : 'F8FAFC' };

    // Slide bìa (Cover Slide)
    if (idx === 0) {
      // Header tag
      slide.addText(s.stageLabel ? s.stageLabel.toUpperCase() : 'BÀI GIẢNG ĐIỆN TỬ CHUẨN GDPT 2018', {
        x: 0.8,
        y: 0.8,
        w: 8.5,
        h: 0.4,
        fontSize: 12,
        bold: true,
        color: '60A5FA', // Blue 400
        fontFace: 'Arial'
      });

      // Tiêu đề bài học lớn
      slide.addText(s.title || lessonName, {
        x: 0.8,
        y: 1.4,
        w: 11.5,
        h: 1.6,
        fontSize: 28,
        bold: true,
        color: 'FFFFFF',
        fontFace: 'Arial'
      });

      // Phụ đề bài học
      if (s.subtitle) {
        slide.addText(s.subtitle, {
          x: 0.8,
          y: 3.1,
          w: 11.5,
          h: 0.6,
          fontSize: 15,
          italic: true,
          color: '94A3B8',
          fontFace: 'Arial'
        });
      }

      // Hộp nội dung trọng tâm tĩnh
      if (s.bulletPoints && s.bulletPoints.length > 0) {
        const bulletsText = s.bulletPoints.map(pt => ({
          text: `• ${pt}\n`,
          options: { fontSize: 13, color: 'E2E8F0', fontFace: 'Arial' }
        }));

        slide.addText(bulletsText, {
          x: 0.8,
          y: 3.9,
          w: 11.5,
          h: 2.2,
          valign: 'top'
        });
      }

      // Chân trang bìa: Tên giáo viên & Trường
      slide.addText(`Người soạn: ${teacher.name} | ${teacher.department} | ${teacher.school}`, {
        x: 0.8,
        y: 6.5,
        w: 11.5,
        h: 0.4,
        fontSize: 11,
        color: '94A3B8',
        fontFace: 'Arial',
        bold: true
      });

      return;
    }

    // 2. CÁC SLIDE NỘI DUNG TĨNH (Slide 2 trở đi)
    
    // Top Bar Ribbon
    slide.addShape('rect', {
      x: 0,
      y: 0,
      w: 13.33,
      h: 0.9,
      fill: { color: 'FFFFFF' },
      line: { color: 'E2E8F0', width: 1 }
    });

    // Huy hiệu Hoạt động / Giai đoạn
    slide.addShape('roundRect', {
      x: 0.6,
      y: 0.22,
      w: 2.2,
      h: 0.45,
      fill: { color: 'EFF6FF' },
      line: { color: 'BFDBFE', width: 1 }
    });

    slide.addText(s.stageLabel ? s.stageLabel.toUpperCase() : 'HOẠT ĐỘNG', {
      x: 0.6,
      y: 0.22,
      w: 2.2,
      h: 0.45,
      fontSize: 10,
      bold: true,
      color: COLOR_ACCENT,
      fontFace: 'Arial',
      align: 'center',
      valign: 'middle'
    });

    // Tiêu đề slide
    slide.addText(s.title, {
      x: 3.0,
      y: 0.15,
      w: 8.5,
      h: 0.6,
      fontSize: 17,
      bold: true,
      color: COLOR_TEXT_DARK,
      fontFace: 'Arial',
      valign: 'middle'
    });

    // Số trang ở góc trên bên phải
    slide.addText(`${idx + 1} / ${deck.slides.length}`, {
      x: 11.8,
      y: 0.25,
      w: 1.0,
      h: 0.4,
      fontSize: 11,
      color: COLOR_TEXT_MUTED,
      fontFace: 'Arial',
      align: 'right'
    });

    // Subtitle nếu có
    if (s.subtitle) {
      slide.addText(s.subtitle, {
        x: 0.6,
        y: 1.05,
        w: 12.1,
        h: 0.35,
        fontSize: 11,
        italic: true,
        color: COLOR_TEXT_MUTED,
        fontFace: 'Arial'
      });
    }

    // VÙNG NỘI DUNG TĨNH CHÍNH (Layout 2 cột nếu có Box, hoặc 1 khối rộng)
    const hasCallout = Boolean(s.calloutBox || s.formulaOrCode);
    const colWidth = hasCallout ? 7.2 : 12.1;

    // Card nội dung bên trái (Kiến thức trọng tâm)
    slide.addShape('roundRect', {
      x: 0.6,
      y: 1.45,
      w: colWidth,
      h: 4.8,
      fill: { color: COLOR_CARD_BG },
      line: { color: COLOR_BORDER, width: 1 }
    });

    slide.addText('KIẾN THỨC VÀ TIẾN TRÌNH THỰC HIỆN', {
      x: 0.9,
      y: 1.65,
      w: colWidth - 0.6,
      h: 0.35,
      fontSize: 11,
      bold: true,
      color: COLOR_PRIMARY,
      fontFace: 'Arial'
    });

    // Danh sách các ý kiến thức tĩnh
    if (s.bulletPoints && s.bulletPoints.length > 0) {
      const bulletsList = s.bulletPoints.map(b => ({
        text: `▪  ${b}\n\n`,
        options: { fontSize: 13, color: COLOR_TEXT_DARK, fontFace: 'Arial' }
      }));

      slide.addText(bulletsList, {
        x: 0.9,
        y: 2.1,
        w: colWidth - 0.6,
        h: 3.9,
        valign: 'top'
      });
    }

    // Card bên phải: Khái niệm cốt lõi / Công thức nổi bật tĩnh
    if (hasCallout) {
      const rightX = 8.1;
      const rightW = 4.6;

      slide.addShape('roundRect', {
        x: rightX,
        y: 1.45,
        w: rightW,
        h: 4.8,
        fill: { color: 'F0FDF4' }, // Emerald 50
        line: { color: 'BBF7D0', width: 1 }
      });

      slide.addText('KHÁI NIỆM & CÔNG THỨC TRỌNG TÂM', {
        x: rightX + 0.3,
        y: 1.65,
        w: rightW - 0.6,
        h: 0.35,
        fontSize: 11,
        bold: true,
        color: '166534', // Emerald 800
        fontFace: 'Arial'
      });

      if (s.formulaOrCode) {
        slide.addShape('roundRect', {
          x: rightX + 0.3,
          y: 2.15,
          w: rightW - 0.6,
          h: 1.1,
          fill: { color: '0F172A' }
        });

        slide.addText(s.formulaOrCode, {
          x: rightX + 0.3,
          y: 2.15,
          w: rightW - 0.6,
          h: 1.1,
          fontSize: 13,
          fontFace: 'Consolas',
          bold: true,
          color: '34D399',
          align: 'center',
          valign: 'middle'
        });
      }

      if (s.calloutBox) {
        const boxY = s.formulaOrCode ? 3.4 : 2.15;
        const boxH = s.formulaOrCode ? 2.6 : 3.8;

        slide.addText(s.calloutBox.title ? s.calloutBox.title.toUpperCase() : 'GHI CHÚ SƯ PHẠM', {
          x: rightX + 0.3,
          y: boxY,
          w: rightW - 0.6,
          h: 0.35,
          fontSize: 11,
          bold: true,
          color: '047857',
          fontFace: 'Arial'
        });

        slide.addText(s.calloutBox.text, {
          x: rightX + 0.3,
          y: boxY + 0.4,
          w: rightW - 0.6,
          h: boxH - 0.5,
          fontSize: 11.5,
          color: '1F2937',
          fontFace: 'Arial',
          valign: 'top'
        });
      }
    }

    // 3. Chân trang cố định tĩnh: Tên bài, Trường học, Giáo viên
    slide.addShape('line', {
      x: 0.6,
      y: 6.6,
      w: 12.1,
      h: 0,
      line: { color: 'E2E8F0', width: 1 }
    });

    slide.addText(`${lessonName} | ${teacher.school} | GV: ${teacher.name}`, {
      x: 0.6,
      y: 6.7,
      w: 10.0,
      h: 0.4,
      fontSize: 9.5,
      color: COLOR_TEXT_MUTED,
      fontFace: 'Arial'
    });

    slide.addText(`Trang ${idx + 1}`, {
      x: 11.0,
      y: 6.7,
      w: 1.7,
      h: 0.4,
      fontSize: 9.5,
      color: COLOR_TEXT_MUTED,
      fontFace: 'Arial',
      align: 'right'
    });
  });

  // Tải tệp PowerPoint về máy người dùng
  const safeTitle = (lessonName || 'Slide_Bai_Giang')
    .replace(/[^a-zA-Z0-9\u00C0-\u1EF9]/g, '_')
    .slice(0, 40);
  await pptx.writeFile({ fileName: `${safeTitle}_16x9_ChuanBo.pptx` });
}
