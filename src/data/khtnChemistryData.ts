import { 
  UploadedDocument, 
  WorkspaceState, 
  TeacherProfile,
  DocumentChapter
} from '../types';
import { KHTN_PHYSICS_LIBRARY } from './khtnPhysicsData';
import { KHTN_BIOLOGY_LIBRARY } from './khtnBiologyData';
import { CONG_NGHE_7_LIBRARY } from './congNghe7Data';

export const TEACHER_PROFILE_KHTN_HOA: TeacherProfile = {
  name: 'Hồ Minh Luân',
  academicDegree: 'Cử nhân Sư phạm Hóa học - Thạc sĩ Giáo dục học',
  title: 'Giáo viên Khoa học tự nhiên (Phân môn Hóa học) - THCS',
  school: 'TRƯỜNG THCS & THPT NGUYỄN HUỆ',
  department: 'TỔ KHOA HỌC TỰ NHIÊN (BỘ MÔN HÓA HỌC)',
  email: 'H.Minhluan1181@gmail.com',
  phone: '0912 345 678',
  academicYear: '2024 - 2025',
  notes: 'Phụ trách đổi mới phương pháp dạy học thực nghiệm KHTN cấp THCS, phụ trách phòng thí nghiệm Hóa học và bồi dưỡng HSG KHTN.'
};

// =========================================================================
// HỆ THỐNG DỮ LIỆU BẢNG TUẦN HOÀN & TRA CỨU HÓA HỌC THCS (CHUẨN IUPAC GDPT 2018)
// =========================================================================

export interface ChemicalElement {
  z: number;
  symbol: string;
  nameIupac: string;
  nameVi: string;
  atomicMass: number;
  group: string;
  period: number;
  category: 'alkali' | 'alkaline_earth' | 'transition' | 'nonmetal' | 'halogen' | 'noble_gas' | 'metalloid';
  categoryLabel: string;
  valencies: number[];
  electronConfig: string;
}

export const PERIODIC_TABLE_ELEMENTS: ChemicalElement[] = [
  { z: 1, symbol: 'H', nameIupac: 'Hydrogen', nameVi: 'Hiđro', atomicMass: 1, group: 'IA', period: 1, category: 'nonmetal', categoryLabel: 'Phi kim', valencies: [1], electronConfig: '1s¹' },
  { z: 2, symbol: 'He', nameIupac: 'Helium', nameVi: 'Heli', atomicMass: 4, group: 'VIIIA', period: 1, category: 'noble_gas', categoryLabel: 'Khí hiếm', valencies: [0], electronConfig: '1s²' },
  { z: 3, symbol: 'Li', nameIupac: 'Lithium', nameVi: 'Liti', atomicMass: 7, group: 'IA', period: 2, category: 'alkali', categoryLabel: 'Kim loại kiềm', valencies: [1], electronConfig: '[He] 2s¹' },
  { z: 4, symbol: 'Be', nameIupac: 'Beryllium', nameVi: 'Beri', atomicMass: 9, group: 'IIA', period: 2, category: 'alkaline_earth', categoryLabel: 'Kim loại kiềm thổ', valencies: [2], electronConfig: '[He] 2s²' },
  { z: 5, symbol: 'B', nameIupac: 'Boron', nameVi: 'Bo', atomicMass: 11, group: 'IIIA', period: 2, category: 'metalloid', categoryLabel: 'Bán kim', valencies: [3], electronConfig: '[He] 2s² 2p¹' },
  { z: 6, symbol: 'C', nameIupac: 'Carbon', nameVi: 'Cacbon', atomicMass: 12, group: 'IVA', period: 2, category: 'nonmetal', categoryLabel: 'Phi kim', valencies: [2, 4], electronConfig: '[He] 2s² 2p²' },
  { z: 7, symbol: 'N', nameIupac: 'Nitrogen', nameVi: 'Nitơ', atomicMass: 14, group: 'VA', period: 2, category: 'nonmetal', categoryLabel: 'Phi kim', valencies: [2, 3, 4, 5], electronConfig: '[He] 2s² 2p³' },
  { z: 8, symbol: 'O', nameIupac: 'Oxygen', nameVi: 'Oxi', atomicMass: 16, group: 'VIA', period: 2, category: 'nonmetal', categoryLabel: 'Phi kim', valencies: [2], electronConfig: '[He] 2s² 2p⁴' },
  { z: 9, symbol: 'F', nameIupac: 'Fluorine', nameVi: 'Flo', atomicMass: 19, group: 'VIIA', period: 2, category: 'halogen', categoryLabel: 'Halogen', valencies: [1], electronConfig: '[He] 2s² 2p⁵' },
  { z: 10, symbol: 'Ne', nameIupac: 'Neon', nameVi: 'Neon', atomicMass: 20, group: 'VIIIA', period: 2, category: 'noble_gas', categoryLabel: 'Khí hiếm', valencies: [0], electronConfig: '[He] 2s² 2p⁶' },
  { z: 11, symbol: 'Na', nameIupac: 'Sodium', nameVi: 'Natri', atomicMass: 23, group: 'IA', period: 3, category: 'alkali', categoryLabel: 'Kim loại kiềm', valencies: [1], electronConfig: '[Ne] 3s¹' },
  { z: 12, symbol: 'Mg', nameIupac: 'Magnesium', nameVi: 'Magie', atomicMass: 24, group: 'IIA', period: 3, category: 'alkaline_earth', categoryLabel: 'Kim loại kiềm thổ', valencies: [2], electronConfig: '[Ne] 3s²' },
  { z: 13, symbol: 'Al', nameIupac: 'Aluminium', nameVi: 'Nhôm', atomicMass: 27, group: 'IIIA', period: 3, category: 'transition', categoryLabel: 'Kim loại', valencies: [3], electronConfig: '[Ne] 3s² 3p¹' },
  { z: 14, symbol: 'Si', nameIupac: 'Silicon', nameVi: 'Silic', atomicMass: 28, group: 'IVA', period: 3, category: 'metalloid', categoryLabel: 'Bán kim', valencies: [4], electronConfig: '[Ne] 3s² 3p²' },
  { z: 15, symbol: 'P', nameIupac: 'Phosphorus', nameVi: 'Photpho', atomicMass: 31, group: 'VA', period: 3, category: 'nonmetal', categoryLabel: 'Phi kim', valencies: [3, 5], electronConfig: '[Ne] 3s² 3p³' },
  { z: 16, symbol: 'S', nameIupac: 'Sulfur', nameVi: 'Lưu huỳnh', atomicMass: 32, group: 'VIA', period: 3, category: 'nonmetal', categoryLabel: 'Phi kim', valencies: [2, 4, 6], electronConfig: '[Ne] 3s² 3p⁴' },
  { z: 17, symbol: 'Cl', nameIupac: 'Chlorine', nameVi: 'Clo', atomicMass: 35.5, group: 'VIIA', period: 3, category: 'halogen', categoryLabel: 'Halogen', valencies: [1], electronConfig: '[Ne] 3s² 3p⁵' },
  { z: 18, symbol: 'Ar', nameIupac: 'Argon', nameVi: 'Agon', atomicMass: 40, group: 'VIIIA', period: 3, category: 'noble_gas', categoryLabel: 'Khí hiếm', valencies: [0], electronConfig: '[Ne] 3s² 3p⁶' },
  { z: 19, symbol: 'K', nameIupac: 'Potassium', nameVi: 'Kali', atomicMass: 39, group: 'IA', period: 4, category: 'alkali', categoryLabel: 'Kim loại kiềm', valencies: [1], electronConfig: '[Ar] 4s¹' },
  { z: 20, symbol: 'Ca', nameIupac: 'Calcium', nameVi: 'Canxi', atomicMass: 40, group: 'IIA', period: 4, category: 'alkaline_earth', categoryLabel: 'Kim loại kiềm thổ', valencies: [2], electronConfig: '[Ar] 4s²' },
  { z: 24, symbol: 'Cr', nameIupac: 'Chromium', nameVi: 'Crom', atomicMass: 52, group: 'VIB', period: 4, category: 'transition', categoryLabel: 'Kim loại chuyển tiếp', valencies: [2, 3, 6], electronConfig: '[Ar] 3d⁵ 4s¹' },
  { z: 25, symbol: 'Mn', nameIupac: 'Manganese', nameVi: 'Mangan', atomicMass: 55, group: 'VIIB', period: 4, category: 'transition', categoryLabel: 'Kim loại chuyển tiếp', valencies: [2, 4, 7], electronConfig: '[Ar] 3d⁵ 4s²' },
  { z: 26, symbol: 'Fe', nameIupac: 'Iron', nameVi: 'Sắt', atomicMass: 56, group: 'VIIIB', period: 4, category: 'transition', categoryLabel: 'Kim loại chuyển tiếp', valencies: [2, 3], electronConfig: '[Ar] 3d⁶ 4s²' },
  { z: 29, symbol: 'Cu', nameIupac: 'Copper', nameVi: 'Đồng', atomicMass: 64, group: 'IB', period: 4, category: 'transition', categoryLabel: 'Kim loại chuyển tiếp', valencies: [1, 2], electronConfig: '[Ar] 3d¹⁰ 4s¹' },
  { z: 30, symbol: 'Zn', nameIupac: 'Zinc', nameVi: 'Kẽm', atomicMass: 65, group: 'IIB', period: 4, category: 'transition', categoryLabel: 'Kim loại chuyển tiếp', valencies: [2], electronConfig: '[Ar] 3d¹⁰ 4s²' },
  { z: 35, symbol: 'Br', nameIupac: 'Bromine', nameVi: 'Brom', atomicMass: 80, group: 'VIIA', period: 4, category: 'halogen', categoryLabel: 'Halogen', valencies: [1], electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁵' },
  { z: 47, symbol: 'Ag', nameIupac: 'Silver', nameVi: 'Bạc', atomicMass: 108, group: 'IB', period: 5, category: 'transition', categoryLabel: 'Kim loại quý', valencies: [1], electronConfig: '[Kr] 4d¹⁰ 5s¹' },
  { z: 56, symbol: 'Ba', nameIupac: 'Barium', nameVi: 'Bari', atomicMass: 137, group: 'IIA', period: 6, category: 'alkaline_earth', categoryLabel: 'Kim loại kiềm thổ', valencies: [2], electronConfig: '[Xe] 6s²' },
  { z: 79, symbol: 'Au', nameIupac: 'Gold', nameVi: 'Vàng', atomicMass: 197, group: 'IB', period: 6, category: 'transition', categoryLabel: 'Kim loại quý', valencies: [1, 3], electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹' },
  { z: 80, symbol: 'Hg', nameIupac: 'Mercury', nameVi: 'Thủy ngân', atomicMass: 201, group: 'IIB', period: 6, category: 'transition', categoryLabel: 'Kim loại lỏng', valencies: [1, 2], electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s²' },
  { z: 82, symbol: 'Pb', nameIupac: 'Lead', nameVi: 'Chì', atomicMass: 207, group: 'IVA', period: 6, category: 'transition', categoryLabel: 'Kim loại', valencies: [2, 4], electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²' }
];

export const METAL_ACTIVITY_SERIES = [
  { symbol: 'K', name: 'Potassium', phrase: 'Khi', reactivity: 'Rất mạnh (Tác dụng nước ở nhiệt độ thường tạo H₂)' },
  { symbol: 'Na', name: 'Sodium', phrase: 'Nào', reactivity: 'Rất mạnh (Tác dụng nước ở nhiệt độ thường tạo H₂)' },
  { symbol: 'Ca', name: 'Calcium', phrase: 'Cần', reactivity: 'Mạnh (Tác dụng nước ở nhiệt độ thường tạo Ca(OH)₂ + H₂)' },
  { symbol: 'Mg', name: 'Magnesium', phrase: 'May', reactivity: 'Trung bình (Đẩy H₂ ra khỏi dung dịch acid loãng)' },
  { symbol: 'Al', name: 'Aluminium', phrase: 'Áo', reactivity: 'Trung bình (Đẩy H₂ ra khỏi dung dịch acid loãng)' },
  { symbol: 'Zn', name: 'Zinc', phrase: 'Giáp', reactivity: 'Trung bình (Đẩy H₂ ra khỏi dung dịch acid loãng)' },
  { symbol: 'Fe', name: 'Iron', phrase: 'Sắt', reactivity: 'Trung bình (Đẩy H₂ ra khỏi dung dịch acid loãng)' },
  { symbol: 'Pb', name: 'Lead', phrase: 'Phải', reactivity: 'Yếu (Đứng ngay trước H)' },
  { symbol: 'H', name: 'Hydrogen', phrase: 'Hỏi', reactivity: 'Mốc so sánh giải phóng khí H₂' },
  { symbol: 'Cu', name: 'Copper', phrase: 'Cửa', reactivity: 'Yếu (Không tác dụng acid loãng HCl, H₂SO₄ loãng)' },
  { symbol: 'Ag', name: 'Silver', phrase: 'Á', reactivity: 'Yếu (Kim loại quý, không tan trong acid loãng)' },
  { symbol: 'Au', name: 'Gold', phrase: 'Âu', reactivity: 'Rất yếu (Kim loại trơ, chỉ tan trong nước cường toan)' }
];

// =========================================================================
// BẢNG TÍNH TAN TRONG NƯỚC CỦA MỘT SỐ ACID, BASE VÀ MUỐI (25°C)
// =========================================================================
export interface SolubilityEntry {
  cation: string;
  cationLabel: string;
  anions: {
    OH: 'T' | 'K' | 'I' | 'B' | '-';
    Cl: 'T' | 'K' | 'I' | 'B' | '-';
    NO3: 'T' | 'K' | 'I' | 'B' | '-';
    SO4: 'T' | 'K' | 'I' | 'B' | '-';
    CO3: 'T' | 'K' | 'I' | 'B' | '-';
    SO3: 'T' | 'K' | 'I' | 'B' | '-';
    PO4: 'T' | 'K' | 'I' | 'B' | '-';
    S: 'T' | 'K' | 'I' | 'B' | '-';
  };
}

export const SOLUBILITY_DATA: SolubilityEntry[] = [
  { cation: 'H+', cationLabel: 'Hydrogen (H⁺)', anions: { OH: 'T', Cl: 'T', NO3: 'T', SO4: 'T', CO3: 'B', SO3: 'B', PO4: 'T', S: 'B' } },
  { cation: 'Na+', cationLabel: 'Sodium (Na⁺)', anions: { OH: 'T', Cl: 'T', NO3: 'T', SO4: 'T', CO3: 'T', SO3: 'T', PO4: 'T', S: 'T' } },
  { cation: 'K+', cationLabel: 'Potassium (K⁺)', anions: { OH: 'T', Cl: 'T', NO3: 'T', SO4: 'T', CO3: 'T', SO3: 'T', PO4: 'T', S: 'T' } },
  { cation: 'NH4+', cationLabel: 'Ammonium (NH₄⁺)', anions: { OH: 'B', Cl: 'T', NO3: 'T', SO4: 'T', CO3: 'T', SO3: 'T', PO4: 'T', S: 'T' } },
  { cation: 'Ba2+', cationLabel: 'Barium (Ba²⁺)', anions: { OH: 'T', Cl: 'T', NO3: 'T', SO4: 'K', CO3: 'K', SO3: 'K', PO4: 'K', S: 'T' } },
  { cation: 'Ca2+', cationLabel: 'Calcium (Ca²⁺)', anions: { OH: 'I', Cl: 'T', NO3: 'T', SO4: 'I', CO3: 'K', SO3: 'K', PO4: 'K', S: 'T' } },
  { cation: 'Mg2+', cationLabel: 'Magnesium (Mg²⁺)', anions: { OH: 'K', Cl: 'T', NO3: 'T', SO4: 'T', CO3: 'K', SO3: 'K', PO4: 'K', S: '-' } },
  { cation: 'Al3+', cationLabel: 'Aluminium (Al³⁺)', anions: { OH: 'K', Cl: 'T', NO3: 'T', SO4: 'T', CO3: '-', SO3: '-', PO4: 'K', S: '-' } },
  { cation: 'Zn2+', cationLabel: 'Zinc (Zn²⁺)', anions: { OH: 'K', Cl: 'T', NO3: 'T', SO4: 'T', CO3: 'K', SO3: 'K', PO4: 'K', S: 'K' } },
  { cation: 'Fe2+', cationLabel: 'Iron(II) (Fe²⁺)', anions: { OH: 'K', Cl: 'T', NO3: 'T', SO4: 'T', CO3: 'K', SO3: 'K', PO4: 'K', S: 'K' } },
  { cation: 'Fe3+', cationLabel: 'Iron(III) (Fe³⁺)', anions: { OH: 'K', Cl: 'T', NO3: 'T', SO4: 'T', CO3: '-', SO3: '-', PO4: 'K', S: '-' } },
  { cation: 'Cu2+', cationLabel: 'Copper(II) (Cu²⁺)', anions: { OH: 'K', Cl: 'T', NO3: 'T', SO4: 'T', CO3: 'K', SO3: 'K', PO4: 'K', S: 'K' } },
  { cation: 'Ag+', cationLabel: 'Silver (Ag⁺)', anions: { OH: '-', Cl: 'K', NO3: 'T', SO4: 'I', CO3: 'K', SO3: 'K', PO4: 'K', S: 'K' } },
  { cation: 'Pb2+', cationLabel: 'Lead(II) (Pb²⁺)', anions: { OH: 'K', Cl: 'I', NO3: 'T', SO4: 'K', CO3: 'K', SO3: 'K', PO4: 'K', S: 'K' } }
];

// =========================================================================
// THANG ĐO pH & DỮ LIỆU CHẤT CHỈ THỊ MÀU
// =========================================================================
export interface PhScaleItem {
  ph: number;
  environment: 'acid' | 'neutral' | 'base';
  litmusColor: string;
  phenolColor: string;
  sampleSubstances: string[];
  hexColor: string;
}

export const PH_SCALE_ITEMS: PhScaleItem[] = [
  { ph: 0, environment: 'acid', litmusColor: 'Đỏ đậm', phenolColor: 'Không màu', sampleSubstances: ['Dung dịch HCl 1M', 'Acid ắc quy đậm đặc'], hexColor: '#dc2626' },
  { ph: 1, environment: 'acid', litmusColor: 'Đỏ cờ', phenolColor: 'Không màu', sampleSubstances: ['Dịch vị dạ dày người', 'Acid tẩy gỉ'], hexColor: '#ef4444' },
  { ph: 2, environment: 'acid', litmusColor: 'Đỏ', phenolColor: 'Không màu', sampleSubstances: ['Nước chanh tươi', 'Giấm ăn công nghiệp'], hexColor: '#f87171' },
  { ph: 3, environment: 'acid', litmusColor: 'Đỏ cam', phenolColor: 'Không màu', sampleSubstances: ['Giấm ăn gia đình (2-5%)', 'Nước ngọt có gas'], hexColor: '#fb923c' },
  { ph: 4, environment: 'acid', litmusColor: 'Cam', phenolColor: 'Không màu', sampleSubstances: ['Nước ép cà chua', 'Rượu vang'], hexColor: '#f59e0b' },
  { ph: 5, environment: 'acid', litmusColor: 'Vàng cam', phenolColor: 'Không màu', sampleSubstances: ['Nước mưa thông thường', 'Cà phê đen'], hexColor: '#eab308' },
  { ph: 6, environment: 'acid', litmusColor: 'Vàng nhạt', phenolColor: 'Không màu', sampleSubstances: ['Sữa tươi', 'Nước tiểu người khỏe mạnh'], hexColor: '#84cc16' },
  { ph: 7, environment: 'neutral', litmusColor: 'Tím', phenolColor: 'Không màu', sampleSubstances: ['Nước cất tinh khiết (25°C)', 'Dung dịch NaCl'], hexColor: '#10b981' },
  { ph: 8, environment: 'base', litmusColor: 'Xanh lục', phenolColor: 'Không màu', sampleSubstances: ['Nước biển tự nhiên', 'Nước bọt'], hexColor: '#06b6d4' },
  { ph: 9, environment: 'base', litmusColor: 'Xanh lam', phenolColor: 'Hồng nhạt', sampleSubstances: ['Baking soda (NaHCO₃)', 'Dung dịch xà phòng loãng'], hexColor: '#0ea5e9' },
  { ph: 10, environment: 'base', litmusColor: 'Xanh đậm', phenolColor: 'Hồng', sampleSubstances: ['Thuốc kháng acid dạ dày', 'Xà phòng tắm'], hexColor: '#3b82f6' },
  { ph: 11, environment: 'base', litmusColor: 'Xanh tím', phenolColor: 'Đỏ hồng', sampleSubstances: ['Dung dịch Ammonia (NH₃)', 'Nước lau kính'], hexColor: '#6366f1' },
  { ph: 12, environment: 'base', litmusColor: 'Tím lam', phenolColor: 'Đỏ tím', sampleSubstances: ['Nước vôi trong Ca(OH)₂', 'Chất tẩy rửa nhẹ'], hexColor: '#8b5cf6' },
  { ph: 13, environment: 'base', litmusColor: 'Tím sẫm', phenolColor: 'Đỏ tím sẫm', sampleSubstances: ['Thuốc tẩy gia dụng', 'Dung dịch kiềm vừa'], hexColor: '#a855f7' },
  { ph: 14, environment: 'base', litmusColor: 'Tím rất sẫm', phenolColor: 'Đỏ tím đậm', sampleSubstances: ['Dung dịch NaOH 1M', 'Chất thông cống đậm đặc'], hexColor: '#7c3aed' }
];

// =========================================================================
// PHƯƠNG TRÌNH HÓA HỌC THCS TRỌNG TÂM (GDPT 2018)
// =========================================================================
export interface ChemicalEquationItem {
  id: string;
  topic: string;
  grade: string;
  equation: string;
  condition?: string;
  phenomenon: string;
  type: string;
}

export const COMMON_CHEMICAL_EQUATIONS: ChemicalEquationItem[] = [
  // Lớp 8
  { id: 'eq-8-1', topic: 'Acid tác dụng kim loại', grade: 'Lớp 8', equation: 'Zn + 2HCl → ZnCl₂ + H₂↑', phenomenon: 'Bọt khí không màu H₂ thoát ra mạnh, mảnh kẽm tan dần', type: 'Phản ứng thế' },
  { id: 'eq-8-2', topic: 'Acid tác dụng kim loại', grade: 'Lớp 8', equation: 'Fe + H₂SO₄ (loãng) → FeSO₄ + H₂↑', phenomenon: 'Sủi bọt khí không màu, dung dịch có màu lục nhạt', type: 'Phản ứng thế' },
  { id: 'eq-8-3', topic: 'Acid tác dụng oxide base', grade: 'Lớp 8', equation: 'CuO + 2HCl → CuCl₂ + H₂O', phenomenon: 'Bột đen CuO tan dần, dung dịch chuyển sang màu xanh lam', type: 'Phản ứng trao đổi' },
  { id: 'eq-8-4', topic: 'Phản ứng trung hòa', grade: 'Lớp 8', equation: 'NaOH + HCl → NaCl + H₂O', phenomenon: 'Tỏa nhiệt, quỳ tím hoặc phenolphthalein trở về trung tính', type: 'Phản ứng trao đổi' },
  { id: 'eq-8-5', topic: 'Phản ứng trung hòa', grade: 'Lớp 8', equation: 'Ba(OH)₂ + H₂SO₄ → BaSO₄↓ + 2H₂O', phenomenon: 'Xuất hiện kết tủa trắng tinh BaSO₄ không tan trong acid', type: 'Phản ứng trao đổi' },
  { id: 'eq-8-6', topic: 'Base tác dụng oxide acid', grade: 'Lớp 8', equation: 'Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O', phenomenon: 'Dung dịch nước vôi trong bị vẩn đục trắng CaCO₃', type: 'Phản ứng tạo muối' },
  { id: 'eq-8-7', topic: 'Nhiệt phân muối', grade: 'Lớp 8', equation: 'CaCO₃ → CaO + CO₂↑', condition: 't° cao (khoảng 900°C)', phenomenon: 'Sinh vôi sống CaO và giải phóng khí carbon dioxide', type: 'Phản ứng phân hủy' },
  { id: 'eq-8-8', topic: 'Phản ứng điều chế muối', grade: 'Lớp 8', equation: 'AgNO₃ + NaCl → AgCl↓ + NaNO₃', phenomenon: 'Xuất hiện kết tủa trắng vón AgCl không tan', type: 'Phản ứng trao đổi' },
  
  // Lớp 9
  { id: 'eq-9-1', topic: 'Kim loại tác dụng muối', grade: 'Lớp 9', equation: 'Fe + CuSO₄ → FeSO₄ + Cu↓', phenomenon: 'Đinh sắt bám lớp kim loại màu đỏ (Cu), màu xanh lam nhạt dần', type: 'Phản ứng thế' },
  { id: 'eq-9-2', topic: 'Kim loại tác dụng nước', grade: 'Lớp 9', equation: '2Na + 2H₂O → 2NaOH + H₂↑', phenomenon: 'Mẩu Na chạy tròn trên mặt nước, nóng chảy thành giọt tròn, sủi bọt khí H₂', type: 'Phản ứng thế' },
  { id: 'eq-9-3', topic: 'Đốt cháy Alkane (Methane)', grade: 'Lớp 9', equation: 'CH₄ + 2O₂ → CO₂ + 2H₂O', condition: 't°', phenomenon: 'Ngọn lửa màu xanh nhạt, tỏa lượng nhiệt rất lớn', type: 'Phản ứng cháy (oxi hóa)' },
  { id: 'eq-9-4', topic: 'Phản ứng thế của Alkane', grade: 'Lớp 9', equation: 'CH₄ + Cl₂ → CH₃Cl + HCl', condition: 'Ánh sáng khuếch tán', phenomenon: 'Màu vàng lục của khí clo nhạt dần, sinh khí HCl làm đỏ quỳ ẩm', type: 'Phản ứng thế' },
  { id: 'eq-9-5', topic: 'Phản ứng cộng của Alkene (Ethylene)', grade: 'Lớp 9', equation: 'CH₂=CH₂ + Br₂ → CH₂Br-CH₂Br', phenomenon: 'Dung dịch Bromine màu da cam bị mất màu hoàn toàn', type: 'Phản ứng cộng' },
  { id: 'eq-9-6', topic: 'Phản ứng trùng hợp', grade: 'Lớp 9', equation: 'n CH₂=CH₂ → (-CH₂-CH₂-)n', condition: 't°, p, xt', phenomenon: 'Tạo chất rắn màu trắng là nhựa Polyethylene (PE)', type: 'Phản ứng trùng hợp' },
  { id: 'eq-9-7', topic: 'Ethylic alcohol tác dụng Na', grade: 'Lớp 9', equation: '2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂↑', phenomenon: 'Sủi bọt khí không màu H₂, mẩu Na tan dần', type: 'Phản ứng thế' },
  { id: 'eq-9-8', topic: 'Phản ứng Ester hóa', grade: 'Lớp 9', equation: 'CH₃COOH + C₂H₅OH ⇄ CH₃COOC₂H₅ + H₂O', condition: 'H₂SO₄ đặc, đun nóng', phenomenon: 'Tạo chất lỏng nhẹ hơn nước, có mùi thơm hoa quả (Ethyl acetate)', type: 'Phản ứng thuận nghịch' },
  
  // Lớp 7 & Lớp 6
  { id: 'eq-7-1', topic: 'Sự hình thành liên kết ion', grade: 'Lớp 7', equation: '2Na + Cl₂ → 2NaCl', condition: 't°', phenomenon: 'Natri nóng chảy cháy sáng chói trong khí clo tạo khói trắng muối ăn', type: 'Phản ứng hóa hợp' },
  { id: 'eq-6-1', topic: 'Sự cháy của Carbon', grade: 'Lớp 6', equation: 'C + O₂ → CO₂', condition: 't°', phenomenon: 'Than cháy đỏ rực, tỏa nhiều nhiệt, không khói', type: 'Phản ứng oxi hóa' },
  { id: 'eq-6-2', topic: 'Sự cháy của Sulfur', grade: 'Lớp 6', equation: 'S + O₂ → SO₂', condition: 't°', phenomenon: 'Lưu huỳnh cháy trong oxi với ngọn lửa xanh lam, có mùi hắc', type: 'Phản ứng oxi hóa' }
];

// =========================================================================
// QUY TẮC AN TOÀN PHÒNG THÍ NGHIỆM HÓA HỌC THCS
// =========================================================================
export const LAB_SAFETY_RULES = [
  {
    id: 'rule-1',
    title: 'QUY TẮC PHA LOÃNG H₂SO₄ ĐẶC',
    content: 'TUYỆT ĐỐI KHÔNG rót nước vào acid đặc. Luôn rót TỪ TỪ acid vào nước dọc theo đũa thủy tinh và khuấy đều.',
    importance: 'Cực kì nguy hiểm',
    action: 'Nếu bị acid bắn vào da: Rửa ngay dưới vòi nước chảy liên tục trong 15 phút, sau đó rửa bằng dung dịch NaHCO₃ loãng.'
  },
  {
    id: 'rule-2',
    title: 'TRANG BỊ BẢO HỘ BẮT BUỘC',
    content: 'Mặc áo blouse trắng dài tay, đeo kính bảo hộ khi làm việc với hóa chất ăn mòn, đi giày kín mũi và buộc tóc gọn gàng.',
    importance: 'Bắt buộc',
    action: 'Không ăn uống, đùa nghịch, nếm thử hóa chất hoặc ngửi trực tiếp bằng mũi.'
  },
  {
    id: 'rule-3',
    title: 'NGUYÊN TẮC NGỬI MÙI HÓA CHẤT',
    content: 'Không bao giờ đưa mũi sát miệng lọ hóa chất. Dùng bàn tay phẩy nhẹ hơi chất từ miệng lọ về phía mũi.',
    importance: 'Quy tắc thao tác',
    action: 'Thao tác với chất khí độc (SO₂, Cl₂, NO₂) phải thực hiện trong tủ hút hoặc gần cửa sổ thông gió.'
  },
  {
    id: 'rule-4',
    title: 'KĨ THUẬT ĐUN NÓNG ỐNG NGHIỆM',
    content: 'Hơ nóng đều đáy ống nghiệm trên ngọn lửa đèn cồn trước khi đun tập trung tại vị trí chứa hóa chất. Miệng ống nghiệm phải hướng về phía KHÔNG CÓ NGƯỜI.',
    importance: 'Phòng ngừa sự cố',
    action: 'Tắt đèn cồn bằng cách chụp nắp đèn, tuyệt đối không dùng miệng thổi ngọn lửa.'
  },
  {
    id: 'rule-5',
    title: 'THU GOM & XỬ LÍ CHẤT THẢI HÓA HỌC',
    content: 'Hóa chất thừa sau thí nghiệm không được đổ bừa bãi vào bồn rửa mà phải thu gom vào bình chứa rác thải chuyên dụng của phòng thí nghiệm.',
    importance: 'Bảo vệ môi trường',
    action: 'Dung dịch kim loại nặng và acid phải được trung hòa trước khi thải bỏ.'
  }
];

// =========================================================================
// KHO HỌC LIỆU TOÀN DIỆN KHTN 6, 7, 8, 9 (KNTT) - SGK, SBT, SGV
// =========================================================================

export const KHTN_FULL_LIBRARY: UploadedDocument[] = [
  // -------------------------------------------------------------
  // 1. KHOA HỌC TỰ NHIÊN LỚP 8 (TRỌNG TÂM PHÂN MÔN HÓA HỌC THCS)
  // -------------------------------------------------------------
  {
    id: 'doc-sgk-khtn-8',
    name: 'SGK Khoa học tự nhiên 8 (Kết Nối Tri Thức Với Cuộc Sống)',
    category: 'sgk',
    subject: 'Khoa học tự nhiên',
    grade: 'Lớp 8',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-01',
    fileSize: '24.5 MB',
    pageCount: 216,
    status: 'indexed',
    rawTextPreview: 'Chương I: Phản ứng hóa học. Bài 1: Sử dụng hóa chất và dụng cụ thí nghiệm an toàn. Bài 2: Phản ứng hóa học. Bài 3: Định luật bảo toàn khối lượng và phương trình hóa học. Bài 4: Mol và tỉ khối chất khí. Bài 5: Nồng độ dung dịch C% và CM. Bài 6: Tính theo PTHH. Bài 7: Tốc độ phản ứng. Chương II: Một số hợp chất vô cơ thông dụng: Acid, Base, Thang pH, Oxide, Muối, Phân bón hóa học...',
    chapters: [
      {
        id: 'khtn8-ch-8',
        chapterNumber: 2,
        chapterTitle: 'Chương 2: Một số hợp chất vô cơ thông dụng (Hóa học)',
        lessonNumber: '8',
        lessonName: 'Acid (Axit - Tính chất hóa học và Ứng dụng)',
        summary: 'Khái niệm acid là hợp chất gồm H liên kết gốc acid; dung dịch acid làm quỳ tím hóa đỏ; acid tác dụng với kim loại giải phóng khí Hydrogen (H₂); ứng dụng quan trọng của HCl và H₂SO₄.',
        keyPoints: [
          'Acid tạo ra cation H⁺ trong dung dịch nước: Phân tử gồm một hay nhiều nguyên tử H liên kết với gốc acid.',
          'Dung dịch acid làm quỳ tím chuyển sang màu đỏ.',
          'Acid (HCl, H₂SO₄ loãng) tác dụng với kim loại đứng trước H trong dãy hoạt động (Mg, Al, Zn, Fe...) sinh ra muối và giải phóng khí H₂.',
          'PTHH điển hình: Zn + 2HCl → ZnCl₂ + H₂↑; Fe + H₂SO₄ loãng → FeSO₄ + H₂↑.',
          'Acid tác dụng với oxide base tạo thành muối và nước: CuO + 2HCl → CuCl₂ (xanh lam) + H₂O.'
        ],
        rawContent: `BỘ GIÁO DỤC VÀ ĐÀO TẠO — BỘ SÁCH KẾT NỐI TRI THỨC VỚI CUỘC SỐNG
MÔN: KHOA HỌC TỰ NHIÊN 8 (PHÂN MÔN HÓA HỌC)
CHƯƠNG II: MỘT SỐ HỢP CHẤT VÔ CƠ THÔNG DỤNG
BÀI 8: ACID (Thời lượng: 2 tiết - 90 phút)

I. KHỞI ĐỘNG VÀ ĐẶT VẤN ĐỀ
Trong đời sống, ta thường gặp các chất có vị chua như giấm ăn, chanh, khế, sữa chua,... Vị chua đó do các acid hữu cơ gây ra. Trong công nghiệp và phòng thí nghiệm, có những acid vô cơ rất mạnh và phổ biến như hydrochloric acid (HCl), sulfuric acid (H₂SO₄), nitric acid (HNO₃). Vậy acid là gì? Acid có những tính chất hóa học đặc trưng nào và có ứng dụng gì trong sản xuất và đời sống?

II. KHÁI NIỆM VỀ ACID
- Acid là những hợp chất mà phân tử gồm có một hay nhiều nguyên tử hydrogen liên kết với gốc acid. Khi tan trong nước, acid phân li ra ion H⁺.
- Ví dụ: Hydrochloric acid (HCl), Sulfuric acid (H₂SO₄), Acetic acid (CH₃COOH).

III. TÍNH CHẤT HÓA HỌC CỦA ACID
1. Làm đổi màu chất chỉ thị:
- Dung dịch acid làm quỳ tím chuyển thành màu đỏ. Do đó, quỳ tím là thuốc thử dùng để nhận biết dung dịch acid.
2. Tác dụng với kim loại:
- Cho vài hạt kẽm (Zn) hoặc đinh sắt (Fe) vào ống nghiệm đựng dung dịch HCl loãng.
- Hiện tượng: Có bọt khí không màu thoát ra, mảnh kẽm tan dần. Đưa que đóm đang cháy vào miệng ống nghiệm, khí cháy với ngọn lửa màu xanh nhạt kèm tiếng nổ nhỏ (khí Hydrogen H₂).
- PTHH: Zn + 2HCl → ZnCl₂ + H₂↑
         Fe + 2HCl → FeCl₂ + H₂↑
- Lưu ý: Kim loại đứng sau H trong dãy hoạt động hóa học (Cu, Ag, Au) không phản ứng với HCl, H₂SO₄ loãng.
3. Tác dụng với oxide base:
- Cho một ít bột copper(II) oxide (CuO) màu đen vào ống nghiệm, nhỏ 2 mL dung dịch HCl, lắc nhẹ.
- Hiện tượng: Bột CuO màu đen tan dần, dung dịch chuyển sang màu xanh lam của muối copper(II) chloride (CuCl₂).
- PTHH: CuO + 2HCl → CuCl₂ + H₂O

IV. MỘT SỐ ACID THÔNG DỤNG VÀ NGUYÊN TẮC AN TOÀN
- Hydrochloric acid (HCl): Chất lỏng không màu, dùng tẩy gỉ thép, sản xuất muối chloride, chế biến thực phẩm.
- Sulfuric acid (H₂SO₄): Acid công nghiệp quan trọng hàng đầu, dùng sản xuất phân bón, chất tẩy rửa, ắc quy.
- CẢNH BÁO AN TOÀN: H₂SO₄ đặc hút nước rất mạnh và tỏa nhiệt lớn, gây bỏng sâu nguy hiểm. Khi pha loãng H₂SO₄ đặc, TUYỆT ĐỐI KHÔNG rót nước vào acid mà phải rót TỪ TỪ acid vào nước dọc theo đũa thủy tinh rồi khuấy đều.`
      },
      {
        id: 'khtn8-ch-9',
        chapterNumber: 2,
        chapterTitle: 'Chương 2: Một số hợp chất vô cơ thông dụng (Hóa học)',
        lessonNumber: '9',
        lessonName: 'Base (Bazơ - Tính chất hóa học và Phân loại)',
        summary: 'Khái niệm base phân tử gồm nguyên tử kim loại liên kết với nhóm hydroxide (-OH); dung dịch base làm quỳ tím hóa xanh, phenolphtalein hóa hồng; phản ứng trung hòa giữa acid và base tạo muối và nước.',
        keyPoints: [
          'Base phân tử gồm nguyên tử kim loại liên kết với một hay nhiều nhóm hydroxide (-OH).',
          'Base tan trong nước (kiềm): NaOH, KOH, Ca(OH)₂, Ba(OH)₂.',
          'Dung dịch kiềm làm quỳ tím hóa xanh, dung dịch phenolphthalein không màu hóa hồng.',
          'Phản ứng trung hòa: Acid + Base → Muối + Nước (NaOH + HCl → NaCl + H₂O).'
        ]
      },
      {
        id: 'khtn8-ch-10',
        chapterNumber: 2,
        chapterTitle: 'Chương 2: Một số hợp chất vô cơ thông dụng (Hóa học)',
        lessonNumber: '10',
        lessonName: 'Thang pH và Chỉ thị đo độ acid - base',
        summary: 'Ý nghĩa thang pH từ 1 đến 14; pH < 7 là môi trường acid, pH = 7 là trung tính, pH > 7 là môi trường base (kiềm); ứng dụng đo pH của đất trồng trọt và nước sinh hoạt.',
        keyPoints: [
          'Thang pH dùng để biểu thị độ acid, base của một dung dịch.',
          'pH < 7: Dung dịch có tính acid (pH càng nhỏ, tính acid càng mạnh).',
          'pH = 7: Dung dịch trung tính (nước cất).',
          'pH > 7: Dung dịch có tính base (pH càng lớn, tính base càng mạnh).'
        ]
      },
      {
        id: 'khtn8-ch-2',
        chapterNumber: 1,
        chapterTitle: 'Chương 1: Phản ứng hóa học (Hóa học)',
        lessonNumber: '2',
        lessonName: 'Phản ứng hóa học và Biến đổi hóa học',
        summary: 'Phân biệt hiện tượng vật lí và hiện tượng hóa học; dấu hiệu nhận biết phản ứng hóa học (tạo kết tủa, sinh chất khí, đổi màu, tỏa nhiệt phát sáng); viết phương trình chữ.',
        keyPoints: [
          'Biến đổi vật lí: Chất thay đổi về trạng thái, kích thước nhưng giữ nguyên bản chất chất.',
          'Biến đổi hóa học: Có sự hình thành chất mới.',
          'Dấu hiệu có phản ứng: Xuất hiện chất khí, chất kết tủa, thay đổi màu sắc hoặc có sự tỏa nhiệt/phát sáng.'
        ]
      },
      {
        id: 'khtn8-ch-3',
        chapterNumber: 1,
        chapterTitle: 'Chương 1: Phản ứng hóa học (Hóa học)',
        lessonNumber: '3',
        lessonName: 'Định luật bảo toàn khối lượng và Phương trình hóa học',
        summary: 'Định luật bảo toàn khối lượng m(chất tham gia) = m(sản phẩm); các bước lập phương trình hóa học bằng phương pháp cân bằng nguyên tử hai vế.',
        keyPoints: [
          'Trong một phản ứng hóa học, tổng khối lượng của các chất tham gia bằng tổng khối lượng của các chất sản phẩm.',
          'Phương trình hóa học biểu diễn ngắn gọn phản ứng hóa học bằng công thức hóa học.',
          'Các bước lập PTHH: Viết sơ đồ phản ứng -> Cân bằng số nguyên tử mỗi nguyên tố -> Viết PTHH.'
        ]
      },
      {
        id: 'khtn8-ch-5',
        chapterNumber: 1,
        chapterTitle: 'Chương 1: Phản ứng hóa học (Hóa học)',
        lessonNumber: '5',
        lessonName: 'Nồng độ dung dịch (Nồng độ C% và CM)',
        summary: 'Định nghĩa độ tan, nồng độ phần trăm C% = (mct/mdd) * 100%, nồng độ mol CM = n / V; công thức pha chế dung dịch theo yêu cầu.',
        keyPoints: [
          'Dung dịch = Chất tan + Dung môi. mdd = mct + mdm.',
          'Nồng độ phần trăm: C% = (mct / mdd) * 100%.',
          'Nồng độ mol: CM = n / V (mol/L hoặc M).'
        ]
      },
      {
        id: 'khtn8-ch-11',
        chapterNumber: 2,
        chapterTitle: 'Chương 2: Một số hợp chất vô cơ thông dụng (Hóa học)',
        lessonNumber: '11',
        lessonName: 'Oxide (Oxit - Phân loại và Tính chất)',
        summary: 'Định nghĩa oxide là hợp chất của 2 nguyên tố trong đó có 1 nguyên tố là Oxygen; phân loại oxide base (Na₂O, CaO, BaO, CuO) và oxide acid (CO₂, SO₂, P₂O₅).',
        keyPoints: [
          'Oxide là hợp chất gồm 2 nguyên tố, trong đó có một nguyên tố là oxygen.',
          'Oxide base thường là oxide của kim loại, tác dụng với acid tạo thành muối và nước.',
          'Oxide acid thường là oxide của phi kim, tác dụng với dung dịch kiềm tạo muối và nước.'
        ]
      },
      {
        id: 'khtn8-ch-12',
        chapterNumber: 2,
        chapterTitle: 'Chương 2: Một số hợp chất vô cơ thông dụng (Hóa học)',
        lessonNumber: '12',
        lessonName: 'Muối (Tính chất và Phản ứng trao đổi trong dung dịch)',
        summary: 'Khái niệm muối gồm kim loại kết hợp gốc acid; tính chất hóa học tác dụng kim loại, acid, base, muối khác; điều kiện phản ứng trao đổi xảy ra (sinh chất kết tủa hoặc chất bay hơi hoặc nước).',
        keyPoints: [
          'Muối = Cation kim loại (hoặc NH₄⁺) + Anion gốc acid.',
          'Điều kiện phản ứng trao đổi: Sản phẩm phải có chất không tan (kết tủa) hoặc chất khí hoặc chất điện li yếu (nước).'
        ]
      },
      {
        id: 'khtn8-ch-13',
        chapterNumber: 2,
        chapterTitle: 'Chương 2: Một số hợp chất vô cơ thông dụng (Hóa học)',
        lessonNumber: '13',
        lessonName: 'Phân bón hóa học trong nông nghiệp',
        summary: 'Các loại phân bón đơn: phân đạm (cung cấp N), phân lân (cung cấp P), phân kali (cung cấp K); phân bón hỗn hợp NPK; cách bón phân hợp lí bảo vệ môi trường đất và nguồn nước.',
        keyPoints: [
          'Phân đạm cung cấp nguyên tố Nitrogen (N) kích thích cây đâm chồi, nảy lộc.',
          'Phân lân cung cấp Phosphorus (P) kích thích phát triển rễ và củ.',
          'Phân kali cung cấp Potassium (K) giúp cây tăng khả năng chống chịu sâu bệnh và lạnh giá.'
        ]
      },
      {
        id: 'khtn8-ch-1',
        chapterNumber: 1,
        chapterTitle: 'Chương 1: Phản ứng hóa học (Hóa học)',
        lessonNumber: '1',
        lessonName: 'Sử dụng một số hóa chất, thiết bị cơ bản trong phòng thí nghiệm',
        summary: 'Quy tắc an toàn trong phòng thí nghiệm hóa học; cách nhận biết nhãn hóa chất, cảnh báo nguy hiểm; cách sử dụng đèn cồn, ống nghiệm, kẹp gỗ, ống hút nhỏ giọt và cân điện tử.',
        keyPoints: [
          'Nắm vững nội quy an toàn phòng thí nghiệm và nhận diện các biểu tượng cảnh báo nguy hiểm trên nhãn lọ hóa chất.',
          'Kĩ thuật sử dụng đèn cồn an toàn: châm lửa bằng que diêm, tắt lửa bằng cách chụp nắp đèn cồn, không thổi bằng miệng.',
          'Kĩ thuật đun nóng chất lỏng trong ống nghiệm: hơ đều ống nghiệm, nghiêng miệng ống nghiệm về phía không có người.'
        ],
        rawContent: `BỘ GIÁO DỤC VÀ ĐÀO TẠO — BỘ SÁCH KẾT NỐI TRI THỨC VỚI CUỘC SỐNG
MÔN: KHOA HỌC TỰ NHIÊN 8 (PHÂN MÔN HÓA HỌC)
CHƯƠNG I: PHẢN ỨNG HÓA HỌC
BÀI 1: SỬ DỤNG MỘT SỐ HÓA CHẤT, THIẾT BỊ CƠ BẢN TRONG PHÒNG THÍ NGHIỆM

I. NGUYÊN TẮC AN TOÀN TRONG PHÒNG THÍ NGHIỆM
- Không nếm, không ngửi trực tiếp bất kì hóa chất nào. Khi ngửi mùi hóa chất, dùng bàn tay phẩy nhẹ hơi chất từ miệng lọ về phía mũi.
- Tuyệt đối không tự ý làm thí nghiệm ngoài sự hướng dẫn của giáo viên bộ môn.
- Khi lấy hóa chất dạng lỏng: dùng ống nhỏ giọt hoặc rót từ từ theo đũa thủy tinh, không để hóa chất rớt ra ngoài.

II. MỘT SỐ DỤNG CỤ VÀ THIẾT BỊ THÍ NGHIỆM THÔNG DỤNG
1. Ống nghiệm và giá để ống nghiệm: dùng chứa lượng nhỏ hóa chất lỏng hoặc rắn khi làm phản ứng.
2. Đèn cồn: nguồn nhiệt để đun nóng hóa chất. Phải dùng nắp dập tắt ngọn lửa.
3. Kẹp ống nghiệm: dùng kẹp ở vị trí 1/3 thân ống nghiệm tính từ miệng xuống.
4. Cân điện tử và bình định mức: dùng cân khối lượng và đo thể tích dung dịch chính xác.`
      },
      {
        id: 'khtn8-ch-4',
        chapterNumber: 1,
        chapterTitle: 'Chương 1: Phản ứng hóa học (Hóa học)',
        lessonNumber: '4',
        lessonName: 'Mol và Tỉ khối của chất khí',
        summary: 'Khái niệm Mol là lượng chất chứa 6,022.10²³ hạt nguyên tử hoặc phân tử; khối lượng mol M (g/mol); thể tích mol chất khí ở điều kiện chuẩn 25°C, 1 bar là 24,79 L/mol; công thức tỉ khối chất khí d_A/B = M_A / M_B.',
        keyPoints: [
          'Mol là lượng chất chứa N_A (6,022.10²³) nguyên tử hoặc phân tử chất đó.',
          'Khối lượng mol (M) là khối lượng tính bằng gam của 1 mol chất đó (g/mol). Công thức: n = m / M.',
          'Ở điều kiện chuẩn (25°C và 1 bar), 1 mol của bất kì chất khí nào cũng chiếm thể tích là 24,79 lít. Công thức: V = n . 24,79 (lít).',
          'Tỉ khối của khí A đối với khí B: d(A/B) = M(A) / M(B). Cho biết khí A nặng hay nhẹ hơn khí B bao nhiêu lần.'
        ]
      },
      {
        id: 'khtn8-ch-6',
        chapterNumber: 1,
        chapterTitle: 'Chương 1: Phản ứng hóa học (Hóa học)',
        lessonNumber: '6',
        lessonName: 'Tính theo phương trình hóa học',
        summary: 'Các bước tính khối lượng chất tham gia hoặc sản phẩm theo PTHH: Đổi dữ kiện bài toán ra số mol (n = m/M hoặc n = V/24,79) -> Viết và cân bằng PTHH -> Dựa vào tỉ lệ số mol trong PTHH tìm số mol chất cần tính -> Chuyển đổi số mol sang khối lượng hoặc thể tích.',
        keyPoints: [
          'Tỉ lệ số mol giữa các chất trong phản ứng đúng bằng tỉ lệ hệ số các chất trong phương trình hóa học đã cân bằng.',
          'Các bước giải bài toán tính theo PTHH: (1) Tính số mol chất đã cho; (2) Lập PTHH; (3) Tìm số mol chất cần tìm theo PTHH; (4) Tính khối lượng hoặc thể tích theo yêu cầu.',
          'Bài toán lượng chất dư: So sánh tỉ số n(cho) / hệ số PTHH, chất nào có tỉ số nhỏ hơn thì phản ứng hết, tính theo chất hết.'
        ]
      },
      {
        id: 'khtn8-ch-7',
        chapterNumber: 1,
        chapterTitle: 'Chương 1: Phản ứng hóa học (Hóa học)',
        lessonNumber: '7',
        lessonName: 'Tốc độ phản ứng và Chất xúc tác',
        summary: 'Khái niệm tốc độ phản ứng là đại lượng đặc trưng cho sự nhanh hay chậm của phản ứng hóa học; các yếu tố ảnh hưởng: nồng độ chất phản ứng, nhiệt độ, diện tích tiếp xúc bề mặt, áp suất (với chất khí) và chất xúc tác.',
        keyPoints: [
          'Tốc độ phản ứng biểu thị mức độ diễn ra nhanh hay chậm của một phản ứng hóa học.',
          'Các yếu tố làm tăng tốc độ phản ứng: Tăng nồng độ chất phản ứng, tăng nhiệt độ, tăng diện tích tiếp xúc (nghiền nhỏ chất rắn), tăng áp suất.',
          'Chất xúc tác là chất làm tăng tốc độ phản ứng nhưng không bị tiêu hao sau phản ứng (ví dụ men tiêu hóa, MnO₂ trong phản ứng phân hủy H₂O₂).'
        ]
      }
    ]
  },
  {
    id: 'doc-sbt-khtn-8',
    name: 'SBT Khoa học tự nhiên 8 (Kết Nối Tri Thức - Bài Tập Phân Hóa)',
    category: 'sbt',
    subject: 'Khoa học tự nhiên',
    grade: 'Lớp 8',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-05',
    fileSize: '18.7 MB',
    pageCount: 180,
    status: 'indexed',
    rawTextPreview: 'Tuyển chọn bài tập phân môn Hóa học KHTN 8: Câu hỏi trắc nghiệm 4 mức độ nhận biết - thông hiểu - vận dụng - vận dụng cao. Bài tập tính nồng độ C%, CM, tính theo PTHH có chất dư, bài toán nhận biết dung dịch bằng quỳ tím...',
    chapters: [
      {
        id: 'sbt-khtn8-ch-8',
        chapterNumber: 2,
        chapterTitle: 'Chương 2: Bài tập Hóa học vô cơ',
        lessonNumber: '8',
        lessonName: 'Bài tập Bài 8: Acid và Tính toán thực nghiệm',
        summary: 'Hệ thống bài tập phân loại acid, hoàn thành phương trình phản ứng hóa học kim loại tác dụng acid loãng, bài toán kim loại kẽm Zn tác dụng HCl tính thể tích khí H₂ ở đktc.',
        keyPoints: [
          'Dạng 1: Viết phương trình phản ứng của kim loại và oxide base với acid',
          'Dạng 2: Tính lượng khí H₂ sinh ra và khối lượng muối tạo thành',
          'Dạng 3: Bài toán hỗn hợp 2 kim loại tác dụng với lượng dư acid'
        ]
      },
      {
        id: 'sbt-khtn8-ch-2-3',
        chapterNumber: 1,
        chapterTitle: 'Chương 1: Bài tập Phản ứng hóa học',
        lessonNumber: '3',
        lessonName: 'Bài tập Định luật bảo toàn khối lượng và Cân bằng PTHH',
        summary: 'Bài tập rèn luyện kĩ năng cân bằng PTHH theo phương pháp chẵn - lẻ, phương pháp nguyên tử nguyên tố và áp dụng định luật bảo toàn khối lượng tính khối lượng chất.',
        keyPoints: [
          'Cân bằng nhanh các PTHH có nhóm nguyên tử (OH, SO₄, NO₃)',
          'Tính khối lượng chất phản ứng hoặc sản phẩm qua biểu thức bảo toàn'
        ]
      },
      {
        id: 'sbt-khtn8-ch-5-6',
        chapterNumber: 1,
        chapterTitle: 'Chương 1: Bài tập Nồng độ và Tính theo PTHH',
        lessonNumber: '5',
        lessonName: 'Bài tập Nồng độ dung dịch và Bài toán tính theo PTHH',
        summary: 'Bài toán pha chế dung dịch theo nồng độ C% và CM, bài toán có chất dư sau phản ứng, tính hiệu suất phản ứng.',
        keyPoints: [
          'Chuyển đổi linh hoạt giữa C% và CM: CM = (10 . C% . d) / M',
          'Xác định chất phản ứng hết và chất còn dư trong bài toán định lượng'
        ]
      },
      {
        id: 'sbt-khtn8-ch-11-12',
        chapterNumber: 2,
        chapterTitle: 'Chương 2: Bài tập Base, Oxide và Muối',
        lessonNumber: '12',
        lessonName: 'Bài tập Phản ứng trao đổi trong dung dịch',
        summary: 'Xét điều kiện phản ứng trao đổi giữa các dung dịch muối, acid, base xảy ra; giải bài toán tính khối lượng kết tủa sau phản ứng.',
        keyPoints: [
          'Vận dụng bảng tính tan để xác định chất kết tủa',
          'Tính khối lượng kết tủa BaSO₄, CaCO₃, AgCl'
        ]
      }
    ]
  },
  {
    id: 'doc-sgv-khtn-8',
    name: 'SGV Khoa học tự nhiên 8 (Sách Giáo Viên KNTT - Hướng Dẫn Sư Phạm)',
    category: 'sgv',
    subject: 'Khoa học tự nhiên',
    grade: 'Lớp 8',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-08',
    fileSize: '22.1 MB',
    pageCount: 260,
    status: 'indexed',
    rawTextPreview: 'Hướng dẫn giáo viên thiết kế bài dạy phân môn Hóa học KHTN 8 chuẩn Công văn 5512/BGDĐT-GDTrH. Kế hoạch tổ chức 4 hoạt động, quản lí an toàn phòng thí nghiệm, quy tắc thao tác với acid và hóa chất độc hại...',
    chapters: [
      {
        id: 'sgv-khtn8-ch-8',
        chapterNumber: 2,
        chapterTitle: 'Chương 2: Thiết kế dạy học Hợp chất vô cơ',
        lessonNumber: '8',
        lessonName: 'Gợi ý thiết kế Bài 8: Acid chuẩn CV 5512',
        summary: 'Phương pháp tổ chức thí nghiệm học sinh tự lực, cách đặt câu hỏi gợi mở phát triển năng lực tìm hiểu tự nhiên và rubric đánh giá hoạt động thực hành.',
        keyPoints: [
          'Thiết kế 4 hoạt động chuẩn CV 5512: Khởi động, Khám phá, Luyện tập, Vận dụng',
          'Tổ chức thí nghiệm vi mô tiết kiệm hóa chất và bảo đảm an toàn',
          'Tích hợp giáo dục môi trường về hiện tượng mưa acid'
        ]
      },
      {
        id: 'sgv-khtn8-ch-1',
        chapterNumber: 1,
        chapterTitle: 'Chương 1: Thiết kế dạy học Phản ứng hóa học',
        lessonNumber: '1',
        lessonName: 'Tổ chức hoạt động Thực hành an toàn và Cân bằng PTHH',
        summary: 'Quy trình hướng dẫn học sinh thao tác với hóa chất, phương pháp trực quan hóa số lượng nguyên tử giúp học sinh hiểu bản chất cân bằng phương trình.',
        keyPoints: [
          'Xây dựng rubric đánh giá kĩ năng thao tác phòng thí nghiệm',
          'Tổ chức trò chơi ghép thẻ nguyên tố để luyện tập cân bằng PTHH'
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // 2. KHOA HỌC TỰ NHIÊN LỚP 9 (TRỌNG TÂM PHÂN MÔN HÓA HỌC THCS)
  // -------------------------------------------------------------
  {
    id: 'doc-sgk-khtn-9',
    name: 'SGK Khoa học tự nhiên 9 (Kết Nối Tri Thức Với Cuộc Sống)',
    category: 'sgk',
    subject: 'Khoa học tự nhiên',
    grade: 'Lớp 9',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-01',
    fileSize: '26.8 MB',
    pageCount: 232,
    status: 'indexed',
    rawTextPreview: 'Chương VI: Kim loại (Dãy hoạt động hóa học, tách kim loại, ăn mòn và bảo vệ kim loại). Chương VII: Giới thiệu hợp chất hữu cơ, Alkane (Methane CH₄), Alkene (Ethylene C₂H₄), Nhiên liệu. Chương VIII: Ethylic alcohol và Acetic acid. Chương IX: Lipid, Carbohydrate, Polymer, Hóa học xanh...',
    chapters: [
      {
        id: 'khtn9-ch-14',
        chapterNumber: 6,
        chapterTitle: 'Chương 6: Kim loại và Sự biến đổi (Hóa học)',
        lessonNumber: '14',
        lessonName: 'Tính chất chung của kim loại',
        summary: 'Tính chất vật lí: tính dẻo, dẫn điện, dẫn nhiệt, ánh kim; tính chất hóa học: tác dụng oxygen, phi kim khác, acid, dung dịch muối.',
        keyPoints: [
          'Kim loại có tính dẻo, tính dẫn điện, tính dẫn nhiệt và có ánh kim.',
          'Kim loại tác dụng với oxygen tạo oxide; tác dụng với phi kim tạo muối.',
          'Kim loại tác dụng với acid loãng sinh khí H₂; kim loại mạnh đẩy kim loại yếu ra khỏi dung dịch muối.'
        ]
      },
      {
        id: 'khtn9-ch-15',
        chapterNumber: 6,
        chapterTitle: 'Chương 6: Kim loại và Sự biến đổi (Hóa học)',
        lessonNumber: '15',
        lessonName: 'Dãy hoạt động hóa học của kim loại',
        summary: 'Dãy hoạt động: K, Na, Ca, Mg, Al, Zn, Fe, Pb, (H), Cu, Ag, Au; ý nghĩa của dãy trong việc dự đoán phản ứng với nước, acid và muối.',
        keyPoints: [
          'Mức độ hoạt động hóa học của các kim loại giảm dần từ trái sang phải.',
          'Kim loại đứng trước Mg phản ứng với nước ở nhiệt độ thường giải phóng H₂.',
          'Kim loại đứng trước H phản ứng với một số acid loãng giải phóng H₂.',
          'Kim loại đứng trước (trừ K, Na, Ca...) đẩy được kim loại đứng sau ra khỏi dung dịch muối.'
        ]
      },
      {
        id: 'khtn9-ch-19',
        chapterNumber: 7,
        chapterTitle: 'Chương 7: Hydrocarbon và Nhiên liệu (Hóa học hữu cơ)',
        lessonNumber: '19',
        lessonName: 'Alkane (Methane CH₄ - Cấu tạo và Tính chất)',
        summary: 'Đặc điểm liên kết đơn C-H trong phân tử Methane; phản ứng cháy tỏa nhiều nhiệt; phản ứng thế đặc trưng với chlorine khi có ánh sáng.',
        keyPoints: [
          'Methane (CH₄) là hydrocarbon đơn giản nhất, trong phân tử có 4 liên kết đơn C-H.',
          'Phản ứng cháy: CH₄ + 2O₂ → CO₂ + 2H₂O (tỏa nhiều nhiệt, dùng làm nhiên liệu khí đốt).',
          'Phản ứng thế đặc trưng của liên kết đơn: CH₄ + Cl₂ → CH₃Cl (methyl chloride) + HCl (ánh sáng).'
        ]
      },
      {
        id: 'khtn9-ch-20',
        chapterNumber: 7,
        chapterTitle: 'Chương 7: Hydrocarbon và Nhiên liệu (Hóa học hữu cơ)',
        lessonNumber: '20',
        lessonName: 'Alkene (Ethylene C₂H₄ - Liên kết đôi)',
        summary: 'Cấu tạo phân tử Ethylene có 1 liên kết đôi C=C kém bền; phản ứng cộng làm mất màu dung dịch Bromine (thuốc thử nhận biết liên kết đôi); phản ứng trùng hợp tạo nhựa PE.',
        keyPoints: [
          'Trong phân tử Ethylene (C₂H₄) có 1 liên kết đôi C=C, trong đó có một liên kết kém bền dễ bị đứt ra trong các phản ứng hóa học.',
          'Phản ứng cộng đặc trưng: CH₂=CH₂ + Br₂ → CH₂Br-CH₂Br (1,2-dibromoethane, làm mất màu da cam của Br₂).',
          'Phản ứng trùng hợp: n CH₂=CH₂ → (-CH₂-CH₂-)n (nhựa polyethylene PE).'
        ]
      },
      {
        id: 'khtn9-ch-22',
        chapterNumber: 8,
        chapterTitle: 'Chương 8: Ethylic alcohol và Acetic acid (Hóa học)',
        lessonNumber: '22',
        lessonName: 'Ethylic alcohol (C₂H₅OH - Rượu etylic)',
        summary: 'Công thức phân tử C₂H₅OH, nhóm chức -OH quyết định tính chất; phản ứng với kim loại Na giải phóng H₂; phản ứng cháy; độ cồn và tác hại của rượu bia.',
        keyPoints: [
          'Phân tử có nhóm hydroxy (-OH) linh động: 2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂↑.',
          'Độ cồn là số mL ethylic alcohol nguyên chất có trong 100 mL dung dịch hỗn hợp cồn với nước.'
        ]
      },
      {
        id: 'khtn9-ch-23',
        chapterNumber: 8,
        chapterTitle: 'Chương 8: Ethylic alcohol và Acetic acid (Hóa học)',
        lessonNumber: '23',
        lessonName: 'Acetic acid (CH₃COOH - Axit axetic)',
        summary: 'Nhóm carboxyl (-COOH) mang tính acid yếu; làm đỏ quỳ tím, tác dụng kim loại trước H, base, oxide base, muối carbonate; phản ứng ester hóa với alcohol.',
        keyPoints: [
          'Nhóm carboxyl (-COOH) quyết định tính acid của phân tử.',
          'Tác dụng Na₂CO₃ sinh bọt khí CO₂: 2CH₃COOH + CaCO₃ → (CH₃COO)₂Ca + CO₂↑ + H₂O.',
          'Phản ứng ester hóa: CH₃COOH + C₂H₅OH ⇄ CH₃COOC₂H₅ (mùi thơm hoa quả) + H₂O (H₂SO₄ đặc, t°).'
        ]
      },
      {
        id: 'khtn9-ch-16',
        chapterNumber: 6,
        chapterTitle: 'Chương 6: Kim loại và Sự biến đổi (Hóa học)',
        lessonNumber: '16',
        lessonName: 'Một số phương pháp tách kim loại và Hợp kim',
        summary: 'Các phương pháp tách kim loại từ quặng: nhiệt luyện, thủy luyện, điện phân; khái niệm và ứng dụng của hợp kim (gang, thép, duralumin).',
        keyPoints: [
          'Tách kim loại hoạt động mạnh (K, Na, Ca, Mg, Al): Phương pháp điện phân nóng chảy.',
          'Tách kim loại hoạt động trung bình và yếu (Zn, Fe, Cu, Pb): Phương pháp nhiệt luyện (dùng C, CO, H₂ khử oxide ở nhiệt độ cao).',
          'Hợp kim là vật liệu kim loại có chứa ít nhất một kim loại cơ bản và một số kim loại hoặc phi kim khác (gang, thép bền hơn sắt nguyên chất).'
        ]
      },
      {
        id: 'khtn9-ch-17',
        chapterNumber: 6,
        chapterTitle: 'Chương 6: Kim loại và Sự biến đổi (Hóa học)',
        lessonNumber: '17',
        lessonName: 'Sự ăn mòn kim loại và Bảo vệ kim loại',
        summary: 'Khái niệm sự ăn mòn kim loại do tác dụng hóa học của môi trường; các yếu tố ảnh hưởng (nhiệt độ, độ ẩm, nồng độ muối); các biện pháp bảo vệ kim loại (sơn phủ, mạ kim loại, dùng chất chống ăn mòn).',
        keyPoints: [
          'Ăn mòn kim loại là sự phá hủy kim loại hoặc hợp kim do tác dụng hóa học hoặc điện hóa giữa kim loại với môi trường xung quanh.',
          'Kim loại bị ăn mòn nhanh hơn trong môi trường ẩm ướt, có muối ăn (nước biển) hoặc hơi acid.',
          'Biện pháp bảo vệ: Cách li kim loại với môi trường (sơn, mạ, bôi dầu mỡ), chế tạo hợp kim chống ăn mòn (thép không gỉ - inox).'
        ]
      },
      {
        id: 'khtn9-ch-18',
        chapterNumber: 6,
        chapterTitle: 'Chương 6: Kim loại và Sự biến đổi (Hóa học)',
        lessonNumber: '18',
        lessonName: 'Tính chất chung của phi kim (Carbon, Silicon)',
        summary: 'Tính chất vật lí và hóa học của phi kim; tính chất đặc thù của các dạng thù hình của carbon (kim cương, than chì, carbon vô định hình); tính hấp phụ của than hoạt tính.',
        keyPoints: [
          'Phi kim tác dụng với kim loại tạo muối hoặc oxide phi kim.',
          'Phi kim tác dụng với hydrogen tạo hợp chất khí (HCl, H₂S, CH₄).',
          'Carbon có tính khử mạnh ở nhiệt độ cao: C + CO₂ → 2CO; C + CuO → Cu + CO₂↑.',
          'Than hoạt tính có tính hấp phụ cao, dùng làm mặt nạ phòng độc, lõi lọc nước.'
        ]
      },
      {
        id: 'khtn9-ch-21',
        chapterNumber: 7,
        chapterTitle: 'Chương 7: Hydrocarbon và Nhiên liệu (Hóa học hữu cơ)',
        lessonNumber: '21',
        lessonName: 'Alkyne (Acetylene C₂H₂ - Liên kết ba)',
        summary: 'Cấu tạo phân tử Acetylene có 1 liên kết ba C≡C; phản ứng cháy tỏa nhiệt độ rất cao (đèn xì hàn cắt kim loại); phản ứng cộng dung dịch Bromine qua 2 giai đoạn.',
        keyPoints: [
          'Công thức phân tử C₂H₂, công thức cấu tạo H-C≡C-H có một liên kết ba gồm 1 liên kết bền và 2 liên kết kém bền.',
          'Phản ứng cộng với dung dịch bromine: CH≡CH + 2Br₂ → CHBr₂-CHBr₂ (làm mất màu bromine nhanh chóng).',
          'Ứng dụng: Dùng trong đèn xì oxy - acetylen để hàn cắt kim loại do nhiệt độ ngọn lửa đạt trên 3000°C.'
        ]
      },
      {
        id: 'khtn9-ch-25',
        chapterNumber: 9,
        chapterTitle: 'Chương 9: Hợp chất hữu cơ phức tạp (Lipid, Carbohydrate, Polymer)',
        lessonNumber: '25',
        lessonName: 'Ester và Lipid (Chất béo trong đời sống)',
        summary: 'Khái niệm ester và phản ứng thủy phân; cấu tạo chất béo là triester của glycerol với các acid béo; tính chất vật lí nhẹ hơn nước, không tan trong nước; phản ứng xà phòng hóa.',
        keyPoints: [
          'Chất béo là triester của glycerol và các acid béo, có công thức chung là (RCOO)₃C₃H₅.',
          'Phản ứng xà phòng hóa: (RCOO)₃C₃H₅ + 3NaOH → 3RCOONa (xà phòng) + C₃H₅(OH)₃ (glycerol).',
          'Vai trò: Cung cấp năng lượng quan trọng cho cơ thể người và động vật, bảo quản và chế biến thực phẩm.'
        ]
      },
      {
        id: 'khtn9-ch-26',
        chapterNumber: 9,
        chapterTitle: 'Chương 9: Hợp chất hữu cơ phức tạp (Lipid, Carbohydrate, Polymer)',
        lessonNumber: '26',
        lessonName: 'Glucose và Saccharose (Carbohydrate)',
        summary: 'Công thức phân tử C₆H₁₂O₆ (Glucose) và C₁₂H₂₂O₁₁ (Saccharose); phản ứng tráng bạc đặc trưng của glucose; phản ứng thủy phân của đường mía saccharose; vai trò dinh dưỡng.',
        keyPoints: [
          'Glucose (C₆H₁₂O₆) có vị ngọt thanh, có nhiều trong quả nho chín, tham gia phản ứng tráng bạc: tráng gương sáng bóng.',
          'Saccharose (C₁₂H₂₂O₁₁) là đường mía thông dụng, bị thủy phân trong môi trường acid tạo glucose và fructose.',
          'Glucose là nguồn cung cấp năng lượng tức thời cho tế bào não và cơ bắp người.'
        ]
      },
      {
        id: 'khtn9-ch-27',
        chapterNumber: 9,
        chapterTitle: 'Chương 9: Hợp chất hữu cơ phức tạp (Lipid, Carbohydrate, Polymer)',
        lessonNumber: '27',
        lessonName: 'Tinh bột và Cellulose',
        summary: 'Công thức chung (-C₆H₁₀O₅-)n; phản ứng tạo màu xanh tím đặc trưng của hồ tinh bột với dung dịch Iodine (thuốc thử nhận biết tinh bột); phản ứng thủy phân tạo glucose; vai trò sản xuất giấy và thức ăn.',
        keyPoints: [
          'Tinh bột có nhiều trong các loại hạt ngũ cốc (gạo, ngô, khoai, sắn).',
          'Thuốc thử đặc trưng của tinh bột là dung dịch Iodine (I₂), tạo màu xanh tím đậm.',
          'Cellulose là thành phần chính cấu tạo nên thành tế bào thực vật, sợi bông, gỗ, dùng sản xuất giấy và tơ sợi.'
        ]
      },
      {
        id: 'khtn9-ch-29',
        chapterNumber: 9,
        chapterTitle: 'Chương 9: Hợp chất hữu cơ phức tạp (Lipid, Carbohydrate, Polymer)',
        lessonNumber: '29',
        lessonName: 'Polymer (Chất dẻo, Tơ sợi, Cao su và Hóa học xanh)',
        summary: 'Khái niệm hợp chất cao phân tử polymer gồm nhiều mắt xích liên kết nhau; phân loại chất dẻo (PE, PVC), cao su tự nhiên và cao su tổng hợp, tơ sợi; vấn đề rác thải nhựa và bảo vệ môi trường.',
        keyPoints: [
          'Polymer là hợp chất có phân tử khối rất lớn do nhiều mắt xích (monomer) liên kết với nhau.',
          'Chất dẻo thông dụng: Polyethylene (PE), Polyvinyl chloride (PVC).',
          'Vấn đề môi trường: Rác thải nhựa khó phân hủy gây ô nhiễm trắng, cần tăng cường tái chế và sử dụng nhựa sinh học.'
        ]
      }
    ]
  },
  {
    id: 'doc-sbt-khtn-9',
    name: 'SBT Khoa học tự nhiên 9 (Kết Nối Tri Thức - Bài Tập Phân Hóa)',
    category: 'sbt',
    subject: 'Khoa học tự nhiên',
    grade: 'Lớp 9',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-05',
    fileSize: '19.5 MB',
    pageCount: 196,
    status: 'indexed',
    rawTextPreview: 'Ngân hàng bài tập Hóa học 9 KNTT: Chuỗi biến đổi hóa học kim loại và hợp chất hữu cơ, bài toán xác định công thức phân tử hydrocarbon qua phản ứng đốt cháy, bài tập phân biệt cồn và acid...',
    chapters: [
      {
        id: 'sbt-khtn9-ch-15',
        chapterNumber: 6,
        chapterTitle: 'Chương 6: Bài tập Kim loại',
        lessonNumber: '15',
        lessonName: 'Bài tập Dãy hoạt động hóa học của kim loại',
        summary: 'Các dạng bài xác định kim loại, bài toán kim loại đẩy nhau ra khỏi dung dịch muối, tính nồng độ sau phản ứng.',
        keyPoints: [
          'Dạng 1: Viết phương trình kim loại đẩy muối',
          'Dạng 2: Bài toán tăng giảm khối lượng thanh kim loại'
        ]
      },
      {
        id: 'sbt-khtn9-ch-19-20',
        chapterNumber: 7,
        chapterTitle: 'Chương 7: Bài tập Hydrocarbon và Nhiên liệu',
        lessonNumber: '20',
        lessonName: 'Bài tập Phân biệt Alkane và Alkene qua dung dịch Bromine',
        summary: 'Dạng bài tập đốt cháy hydrocarbon tính thể tích CO₂ và H₂O, bài tập nhận biết khí Methane và Ethylene.',
        keyPoints: [
          'Nhận biết Ethylene bằng dung dịch Br₂ màu da cam bị mất màu',
          'Tính tỉ lệ số mol n(H₂O) và n(CO₂) để xác định loại hydrocarbon'
        ]
      },
      {
        id: 'sbt-khtn9-ch-22-23',
        chapterNumber: 8,
        chapterTitle: 'Chương 8: Bài tập Rượu và Acid hữu cơ',
        lessonNumber: '23',
        lessonName: 'Bài tập Phản ứng ester hóa và Tính độ cồn',
        summary: 'Bài toán tính hiệu suất phản ứng ester hóa giữa C₂H₅OH và CH₃COOH, bài tập tính lượng rượu nguyên chất theo độ cồn.',
        keyPoints: [
          'Công thức độ cồn: Độ cồn = (V_rượu nguyên chất / V_dung dịch) * 100',
          'Tính lượng ester Ethyl acetate thu được theo hiệu suất phản ứng'
        ]
      }
    ]
  },
  {
    id: 'doc-sgv-khtn-9',
    name: 'SGV Khoa học tự nhiên 9 (Sách Giáo Viên KNTT - Hướng Dẫn Giảng Dạy)',
    category: 'sgv',
    subject: 'Khoa học tự nhiên',
    grade: 'Lớp 9',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-08',
    fileSize: '23.4 MB',
    pageCount: 248,
    status: 'indexed',
    rawTextPreview: 'Hướng dẫn phương pháp dạy học phân môn Hóa học 9. Thiết kế hoạt động STEM điều chế xà phòng từ chất béo, làm giấm ăn từ hoa quả, phương pháp giải bài toán hóa hữu cơ định lượng...',
    chapters: [
      {
        id: 'sgv-khtn9-ch-15',
        chapterNumber: 6,
        chapterTitle: 'Chương 6: Phương pháp dạy học Kim loại',
        lessonNumber: '15',
        lessonName: 'Kế hoạch bài dạy Dãy hoạt động kim loại',
        summary: 'Tiến trình 4 hoạt động 5512, hướng dẫn thí nghiệm kiểm chứng sự đẩy kim loại an toàn.',
        keyPoints: [
          'Thiết kế chuỗi thí nghiệm so sánh tính hoạt động của Fe, Cu, Ag',
          'Phát triển năng lực thực nghiệm khoa học cho học sinh'
        ]
      },
      {
        id: 'sgv-khtn9-ch-20',
        chapterNumber: 7,
        chapterTitle: 'Chương 7: Dạy học Hóa học Hữu cơ trực quan',
        lessonNumber: '20',
        lessonName: 'Sử dụng mô hình phân tử 3D dạy học Alkane và Alkene',
        summary: 'Phương pháp hướng dẫn học sinh lắp ráp mô hình que - cầu liên kết đơn C-C và liên kết đôi C=C giúp khắc sâu bản chất phản ứng cộng.',
        keyPoints: [
          'Sử dụng bộ lắp ráp mô hình phân tử hoặc phần mềm mô phỏng 3D',
          'Tổ chức hoạt động phân biệt phản ứng thế và phản ứng cộng'
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // 3. KHOA HỌC TỰ NHIÊN LỚP 7 (PHÂN MÔN HÓA HỌC: NGUYÊN TỬ & BTH)
  // -------------------------------------------------------------
  {
    id: 'doc-sgk-khtn-7',
    name: 'SGK Khoa học tự nhiên 7 (Kết Nối Tri Thức Với Cuộc Sống)',
    category: 'sgk',
    subject: 'Khoa học tự nhiên',
    grade: 'Lớp 7',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-01',
    fileSize: '23.0 MB',
    pageCount: 208,
    status: 'indexed',
    rawTextPreview: 'Chương I: Nguyên tử - Sơ lược về bảng tuần hoàn các nguyên tố hóa học. Bài 2: Nguyên tử (hạt proton, neutron, electron). Bài 3: Nguyên tố hóa học và kí hiệu hóa học. Bài 4: Sơ lược bảng tuần hoàn các nguyên tố hóa học (ô nguyên tố, chu kì, nhóm). Bài 5: Phân tử - Đơn chất - Hợp chất. Bài 6: Hóa trị và Công thức hóa học...',
    chapters: [
      {
        id: 'khtn7-ch-2',
        chapterNumber: 1,
        chapterTitle: 'Chương 1: Nguyên tử - Sơ lược Bảng tuần hoàn (Hóa học)',
        lessonNumber: '2',
        lessonName: 'Nguyên tử (Mô hình Rutherford - Bohr)',
        summary: 'Nguyên tử có kích thước vô cùng nhỏ, trung hòa về điện; cấu tạo gồm hạt nhân ở giữa (mang điện tích dương chứa proton và neutron) và lớp vỏ gồm các electron mang điện tích âm chuyển động xung quanh.',
        keyPoints: [
          'Nguyên tử gồm hạt nhân mang điện dương và vỏ nguyên tử chứa các electron (e) mang điện âm.',
          'Hạt nhân gồm hạt proton (p, mang điện tích +1) và neutron (n, không mang điện).',
          'Trong mỗi nguyên tử: Số proton = Số electron (nguyên tử trung hòa về điện).',
          'Khối lượng nguyên tử tập trung hầu hết ở hạt nhân do khối lượng electron rất nhỏ bé.'
        ]
      },
      {
        id: 'khtn7-ch-3',
        chapterNumber: 1,
        chapterTitle: 'Chương 1: Nguyên tử - Sơ lược Bảng tuần hoàn (Hóa học)',
        lessonNumber: '3',
        lessonName: 'Nguyên tố hóa học và Kí hiệu hóa học',
        summary: 'Tập hợp các nguyên tử cùng loại có cùng số proton trong hạt nhân tạo thành một nguyên tố hóa học; quy ước tên gọi và kí hiệu hóa học 1 hoặc 2 chữ cái theo chuẩn IUPAC quốc tế.',
        keyPoints: [
          'Nguyên tố hóa học là tập hợp những nguyên tử cùng loại, có cùng số proton trong hạt nhân.',
          'Mỗi nguyên tố hóa học được biểu diễn bằng một kí hiệu hóa học (chữ cái đầu viết hoa, chữ thứ hai nếu có viết thường).',
          'Khối lượng nguyên tử được đo bằng đơn vị amu (atomic mass unit).'
        ]
      },
      {
        id: 'khtn7-ch-4',
        chapterNumber: 1,
        chapterTitle: 'Chương 1: Nguyên tử - Sơ lược Bảng tuần hoàn (Hóa học)',
        lessonNumber: '4',
        lessonName: 'Sơ lược về Bảng tuần hoàn các nguyên tố hóa học',
        summary: 'Nguyên tắc sắp xếp theo chiều tăng dần điện tích hạt nhân; cấu tạo bảng gồm Ô nguyên tố, Chu kì (hàng ngang) và Nhóm (cột dọc); vị trí của kim loại, phi kim và khí hiếm.',
        keyPoints: [
          'Bảng tuần hoàn sắp xếp các nguyên tố theo chiều tăng dần của điện tích hạt nhân nguyên tử.',
          'Ô nguyên tố cho biết: Số hiệu nguyên tử (= số p = số e), Kí hiệu hóa học, Tên nguyên tố, Khối lượng nguyên tử.',
          'Chu kì là dãy các nguyên tố mà nguyên tử của chúng có cùng số lớp electron (có 7 chu kì).',
          'Nhóm gồm các nguyên tố có tính chất hóa học tương tự nhau, sắp xếp thành cột theo số electron lớp ngoài cùng.'
        ]
      },
      {
        id: 'khtn7-ch-6',
        chapterNumber: 1,
        chapterTitle: 'Chương 1: Nguyên tử - Sơ lược Bảng tuần hoàn (Hóa học)',
        lessonNumber: '6',
        lessonName: 'Hóa trị và Công thức hóa học',
        summary: 'Ý nghĩa của công thức hóa học; quy tắc hóa trị AxBy thì a.x = b.y; các bước lập công thức hóa học của hợp chất khi biết hóa trị hoặc phần trăm khối lượng.',
        keyPoints: [
          'Công thức hóa học cho biết nguyên tố cấu tạo nên chất và số lượng nguyên tử mỗi nguyên tố.',
          'Quy tắc hóa trị: Trong hợp chất hai nguyên tố AxBy (hóa trị tương ứng a, b), tích chỉ số và hóa trị của nguyên tố này bằng tích chỉ số và hóa trị của nguyên tố kia: x.a = y.b.',
          'Áp dụng quy tắc hóa trị để lập CTHH hoặc tính hóa trị của một nguyên tố chưa biết.'
        ]
      },
      {
        id: 'khtn7-ch-5',
        chapterNumber: 2,
        chapterTitle: 'Chương 2: Phân tử và Liên kết hóa học (Hóa học)',
        lessonNumber: '5',
        lessonName: 'Phân tử - Đơn chất - Hợp chất',
        summary: 'Khái niệm phân tử là hạt đại diện cho chất, gồm một số nguyên tử liên kết với nhau; đơn chất tạo từ 1 nguyên tố hóa học; hợp chất tạo từ 2 hay nhiều nguyên tố hóa học; cách tính khối lượng phân tử theo đơn vị amu.',
        keyPoints: [
          'Phân tử là hạt đại diện cho chất, mang đầy đủ tính chất hóa học của chất.',
          'Đơn chất là chất được tạo nên từ một nguyên tố hóa học (ví dụ khí oxygen O₂, kim loại đồng Cu).',
          'Hợp chất là chất được tạo nên từ hai hay nhiều nguyên tố hóa học (ví dụ nước H₂O, muối ăn NaCl, carbon dioxide CO₂).',
          'Khối lượng phân tử bằng tổng khối lượng của các nguyên tử trong phân tử chất đó.'
        ]
      },
      {
        id: 'khtn7-ch-7',
        chapterNumber: 2,
        chapterTitle: 'Chương 2: Phân tử và Liên kết hóa học (Hóa học)',
        lessonNumber: '7',
        lessonName: 'Giới thiệu về liên kết hóa học (Liên kết ion và Liên kết cộng hóa trị)',
        summary: 'Quy tắc octet (8 electron lớp ngoài cùng bền vững như khí hiếm); sự hình thành liên kết ion do lực hút tĩnh điện giữa các ion mang điện tích trái dấu; sự hình thành liên kết cộng hóa trị do các nguyên tử dùng chung đôi electron.',
        keyPoints: [
          'Nguyên tử các nguyên tố có xu hướng đạt cấu hình electron bền vững của khí hiếm (8 electron ở lớp ngoài cùng, riêng He có 2 electron).',
          'Liên kết ion hình thành do lực hút tĩnh điện giữa các ion mang điện tích trái dấu (ví dụ kim loại Na nhường 1e thành Na⁺, phi kim Cl nhận 1e thành Cl⁻ hút nhau tạo NaCl).',
          'Liên kết cộng hóa trị hình thành do các nguyên tử phi kim góp chung một hay nhiều đôi electron (ví dụ phân tử H₂, O₂, H₂O, CO₂).'
        ]
      }
    ]
  },
  {
    id: 'doc-sbt-khtn-7',
    name: 'SBT Khoa học tự nhiên 7 (Kết Nối Tri Thức - Bài Tập)',
    category: 'sbt',
    subject: 'Khoa học tự nhiên',
    grade: 'Lớp 7',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-05',
    fileSize: '17.9 MB',
    pageCount: 172,
    status: 'indexed',
    rawTextPreview: 'Bài tập cấu tạo nguyên tử, tra cứu bảng tuần hoàn, tính phần trăm khối lượng nguyên tố trong hợp chất, lập công thức hóa học dựa vào quy tắc hóa trị...',
    chapters: [
      {
        id: 'sbt-khtn7-ch-4',
        chapterNumber: 1,
        chapterTitle: 'Chương 1: Bài tập Bảng tuần hoàn',
        lessonNumber: '4',
        lessonName: 'Bài tập Bảng tuần hoàn và Vị trí nguyên tố',
        summary: 'Dạng bài xác định vị trí nguyên tố ô, chu kì, nhóm dựa vào số electron và cấu hình hạt nhân.',
        keyPoints: [
          'Xác định số hạt p, n, e trong nguyên tử',
          'Lập CTHH theo quy tắc hóa trị'
        ]
      },
      {
        id: 'sbt-khtn7-ch-6-7',
        chapterNumber: 2,
        chapterTitle: 'Chương 2: Bài tập Liên kết hóa học và Hóa trị',
        lessonNumber: '7',
        lessonName: 'Bài tập Phân biệt Liên kết ion và Liên kết cộng hóa trị',
        summary: 'Bài tập vẽ sơ đồ dùng chung electron, sơ đồ cho - nhận electron tạo ion, tính hóa trị của nguyên tố trong hợp chất.',
        keyPoints: [
          'Nhận biết liên kết ion qua cặp kim loại điển hình và phi kim điển hình',
          'Biểu diễn liên kết cộng hóa trị bằng dấu chấm electron hoặc gạch nối'
        ]
      }
    ]
  },
  {
    id: 'doc-sgv-khtn-7',
    name: 'SGV Khoa học tự nhiên 7 (Sách Giáo Viên KNTT)',
    category: 'sgv',
    subject: 'Khoa học tự nhiên',
    grade: 'Lớp 7',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-08',
    fileSize: '21.5 MB',
    pageCount: 236,
    status: 'indexed',
    rawTextPreview: 'Phương pháp trực quan hóa mô hình nguyên tử Rutherford - Bohr. Trò chơi học tập khám phá ô nguyên tố bảng tuần hoàn, hướng dẫn sử dụng phần mềm mô phỏng 3D...',
    chapters: [
      {
        id: 'sgv-khtn7-ch-4',
        chapterNumber: 1,
        chapterTitle: 'Chương 1: Thiết kế dạy học Bảng tuần hoàn',
        lessonNumber: '4',
        lessonName: 'Kế hoạch dạy học Sơ lược Bảng tuần hoàn',
        summary: 'Hướng dẫn 4 bước tổ chức hoạt động học sinh khai thác bảng tuần hoàn kích thích tư duy.',
        keyPoints: [
          'Sử dụng sơ đồ trực quan và thẻ flashcard nguyên tố',
          'Tổ chức thảo luận nhóm tìm quy luật chu kì và nhóm'
        ]
      },
      {
        id: 'sgv-khtn7-ch-7',
        chapterNumber: 2,
        chapterTitle: 'Chương 2: Dạy học Liên kết hóa học',
        lessonNumber: '7',
        lessonName: 'Phương pháp mô phỏng tương tác Liên kết hóa học',
        summary: 'Khai thác phần mềm mô phỏng giúp học sinh hình dung trực quan cơ chế dùng chung electron và chuyển dời electron.',
        keyPoints: [
          'Trực quan hóa cấu hình octet bền vững',
          'Phân biệt rõ tính chất vật lí giữa hợp chất ion và hợp chất cộng hóa trị'
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // 4. KHOA HỌC TỰ NHIÊN LỚP 6 (PHÂN MÔN HÓA HỌC: CHẤT & TÁCH CHẤT)
  // -------------------------------------------------------------
  {
    id: 'doc-sgk-khtn-6-full',
    name: 'SGK Khoa học tự nhiên 6 (Kết Nối Tri Thức Với Cuộc Sống)',
    category: 'sgk',
    subject: 'Khoa học tự nhiên',
    grade: 'Lớp 6',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-01',
    fileSize: '21.4 MB',
    pageCount: 204,
    status: 'indexed',
    rawTextPreview: 'Chương 1: Mở đầu về KHTN và An toàn phòng thực hành. Chương 2: Các phép đo. Chương 3: Chất quanh ta (Sự đa dạng của chất, Ba thể của chất, Oxygen và không khí, Nhiên liệu, Lương thực). Chương 4: Tách chất ra khỏi hỗn hợp (Dung dịch, huyền phù, nhũ tương; lọc, cô cạn, chiết)...',
    chapters: [
      {
        id: 'khtn6-ch-2',
        chapterNumber: 1,
        chapterTitle: 'Chương 1: Mở đầu về KHTN và An toàn phòng thực hành',
        lessonNumber: '2',
        lessonName: 'Quy định an toàn trong phòng thực hành (Hóa chất và Dụng cụ)',
        summary: 'Nội quy an toàn phòng thực hành; nhận biết các kí hiệu cảnh báo nguy hiểm (dễ cháy, ăn mòn, độc sinh học); cách sử dụng kính bảo hộ, găng tay và xử lí tai nạn hóa chất ban đầu.',
        keyPoints: [
          'Tuân thủ tuyệt đối sự hướng dẫn của giáo viên khi tiếp xúc với hóa chất và dụng cụ thí nghiệm.',
          'Phân biệt các biển cảnh báo nguy hiểm: chất ăn mòn, chất độc, chất dễ cháy nổ, nguy cơ giật điện.',
          'Quy tắc sơ cứu: Bị hóa chất dính vào tay phải xả ngay dưới vòi nước chảy liên tục ít nhất 10 phút.'
        ]
      },
      {
        id: 'khtn6-ch-9',
        chapterNumber: 3,
        chapterTitle: 'Chương 3: Chất quanh ta (Hóa học đại cương)',
        lessonNumber: '9',
        lessonName: 'Sự đa dạng của chất và Các thể của chất',
        summary: 'Chất có ở khắp xung quanh ta; ba thể cơ bản rắn, lỏng, khí và đặc điểm sắp xếp các hạt; sự chuyển thể (nóng chảy, đông đặc, bay hơi, ngưng tụ, sôi).',
        keyPoints: [
          'Mọi vật thể đều do chất tạo nên. Một vật thể có thể tạo từ một hoặc nhiều chất.',
          'Chất tồn tại ở 3 thể: Rắn (hình dạng và thể tích xác định), Lỏng (thể tích xác định, hình dạng biến đổi), Khí/Hơi (không có hình dạng và thể tích xác định, lan tỏa chiếm toàn bộ thể tích bình chứa).',
          'Khi nhiệt độ thay đổi, chất có thể chuyển từ thể này sang thể khác.'
        ]
      },
      {
        id: 'khtn6-ch-10',
        chapterNumber: 3,
        chapterTitle: 'Chương 3: Chất quanh ta (Hóa học)',
        lessonNumber: '10',
        lessonName: 'Oxygen và Không khí',
        summary: 'Tính chất của oxygen là chất khí không màu, không mùi, duy trì sự cháy và sự sống; thành phần không khí gồm 78% Nitrogen, 21% Oxygen, 1% Carbon dioxide và khí khác; bảo vệ môi trường không khí.',
        keyPoints: [
          'Oxygen là chất khí không màu, không mùi, không vị, ít tan trong nước, nặng hơn không khí.',
          'Oxygen có vai trò duy trì sự sống của sinh vật và duy trì sự cháy của các nhiên liệu.',
          'Thành phần thể tích không khí: 78% nitrogen, 21% oxygen, 1% carbon dioxide, hơi nước và các khí khác.'
        ]
      },
      {
        id: 'khtn6-ch-11',
        chapterNumber: 3,
        chapterTitle: 'Chương 3: Chất quanh ta (Hóa học)',
        lessonNumber: '11',
        lessonName: 'Tính chất của chất và Sự biến đổi của chất (Vật lí & Hóa học)',
        summary: 'Phân biệt tính chất vật lí (màu sắc, mùi vị, thể, khối lượng riêng, nhiệt độ nóng chảy) và tính chất hóa học (khả năng biến đổi thành chất khác qua phản ứng cháy, phân hủy).',
        keyPoints: [
          'Tính chất vật lí: Không có sự biến đổi chất này thành chất khác (thể, màu, độ tan, nhiệt độ sôi).',
          'Tính chất hóa học: Đặc trưng bởi sự biến đổi tạo ra chất mới (ví dụ sắt bị gỉ trong không khí ẩm, than cháy thành khí carbon dioxide).'
        ]
      },
      {
        id: 'khtn6-ch-12',
        chapterNumber: 3,
        chapterTitle: 'Chương 3: Chất quanh ta (Hóa học)',
        lessonNumber: '12',
        lessonName: 'Một số vật liệu thông dụng (Kim loại, Nhựa, Cao su, Gốm sứ)',
        summary: 'Tính chất và ứng dụng của kim loại, nhựa, cao su, thủy tinh, gốm sứ; cách sử dụng an toàn, tiết kiệm và bảo vệ môi trường qua mô hình 3R (Reduce, Reuse, Recycle).',
        keyPoints: [
          'Kim loại dẫn điện, dẫn nhiệt tốt, bền cơ học, dùng chế tạo máy móc, dây dẫn điện.',
          'Nhựa và cao su cách điện, cách nhiệt, đàn hồi tốt nhưng khó phân hủy tự nhiên, cần tái chế.',
          'Thủy tinh và gốm sứ chịu nhiệt tốt, trơ hóa học nhưng dễ vỡ.'
        ]
      },
      {
        id: 'khtn6-ch-15',
        chapterNumber: 4,
        chapterTitle: 'Chương 4: Tách chất ra khỏi hỗn hợp (Hóa học thực nghiệm)',
        lessonNumber: '15',
        lessonName: 'Chất tinh khiết, Hỗn hợp và Dung dịch',
        summary: 'Phân biệt chất tinh khiết và hỗn hợp; hỗn hợp đồng nhất (dung dịch) và không đồng nhất (huyền phù, nhũ tương); chất tan và dung môi.',
        keyPoints: [
          'Chất tinh khiết chỉ tạo từ 1 chất, có tính chất vật lí và hóa học xác định.',
          'Hỗn hợp gồm 2 hay nhiều chất trộn lẫn vào nhau.',
          'Dung dịch là hỗn hợp đồng nhất của chất tan và dung môi.'
        ]
      },
      {
        id: 'khtn6-ch-16',
        chapterNumber: 4,
        chapterTitle: 'Chương 4: Tách chất ra khỏi hỗn hợp (Hóa học)',
        lessonNumber: '16',
        lessonName: 'Một số phương pháp tách chất thông dụng (Lọc, Cô cạn, Chiết)',
        summary: 'Phương pháp lọc tách chất rắn không tan ra khỏi chất lỏng; phương pháp cô cạn tách chất rắn tan ra khỏi dung dịch; phương pháp chiết tách 2 chất lỏng không hòa tan vào nhau.',
        keyPoints: [
          'Phương pháp lọc dùng để tách chất rắn không tan ra khỏi chất lỏng (ví dụ lọc cát khỏi nước).',
          'Phương pháp cô cạn dùng để tách chất rắn tan khỏi dung dịch (ví dụ làm muối biển từ nước biển).',
          'Phương pháp chiết dùng phễu chiết để tách các chất lỏng không hòa tan vào nhau (ví dụ tách dầu ăn khỏi nước).'
        ]
      },
      {
        id: 'khtn6-ch-17',
        chapterNumber: 4,
        chapterTitle: 'Chương 4: Tách chất ra khỏi hỗn hợp (Hóa học)',
        lessonNumber: '17',
        lessonName: 'Tách chất trong thực tế (Bài thực hành làm sạch muối và lọc nước)',
        summary: 'Quy trình thực hành làm sạch muối ăn bị lẫn cát bằng phương pháp hòa tan, lọc và cô cạn; chế tạo hệ thống lọc nước đơn giản bằng cát, sỏi, than hoạt tính.',
        keyPoints: [
          'Quy trình 3 bước làm sạch muối ăn: Hòa tan hỗn hợp vào nước -> Lọc bỏ cát không tan -> Cô cạn dung dịch thu hồi tinh thể muối sạch.',
          'Ứng dụng lọc nước bằng than hoạt tính giúp hấp phụ mùi hôi và chất hữu cơ độc hại.'
        ]
      }
    ]
  },
  {
    id: 'doc-sbt-khtn-6',
    name: 'SBT Khoa học tự nhiên 6 (Kết Nối Tri Thức - Bài Tập)',
    category: 'sbt',
    subject: 'Khoa học tự nhiên',
    grade: 'Lớp 6',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-05',
    fileSize: '16.5 MB',
    pageCount: 168,
    status: 'indexed',
    rawTextPreview: 'Hệ thống bài tập phân biệt hỗn hợp và chất tinh khiết, lựa chọn phương pháp tách chất trong thực tế đời sống, giải thích hiện tượng bảo quản thực phẩm...',
    chapters: [
      {
        id: 'sbt-khtn6-ch-16',
        chapterNumber: 4,
        chapterTitle: 'Chương 4: Bài tập Tách chất',
        lessonNumber: '16',
        lessonName: 'Bài tập Phương pháp tách chất',
        summary: 'Bài tập trắc nghiệm và tình huống thực tế làm sạch nước sinh hoạt, sản xuất muối ăn.',
        keyPoints: [
          'Lựa chọn phễu lọc, giấy lọc hay phễu chiết',
          'Vận dụng tách muối ăn bị lẫn cát'
        ]
      },
      {
        id: 'sbt-khtn6-ch-10',
        chapterNumber: 3,
        chapterTitle: 'Chương 3: Bài tập Oxygen và Không khí',
        lessonNumber: '10',
        lessonName: 'Bài tập Oxygen và Sự cháy',
        summary: 'Bài tập giải thích điều kiện dập tắt đám cháy, tính thể tích không khí cần thiết cho phản ứng cháy.',
        keyPoints: [
          'Hai điều kiện phát sinh sự cháy và ba biện pháp dập tắt sự cháy',
          'Tính thể tích không khí V(kk) = 5 . V(O₂)'
        ]
      }
    ]
  },
  {
    id: 'doc-sgv-khtn-6',
    name: 'SGV Khoa học tự nhiên 6 (Sách Giáo Viên KNTT)',
    category: 'sgv',
    subject: 'Khoa học tự nhiên',
    grade: 'Lớp 6',
    curriculum: 'Kết nối tri thức với cuộc sống',
    uploadDate: '2025-09-08',
    fileSize: '20.2 MB',
    pageCount: 220,
    status: 'indexed',
    rawTextPreview: 'Hướng dẫn dạy học thực hành tách chất lớp 6. Các thí nghiệm tự làm từ vật liệu tái chế (chai nhựa, bông y tế, cát sỏi làm bình lọc nước mini theo định hướng STEM)...',
    chapters: [
      {
        id: 'sgv-khtn6-ch-16',
        chapterNumber: 4,
        chapterTitle: 'Chương 4: Hướng dẫn dạy học Tách chất',
        lessonNumber: '16',
        lessonName: 'Kế hoạch bài dạy Thực hành Tách chất',
        summary: 'Tổ chức dự án STEM chế tạo hệ thống lọc nước đơn giản cho gia đình.',
        keyPoints: [
          'Tiến trình dạy học 5512 kết hợp mô hình 5E',
          'Rèn luyện kĩ năng thao tác khéo léo với dụng cụ thí nghiệm'
        ]
      },
      {
        id: 'sgv-khtn6-ch-10',
        chapterNumber: 3,
        chapterTitle: 'Chương 3: Hướng dẫn dạy học Oxygen',
        lessonNumber: '10',
        lessonName: 'Tổ chức thí nghiệm đốt que đóm trong Oxygen',
        summary: 'Kĩ thuật thu khí oxygen bằng phương pháp đẩy nước và đẩy không khí, phương pháp thử sự duy trì sự cháy bằng tàn đóm đỏ.',
        keyPoints: [
          'Hướng dẫn kĩ thuật thu khí an toàn không làm vỡ ống nghiệm',
          'Phát triển năng lực quan sát hiện tượng và giải thích'
        ]
      }
    ]
  },
  // Hợp nhất toàn bộ học liệu phân môn Vật lí, Sinh học (KHTN 6, 7, 8, 9) và Công nghệ 7 (KNTT)
  ...KHTN_PHYSICS_LIBRARY,
  ...KHTN_BIOLOGY_LIBRARY,
  ...CONG_NGHE_7_LIBRARY,
];

// =========================================================================
// PRESET MẪU MẶC ĐỊNH HOÀN HẢO CHO GIÁO VIÊN HÓA HỌC THCS (KHTN 8 - ACID)
// =========================================================================

export const SAMPLE_KHTN_HOA_8: WorkspaceState = {
  version: '2025.1-GDPT2018-KNTT',
  timestamp: new Date().toISOString(),
  activeTab: 'library',
  teacherProfile: TEACHER_PROFILE_KHTN_HOA,
  uploadedDocuments: KHTN_FULL_LIBRARY,
  savedProjects: [
    {
      id: 'proj-khtn8-acid',
      title: 'KHBD 5512 - Bài 8: Acid (Hóa học 8 KNTT)',
      type: 'khbd',
      subject: 'Khoa học tự nhiên',
      grade: 'Lớp 8',
      curriculum: 'Kết nối tri thức với cuộc sống',
      savedAt: '2025-10-05 09:30',
      fileSize: '240 KB',
      sourceDocName: 'SGK KHTN 8 (KNTT)',
      teacherName: 'Hồ Minh Luân',
      cloudSyncStatus: 'synced',
      downloadFormats: ['word', 'pdf', 'json']
    },
    {
      id: 'proj-khtn8-exam',
      title: 'Đề kiểm tra định kì 7991 - KHTN 8 (Phân môn Hóa học)',
      type: 'exam',
      subject: 'Khoa học tự nhiên',
      grade: 'Lớp 8',
      curriculum: 'Kết nối tri thức với cuộc sống',
      savedAt: '2025-10-05 10:15',
      fileSize: '310 KB',
      sourceDocName: 'SBT KHTN 8 (KNTT)',
      teacherName: 'Hồ Minh Luân',
      cloudSyncStatus: 'synced',
      downloadFormats: ['word', 'pdf', 'json']
    }
  ],
  lessonPlan: {
    schoolName: TEACHER_PROFILE_KHTN_HOA.school,
    department: TEACHER_PROFILE_KHTN_HOA.department,
    teacherName: TEACHER_PROFILE_KHTN_HOA.name,
    subject: 'Khoa học tự nhiên',
    grade: 'Lớp 8',
    curriculum: 'Kết nối tri thức với cuộc sống',
    lessonName: 'BÀI 8: ACID (TÍNH CHẤT HÓA HỌC VÀ ỨNG DỤNG CỦA ACID)',
    durationInPeriods: 2,
    academicYear: TEACHER_PROFILE_KHTN_HOA.academicYear,

    objectives: {
      knowledge: [
        'Nêu được khái niệm acid (tạo ion H⁺ trong dung dịch nước; gồm nguyên tử H liên kết gốc acid).',
        'Tiến hành được thí nghiệm của acid tác dụng với chất chỉ thị (quỳ tím hóa đỏ), tác dụng với kim loại (Mg, Zn, Fe giải phóng H₂), tác dụng với oxide base (CuO tạo CuCl₂ màu xanh lam).',
        'Viết và cân bằng thành thạo các phương trình hóa học (PTHH) minh họa tính chất hóa học của acid.',
        'Trình bày được ứng dụng của một số acid thông dụng (HCl, H₂SO₄) và nguyên tắc bảo đảm an toàn tuyệt đối khi pha loãng H₂SO₄ đặc.'
      ],
      competencies: {
        general: [
          'Năng lực tự chủ và tự học: Tự nghiên cứu thông tin SGK KNTT về các loại acid thông dụng trong tự nhiên và công nghiệp.',
          'Năng lực giao tiếp và hợp tác: Làm việc nhóm 4 học sinh để thực hiện an toàn chuỗi 3 thí nghiệm với acid loãng, phân công nhóm trưởng, thư kí ghi chép hiện tượng.',
          'Năng lực giải quyết vấn đề và sáng tạo: Đề xuất giải pháp xử lí nước chua phèn trong nông nghiệp bằng vôi sống và giải thích nguyên nhân hiện tượng mưa acid.'
        ],
        specific: [
          'Năng lực nhận thức khoa học tự nhiên: Trình bày và hệ thống hóa được tính chất hóa học của acid, phân biệt được kim loại phản ứng và không phản ứng với HCl/H₂SO₄ loãng.',
          'Năng lực tìm hiểu tự nhiên: Kĩ năng thao tác dùng kẹp gỗ, ống hút nhỏ giọt nhỏ acid vào mẫu kim loại và nhận diện bọt khí Hydrogen thoát ra.',
          'Năng lực vận dụng kiến thức: Vận dụng quy tắc pha loãng sulfuric acid an toàn trong đời sống gia đình và phòng thí nghiệm trường học.'
        ]
      },
      qualities: [
        'Chăm chỉ: Tích cực chuẩn bị bài, cẩn thận, tỉ mỉ khi làm việc với hóa chất.',
        'Trung thực: Khách quan, trung thực ghi nhận màu sắc chỉ thị và hiện tượng sủi bọt khí thực nghiệm.',
        'Trách nhiệm: Tuân thủ nghiêm ngặt nội quy an toàn phòng thí nghiệm Hóa học, có ý thức tiết kiệm hóa chất và thu gom rác thải hóa học đúng quy định.'
      ]
    },

    equipments: {
      teacher: [
        'Kế hoạch bài dạy chuẩn Công văn 5512/BGDĐT-GDTrH, bài giảng điện tử tương tác Slide 16:9.',
        'Bộ video clip mô phỏng cấu tạo phân tử acid và sự điện li trong nước.',
        'Dụng cụ và hóa chất làm thí nghiệm đối chứng: Lọ dung dịch HCl 1M, H₂SO₄ đặc (để hướng dẫn an toàn), mẫu CuO bột màu đen, giấy quỳ tím.'
      ],
      students: [
        'Sách giáo khoa Khoa học tự nhiên 8 (Bộ Kết nối tri thức với cuộc sống), vở ghi, bút viết.',
        'Bộ khay thí nghiệm cho mỗi nhóm (6 nhóm/lớp): Giá để ống nghiệm, 4 ống nghiệm sạch, kẹp gỗ, ống nhỏ giọt.',
        'Hóa chất học sinh: Lọ dung dịch HCl loãng (0.5M), hộp giấy quỳ tím, vài viên kẽm (Zn), đinh sắt (Fe) đã chà sạch gỉ, mẩu đồng (Cu).'
      ]
    },

    activities: [
      {
        id: 'khtn8-act-1',
        code: 'ACT_1',
        title: 'Hoạt động 1: Xác định vấn đề / Khởi động (Mở đầu)',
        duration: '8 phút',
        goal: 'Khơi gợi hứng thú, liên hệ các chất có vị chua quen thuộc trong đời sống (chanh, giấm, quất) với khái niệm acid trong hóa học; đặt vấn đề về tính chất của acid.',
        content: 'Học sinh quan sát hình ảnh quả chanh, chai giấm ăn, bình ắc quy xe máy. Trả lời câu hỏi: Vị chua của chanh do chất nào tạo nên? Tại sao nước chanh làm đổi màu giấy quỳ tím? Trong công nghiệp, acid có những đặc tính hóa học gì?',
        product: 'Câu trả lời của học sinh: Vị chua do acid (citric acid trong chanh, acetic acid trong giấm); acid làm quỳ tím đổi màu; bình ắc quy chứa acid mạnh sulfuric acid.',
        implementation: {
          step1_assign: 'Giáo viên chiếu hình ảnh thực tế và đưa ra câu hỏi gợi mở: "Tại sao khi vắt chanh vào nước rau muống luộc thì nước canh lại chuyển từ màu xanh sang đỏ nhạt? Chất nào tạo nên sự biến đổi kì diệu này?". Giao nhiệm vụ thảo luận cặp đôi 2 phút.',
          step2_execute: 'Học sinh trao đổi cặp đôi, nhớ lại kiến thức lớp 6 về chất chỉ thị màu tự nhiên, ghi phán đoán vào phiếu học tập.',
          step3_report: 'Đại diện 2 cặp đôi phát biểu ý kiến: Do trong chanh có chứa acid. Acid làm đổi màu chất chỉ thị.',
          step4_conclude: 'Giáo viên nhận xét, chốt vấn đề: Acid là một loại hợp chất vô cơ vô cùng quan trọng. Để hiểu rõ bản chất và các tính chất hóa học đặc trưng, chúng ta cùng nghiên cứu Bài 8.'
        }
      },
      {
        id: 'khtn8-act-2',
        code: 'ACT_2',
        title: 'Hoạt động 2: Hình thành kiến thức mới (Khám phá tính chất hóa học của Acid)',
        duration: '22 phút',
        goal: 'Học sinh tự lực thực hiện các thí nghiệm: Acid làm đổi màu quỳ tím, tác dụng kim loại Zn, Fe sinh khí H₂, tác dụng oxide base CuO tạo dung dịch CuCl₂ màu xanh lam; rút ra kết luận và viết PTHH.',
        content: 'Các nhóm nhận khay hóa chất, tiến hành 3 thí nghiệm theo phiếu học tập số 1: (1) Nhỏ HCl vào giấy quỳ tím; (2) Cho 2 mL HCl vào 2 ống nghiệm chứa Zn và Fe; (3) Cho 2 mL HCl vào ống nghiệm chứa bột CuO đen, lắc nhẹ. Ghi hiện tượng và viết PTHH.',
        product: 'Phiếu học tập số 1 hoàn thành: (1) Quỳ tím chuyển sang màu đỏ; (2) Có bọt khí không màu H₂ thoát ra, Zn tan: Zn + 2HCl → ZnCl₂ + H₂↑; (3) Bột CuO tan, dung dịch có màu xanh lam: CuO + 2HCl → CuCl₂ + H₂O.',
        implementation: {
          step1_assign: 'GV nêu rõ các bước an toàn khi dùng acid, chia lớp thành 6 nhóm, phát phiếu học tập số 1, giao thời gian thực hành 12 phút.',
          step2_execute: 'Các nhóm thao tác thí nghiệm: Nhóm trưởng điều hành, học sinh lần lượt nhỏ acid vào quỳ tím, thả kẽm vào ống nghiệm, quan sát bọt khí và hiện tượng đổi màu. GV đi từng bàn nhắc nhở tư thế cầm ống nghiệm và nhỏ hóa chất cẩn thận.',
          step3_report: 'Đại diện nhóm 2 và nhóm 5 lên bảng dán phiếu học tập, cử đại diện trình bày hiện tượng và viết 2 PTHH minh họa.',
          step4_conclude: 'GV chuẩn hóa kiến thức trên màn hình trình chiếu: Khái quát 3 tính chất hóa học then chốt của acid. Nhấn mạnh kim loại đứng sau H (như Cu) không phản ứng với HCl loãng.'
        }
      },
      {
        id: 'khtn8-act-3',
        code: 'ACT_3',
        title: 'Hoạt động 3: Luyện tập và củng cố kiến thức',
        duration: '10 phút',
        goal: 'Khắc sâu kiến thức về tính chất hóa học của acid; rèn luyện kĩ năng viết và cân bằng PTHH; giải bài tập trắc nghiệm và bài toán tính theo PTHH đơn giản.',
        content: 'Học sinh làm việc cá nhân hoàn thành 4 câu hỏi trắc nghiệm nhanh và 1 bài tập tự luận: Cho 6,5 gam kẽm (Zn) tác dụng hoàn toàn với dung dịch HCl dư. Tính thể tích khí Hydrogen (đktc) thu được.',
        product: 'Đáp án bảng con trắc nghiệm; bài giải tự luận trong vở: n(Zn) = 6,5/65 = 0,1 mol -> n(H₂) = 0,1 mol -> V(H₂) = 0,1 * 24,79 = 2,479 L (theo chuẩn điều kiện chuẩn 25°C, 1 bar của GDPT 2018).',
        implementation: {
          step1_assign: 'GV chiếu 4 câu hỏi trắc nghiệm và bài toán tính thể tích khí theo chuẩn GDPT 2018 (1 mol khí = 24,79 L ở 25°C, 1 bar).',
          step2_execute: 'Học sinh tính toán độc lập trong 5 phút.',
          step3_report: 'GV mời 1 học sinh lên bảng giải chi tiết, các học sinh khác đối chiếu kết quả.',
          step4_conclude: 'GV chốt đáp án, biểu dương các em làm nhanh và nhắc nhở lưu ý đơn vị đo thể tích khí theo chương trình 2018.'
        }
      },
      {
        id: 'khtn8-act-4',
        code: 'ACT_4',
        title: 'Hoạt động 4: Vận dụng và mở rộng thực tiễn',
        duration: '5 phút (hướng dẫn về nhà)',
        goal: 'Vận dụng kiến thức acid giải thích hiện tượng mưa acid gây hại cho các tượng đài đá vôi và công trình kim loại; nắm vững nguyên tắc an toàn pha loãng acid sulfuric.',
        content: 'Nhiệm vụ: (1) Tìm hiểu nguyên nhân hình thành mưa acid (khí SO₂, NO₂) và cách giảm thiểu; (2) Giải thích vì sao khi bị ong đốt (nọc có tính acid) người ta thường bôi vôi tôi hoặc kem đánh răng (tính kiềm yếu) vào vết đốt.',
        product: 'Bài báo cáo ngắn dạng infographic hoặc bài thuyết trình 1 trang nộp vào tiết học sau.',
        implementation: {
          step1_assign: 'GV chiếu hình ảnh tượng đá bị ăn mòn do mưa acid và hình ảnh sơ đồ pha loãng acid sulfuric (rót acid vào nước). Nêu câu hỏi nhiệm vụ về nhà.',
          step2_execute: 'Học sinh ghi nhận câu hỏi và tiêu chí đánh giá vào sổ tay.',
          step3_report: 'Nộp bài báo cáo qua nhóm học tập trực tuyến trước buổi học sau.',
          step4_conclude: 'GV dặn dò chuẩn bị bài mới Bài 9: Base.'
        }
      }
    ]
  },
  slides: {
    title: 'BÀI 8: ACID (TÍNH CHẤT HÓA HỌC & ỨNG DỤNG)',
    author: `${TEACHER_PROFILE_KHTN_HOA.name} · ${TEACHER_PROFILE_KHTN_HOA.department}`,
    slides: [
      {
        id: 'slide-1',
        activityCode: 'INTRO',
        stageLabel: 'Mở đầu bài học',
        title: 'BÀI 8: ACID (TÍNH CHẤT HÓA HỌC & ỨNG DỤNG)',
        subtitle: 'Môn Khoa học tự nhiên 8 · Bộ sách Kết nối tri thức với cuộc sống',
        bulletPoints: [
          'Giáo viên giảng dạy: Thầy Hồ Minh Luân',
          'Thời lượng thực hiện: 2 tiết (90 phút)',
          'Tổ Khoa học tự nhiên — Trường THCS & THPT Nguyễn Huệ'
        ],
        speakerNotes: 'Giới thiệu tổng quan bài học về Acid trong đời sống.'
      },
      {
        id: 'slide-2',
        activityCode: 'ACT_2',
        stageLabel: 'Hình thành kiến thức',
        title: 'I. KHÁI NIỆM VỀ ACID',
        subtitle: 'Cấu tạo phân tử và sự điện li trong nước',
        bulletPoints: [
          'Acid là hợp chất mà phân tử gồm có một hay nhiều nguyên tử Hydrogen (H) liên kết với gốc acid.',
          'Khi tan trong nước, acid tạo ra cation Hydrogen (H⁺).',
          'Công thức chung: H_n A (trong đó A là gốc acid hóa trị n).',
          'Ví dụ phổ biến: Hydrochloric acid (HCl), Sulfuric acid (H₂SO₄), Nitric acid (HNO₃), Acetic acid (CH₃COOH).'
        ],
        formulaOrCode: 'Acid → H⁺ + Gốc acid',
        calloutBox: {
          title: 'Đặc trưng cốt lõi',
          text: 'Mọi dung dịch acid đều chứa cation H⁺, chính ion H⁺ quyết định tính chất hóa học chung của acid.',
          type: 'key-concept'
        },
        speakerNotes: 'Giải thích nguyên nhân dẫn đến tính chất chung của acid là do ion H+.'
      },
      {
        id: 'slide-3',
        activityCode: 'ACT_2',
        stageLabel: 'Hình thành kiến thức',
        title: 'II. TÍNH CHẤT 1: LÀM ĐỔI MÀU CHẤT CHỈ THỊ',
        subtitle: 'Thí nghiệm nhận biết acid bằng giấy quỳ tím',
        bulletPoints: [
          'Dung dịch acid làm đổi màu giấy quỳ tím từ tím sang ĐỎ.',
          'Quỳ tím là chất chỉ thị màu đơn giản, nhạy và thuận tiện nhất để nhận biết môi trường acid.',
          'Ứng dụng: Nhận diện nhanh các nguồn nước nhiễm chua phèn hoặc kiểm tra chất lượng thực phẩm lên men.'
        ],
        speakerNotes: 'Yêu cầu học sinh thực hành nhúng giấy quỳ vào ống nghiệm chứa HCl loãng.'
      },
      {
        id: 'slide-4',
        activityCode: 'ACT_2',
        stageLabel: 'Hình thành kiến thức',
        title: 'III. TÍNH CHẤT 2: TÁC DỤNG VỚI KIM LOẠI',
        subtitle: 'Phản ứng sinh khí Hydrogen (H₂)',
        bulletPoints: [
          'Dung dịch acid (HCl, H₂SO₄ loãng) tác dụng với kim loại đứng trước H trong dãy hoạt động.',
          'Hiện tượng: Kim loại tan dần, có bọt khí không màu H₂ thoát ra sủi bọt mạnh.',
          'PTHH điển hình: Zn + 2HCl → ZnCl₂ + H₂↑',
          'PTHH minh họa: Fe + H₂SO₄ loãng → FeSO₄ + H₂↑',
          'Lưu ý quan trọng: Kim loại Cu, Ag, Au đứng sau H nên KHÔNG tác dụng với HCl, H₂SO₄ loãng.'
        ],
        formulaOrCode: 'Kim loại (trước H) + Acid loãng → Muối + H₂↑',
        speakerNotes: 'Lưu ý học sinh về dãy hoạt động hóa học và điều kiện xảy ra phản ứng.'
      },
      {
        id: 'slide-5',
        activityCode: 'ACT_2',
        stageLabel: 'Hình thành kiến thức',
        title: 'IV. TÍNH CHẤT 3: TÁC DỤNG VỚI OXIDE BASE',
        subtitle: 'Phản ứng tạo muối và nước',
        bulletPoints: [
          'Dung dịch acid tác dụng với oxide base tạo thành muối và nước.',
          'Thí nghiệm: Nhỏ dung dịch HCl vào ống nghiệm chứa bột copper(II) oxide (CuO) màu đen.',
          'Hiện tượng: Bột đen tan dần, dung dịch chuyển sang màu xanh lam đặc trưng của muối Cu²⁺.',
          'PTHH: CuO (đen) + 2HCl → CuCl₂ (xanh lam) + H₂O',
          'PTHH: Fe₂O₃ (nâu đỏ) + 6HCl → 2FeCl₃ (vàng nâu) + 3H₂O'
        ],
        formulaOrCode: 'Oxide base + Acid → Muối + Nước',
        speakerNotes: 'Nhấn mạnh sự chuyển màu dung dịch từ không màu sang xanh lam của đồng.'
      },
      {
        id: 'slide-6',
        activityCode: 'ACT_3',
        stageLabel: 'Luyện tập',
        title: 'V. ỨNG DỤNG CỦA ACID TRONG ĐỜI SỐNG & SẢN XUẤT',
        subtitle: 'Tầm quan trọng của HCl và H₂SO₄',
        bulletPoints: [
          'Hydrochloric acid (HCl): Tẩy gỉ thép trong công nghiệp xây dựng, sản xuất muối chloride, tinh chế quặng, có trong dịch vị dạ dày giúp tiêu hóa.',
          'Sulfuric acid (H₂SO₄): Mệnh danh là "máu của ngành công nghiệp hóa chất", dùng sản xuất phân bón (superphosphate), chất tẩy rửa, sơn, ắc quy chì.',
          'Acetic acid (CH₃COOH): Giấm ăn (nồng độ 2 - 5%), chất bảo quản thực phẩm, sản xuất tơ nhân tạo.'
        ],
        speakerNotes: 'Liên hệ thực tế đời sống để học sinh thấy vai trò to lớn của hóa học.'
      },
      {
        id: 'slide-7',
        activityCode: 'ACT_4',
        stageLabel: 'Vận dụng',
        title: 'VI. NGUYÊN TẮC AN TOÀN TUYỆT ĐỐI VỚI ACID',
        subtitle: 'Quy tắc pha loãng Sulfuric acid đặc',
        bulletPoints: [
          'Sulfuric acid đặc háo nước cực mạnh và tỏa lượng nhiệt khổng lồ, gây bỏng ăn mòn sâu nguy hiểm.',
          'QUY TẮC BẤT DI BẤT DỊCH: Rót TỪ TỪ acid vào nước dọc theo đũa thủy tinh và khuấy đều.',
          'TUYỆT ĐỐI KHÔNG làm ngược lại (rót nước vào acid) vì sẽ làm nước sôi đột ngột bắn acid ra ngoài gây bỏng mù mắt.',
          'Xử lí khi dính acid: Rửa ngay dưới vòi nước sạch chảy liên tục nhiều phút, sau đó rửa bằng dung dịch NaHCO₃ loãng.'
        ],
        calloutBox: {
          title: 'Quy tắc vàng an toàn',
          text: 'Rót axit vào nước dọc theo đũa thủy tinh. Tuyệt đối không rót nước vào axit đặc!',
          type: 'warning'
        },
        speakerNotes: 'Nhấn mạnh mạnh mẽ quy tắc rót acid vào nước, giải thích cơ chế tỏa nhiệt.'
      },
      {
        id: 'slide-8',
        activityCode: 'ACT_4',
        stageLabel: 'Tổng kết',
        title: 'VII. TỔNG KẾT BÀI HỌC (EM ĐÃ HỌC)',
        subtitle: 'Kiến thức cốt lõi SGK Kết Nối Tri Thức',
        bulletPoints: [
          '1. Acid tạo cation H⁺ trong nước; quỳ tím hóa ĐỎ.',
          '2. Kim loại (trước H) + Acid → Muối + H₂↑.',
          '3. Oxide base + Acid → Muối + H₂O.',
          '4. Luôn ghi nhớ quy tắc an toàn: Rót acid vào nước, không làm ngược lại!'
        ],
        speakerNotes: 'Củng cố toàn bộ nội dung cốt lõi của bài học.'
      }
    ]
  },
  matrixRows: [
    {
      id: 'mat-khtn8-1',
      chapter: 'Chương 2: Một số hợp chất vô cơ thông dụng (Hóa học)',
      unit: 'Bài 8: Acid (Khái niệm, Quỳ tím và Tính chất hóa học)',
      tnkq_nhieuLuaChon: { biet: 2, hieu: 1, vanDung: 0 },
      tnkq_dungSai: { biet: 1, hieu: 1, vanDung: 0 },
      tnkq_traLoiNgan: { biet: 0, hieu: 1, vanDung: 1 },
      tuLuan: { biet: 0, hieu: 1, vanDung: 1 }
    }
  ],
  specRows: [
    {
      id: 'spec-khtn8-1',
      chapter: 'Chương 2: Một số hợp chất vô cơ thông dụng (Hóa học)',
      unit: 'Bài 8: Acid',
      learningOutcomes: {
        biet: [
          'Nêu được khái niệm acid (tạo cation H⁺ trong dung dịch nước).',
          'Nhận biết được hiện tượng dung dịch acid làm đổi màu quỳ tím sang đỏ.'
        ],
        hieu: [
          'Giải thích được hiện tượng phản ứng giữa acid (HCl, H₂SO₄ loãng) với kim loại đứng trước H.',
          'Mô tả được hiện tượng acid tác dụng với oxide base tạo muối và nước (CuO tan tạo dung dịch màu xanh).'
        ],
        vanDung: [
          'Tính toán lượng chất (số mol, thể tích khí H₂ ở đkc) tham gia hoặc tạo thành theo PTHH.',
          'Vận dụng kiến thức về acid để giải thích hiện tượng bảo quản thực phẩm và quy tắc an toàn pha loãng H₂SO₄ đặc.'
        ]
      },
      numberOfQuestions: {
        tnkq_nhieuLuaChon: { biet: 2, hieu: 1, vanDung: 0 },
        tnkq_dungSai: { biet: 1, hieu: 1, vanDung: 0 },
        tnkq_traLoiNgan: { biet: 0, hieu: 1, vanDung: 1 },
        tuLuan: { biet: 0, hieu: 1, vanDung: 1 }
      }
    }
  ],
  exam: {
    title: 'ĐỀ KIỂM TRA ĐỊNH KÌ GIỮA HỌC KÌ I - MÔN KHOA HỌC TỰ NHIÊN 8 (HÓA HỌC)',
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
        id: 'q1',
        number: 1,
        content: 'Dung dịch nào sau đây làm đổi màu quỳ tím sang màu đỏ?',
        options: {
          A: 'Hydrochloric acid (HCl)',
          B: 'Sodium hydroxide (NaOH)',
          C: 'Nước cất (H₂O)',
          D: 'Sodium chloride (NaCl)'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Chất chỉ thị màu của Acid',
        explanation: 'Dung dịch acid (như HCl) làm quỳ tím hóa đỏ, dung dịch base (như NaOH) làm quỳ tím hóa xanh.'
      },
      {
        id: 'q2',
        number: 2,
        content: 'Kim loại nào sau đây phản ứng được với dung dịch acid HCl loãng giải phóng khí Hydrogen?',
        options: {
          A: 'Kẽm (Zinc - Zn)',
          B: 'Đồng (Copper - Cu)',
          C: 'Bạc (Silver - Ag)',
          D: 'Vàng (Gold - Au)'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Kim loại tác dụng acid',
        explanation: 'Trong dãy hoạt động hóa học, Zn đứng trước H nên phản ứng với HCl loãng. Cu, Ag, Au đứng sau H nên không phản ứng.'
      },
      {
        id: 'q3',
        number: 3,
        content: 'Hiện tượng quan sát được khi cho bột copper(II) oxide (CuO) màu đen vào ống nghiệm đựng dung dịch HCl là:',
        options: {
          A: 'Bột màu đen tan dần, tạo dung dịch có màu xanh lam.',
          B: 'Có bọt khí không màu thoát ra sủi bọt mạnh.',
          C: 'Xuất hiện kết tủa trắng ở đáy ống nghiệm.',
          D: 'Không có hiện tượng gì xảy ra.'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'Oxide base tác dụng acid',
        explanation: 'CuO (đen) + 2HCl → CuCl₂ (dung dịch xanh lam) + H₂O. Phản ứng không sinh ra chất khí.'
      },
      {
        id: 'q4',
        number: 4,
        content: 'Quy tắc an toàn nào sau đây là ĐÚNG khi pha loãng dung dịch sulfuric acid (H₂SO₄) đặc?',
        options: {
          A: 'Rót từ từ acid đặc vào nước và khuấy đều bằng đũa thủy tinh.',
          B: 'Rót nhanh nước vào acid đặc rồi đậy nút kín.',
          C: 'Đổ cùng lúc cả nước và acid vào cốc thủy tinh.',
          D: 'Đun nóng acid đặc trước khi đổ nước vào.'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'An toàn phòng thí nghiệm',
        explanation: 'Do H₂SO₄ đặc hút nước và tỏa nhiệt rất mạnh, chỉ được rót từ từ acid vào nước để nhiệt tỏa đều vào khối nước, không làm nước sôi bắn acid ra ngoài.'
      },
      {
        id: 'q5',
        number: 5,
        content: 'Dung dịch có pH = 3 thuộc loại môi trường nào sau đây?',
        options: {
          A: 'Môi trường acid',
          B: 'Môi trường base',
          C: 'Môi trường trung tính',
          D: 'Môi trường muối kiềm'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Thang pH',
        explanation: 'Dung dịch có pH < 7 là môi trường acid; pH = 7 là trung tính; pH > 7 là môi trường base.'
      },
      {
        id: 'q6',
        number: 6,
        content: 'Cho mẩu sắt (Fe) vào dung dịch hydrochloric acid (HCl), phương trình hóa học đúng là:',
        options: {
          A: 'Fe + 2HCl → FeCl₂ + H₂↑',
          B: '2Fe + 6HCl → 2FeCl₃ + 3H₂↑',
          C: 'Fe + HCl → FeCl + H₂↑',
          D: 'Fe + 2HCl → FeCl₂ + H₂O'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'Phương trình hóa học của Fe',
        explanation: 'Sắt Fe tác dụng với dung dịch HCl loãng chỉ bị oxi hóa lên sắt hóa trị II (muối FeCl₂), giải phóng khí H₂.'
      },
      {
        id: 'q7',
        number: 7,
        content: 'Khí nào sau đây là nguyên nhân chính gây ra hiện tượng mưa acid ăn mòn công trình kim loại và tượng đá vôi?',
        options: {
          A: 'Sulfur dioxide (SO₂) và Nitrogen dioxide (NO₂)',
          B: 'Oxygen (O₂) và Nitrogen (N₂)',
          C: 'Hydrogen (H₂) và Methane (CH₄)',
          D: 'Argon (Ar) và Helium (He)'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Môi trường & Mưa acid',
        explanation: 'Khí SO₂ và NO₂ do khói bụi nhà máy xả ra phản ứng với hơi nước trong không khí tạo thành H₂SO₄ và HNO₃ rơi xuống cùng nước mưa gây mưa acid.'
      },
      {
        id: 'q8',
        number: 8,
        content: 'Công thức hóa học của muối ăn thông dụng hàng ngày là:',
        options: {
          A: 'NaCl',
          B: 'CaCO₃',
          C: 'CuSO₄',
          D: 'KNO₃'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Nhận biết',
        topic: 'Muối thông dụng',
        explanation: 'Muối ăn là Sodium chloride có CTHH là NaCl.'
      },
      {
        id: 'q9',
        number: 9,
        content: 'Chất nào sau đây được dùng để khử chua đất nông nghiệp trồng trọt bị nhiễm phèn chua (acid)?',
        options: {
          A: 'Vôi sống (Calcium oxide - CaO)',
          B: 'Muối ăn (NaCl)',
          C: 'Cát trắng (SiO₂)',
          D: 'Dung dịch hydrochloric acid (HCl)'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Vận dụng',
        topic: 'Ứng dụng thực tiễn của Oxide base',
        explanation: 'Vôi sống CaO tác dụng với nước tạo Ca(OH)₂ có tính base để trung hòa lượng acid dư trong đất chua, đưa pH đất về mức tối ưu cho cây trồng.'
      },
      {
        id: 'q10',
        number: 10,
        content: 'Hòa tan 20 gam muối ăn NaCl vào 80 gam nước. Nồng độ phần trăm (C%) của dung dịch thu được là:',
        options: {
          A: '20%',
          B: '25%',
          C: '16,7%',
          D: '80%'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'Nồng độ phần trăm C%',
        explanation: 'm(dung dịch) = m(chất tan) + m(nước) = 20 + 80 = 100g. C% = (20 / 100) * 100% = 20%.'
      },
      {
        id: 'q11',
        number: 11,
        content: 'Một học sinh bị ong vò vẽ đốt (nọc ong có tính acid). Cách xử lí dân gian khoa học ngay tại chỗ là:',
        options: {
          A: 'Bôi một ít nước vôi trong hoặc kem đánh răng (tính kiềm nhẹ) vào vết đốt.',
          B: 'Vắt thêm nước chanh hoặc giấm ăn vào vết đốt.',
          C: 'Rót cồn đậm đặc đốt nóng vết đốt.',
          D: 'Xát muối ớt cay vào vết đốt.'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Vận dụng',
        topic: 'Ứng dụng phản ứng trung hòa',
        explanation: 'Nước vôi hoặc kem đánh răng có tính base nhẹ sẽ trung hòa bớt acid trong nọc ong, làm giảm cảm giác đau buốt và sưng tấy.'
      },
      {
        id: 'q12',
        number: 12,
        content: 'Cho 0,1 mol kim loại Magnesium (Mg) tác dụng vừa đủ với dung dịch acid HCl. Thể tích khí H₂ thu được ở điều kiện chuẩn (25°C, 1 bar) là:',
        options: {
          A: '2,479 lít',
          B: '2,24 lít',
          C: '24,79 lít',
          D: '0,2479 lít'
        },
        correctAnswer: 'A',
        points: 0.25,
        level: 'Thông hiểu',
        topic: 'Tính theo PTHH chuẩn 2018',
        explanation: 'PTHH: Mg + 2HCl → MgCl₂ + H₂↑. n(H₂) = n(Mg) = 0,1 mol. Theo chuẩn GDPT 2018 (đkc 25°C, 1 bar), V = 0,1 * 24,79 = 2,479 lít.'
      }
    ],

    partII_TrueFalse: [
      {
        id: 'tf-1',
        number: 1,
        context: 'Tiến hành thí nghiệm cho các mẩu kim loại Zinc (Zn), Iron (Fe), Copper (Cu) vào từng ống nghiệm đựng dung dịch acid hydrochloric (HCl) loãng cùng nồng độ. Xét tính Đúng/Sai của các mệnh đề sau:',
        level: 'Thông hiểu',
        topic: 'Kim loại tác dụng với Acid',
        pointsTotal: 1.0,
        statements: [
          {
            subId: 'a',
            text: 'Ống nghiệm chứa kẽm (Zn) và ống nghiệm chứa sắt (Fe) đều có hiện tượng sủi bọt khí không màu.',
            isCorrect: true,
            explanation: 'Đúng. Cả Zn và Fe đều đứng trước H trong dãy hoạt động hóa học nên phản ứng giải phóng khí H₂.'
          },
          {
            subId: 'b',
            text: 'Ống nghiệm chứa đồng (Cu) có bọt khí thoát ra mạnh nhất vì đồng là kim loại dẫn điện tốt.',
            isCorrect: false,
            explanation: 'Sai. Đồng (Cu) đứng sau H trong dãy hoạt động nên hoàn toàn không phản ứng với HCl loãng, không có bọt khí.'
          },
          {
            subId: 'c',
            text: 'Dung dịch thu được trong ống nghiệm chứa sắt (Fe) là dung dịch iron(III) chloride có màu vàng nâu.',
            isCorrect: false,
            explanation: 'Sai. Phản ứng sinh ra iron(II) chloride FeCl₂ (dung dịch màu lục rất nhạt), không phải muối Fe(III).'
          },
          {
            subId: 'd',
            text: 'Tốc độ thoát bọt khí ở ống nghiệm chứa Zn diễn ra nhanh hơn ở ống nghiệm chứa Fe trong cùng điều kiện.',
            isCorrect: true,
            explanation: 'Đúng. Zn có tính khử mạnh hơn Fe (đứng trước Fe trong dãy hoạt động) nên phản ứng với acid xảy ra nhanh hơn.'
          }
        ]
      },
      {
        id: 'tf-2',
        number: 2,
        context: 'Về tính chất và ứng dụng của sulfuric acid (H₂SO₄) và thang pH trong thực tế đời sống:',
        level: 'Thông hiểu',
        topic: 'Thang pH và Axit sunfuric',
        pointsTotal: 1.0,
        statements: [
          {
            subId: 'a',
            text: 'Dung dịch sulfuric acid loãng làm đổi màu giấy quỳ tím thành màu xanh.',
            isCorrect: false,
            explanation: 'Sai. Acid làm đổi màu quỳ tím thành màu đỏ, chỉ có dung dịch base mới làm quỳ tím hóa xanh.'
          },
          {
            subId: 'b',
            text: 'Khi pha loãng sulfuric acid đặc, người ta phải rót từ từ acid vào nước, tuyệt đối không làm ngược lại.',
            isCorrect: true,
            explanation: 'Đúng. Rót nước vào acid đặc sẽ làm nước sôi cục bộ bắn acid ra ngoài gây bỏng nguy hiểm.'
          },
          {
            subId: 'c',
            text: 'Một mẫu đất nông nghiệp có chỉ số pH = 5,0 nghĩa là đất này có tính kiềm, cần bón thêm acid để hạ pH.',
            isCorrect: false,
            explanation: 'Sai. pH = 5,0 < 7 là đất có tính acid (đất chua), người nông dân phải bón vôi sống (CaO) để khử chua.'
          },
          {
            subId: 'd',
            text: 'Sulfuric acid được sử dụng rộng rãi để sản xuất phân bón superphosphate và làm chất điện phân trong ắc quy xe máy, ô tô.',
            isCorrect: true,
            explanation: 'Đúng. H₂SO₄ là hóa chất công nghiệp hàng đầu phục vụ sản xuất phân bón và ắc quy chì.'
          }
        ]
      }
    ],

    partIII_ShortAnswer: [
      {
        id: 'sa-1',
        number: 1,
        content: 'Cho 6,5 gam kim loại kẽm (Zinc - Zn, M = 65) phản ứng hoàn toàn với dung dịch acid HCl dư. Hãy tính thể tích khí Hydrogen (H₂) thu được ở điều kiện chuẩn (25°C, 1 bar). Điền kết quả bằng số theo đơn vị lít (lấy 3 chữ số thập phân):',
        acceptableAnswers: ['2,479', '2.479', '2,479 lít', '2.479 l'],
        points: 0.5,
        level: 'Vận dụng',
        topic: 'Tính theo PTHH',
        solutionGuide: 'n(Zn) = 6,5 / 65 = 0,1 mol. PTHH: Zn + 2HCl → ZnCl₂ + H₂↑. n(H₂) = n(Zn) = 0,1 mol. V(H₂) = 0,1 * 24,79 = 2,479 lít.'
      },
      {
        id: 'sa-2',
        number: 2,
        content: 'Hòa tan hoàn toàn 4,0 gam bột copper(II) oxide (CuO, M = 80) vào một lượng vừa đủ dung dịch hydrochloric acid (HCl) 1M. Thể tích dung dịch HCl 1M tối thiểu cần dùng là bao nhiêu mL? (Điền số nguyên):',
        acceptableAnswers: ['100', '100 mL', '100ml'],
        points: 0.5,
        level: 'Vận dụng',
        topic: 'Nồng độ mol và thể tích',
        solutionGuide: 'n(CuO) = 4,0 / 80 = 0,05 mol. PTHH: CuO + 2HCl → CuCl₂ + H₂O. n(HCl) = 2 * n(CuO) = 0,1 mol. V(dd HCl) = n / CM = 0,1 / 1 = 0,1 lít = 100 mL.'
      }
    ],

    partIV_Essay: [
      {
        id: 'es-1',
        number: 1,
        content: 'Có 3 lọ hóa chất mất nhãn đựng riêng biệt 3 dung dịch không màu: Hydrochloric acid (HCl), Sodium hydroxide (NaOH), và Sodium chloride (NaCl).\na) Bằng phương pháp hóa học, hãy nêu các bước nhận biết từng dung dịch trong các lọ trên chỉ dùng một hóa chất làm thuốc thử duy nhất.\nb) Viết các phương trình hóa học minh họa (nếu có).',
        points: 1.5,
        level: 'Thông hiểu',
        topic: 'Nhận biết hóa chất vô cơ',
        gradingCriteria: [
          {
            step: 'Ý a (1.0đ): Trích mẫu thử, đánh số thứ tự. Dùng thuốc thử duy nhất là giấy quỳ tím nhúng vào 3 mẫu thử: Mẫu thử làm quỳ tím hóa đỏ là HCl (dung dịch acid); Mẫu thử làm quỳ tím hóa xanh là NaOH (dung dịch base kiềm); Mẫu thử không làm đổi màu quỳ tím (quỳ giữ màu tím) là NaCl (dung dịch muối trung tính).',
            points: 1.0
          },
          {
            step: 'Ý b (0.5đ): Nêu rõ đây là thí nghiệm nhận biết dựa trên tính chất làm đổi màu chất chỉ thị của acid và base, không cần phương trình hóa học phát sinh (hoặc viết PTHH kiểm chứng phản ứng trung hòa NaOH + HCl → NaCl + H₂O khi trộn mẫu thử).',
            points: 0.5
          }
        ]
      },
      {
        id: 'es-2',
        number: 2,
        content: 'Một mảnh hợp kim gồm kẽm (Zn) và đồng (Cu) có tổng khối lượng là 10,0 gam. Cho mảnh hợp kim này vào cốc thủy tinh đựng dung dịch acid hydrochloric (HCl) loãng lấy dư. Sau khi phản ứng kết thúc hoàn toàn, thu được 1,9832 lít khí Hydrogen (đo ở điều kiện chuẩn 25°C, 1 bar) và một chất rắn màu đỏ không tan ở đáy cốc.\na) Chất rắn màu đỏ không tan là chất nào? Giải thích vì sao chất rắn này không tan.\nb) Hãy tính phần trăm khối lượng của mỗi kim loại kẽm và đồng có trong mảnh hợp kim ban đầu.',
        points: 1.5,
        level: 'Vận dụng',
        topic: 'Bài toán hợp kim thực tế',
        gradingCriteria: [
          {
            step: 'Ý a (0.5đ): Chất rắn màu đỏ không tan là kim loại đồng (Copper - Cu). Giải thích: Trong dãy hoạt động hóa học, đồng Cu đứng sau nguyên tố Hydrogen (H) nên không có khả năng đẩy H ra khỏi dung dịch acid loãng, do đó Cu không phản ứng và lắng lại ở đáy cốc.',
            points: 0.5
          },
          {
            step: 'Ý b (1.0đ): PTHH: Zn + 2HCl → ZnCl₂ + H₂↑. n(H₂) = 1,9832 / 24,79 = 0,08 mol. Theo PTHH, n(Zn) = n(H₂) = 0,08 mol. Khối lượng kẽm m(Zn) = 0,08 * 65 = 5,2 gam. %m(Zn) = (5,2 / 10,0) * 100% = 52,0%. Khối lượng đồng m(Cu) = 10,0 - 5,2 = 4,8 gam -> %m(Cu) = 48,0%.',
            points: 1.0
          }
        ]
      }
    ]
  }
};

// =========================================================================
// PRESET MẪU CHO KHTN 9 (BÀI 15: DÃY HOẠT ĐỘNG HÓA HỌC CỦA KIM LOẠI)
// =========================================================================
export const SAMPLE_KHTN_HOA_9: WorkspaceState = {
  ...SAMPLE_KHTN_HOA_8,
  lessonPlan: {
    ...SAMPLE_KHTN_HOA_8.lessonPlan,
    grade: 'Lớp 9',
    lessonName: 'BÀI 15: DÃY HOẠT ĐỘNG HÓA HỌC CỦA KIM LOẠI',
    durationInPeriods: 2,
    objectives: {
      knowledge: [
        'Nêu được dãy hoạt động hóa học của kim loại: K, Na, Ca, Mg, Al, Zn, Fe, Pb, (H), Cu, Ag, Au.',
        'Trình bày được ý nghĩa của dãy hoạt động hóa học trong việc so sánh mức độ hoạt động và dự đoán chiều hướng phản ứng.',
        'Thực hiện được các thí nghiệm: Fe tác dụng CuSO₄, Cu tác dụng AgNO₃, kim loại tác dụng nước và acid.',
        'Vận dụng dãy hoạt động hóa học để giải thích hiện tượng bảo quản kim loại trong đời sống.'
      ],
      competencies: {
        general: [
          'Năng lực tự chủ và tự học: Tìm hiểu ứng dụng dãy hoạt động kim loại trong SGK KNTT.',
          'Năng lực giao tiếp và hợp tác: Làm việc nhóm thực hiện chuỗi thí nghiệm so sánh tính hoạt động của Fe, Cu, Ag.',
          'Năng lực giải quyết vấn đề và sáng tạo: Đề xuất phương án làm sạch mẩu đồng bị lẫn bột sắt.'
        ],
        specific: [
          'Năng lực nhận thức khoa học tự nhiên: So sánh được mức độ hoạt động hóa học giữa các kim loại.',
          'Năng lực tìm hiểu tự nhiên: Tiến hành thí nghiệm đẩy kim loại ra khỏi dung dịch muối an toàn.',
          'Năng lực vận dụng kiến thức: Giải thích tại sao đồ dùng bằng nhôm bền trong không khí và nước.'
        ]
      },
      qualities: [
        'Chăm chỉ: Tích cực hoàn thành các nhiệm vụ học tập trên lớp và phiếu thực hành.',
        'Trung thực: Khách quan trong việc ghi nhận hiện tượng đổi màu bề mặt đinh sắt.',
        'Trách nhiệm: Thu dọn hóa chất và bảo quản dụng cụ phòng thực hành đúng quy định.'
      ]
    }
  },
  slides: {
    title: 'BÀI 15: DÃY HOẠT ĐỘNG HÓA HỌC CỦA KIM LOẠI',
    author: `${TEACHER_PROFILE_KHTN_HOA.name} · ${TEACHER_PROFILE_KHTN_HOA.department}`,
    slides: [
      {
        id: 'sl-9-1',
        activityCode: 'INTRO',
        stageLabel: 'Mở đầu bài học',
        title: 'BÀI 15: DÃY HOẠT ĐỘNG HÓA HỌC CỦA KIM LOẠI',
        subtitle: 'Khoa học tự nhiên 9 · Phân môn Hóa học · Kết Nối Tri Thức',
        bulletPoints: [
          'Giáo viên: Hồ Minh Luân',
          'Thời lượng: 2 tiết',
          'Trường THCS & THPT Nguyễn Huệ'
        ],
        speakerNotes: 'Giới thiệu về vị trí của kim loại trong bảng tuần hoàn và tính chất hóa học.'
      },
      {
        id: 'sl-9-2',
        activityCode: 'ACT_2',
        stageLabel: 'Hình thành kiến thức',
        title: 'I. DÃY HOẠT ĐỘNG HÓA HỌC',
        subtitle: 'Thứ tự sắp xếp theo mức độ giảm dần',
        bulletPoints: [
          'Dãy: K, Na, Ca, Mg, Al, Zn, Fe, Pb, (H), Cu, Ag, Au',
          'Câu vần nhớ mẹo: "Khi Nào Cần May Áo Giáp Sắt Phải Hỏi Cửa Hàng Á Âu"',
          'Mức độ hoạt động hóa học giảm dần từ trái qua phải.'
        ],
        formulaOrCode: 'K > Na > Ca > Mg > Al > Zn > Fe > Pb > (H) > Cu > Ag > Au',
        speakerNotes: 'Dạy học sinh câu mẹo nhớ thứ tự dãy hoạt động.'
      }
    ]
  }
};

// =========================================================================
// PRESET MẪU CHO KHTN 7 (BÀI 4: SƠ LƯỢC BẢNG TUẦN HOÀN CÁC NGUYÊN TỐ HÓA HỌC)
// =========================================================================
export const SAMPLE_KHTN_HOA_7: WorkspaceState = {
  ...SAMPLE_KHTN_HOA_8,
  lessonPlan: {
    ...SAMPLE_KHTN_HOA_8.lessonPlan,
    grade: 'Lớp 7',
    lessonName: 'BÀI 4: SƠ LƯỢC VỀ BẢNG TUẦN HOÀN CÁC NGUYÊN TỐ HÓA HỌC',
    durationInPeriods: 2,
    objectives: {
      knowledge: [
        'Nêu được nguyên tắc sắp xếp các nguyên tố hóa học trong bảng tuần hoàn (theo chiều tăng dần điện tích hạt nhân).',
        'Mô tả được cấu tạo bảng tuần hoàn gồm: Ô nguyên tố, Chu kì và Nhóm.',
        'Xác định được vị trí của kim loại, phi kim và khí hiếm trong bảng tuần hoàn.',
        'Sử dụng bảng tuần hoàn để tra cứu thông tin về số hiệu nguyên tử, tên, kí hiệu hóa học và khối lượng nguyên tử.'
      ],
      competencies: {
        general: [
          'Năng lực tự chủ và tự học: Tự tra cứu các ô nguyên tố trong bảng tuần hoàn SGK KNTT.',
          'Năng lực giao tiếp và hợp tác: Hoạt động nhóm khám phá quy luật biến đổi số electron lớp ngoài cùng.'
        ],
        specific: [
          'Năng lực nhận thức khoa học tự nhiên: Đọc và hiểu được các thông số ghi trong một ô nguyên tố.',
          'Năng lực tìm hiểu tự nhiên: Phân loại được nguyên tố kim loại, phi kim và khí hiếm.'
        ]
      },
      qualities: [
        'Yêu thích khám phá cấu trúc bảng tuần hoàn và trân trọng thành tựu của nhà khoa học Mendeleev.'
      ]
    }
  }
};

// =========================================================================
// PRESET MẪU CHO KHTN 6 (BÀI 16: MỘT SỐ PHƯƠNG PHÁP TÁCH CHẤT THÔNG DỤNG)
// =========================================================================
export const SAMPLE_KHTN_HOA_6: WorkspaceState = {
  ...SAMPLE_KHTN_HOA_8,
  lessonPlan: {
    ...SAMPLE_KHTN_HOA_8.lessonPlan,
    grade: 'Lớp 6',
    lessonName: 'BÀI 16: MỘT SỐ PHƯƠNG PHÁP TÁCH CHẤT THÔNG DỤNG',
    durationInPeriods: 2,
    objectives: {
      knowledge: [
        'Trình bày được nguyên tắc của các phương pháp tách chất thông dụng: Lọc, Cô cạn, Chiết.',
        'Thực hiện được thí nghiệm tách cát ra khỏi nước (lọc), tách muối ra khỏi dung dịch nước muối (cô cạn), tách dầu ăn ra khỏi nước (chiết).',
        'Vận dụng phương pháp tách chất để giải thích quy trình sản xuất muối ăn từ nước biển và làm sạch nước sinh hoạt.'
      ],
      competencies: {
        general: [
          'Năng lực hợp tác làm việc nhóm chế tạo bình lọc nước mini dạng dự án STEM.'
        ],
        specific: [
          'Kĩ năng lắp đặt giá thí nghiệm, phễu lọc, giấy lọc và phễu chiết đúng kĩ thuật an toàn.'
        ]
      },
      qualities: [
        'Có ý thức tiết kiệm và bảo vệ nguồn nước sạch sinh hoạt trong gia đình.'
      ]
    }
  }
};
