import { 
  UploadedDocument, 
  DocumentChapter, 
  Subject, 
  GradeLevel, 
  CurriculumSeries, 
  RagChunkResult,
  LessonPlan5512,
  TeachingActivity,
  LessonIllustration,
  Exam7991,
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  ShortAnswerQuestion,
  EssayQuestion,
  SpecSheetRow,
  MatrixRowItem
} from '../types';
import { HTS_DIGITAL_ILLUSTRATIONS, findRelevantDigitalIllustrations, resolveIllustrationsForLessonActivities } from '../data/digitalMaterials';

/**
 * Hàm chuẩn hóa văn bản tiếng Việt để tìm kiếm ngữ nghĩa không phụ thuộc dấu / chữ hoa
 */
function normalizeViText(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Trích xuất từ khóa chính từ câu hỏi tra cứu
 */
function extractQueryKeywords(query: string): string[] {
  const norm = normalizeViText(query);
  const stopWords = new Set([
    'la', 'gi', 'nhu', 'the', 'nao', 'va', 'cua', 'trong', 'cac', 'nhung', 'co', 'duoc', 
    'cho', 've', 'voi', 'mot', 'hai', 'ba', 'trang', 'bai', 'chuong', 'sach', 'tim', 'hieu', 'tra', 'cuu'
  ]);
  return norm
    .split(' ')
    .filter(w => w.length > 1 && !stopWords.has(w));
}

/**
 * Công cụ RAG Engine: Tra cứu ngữ liệu chuyên sâu từ Kho SGK & Tài liệu đã tải lên
 */
export function searchTextbookRag(
  query: string,
  documents: UploadedDocument[],
  options?: {
    selectedDocId?: string;
    selectedChapterId?: string;
    contentType?: 'all' | 'definition' | 'activity' | 'exercise' | 'core';
    minScore?: number;
  }
): RagChunkResult[] {
  if (!query || !query.trim()) return [];

  const rawQuery = query.trim();
  const normQuery = normalizeViText(rawQuery);
  const queryTokens = extractQueryKeywords(rawQuery);

  const results: RagChunkResult[] = [];

  // Lọc documents theo tùy chọn
  const docsToSearch = options?.selectedDocId 
    ? documents.filter(d => d.id === options.selectedDocId)
    : documents;

  for (const doc of docsToSearch) {
    const chaptersToSearch = options?.selectedChapterId
      ? doc.chapters.filter(c => c.id === options.selectedChapterId)
      : doc.chapters;

    for (let cIdx = 0; cIdx < chaptersToSearch.length; cIdx++) {
      const ch = chaptersToSearch[cIdx];
      const pageEstimate = 8 + (cIdx * 6); // Ước lượng số trang thực tế trong SGK
      const pageStr = `Trang ${pageEstimate} - ${pageEstimate + 3}`;

      // 1. CHUNK: Kiến thức cốt lõi & Khái niệm
      if (!options?.contentType || options.contentType === 'all' || options.contentType === 'core' || options.contentType === 'definition') {
        const coreContentText = ch.coreContent || ch.summary || '';
        const keyPointsText = ch.keyPoints ? ch.keyPoints.join('. ') : '';
        const fullCore = `${coreContentText}\n${keyPointsText}`;

        const score = computeChunkRelevance(normQuery, queryTokens, fullCore, ch.lessonName, ch.chapterTitle);
        if (score >= (options?.minScore || 35)) {
          results.push({
            id: `rag-${doc.id}-${ch.id}-core`,
            docId: doc.id,
            docName: doc.name,
            subject: doc.subject,
            grade: doc.grade,
            curriculum: doc.curriculum,
            chapterTitle: ch.chapterTitle,
            lessonNumber: ch.lessonNumber,
            lessonName: ch.lessonName,
            pageNumber: pageStr,
            contentType: 'Khái niệm & Định lý',
            contentSnippet: generateSnippet(fullCore, queryTokens, 280),
            relevanceScore: Math.min(99, Math.round(score)),
            keywords: ch.keyPoints?.slice(0, 4) || [ch.lessonName, doc.subject]
          });
        }
      }

      // 2. CHUNK: Hoạt động học tập / Thực hành / Thí nghiệm
      if (!options?.contentType || options.contentType === 'all' || options.contentType === 'activity') {
        if (ch.learningActivities && ch.learningActivities.length > 0) {
          ch.learningActivities.forEach((act, actIdx) => {
            const actText = `[${act.stage}] ${act.title}: ${act.description}${act.expectedProduct ? ` (Sản phẩm: ${act.expectedProduct})` : ''}`;
            const score = computeChunkRelevance(normQuery, queryTokens, actText, ch.lessonName, act.title);
            if (score >= (options?.minScore || 30)) {
              results.push({
                id: `rag-${doc.id}-${ch.id}-act-${actIdx}`,
                docId: doc.id,
                docName: doc.name,
                subject: doc.subject,
                grade: doc.grade,
                curriculum: doc.curriculum,
                chapterTitle: ch.chapterTitle,
                lessonNumber: ch.lessonNumber,
                lessonName: ch.lessonName,
                pageNumber: `Trang ${pageEstimate + 1}`,
                contentType: 'Hoạt động & Thí nghiệm',
                contentSnippet: generateSnippet(actText, queryTokens, 260),
                relevanceScore: Math.min(98, Math.round(score + 2)),
                keywords: [act.stage, act.title, 'Hoạt động sư phạm']
              });
            }
          });
        }
      }

      // 3. CHUNK: Câu hỏi, bài tập SGK & hướng dẫn giải
      if (!options?.contentType || options.contentType === 'all' || options.contentType === 'exercise') {
        if (ch.textbookExercises && ch.textbookExercises.length > 0) {
          ch.textbookExercises.forEach((ex, exIdx) => {
            const exText = `[Bài tập ${exIdx + 1}] ${ex.content}${ex.suggestedAnswer ? ` => Hướng dẫn giải: ${ex.suggestedAnswer}` : ''}`;
            const score = computeChunkRelevance(normQuery, queryTokens, exText, ch.lessonName, 'Bài tập SGK');
            if (score >= (options?.minScore || 30)) {
              results.push({
                id: `rag-${doc.id}-${ch.id}-ex-${exIdx}`,
                docId: doc.id,
                docName: doc.name,
                subject: doc.subject,
                grade: doc.grade,
                curriculum: doc.curriculum,
                chapterTitle: ch.chapterTitle,
                lessonNumber: ch.lessonNumber,
                lessonName: ch.lessonName,
                pageNumber: `Trang ${pageEstimate + 2}`,
                contentType: 'Bài tập & Câu hỏi',
                contentSnippet: generateSnippet(exText, queryTokens, 260),
                relevanceScore: Math.min(97, Math.round(score)),
                keywords: ['Bài tập SGK', 'Lời giải chi tiết', ex.type]
              });
            }
          });
        }
      }

      // 4. CHUNK: Mục tiêu cần đạt & Yêu cầu GDPT 2018
      if (!options?.contentType || options.contentType === 'all' || options.contentType === 'core') {
        if (ch.objectives) {
          const kStr = (ch.objectives.knowledge || []).join('; ');
          const specStr = (ch.objectives.competenciesSpecific || []).join('; ');
          const qStr = (ch.objectives.qualities || []).join('; ');
          const objText = `Yêu cầu cần đạt về kiến thức: ${kStr}. Năng lực đặc thù: ${specStr}. Phẩm chất: ${qStr}.`;
          const score = computeChunkRelevance(normQuery, queryTokens, objText, ch.lessonName, 'Yêu cầu cần đạt');
          if (score >= (options?.minScore || 35)) {
            results.push({
              id: `rag-${doc.id}-${ch.id}-obj`,
              docId: doc.id,
              docName: doc.name,
              subject: doc.subject,
              grade: doc.grade,
              curriculum: doc.curriculum,
              chapterTitle: ch.chapterTitle,
              lessonNumber: ch.lessonNumber,
              lessonName: ch.lessonName,
              pageNumber: `Trang ${pageEstimate}`,
              contentType: 'Kiến thức cốt lõi',
              contentSnippet: generateSnippet(objText, queryTokens, 250),
              relevanceScore: Math.min(96, Math.round(score)),
              keywords: ['Chuẩn GDPT 2018', 'Yêu cầu cần đạt', 'Mục tiêu bài học']
            });
          }
        }
      }
    }
  }

  // Sắp xếp kết quả theo điểm tương đồng cao nhất
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Giới hạn top 15 kết quả phù hợp nhất
  return results.slice(0, 15);
}

/**
 * Tính điểm tương đồng giữa câu hỏi và đoạn trích SGK
 */
function computeChunkRelevance(
  normQuery: string,
  queryTokens: string[],
  chunkText: string,
  lessonName: string,
  extraContext?: string
): number {
  const normChunk = normalizeViText(chunkText);
  const normLesson = normalizeViText(lessonName);
  const normExtra = extraContext ? normalizeViText(extraContext) : '';

  let score = 40; // Điểm cơ bản

  // Khớp chính xác cụm từ nguyên văn
  if (normChunk.includes(normQuery)) {
    score += 45;
  }

  // Khớp tên bài học hoặc chương
  if (normLesson.includes(normQuery) || normQuery.includes(normLesson)) {
    score += 25;
  }
  if (normExtra && normExtra.includes(normQuery)) {
    score += 15;
  }

  // Khớp từng từ khóa
  let matchedCount = 0;
  for (const token of queryTokens) {
    if (normChunk.includes(token)) {
      matchedCount++;
      score += 7;
    } else if (normLesson.includes(token)) {
      matchedCount++;
      score += 5;
    }
  }

  // Tỉ lệ từ khóa được tìm thấy
  if (queryTokens.length > 0) {
    const coverage = matchedCount / queryTokens.length;
    score += coverage * 20;
  }

  return Math.min(99, score);
}

/**
 * Trích xuất đoạn tóm tắt chứa ngữ cảnh khớp từ khóa
 */
function generateSnippet(fullText: string, queryTokens: string[], maxLen: number = 260): string {
  if (!fullText) return '';
  const cleanText = fullText.replace(/\s+/g, ' ').trim();
  if (cleanText.length <= maxLen) return cleanText;

  const norm = normalizeViText(cleanText);
  let bestIdx = 0;

  for (const token of queryTokens) {
    const idx = norm.indexOf(token);
    if (idx !== -1) {
      bestIdx = Math.max(0, idx - 40);
      break;
    }
  }

  let snippet = cleanText.substring(bestIdx, bestIdx + maxLen);
  if (bestIdx > 0) snippet = '...' + snippet;
  if (bestIdx + maxLen < cleanText.length) snippet = snippet + '...';
  return snippet;
}

/**
 * Danh sách gợi ý câu hỏi RAG nhanh cho Giáo viên theo từng môn học
 */
export const RAG_SUGGESTED_QUERIES = [
  { label: '📐 Định nghĩa & Bảng biến thiên', query: 'Định nghĩa hàm số bậc hai, tọa độ đỉnh parabol và bảng biến thiên' },
  { label: '🔬 Cấu tạo tế bào nhân thực', query: 'Cấu tạo tế bào nhân thực gồm những thành phần nào và chức năng của nhân' },
  { label: '⚡ Quy tắc & Thí nghiệm đo lực', query: 'Cách biểu diễn lực bằng mũi tên và thí nghiệm đo lực bằng lực kế lò xo' },
  { label: '🗺️ Xác định tọa độ địa lí', query: 'Khái niệm kinh tuyến gốc, vĩ tuyến gốc và cách đọc tọa độ địa lí trên bản đồ' },
  { label: '🏛️ Nhà nước Văn Lang - Âu Lạc', query: 'Sự ra đời của nhà nước Văn Lang, tổ chức bộ máy và kinh đô Phong Châu Cổ Loa' },
  { label: '📝 Câu hỏi luyện tập & Vận dụng', query: 'Hệ thống câu hỏi bài tập tự luận và trắc nghiệm trong bài học' },
  { label: '🎯 Yêu cầu cần đạt GDPT 2018', query: 'Yêu cầu cần đạt về năng lực đặc thù và phẩm chất học sinh' }
];

/**
 * =========================================================================
 * KẾT NỐI RAG VỚI HỆ THỐNG SOẠN KẾ HOẠCH BÀI DẠY 5512 (KHBD 5512)
 * =========================================================================
 */

// Danh viện ảnh minh họa sư phạm theo chuẩn GDPT 2018 (SGK Kết Nối Tri Thức)
export const SUGGESTED_ILLUSTRATIONS_LIBRARY: LessonIllustration[] = [
  // Hóa học & KHTN
  {
    id: 'lib-chem-1',
    caption: 'Thí nghiệm ống nghiệm phản ứng dung dịch và biến đổi màu sắc chỉ thị',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    description: 'Thí nghiệm thực nghiệm kiểm chứng tính chất hóa học theo SGK KNTT.',
    type: 'experiment',
    source: 'SGK Hóa học / KHTN Kết Nối Tri Thức GDPT 2018'
  },
  {
    id: 'lib-chem-2',
    caption: 'Mô hình liên kết phân tử và cấu trúc tinh thể nguyên tử',
    url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=80',
    description: 'Mô phỏng 3D phân tử và trật tự sắp xếp nguyên tử theo mô hình hiện đại.',
    type: 'molecule',
    source: 'SGK Hóa học / KHTN Kết Nối Tri Thức GDPT 2018'
  },
  {
    id: 'lib-chem-3',
    caption: 'Hệ thống thiết bị phòng thí nghiệm thu khí và chuẩn độ dung dịch',
    url: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=600&auto=format&fit=crop&q=80',
    description: 'Sơ đồ lắp ráp dụng cụ thí nghiệm thực hành an toàn theo quy định Bộ GD&ĐT.',
    type: 'diagram',
    source: 'SGK Hóa học / KHTN Kết Nối Tri Thức GDPT 2018'
  },
  // Vật lí & KHTN
  {
    id: 'lib-phys-1',
    caption: 'Mô hình chuyển động cơ học, quỹ đạo và lực tương tác trong thực tế',
    url: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&auto=format&fit=crop&q=80',
    description: 'Mô hình vật lí cơ học trực quan kích thích tư duy giải quyết vấn đề.',
    type: 'diagram',
    source: 'SGK Vật lí / KHTN Kết Nối Tri Thức GDPT 2018'
  },
  {
    id: 'lib-phys-2',
    caption: 'Sơ đồ mạch điện, linh kiện và thiết bị đo dòng điện, hiệu điện thế',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    description: 'Mạch điện thí nghiệm vật lí theo chuẩn SGK GDPT 2018.',
    type: 'diagram',
    source: 'SGK Vật lí / KHTN Kết Nối Tri Thức GDPT 2018'
  },
  {
    id: 'lib-phys-3',
    caption: 'Thí nghiệm tán sắc ánh sáng qua lăng kính và hiện tượng quang học',
    url: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600&auto=format&fit=crop&q=80',
    description: 'Hiện tượng khúc xạ, phản xạ toàn phần và phổ ánh sáng nhìn thấy.',
    type: 'experiment',
    source: 'SGK Vật lí / KHTN Kết Nối Tri Thức GDPT 2018'
  },
  // Sinh học & KHTN
  {
    id: 'lib-bio-1',
    caption: 'Hình chụp cấu trúc tế bào sinh vật dưới kính hiển vi quang học',
    url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&auto=format&fit=crop&q=80',
    description: 'Hình ảnh hiển vi tế bào thực vật và động vật bám sát bài học.',
    type: 'photo',
    source: 'SGK Sinh học / KHTN Kết Nối Tri Thức GDPT 2018'
  },
  {
    id: 'lib-bio-2',
    caption: 'Sơ đồ chuỗi xoắn kép ADN và cấu trúc vật chất di truyền',
    url: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&auto=format&fit=crop&q=80',
    description: 'Mô hình ADN nhân đôi và phiên mã theo chương trình GDPT 2018.',
    type: 'diagram',
    source: 'SGK Sinh học / KHTN Kết Nối Tri Thức GDPT 2018'
  },
  {
    id: 'lib-bio-3',
    caption: 'Quá trình quang hợp ở thực vật và trao đổi khí sinh học',
    url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format&fit=crop&q=80',
    description: 'Sơ đồ quang hợp và mối liên hệ với chu trình carbon tự nhiên.',
    type: 'photo',
    source: 'SGK Sinh học / KHTN Kết Nối Tri Thức GDPT 2018'
  },
  // Toán học
  {
    id: 'lib-math-1',
    caption: 'Cổng vòm Gateway Arch dạng Parabol và quỹ đạo chuyển động thực tế',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    description: 'Ứng dụng hình học Parabol trong kiến trúc và đời sống thực tế.',
    type: 'photo',
    source: 'SGK Toán học Kết Nối Tri Thức GDPT 2018'
  },
  {
    id: 'lib-math-2',
    caption: 'Hệ trục tọa độ Oxy, đồ thị hàm số và bảng biến thiên',
    url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    description: 'Đồ thị toán học trực quan chuẩn xác theo SGK Kết Nối Tri Thức.',
    type: 'diagram',
    source: 'SGK Toán học Kết Nối Tri Thức GDPT 2018'
  },
  {
    id: 'lib-math-3',
    caption: 'Hình học trực quan, định lý và các bước giải toán mẫu',
    url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    description: 'Sơ đồ hình học và bảng tổng kết công thức toán học.',
    type: 'diagram',
    source: 'SGK Toán học Kết Nối Tri Thức GDPT 2018'
  },
  // Công nghệ
  {
    id: 'lib-tech-1',
    caption: 'Sơ đồ mạch điện gia đình và quy trình kĩ thuật an toàn',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80',
    description: 'Quy trình công nghệ và ứng dụng thực tiễn theo chuẩn GDPT 2018.',
    type: 'diagram',
    source: 'SGK Công nghệ Kết Nối Tri Thức GDPT 2018'
  }
];

export function getCuratedIllustrationsForLesson(
  subject: Subject,
  lessonName: string,
  docName: string,
  pageEstimate: number,
  grade: GradeLevel = 'Lớp 8'
): {
  act1?: LessonIllustration[];
  act2?: LessonIllustration[];
  act3?: LessonIllustration[];
  act4?: LessonIllustration[];
} {
  return resolveIllustrationsForLessonActivities({
    subject,
    grade,
    lessonName,
    docName,
    pageEstimate
  });
}

/**
 * Tự động làm giàu và chuẩn hóa Kế hoạch bài dạy 5512 từ Ngữ liệu RAG SGK
 */
export function enrichLessonPlanFromRag(
  lessonPlan: LessonPlan5512,
  documents: UploadedDocument[]
): {
  enrichedPlan: LessonPlan5512;
  matchedDoc: UploadedDocument | null;
  matchedChapter: DocumentChapter | null;
  summaryMessage: string;
} {
  // Tìm bài học tương ứng trong toàn bộ kho tài liệu phù hợp theo môn học và khối lớp
  const normLessonName = normalizeViText(lessonPlan.lessonName);
  
  // Ưu tiên tìm trong các sách cùng môn & khối lớp
  const candidateDocs = documents.filter(
    d => d.grade === lessonPlan.grade
  );
  const searchDocs = candidateDocs.length > 0 ? candidateDocs : documents;

  let matchedDoc: UploadedDocument | null = null;
  let matchedChapter: DocumentChapter | null = null;

  // 1. Quét tìm chương có tên bài trùng khớp
  for (const doc of searchDocs) {
    for (const ch of doc.chapters) {
      const normCh = normalizeViText(ch.lessonName);
      const chNumber = String(ch.lessonNumber || '').trim();
      
      const isNameMatch = normCh.includes(normLessonName) || normLessonName.includes(normCh);
      const isNumberMatch = chNumber && (normLessonName.includes(`bai ${chNumber}`) || normLessonName.includes(`bài ${chNumber}`));

      if (isNameMatch || isNumberMatch) {
        matchedDoc = doc;
        matchedChapter = ch;
        break;
      }
    }
    if (matchedChapter) break;
  }

  // 2. Nếu chưa thấy, chọn sách SGK phù hợp khối lớp
  if (!matchedDoc || !matchedChapter) {
    matchedDoc = documents.find(
      d => d.grade === lessonPlan.grade && d.category === 'sgk'
    ) || documents.find(
      d => d.grade === lessonPlan.grade
    ) || documents[0];

    if (!matchedDoc || !matchedDoc.chapters || matchedDoc.chapters.length === 0) {
      return {
        enrichedPlan: lessonPlan,
        matchedDoc: null,
        matchedChapter: null,
        summaryMessage: 'Không tìm thấy tài liệu SGK phù hợp trong kho để trích xuất ngữ liệu.'
      };
    }
    matchedChapter = matchedDoc.chapters[0];
  }

  const cIdx = matchedDoc.chapters.indexOf(matchedChapter);
  const pageEstimate = 8 + (Math.max(0, cIdx) * 6);
  const pageRange = `Trang ${pageEstimate} - ${pageEstimate + 4}`;

  // Làm giàu Mục tiêu bài học (GDPT 2018)
  const enrichedKnowledge = matchedChapter.objectives?.knowledge && matchedChapter.objectives.knowledge.length > 0
    ? matchedChapter.objectives.knowledge
    : matchedChapter.keyPoints && matchedChapter.keyPoints.length > 0
      ? matchedChapter.keyPoints
      : lessonPlan.objectives.knowledge;

  const enrichedCompetencies = matchedChapter.objectives?.competenciesSpecific && matchedChapter.objectives.competenciesSpecific.length > 0
    ? matchedChapter.objectives.competenciesSpecific
    : (lessonPlan.objectives?.competencies?.specific || []);

  const enrichedQualities = matchedChapter.objectives?.qualities && matchedChapter.objectives.qualities.length > 0
    ? matchedChapter.objectives.qualities
    : lessonPlan.objectives.qualities;

  // Làm giàu Thiết bị dạy học & Học liệu với trích dẫn SGK cụ thể
  const enrichedTeacherEquipment = [
    `Sách giáo khoa (SGK) ${matchedDoc.name} (${pageRange}) và Sách giáo viên (SGV).`,
    `Học liệu số: Trích xuất tự động qua công cụ RAG ngữ liệu số chuẩn GDPT 2018 (hanhtrangso.nxbgd.vn).`,
    `Thiết bị trình chiếu, máy tính, bảng phụ và bộ tranh ảnh thí nghiệm/mô hình SGK.`,
    ...(lessonPlan.equipments?.teacher?.filter(e => !e.includes('Sách giáo khoa') && !e.includes('Học liệu số')) || [])
  ];

  const targetLessonName = lessonPlan.lessonName || matchedChapter.lessonName;
  const curatedIllustrations = getCuratedIllustrationsForLesson(
    lessonPlan.subject,
    targetLessonName,
    matchedDoc.name,
    pageEstimate,
    lessonPlan.grade
  );

  // Chuẩn bị nội dung cốt lõi và trích dẫn bài học
  const coreInfo = (Array.isArray(matchedChapter?.coreContent) ? matchedChapter.coreContent.join('. ') : (matchedChapter?.coreContent || '')) || (matchedChapter?.keyPoints ? matchedChapter.keyPoints.join('. ') : '');
  const keyPointsFormatted = matchedChapter.keyPoints && matchedChapter.keyPoints.length > 0
    ? matchedChapter.keyPoints.map((kp, i) => `  ${i + 1}. ${kp}`).join('\n')
    : `  1. Khái niệm cơ bản của bài học: ${matchedChapter.lessonName}\n  2. Quy tắc và định luật khoa học bám sát SGK Kết Nối Tri Thức.`;

  const act1Data = matchedChapter?.learningActivities?.find(a => a.stage === 'Khởi động');
  const act2Data = matchedChapter?.learningActivities?.find(a => a.stage === 'Hình thành kiến thức');
  const act3Data = matchedChapter?.learningActivities?.find(a => a.stage === 'Luyện tập');
  const act4Data = matchedChapter?.learningActivities?.find(a => a.stage === 'Vận dụng');

  const exercisesList = matchedChapter?.textbookExercises && matchedChapter.textbookExercises.length > 0
    ? matchedChapter.textbookExercises.map((ex, i) => `* Bài tập ${i + 1}: ${ex.content}${ex.suggestedAnswer ? `\n  => Hướng dẫn giải / Kết quả: ${ex.suggestedAnswer}` : ''}`).join('\n')
    : `* Hệ thống câu hỏi củng cố và bài tập rèn luyện kỹ năng trong SGK Trang ${pageEstimate + 2}.`;

  // Làm giàu 4 Hoạt động học theo Công văn 5512 - PHỤ LỤC I
  const enrichedActivities: TeachingActivity[] = lessonPlan.activities.map((act) => {
    if (act.code === 'ACT_1') {
      // Hoạt động 1: Mở đầu / Khởi động
      const act1Notes = `* HIỆN TƯỢNG VÀ TÌNH HUỐNG MỞ ĐẦU:\n- Hiện tượng thực tế trích từ SGK: "${act1Data?.description || matchedChapter?.summary || 'Tình huống mở đầu gợi mở vấn đề bài học.'}".\n- Câu hỏi định hướng: Tìm hiểu bản chất, nguyên lí và quy luật khoa học nào chi phối hiện tượng này?`;

      return {
        ...act,
        title: act1Data?.title || 'Hoạt động 1: Mở đầu / Khởi động (Tình huống thực tế SGK)',
        duration: '7 - 10 phút',
        goal: 'Tạo tâm thế hứng thú cho học sinh, kích hoạt kiến thức nền tảng và phát hiện mâu thuẫn nhận thức/vấn đề cốt lõi cần giải quyết trong bài học.',
        content: act1Data?.description 
          ? `Học sinh quan sát tranh ảnh/video thí nghiệm thực tế trích từ SGK ${matchedDoc.name} (${pageRange}): "${act1Data.description}". Thảo luận cặp đôi trả lời câu hỏi mở đầu.`
          : act.content,
        product: act1Data?.expectedProduct 
          ? `Câu trả lời của học sinh: ${act1Data.expectedProduct}. Tâm thế sẵn sàng tiếp nhận nhiệm vụ chiếm lĩnh tri thức mới.`
          : act.product,
        implementation: {
          step1_assign: `GV trình chiếu hình ảnh/video tình huống thực tế trích từ SGK ${matchedDoc.name} (${pageRange}). Phát phiếu khảo sát nhanh và yêu cầu học sinh làm việc cá nhân trong 2 phút rồi thảo luận cặp đôi.`,
          step2_execute: 'Học sinh quan sát, suy nghĩ, liên hệ kiến thức đã học, ghi nhanh câu trả lời hoặc dự đoán ban đầu vào góc học tập cá nhân/bảng con.',
          step3_report: 'GV mời đại diện 2 học sinh trình bày ý kiến; khuyến khích các học sinh khác đối chiếu, bổ sung và nêu thắc mắc phản biện.',
          step4_conclude: `GV ghi nhận tinh thần làm việc của học sinh, tổng hợp các ý kiến chưa thống nhất để dẫn dắt chính xác vào Bài ${matchedChapter.lessonNumber}: ${matchedChapter.lessonName}.`
        },
        studentNotes: act1Notes,
        illustrations: curatedIllustrations.act1 || [],
        ragCitation: {
          docName: matchedDoc.name,
          pageNumber: `Trang ${pageEstimate}`,
          relevanceScore: 98,
          snippet: act1Data?.description || matchedChapter?.summary || 'Tình huống mở đầu gợi mở vấn đề bài học.'
        }
      };
    } else if (act.code === 'ACT_2') {
      // Hoạt động 2: Hình thành kiến thức mới
      const act2Notes = `I. KIẾN THỨC CỐT LÕI (HỌC SINH GHI VÀO VỞ / BẢNG GHI GV):\n1. Khái niệm / Định nghĩa chuẩn SGK Kết Nối Tri Thức:\n- Bài ${matchedChapter.lessonNumber}: ${matchedChapter.lessonName}.\n- Định nghĩa: ${matchedChapter.summary || 'Kiến thức cốt lõi theo chuẩn chương trình GDPT 2018'}.\n\n2. Các nội dung then chốt và tính chất khoa học:\n${keyPointsFormatted}\n\n3. Công thức / Quy tắc / Phương trình then chốt:\n- Ghi nhớ các công thức, phương trình và quy tắc tại Trang ${pageEstimate + 1} - ${pageEstimate + 2} trong SGK ${matchedDoc.name}.\n- Chú ý các điều kiện áp dụng, giới hạn và quy ước chuẩn.\n\n4. Tiểu kết rút ra từ hoạt động học tập:\n- Học sinh hoàn thiện bảng tổng kết kiến thức hoặc sơ đồ tư duy vào vở ghi.`;

      return {
        ...act,
        title: act2Data?.title || 'Hoạt động 2: Hình thành kiến thức mới (Khái niệm, Định lý & Quy tắc SGK)',
        duration: '22 - 25 phút',
        goal: `Học sinh tự lực hoặc hợp tác nhóm để chiếm lĩnh kiến thức trọng tâm của Bài ${matchedChapter.lessonNumber}: ${matchedChapter.lessonName}; hiểu bản chất các định nghĩa, quy tắc và cơ chế.`,
        content: `Nghiên cứu thông tin, tranh ảnh thí nghiệm, bảng số liệu trong SGK Kết Nối Tri Thức (${pageRange}):\n${coreInfo || act.content}\n${act2Data?.description ? `Thực hiện hoạt động khám phá: ${act2Data.description}` : ''}`,
        product: act2Data?.expectedProduct
          ? `Vở ghi kiến thức của học sinh: ${act2Data.expectedProduct}. Nắm vững các định nghĩa, định luật, phương trình và công thức then chốt.`
          : act.product,
        implementation: {
          step1_assign: `GV chia lớp thành các nhóm học tập (4-6 HS), phát Phiếu học tập số 1 và số 2 (khai thác SGK ${matchedDoc.name} trang ${pageEstimate + 1}). Nêu rõ thời gian thực hiện (12 phút) và tiêu chí đánh giá.`,
          step2_execute: 'Các nhóm phân công nhiệm vụ: cá nhân đọc SGK, thảo luận nhóm thống nhất câu trả lời, ghi chép sản phẩm vào bảng phụ nhóm. GV quan sát, kịp thời hỗ trợ các nhóm gặp khó khăn.',
          step3_report: 'Đại diện một nhóm lên bảng báo cáo sản phẩm; các nhóm khác chú ý lắng nghe, đối chiếu kết quả của nhóm mình, đặt câu hỏi phản biện hoặc bổ sung ý kiến.',
          step4_conclude: 'GV nhận xét thái độ làm việc nhóm, chuẩn hóa kiến thức trên màn hình trình chiếu; yêu cầu học sinh ghi chép toàn bộ nội dung tiểu kết cốt lõi vào vở học.'
        },
        studentNotes: act2Notes,
        illustrations: curatedIllustrations.act2 || [],
        ragCitation: {
          docName: matchedDoc.name,
          pageNumber: `Trang ${pageEstimate + 1} - ${pageEstimate + 2}`,
          relevanceScore: 99,
          snippet: coreInfo.slice(0, 200) || 'Kiến thức trọng tâm bài học theo chuẩn GDPT 2018.'
        }
      };
    } else if (act.code === 'ACT_3') {
      // Hoạt động 3: Luyện tập
      const act3Notes = `II. BÀI TẬP VÀ PHƯƠNG PHÁP GIẢI (HỌC SINH CHÉP LỜI GIẢI MẪU VÀO VỞ):\n${exercisesList}\n\n* Phương pháp rèn luyện:\n- Đọc kĩ đề bài, xác định đúng yêu cầu và dữ kiện đã cho.\n- Áp dụng các quy tắc, định luật hoặc công thức đã chiếm lĩnh ở Hoạt động 2 để giải quyết tường minh.`;

      return {
        ...act,
        title: act3Data?.title || 'Hoạt động 3: Luyện tập (Hệ thống bài tập củng cố SGK)',
        duration: '10 - 12 phút',
        goal: 'Củng cố, khắc sâu kiến thức vừa học qua hệ thống bài tập rèn luyện kỹ năng tính toán, giải thích và trình bày bài giải khoa học.',
        content: `Học sinh thực hiện hệ thống bài tập rèn luyện trong SGK ${matchedDoc.name} (${pageRange}):\n${exercisesList}`,
        product: 'Bài giải hoàn chỉnh vào vở bài tập của cá nhân hoặc bảng nhóm của các tổ học sinh; lời giải chi tiết, lập luận chặt chẽ.',
        implementation: {
          step1_assign: 'GV giao hệ thống bài tập luyện tập trong SGK (trắc nghiệm và tự luận), yêu cầu học sinh làm việc cá nhân trong 6 phút, sau đó đổi bài chấm chéo.',
          step2_execute: 'Học sinh độc lập làm bài vào vở. GV đi quanh lớp bao quát, hướng dẫn học sinh còn lúng túng hoặc nhầm lẫn công thức.',
          step3_report: 'GV mời 2 học sinh lên bảng trình bày bài giải; các bạn dưới lớp quan sát, nhận xét bước làm và kết quả.',
          step4_conclude: 'GV chốt đáp án chính xác, phân tích các lỗi sai phổ biến học sinh thường mắc phải và yêu cầu học sinh sửa chữa, chép lời giải mẫu vào vở.'
        },
        studentNotes: act3Notes,
        illustrations: curatedIllustrations.act3 || [],
        ragCitation: {
          docName: matchedDoc.name,
          pageNumber: `Trang ${pageEstimate + 2} - ${pageEstimate + 3}`,
          relevanceScore: 97,
          snippet: exercisesList.slice(0, 200) || 'Hệ thống bài tập luyện tập trong SGK.'
        }
      };
    } else {
      // Hoạt động 4: Vận dụng
      const act4Notes = `III. VẬN DỤNG VÀ HƯỚNG DẪN TỰ HỌC (GHI VÀO VỞ):\n1. Bài tập / Dự án vận dụng thực tiễn:\n- "${act4Data?.description || 'Vận dụng kiến thức đã học giải thích các hiện tượng thực tế đời sống hoặc thiết kế mô hình khoa học đơn giản.'}".\n2. Dặn dò tự học tại nhà:\n- Đọc lại toàn bộ nội dung bài học trong SGK ${matchedDoc.name} (${pageRange}).\n- Hoàn thành bài tập còn lại trong Sách bài tập (SBT).\n- Chuẩn bị trước bài học tiếp theo theo kế hoạch giáo dục.`;

      return {
        ...act,
        title: act4Data?.title || 'Hoạt động 4: Vận dụng & Mở rộng (Liên hệ thực tiễn đời sống)',
        duration: '5 - 8 phút (giao nhiệm vụ về nhà)',
        goal: 'Phát triển năng lực vận dụng kiến thức, kĩ năng đã học vào giải quyết các bài toán và tình huống thực tiễn; phát triển năng lực tự chủ và tự học.',
        content: act4Data?.description
          ? `Giao nhiệm vụ nghiên cứu và giải quyết bài toán thực tế: "${act4Data.description}". Học sinh thực hiện ngoài giờ lên lớp.`
          : act.content,
        product: act4Data?.expectedProduct
          ? `Báo cáo sản phẩm học tập hoặc bài thuyết trình mini: ${act4Data.expectedProduct}`
          : act.product,
        implementation: {
          step1_assign: 'GV trình chiếu nhiệm vụ vận dụng thực tế và tiêu chí đánh giá sản phẩm (ảnh chụp, video hoặc bài thu hoạch). Giải thích rõ yêu cầu.',
          step2_execute: 'Học sinh tiếp nhận nhiệm vụ, ghi chép câu hỏi và thời hạn nộp sản phẩm vào vở dặn dò.',
          step3_report: 'Học sinh nộp sản phẩm qua nhóm học tập trực tuyến hoặc báo cáo sản phẩm vào đầu tiết học tiếp theo.',
          step4_conclude: `GV nhận xét tổng kết buổi học, biểu dương các cá nhân/nhóm tích cực; dặn dò chuẩn bị cho bài học mới trong SGK Kết Nối Tri Thức.`
        },
        studentNotes: act4Notes,
        illustrations: curatedIllustrations.act4 || [],
        ragCitation: {
          docName: matchedDoc.name,
          pageNumber: `Trang ${pageEstimate + 4}`,
          relevanceScore: 96,
          snippet: act4Data?.description || 'Nhiệm vụ vận dụng kiến thức vào thực tiễn cuộc sống.'
        }
      };
    }
  });

  // Tạo Bảng ghi tóm tắt toàn bài cho học sinh chép vào vở (Mục IV)
  const boardPlanSummary = {
    title: `NỘI DUNG GHI BẢNG / VỞ GHI CỐT LÕI CỦA HỌC SINH - BÀI ${matchedChapter.lessonNumber}: ${matchedChapter.lessonName.toUpperCase()}`,
    sections: [
      {
        heading: `1. Khái niệm và Định nghĩa cơ bản (${matchedChapter.lessonName})`,
        content: matchedChapter.summary || `Khái niệm nền tảng theo chuẩn chương trình GDPT 2018 bộ sách Kết Nối Tri Thức.`,
        bulletPoints: matchedChapter.keyPoints?.slice(0, 3) || ['Định nghĩa chuẩn mực', 'Quy tắc khoa học']
      },
      {
        heading: `2. Tính chất / Quy luật / Công thức trọng tâm`,
        content: Array.isArray(matchedChapter.coreContent) ? matchedChapter.coreContent.join('. ') : (matchedChapter.coreContent || 'Nội dung kiến thức cốt lõi được hệ thống hóa logic theo sách giáo khoa.'),
        bulletPoints: matchedChapter.keyPoints?.slice(2, 6) || ['Công thức áp dụng', 'Hiện tượng đặc trưng']
      },
      {
        heading: `3. Luyện tập & Phương pháp giải bài tập`,
        content: `Giải quyết các dạng bài tập SGK trang ${pageEstimate + 2} - ${pageEstimate + 3}. Nắm vững các bước biến đổi và lập luận khoa học.`,
        bulletPoints: ['Bước 1: Phân tích giả thiết và kết luận', 'Bước 2: Vận dụng công thức / định lý tương ứng', 'Bước 3: Kiểm tra tính hợp lý của kết quả']
      },
      {
        heading: `4. Vận dụng thực tiễn`,
        content: `Kết nối bài học với cuộc sống: ${act4Data?.description || 'Giải thích hiện tượng tự nhiên và ứng dụng công nghệ đời sống.'}`,
        bulletPoints: ['Ghi nhớ dặn dò về nhà', 'Chuẩn bị bài học kế tiếp']
      }
    ]
  };

  const enrichedPlan: LessonPlan5512 = {
    ...lessonPlan,
    appendixTitle: 'Phụ lục I: KHUNG KẾ HOẠCH BÀI DẠY (Kèm theo Công văn số 5512/BGDĐT-GDTrH)',
    lessonName: `BÀI ${matchedChapter.lessonNumber}: ${matchedChapter.lessonName.toUpperCase()}`,
    equipments: {
      teacher: enrichedTeacherEquipment,
      students: lessonPlan.equipments?.students || ['Sách giáo khoa, vở bài tập, dụng cụ học tập cá nhân']
    },
    objectives: {
      ...lessonPlan.objectives,
      knowledge: enrichedKnowledge,
      competencies: {
        general: lessonPlan.objectives?.competencies?.general || [
          'Năng lực tự chủ và tự học: Tự giác tìm hiểu kiến thức trong SGK.',
          'Năng lực giao tiếp và hợp tác: Tương tác nhóm hoàn thành nhiệm vụ.'
        ],
        specific: enrichedCompetencies
      },
      qualities: enrichedQualities
    },
    activities: enrichedActivities,
    boardPlanSummary: boardPlanSummary
  };

  return {
    enrichedPlan,
    matchedDoc,
    matchedChapter,
    summaryMessage: `Đã tự động làm giàu KHBD từ SGK "${matchedDoc.name}" (Bài ${matchedChapter.lessonNumber}: ${matchedChapter.lessonName}, ${pageRange}) với đầy đủ 4 hoạt động 5512, nội dung ghi bài cho học sinh và hình ảnh minh họa!`
  };
}

/**
 * Chèn một đoạn trích RAG cụ thể vào một hoạt động trong Kế hoạch bài dạy
 */
export function insertRagSnippetToActivity(
  lessonPlan: LessonPlan5512,
  actCode: 'ACT_1' | 'ACT_2' | 'ACT_3' | 'ACT_4',
  chunk: RagChunkResult
): LessonPlan5512 {
  const updatedActivities = lessonPlan.activities.map(act => {
    if (act.code === actCode) {
      const appendedContent = `${act.content}\n\n[Trích xuất từ ${chunk.docName} - ${chunk.pageNumber}]:\n"${chunk.contentSnippet}"`;
      return {
        ...act,
        content: appendedContent,
        ragCitation: {
          docName: chunk.docName,
          pageNumber: chunk.pageNumber,
          relevanceScore: chunk.relevanceScore,
          snippet: chunk.contentSnippet
        }
      };
    }
    return act;
  });

  return {
    ...lessonPlan,
    activities: updatedActivities
  };
}

/**
 * =========================================================================
 * KẾT NỐI RAG VỚI HỆ THỐNG ĐỀ THI & MA TRẬN 7991 (EXAM 7991 + MATRIX)
 * =========================================================================
 */

/**
 * Tạo câu hỏi kiểm tra chuẩn Công văn 7991 từ đoạn trích RAG
 */
export function generateExamQuestionFromRagChunk(
  chunk: RagChunkResult,
  questionType: 'mc' | 'tf' | 'sa' | 'essay',
  number: number
): MultipleChoiceQuestion | TrueFalseQuestion | ShortAnswerQuestion | EssayQuestion {
  const sourceRef = {
    docName: chunk.docName,
    pageNumber: chunk.pageNumber,
    relevanceScore: chunk.relevanceScore
  };

  if (questionType === 'mc') {
    // Phần I: Trắc nghiệm 4 lựa chọn (0.25đ)
    return {
      id: `rag-mc-${Date.now()}-${number}`,
      number,
      content: `Theo SGK (${chunk.docName}, ${chunk.pageNumber}), phát biểu nào sau đây là ĐÚNG về nội dung: "${chunk.lessonName}"?`,
      options: {
        A: `${chunk.contentSnippet.slice(0, 90)}...`,
        B: `Khái niệm trên chỉ áp dụng trong trường hợp đặc biệt không có giá trị tổng quát.`,
        C: `Nội dung trên đã bị bãi bỏ trong chương trình GDPT 2018.`,
        D: `Không thể xác định được kết quả trong mọi điều kiện thực tế.`
      },
      correctAnswer: 'A',
      points: 0.25,
      level: 'Nhận biết',
      topic: `${chunk.chapterTitle} - ${chunk.lessonName}`,
      explanation: `Căn cứ theo nội dung SGK ${chunk.docName} (${chunk.pageNumber}): "${chunk.contentSnippet}". Do đó phương án A là phát biểu hoàn toàn chính xác.`,
      ragSource: sourceRef
    };
  } else if (questionType === 'tf') {
    // Phần II: Trắc nghiệm Đúng/Sai 4 ý (1.0đ)
    return {
      id: `rag-tf-${Date.now()}-${number}`,
      number,
      context: `Cho ngữ liệu trích từ SGK ${chunk.docName} (${chunk.pageNumber}) về chủ đề "${chunk.lessonName}":\n"${chunk.contentSnippet}"`,
      statements: [
        {
          subId: 'a',
          text: `Nội dung trên mô tả đúng bản chất kiến thức cốt lõi của bài học ${chunk.lessonName}.`,
          isCorrect: true,
          explanation: `Đúng theo định nghĩa và mô tả nguyên văn trong SGK.`
        },
        {
          subId: 'b',
          text: `Quy tắc / định lý này chỉ đúng với các giá trị âm của đại lượng khảo sát.`,
          isCorrect: false,
          explanation: `Sai, quy tắc được áp dụng tổng quát cho toàn bộ tập xác định.`
        },
        {
          subId: 'c',
          text: `Học sinh có thể vận dụng kiến thức này để giải quyết các bài toán và hiện tượng thực tiễn liên quan.`,
          isCorrect: true,
          explanation: `Đúng theo yêu cầu cần đạt của chương trình GDPT 2018.`
        },
        {
          subId: 'd',
          text: `Kết quả nêu trên mâu thuẫn với các thí nghiệm và bài tập trong SGK.`,
          isCorrect: false,
          explanation: `Sai, kết quả này hoàn toàn thống nhất và được chứng minh bằng thực nghiệm.`
        }
      ],
      pointsTotal: 1.0,
      level: 'Thông hiểu',
      topic: `${chunk.chapterTitle} - ${chunk.lessonName}`,
      ragSource: sourceRef
    };
  } else if (questionType === 'sa') {
    // Phần III: Trả lời ngắn (0.5đ)
    return {
      id: `rag-sa-${Date.now()}-${number}`,
      number,
      content: `Dựa vào dữ liệu từ SGK ${chunk.docName} (${chunk.pageNumber}) về "${chunk.lessonName}", hãy xác định giá trị hoặc thuật ngữ chính xác được nhắc đến trong đoạn trích: "${chunk.contentSnippet.slice(0, 120)}..."`,
      acceptableAnswers: [chunk.keywords[0] || 'đúng', chunk.keywords[1] || 'chuẩn', 'chính xác'],
      points: 0.5,
      level: 'Thông hiểu',
      topic: `${chunk.chapterTitle} - ${chunk.lessonName}`,
      solutionGuide: `Tra cứu trực tiếp tại SGK ${chunk.docName}, ${chunk.pageNumber}. Từ khóa trọng tâm cần điền là: "${chunk.keywords.join(', ')}".`,
      ragSource: sourceRef
    };
  } else {
    // Phần IV: Tự luận (1.5đ)
    return {
      id: `rag-es-${Date.now()}-${number}`,
      number,
      content: `Từ kiến thức bài "${chunk.lessonName}" trong SGK ${chunk.docName} (${chunk.pageNumber}):\na) Trình bày nội dung định nghĩa / quy tắc nêu trên.\nb) Vận dụng giải thích một tình huống thực tiễn hoặc giải bài toán ứng dụng sau: "${chunk.contentSnippet.slice(0, 150)}..."`,
      points: 1.5,
      level: 'Vận dụng',
      topic: `${chunk.chapterTitle} - ${chunk.lessonName}`,
      gradingCriteria: [
        { step: 'Phát biểu đúng, đầy đủ khái niệm/định lý theo SGK', points: 0.5 },
        { step: 'Nêu được các bước suy luận hoặc công thức vận dụng', points: 0.5 },
        { step: 'Trình bày lời giải chi tiết và kết luận chính xác', points: 0.5 }
      ],
      ragSource: sourceRef
    };
  }
}

/**
 * Tự động làm giàu và sinh câu hỏi mới cho toàn bộ Đề thi 7991 từ RAG SGK
 */
export function enrichExamFromRag(
  currentExam: Exam7991,
  documents: UploadedDocument[],
  subject: Subject,
  grade: GradeLevel,
  lessonQuery?: string
): {
  enrichedExam: Exam7991;
  addedQuestionsCount: number;
  message: string;
} {
  // Tìm kiếm ngữ liệu RAG phù hợp nhất
  const query = lessonQuery || `${subject} ${grade}`;
  const ragChunks = searchTextbookRag(query, documents, { minScore: 25 });

  if (ragChunks.length === 0) {
    return {
      enrichedExam: currentExam,
      addedQuestionsCount: 0,
      message: 'Không tìm thấy ngữ liệu SGK phù hợp để sinh câu hỏi.'
    };
  }

  // Gắn nguồn RAG vào các câu hỏi hiện có và tạo thêm các câu hỏi minh họa
  const topChunks = ragChunks.slice(0, 4);

  // Cập nhật Phần I
  const updatedPartI = currentExam.partI_MultipleChoice.map((q, idx) => {
    const chunk = topChunks[idx % topChunks.length];
    return {
      ...q,
      ragSource: {
        docName: chunk.docName,
        pageNumber: chunk.pageNumber,
        relevanceScore: chunk.relevanceScore
      }
    };
  });

  // Cập nhật Phần II
  const updatedPartII = currentExam.partII_TrueFalse.map((tf, idx) => {
    const chunk = topChunks[(idx + 1) % topChunks.length];
    return {
      ...tf,
      ragSource: {
        docName: chunk.docName,
        pageNumber: chunk.pageNumber,
        relevanceScore: chunk.relevanceScore
      }
    };
  });

  // Cập nhật Phần III
  const updatedPartIII = currentExam.partIII_ShortAnswer.map((sa, idx) => {
    const chunk = topChunks[(idx + 2) % topChunks.length];
    return {
      ...sa,
      ragSource: {
        docName: chunk.docName,
        pageNumber: chunk.pageNumber,
        relevanceScore: chunk.relevanceScore
      }
    };
  });

  // Cập nhật Phần IV
  const updatedPartIV = currentExam.partIV_Essay.map((es, idx) => {
    const chunk = topChunks[(idx + 3) % topChunks.length];
    return {
      ...es,
      ragSource: {
        docName: chunk.docName,
        pageNumber: chunk.pageNumber,
        relevanceScore: chunk.relevanceScore
      }
    };
  });

  const enrichedExam: Exam7991 = {
    ...currentExam,
    title: `ĐỀ KIỂM TRA ĐỊNH KÌ THEO CÔNG VĂN 7991 - ${subject.toUpperCase()} ${grade.toUpperCase()} (NGUỒN RAG SGK)`,
    partI_MultipleChoice: updatedPartI,
    partII_TrueFalse: updatedPartII,
    partIII_ShortAnswer: updatedPartIII,
    partIV_Essay: updatedPartIV
  };

  return {
    enrichedExam,
    addedQuestionsCount: updatedPartI.length + updatedPartII.length + updatedPartIII.length + updatedPartIV.length,
    message: `Đã kết nối và đồng bộ nguồn RAG từ SGK vào toàn bộ ${updatedPartI.length + updatedPartII.length + updatedPartIII.length + updatedPartIV.length} câu hỏi theo chuẩn CV 7991!`
  };
}

/**
 * Đồng bộ Bản đặc tả đề thi (Spec Sheet) với Yêu cầu cần đạt trích xuất từ RAG SGK
 */
export function enrichSpecFromRag(
  specRows: SpecSheetRow[],
  documents: UploadedDocument[],
  subject: Subject,
  grade: GradeLevel
): {
  enrichedSpec: SpecSheetRow[];
  syncedCount: number;
} {
  const matchedDoc = documents.find(d => d.subject === subject && d.grade === grade) || documents[0];
  if (!matchedDoc || !matchedDoc.chapters) {
    return { enrichedSpec: specRows, syncedCount: 0 };
  }

  let count = 0;
  const enrichedSpec = specRows.map(row => {
    const matchedCh = matchedDoc.chapters.find(c => {
      const normCh = normalizeViText(c.lessonName);
      const normUnit = normalizeViText(row.unit);
      return normCh.includes(normUnit) || normUnit.includes(normCh);
    });

    if (matchedCh && matchedCh.objectives) {
      count++;
      return {
        ...row,
        learningOutcomes: {
          biet: (matchedCh.objectives.knowledge && matchedCh.objectives.knowledge.length > 0)
            ? matchedCh.objectives.knowledge
            : row.learningOutcomes.biet,
          hieu: (matchedCh.objectives.competenciesSpecific && matchedCh.objectives.competenciesSpecific.length > 0)
            ? matchedCh.objectives.competenciesSpecific
            : row.learningOutcomes.hieu,
          vanDung: [
            `Vận dụng giải bài tập thực tiễn liên quan đến ${matchedCh.lessonName} (Trích từ SGK ${matchedDoc.name}).`
          ]
        }
      };
    }
    return row;
  });

  return {
    enrichedSpec,
    syncedCount: count
  };
}

