import React, { useState } from 'react';
import { 
  FlaskConical, 
  Atom, 
  Search, 
  Copy, 
  Check, 
  Sparkles, 
  Flame, 
  ShieldAlert, 
  Droplets, 
  Table, 
  Scale, 
  Info,
  Layers,
  ChevronRight
} from 'lucide-react';
import { 
  PERIODIC_TABLE_ELEMENTS, 
  METAL_ACTIVITY_SERIES, 
  SOLUBILITY_DATA, 
  PH_SCALE_ITEMS, 
  COMMON_CHEMICAL_EQUATIONS, 
  LAB_SAFETY_RULES,
  ChemicalElement 
} from '../data/khtnChemistryData';

interface ChemistryUtilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertToKhbd?: (text: string) => void;
}

export const ChemistryUtilityModal: React.FC<ChemistryUtilityModalProps> = ({
  isOpen,
  onClose,
  onInsertToKhbd
}) => {
  const [activeTab, setActiveTab] = useState<'periodic' | 'metals' | 'ph' | 'solubility' | 'calc' | 'safety'>('periodic');
  const [searchElement, setSearchElement] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedElement, setSelectedElement] = useState<ChemicalElement>(PERIODIC_TABLE_ELEMENTS[10]); // Sodium
  const [currentPh, setCurrentPh] = useState<number>(3);
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);

  // Mini calculator state
  const [calcMass, setCalcMass] = useState<string>('6.5');
  const [calcMolarMass, setCalcMolarMass] = useState<string>('65'); // Zn
  const [calcSoluteMass, setCalcSoluteMass] = useState<string>('20');
  const [calcSolutionMass, setCalcSolutionMass] = useState<string>('100');

  if (!isOpen) return null;

  const showCopyNotice = (msg: string) => {
    setCopiedNotice(msg);
    setTimeout(() => setCopiedNotice(null), 2500);
  };

  const handleCopyText = (text: string, label: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    showCopyNotice(`Đã sao chép: ${label}`);
  };

  // Filter elements
  const filteredElements = PERIODIC_TABLE_ELEMENTS.filter(el => {
    const matchCat = categoryFilter === 'all' || el.category === categoryFilter;
    const q = searchElement.trim().toLowerCase();
    const matchSearch = !q || 
      el.symbol.toLowerCase().includes(q) || 
      el.nameIupac.toLowerCase().includes(q) || 
      el.nameVi.toLowerCase().includes(q) || 
      String(el.z) === q;
    return matchCat && matchSearch;
  });

  // Calculate mol
  const mVal = parseFloat(calcMass) || 0;
  const MVal = parseFloat(calcMolarMass) || 1;
  const calculatedMol = MVal > 0 ? (mVal / MVal) : 0;
  const calculatedGasVolume = calculatedMol * 24.79; // Chuẩn 25°C, 1 bar GDPT 2018

  // Calculate C%
  const mctVal = parseFloat(calcSoluteMass) || 0;
  const mddVal = parseFloat(calcSolutionMass) || 1;
  const calculatedCPercent = mddVal > 0 ? (mctVal / mddVal) * 100 : 0;

  const currentPhData = PH_SCALE_ITEMS.find(item => item.ph === currentPh) || PH_SCALE_ITEMS[7];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-emerald-200 max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden text-xs text-slate-800">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white flex items-center justify-between gap-4 border-b border-emerald-700 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md border border-emerald-400 shrink-0">
              <FlaskConical className="w-5 h-5 text-amber-200" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 uppercase tracking-wider">
                  TIỆN ÍCH CHUYÊN BIỆT HÓA HỌC THCS
                </span>
                <span className="text-[11px] text-teal-200 font-medium">
                  Chuẩn IUPAC & GDPT 2018 · KHTN 6, 7, 8, 9
                </span>
              </div>
              <h2 className="font-extrabold text-base sm:text-lg text-white truncate mt-0.5 flex items-center gap-2">
                <span>Bảng Tra Cứu & Công Cụ Hóa Học Sư Phạm</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-base transition-colors"
              title="Đóng cửa sổ"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Toast thông báo đã sao chép */}
        {copiedNotice && (
          <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-300 text-emerald-900 font-bold text-xs flex items-center justify-between animate-in slide-in-from-top-1">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{copiedNotice}</span>
            </span>
            <button onClick={() => setCopiedNotice(null)} className="text-emerald-700 hover:text-emerald-950">✕</button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto shrink-0 select-none">
          <button
            type="button"
            onClick={() => setActiveTab('periodic')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'periodic'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            <Atom className="w-3.5 h-3.5" />
            <span>1. Bảng tuần hoàn IUPAC</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('metals')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'metals'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>2. Dãy hoạt động kim loại</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ph')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'ph'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>3. Thang pH & Chỉ thị màu</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('solubility')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'solubility'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>4. Bảng tính tan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('calc')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'calc'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>5. Công thức Mol & Nồng độ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('safety')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'safety'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>6. An toàn thí nghiệm & H₂SO₄</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* ========================================================================= */}
          {/* TAB 1: BẢNG TUẦN HOÀN CÁC NGUYÊN TỐ HÓA HỌC IUPAC */}
          {/* ========================================================================= */}
          {activeTab === 'periodic' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Search & Category Filter */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchElement}
                    onChange={(e) => setSearchElement(e.target.value)}
                    placeholder="Tìm theo kí hiệu (Na, Fe, Cu), tên IUPAC (Sodium), hoặc số Z..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'alkali', label: 'Kim loại kiềm' },
                    { id: 'alkaline_earth', label: 'Kiềm thổ' },
                    { id: 'transition', label: 'Chuyển tiếp' },
                    { id: 'nonmetal', label: 'Phi kim' },
                    { id: 'halogen', label: 'Halogen' },
                    { id: 'noble_gas', label: 'Khí hiếm' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] shrink-0 transition-colors ${
                        categoryFilter === cat.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Element Detail Preview Box */}
              {selectedElement && (
                <div className="p-4 sm:p-5 bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-2xl border-2 border-emerald-300 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-white border-2 border-emerald-500 shadow-md flex flex-col items-center justify-center p-1 shrink-0">
                      <span className="text-[10px] font-mono font-bold text-slate-400 self-start pl-1">
                        Z = {selectedElement.z}
                      </span>
                      <span className="text-2xl font-black text-emerald-950 font-mono leading-none">
                        {selectedElement.symbol}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 font-mono mt-0.5">
                        M = {selectedElement.atomicMass}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-extrabold text-base text-slate-900">
                          {selectedElement.nameIupac} ({selectedElement.nameVi})
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {selectedElement.categoryLabel}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 text-blue-800">
                          Nhóm {selectedElement.group} · Chu kì {selectedElement.period}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs">
                        Cấu hình electron: <span className="font-mono font-bold text-slate-900">{selectedElement.electronConfig}</span> · Hóa trị đặc trưng: <span className="font-bold text-amber-700">{selectedElement.valencies.join(', ')}</span>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Số hạt trong nguyên tử: {selectedElement.z} proton (p) = {selectedElement.z} electron (e). Nguyên tử khối: {selectedElement.atomicMass} amu.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => handleCopyText(
                        `${selectedElement.symbol} - ${selectedElement.nameIupac} (${selectedElement.nameVi}): Z=${selectedElement.z}, M=${selectedElement.atomicMass} amu, Nhóm ${selectedElement.group}, Chu kì ${selectedElement.period}, Hóa trị: ${selectedElement.valencies.join(', ')}`,
                        `Nguyên tố ${selectedElement.nameIupac}`
                      )}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 rounded-xl border border-slate-300 font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                    >
                      <Copy className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Sao chép thông tin</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Grid of Elements */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 max-h-[360px] overflow-y-auto p-1">
                {filteredElements.map(el => (
                  <button
                    key={el.z}
                    type="button"
                    onClick={() => setSelectedElement(el)}
                    className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      selectedElement.z === el.z
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-400'
                        : 'bg-white hover:bg-emerald-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold ${selectedElement.z === el.z ? 'text-emerald-200' : 'text-slate-400'}`}>
                        {el.z}
                      </span>
                      <span className={`text-[9px] font-semibold px-1 rounded ${
                        selectedElement.z === el.z ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {el.group}
                      </span>
                    </div>
                    <div className="my-1">
                      <div className="font-mono font-black text-lg leading-none">
                        {el.symbol}
                      </div>
                      <div className={`text-[11px] font-bold truncate mt-0.5 ${selectedElement.z === el.z ? 'text-white' : 'text-slate-900'}`}>
                        {el.nameIupac}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className={selectedElement.z === el.z ? 'text-emerald-100' : 'text-slate-500'}>
                        {el.nameVi}
                      </span>
                      <span className={`font-mono font-bold ${selectedElement.z === el.z ? 'text-amber-200' : 'text-amber-700'}`}>
                        {el.atomicMass}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: DÃY HOẠT ĐỘNG HÓA HỌC CỦA KIM LOẠI */}
          {/* ========================================================================= */}
          {activeTab === 'metals' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Banner Mẹo nhớ vần thơ */}
              <div className="p-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl shadow-sm space-y-1">
                <span className="font-bold text-xs uppercase tracking-wider opacity-90">
                  Mẹo Ghi Nhớ Dân Gian Nhanh Cho Học Sinh THCS:
                </span>
                <p className="font-mono font-black text-sm sm:text-base tracking-wide">
                  "Khi · Nào · Cần · May · Áo · Giáp · Sắt · Phải · Hỏi · Cửa · Hàng · Á · Âu"
                </p>
                <p className="text-[11px] text-amber-100 italic">
                  Tương ứng: K · Na · Ca · Mg · Al · Zn · Fe · Pb · (H) · Cu · Hg · Ag · Au
                </p>
              </div>

              {/* Visual Chain */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wide">
                  <span>← Mức độ hoạt động hóa học GIẢM DẦN →</span>
                  <span>Mốc so sánh: Khí Hydrogen (H)</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {METAL_ACTIVITY_SERIES.map((m, idx) => (
                    <div
                      key={m.symbol}
                      className={`p-3 rounded-xl border text-center space-y-1 transition-all ${
                        m.symbol === 'H'
                          ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold ring-2 ring-amber-300'
                          : idx < 3
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                          : idx < 7
                          ? 'bg-blue-50 border-blue-300 text-blue-950'
                          : 'bg-rose-50 border-rose-300 text-rose-950'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>#{idx + 1}</span>
                        <span className="font-bold text-amber-700 font-sans">"{m.phrase}"</span>
                      </div>
                      <div className="text-xl font-black font-mono">
                        {m.symbol}
                      </div>
                      <div className="text-xs font-bold truncate">
                        {m.name}
                      </div>
                      <div className="text-[10px] text-slate-600 line-clamp-2 leading-tight">
                        {m.reactivity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4 Quy tắc vàng sư phạm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                  <h4 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">1</span>
                    <span>Tác dụng với nước ở nhiệt độ thường</span>
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed pl-5">
                    Chỉ các kim loại đứng trước Mg (như <strong>K, Na, Ca, Ba</strong>) tác dụng mãnh liệt với nước tạo dung dịch kiềm và giải phóng khí H₂.
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                  <h4 className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
                    <span>Tác dụng với dung dịch acid loãng (HCl, H₂SO₄ loãng)</span>
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed pl-5">
                    Các kim loại <strong>đứng trước H</strong> (Mg, Al, Zn, Fe, Pb...) phản ứng sinh muối và khí H₂. Kim loại <strong>đứng sau H (Cu, Ag, Au)</strong> không phản ứng.
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                  <h4 className="font-bold text-indigo-900 text-xs flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">3</span>
                    <span>Kim loại đẩy nhau ra khỏi dung dịch muối</span>
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed pl-5">
                    Kim loại đứng trước (từ Mg trở đi) đẩy được kim loại đứng sau ra khỏi dung dịch muối (Ví dụ: Fe + CuSO₄ → FeSO₄ + Cu↓).
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                  <h4 className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px]">4</span>
                    <span>Lưu ý bài toán Na, K vào dung dịch muối</span>
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed pl-5">
                    Na, K không đẩy Cu ra khỏi CuSO₄ mà phản ứng với nước trước tạo NaOH, sau đó NaOH phản ứng với CuSO₄ sinh kết tủa xanh Cu(OH)₂.
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleCopyText(
                    'Dãy hoạt động hóa học của kim loại: K, Na, Ca, Mg, Al, Zn, Fe, Pb, (H), Cu, Ag, Au. Nhớ: Khi Nào Cần May Áo Giáp Sắt Phải Hỏi Cửa Hàng Á Âu.',
                    'Dãy hoạt động kim loại'
                  )}
                  className="px-3.5 py-1.5 bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-slate-800 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép dãy hoạt động kim loại</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: THANG ĐO pH & CHẤT CHỈ THỊ MÀU */}
          {/* ========================================================================= */}
          {activeTab === 'ph' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Interactive pH Slider Card */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
                    Kéo thanh trượt để khảo sát độ pH (0 - 14):
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-700">Giá trị pH:</span>
                    <span 
                      style={{ backgroundColor: currentPhData.hexColor }} 
                      className="px-3 py-1 rounded-full text-white font-black text-sm shadow-xs"
                    >
                      pH = {currentPh}
                    </span>
                  </div>
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min="0"
                  max="14"
                  step="1"
                  value={currentPh}
                  onChange={(e) => setCurrentPh(parseInt(e.target.value, 10))}
                  className="w-full h-3 bg-gradient-to-r from-red-600 via-emerald-500 to-purple-700 rounded-lg appearance-none cursor-pointer"
                />

                {/* Color Spectrum Indicator Bar */}
                <div className="grid grid-cols-15 gap-0.5 text-center font-mono text-[10px] font-bold">
                  {PH_SCALE_ITEMS.map(item => (
                    <button
                      key={item.ph}
                      type="button"
                      onClick={() => setCurrentPh(item.ph)}
                      style={{ backgroundColor: item.hexColor }}
                      className={`h-7 rounded text-white flex items-center justify-center transition-transform ${
                        currentPh === item.ph ? 'scale-110 ring-2 ring-slate-900 z-10 font-black' : 'opacity-80 hover:opacity-100'
                      }`}
                    >
                      {item.ph}
                    </button>
                  ))}
                </div>

                {/* Result Card for Current pH */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[10px] font-bold uppercase">Môi trường:</span>
                      <span className={`text-sm font-black ${
                        currentPhData.environment === 'acid' ? 'text-rose-600' :
                        currentPhData.environment === 'neutral' ? 'text-emerald-600' : 'text-blue-600'
                      }`}>
                        {currentPhData.environment === 'acid' ? 'Môi trường ACID (pH < 7)' :
                         currentPhData.environment === 'neutral' ? 'Môi trường TRUNG TÍNH (pH = 7)' : 'Môi trường BASE / KIỀM (pH > 7)'}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[10px] font-bold uppercase">Màu quỳ tím:</span>
                      <span className="text-sm font-bold text-slate-900">
                        {currentPhData.litmusColor}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[10px] font-bold uppercase">Phenolphthalein:</span>
                      <span className="text-sm font-bold text-slate-900">
                        {currentPhData.phenolColor}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <span className="font-bold text-slate-800 text-xs">Mẫu chất quen thuộc trong đời sống: </span>
                    <span className="text-slate-600 text-xs">{currentPhData.sampleSubstances.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Table of Reference pH values */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-2.5">pH</th>
                      <th className="p-2.5">Môi trường</th>
                      <th className="p-2.5">Màu giấy quỳ tím</th>
                      <th className="p-2.5">Màu Phenolphthalein</th>
                      <th className="p-2.5">Ví dụ chất thường gặp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PH_SCALE_ITEMS.map((item, idx) => (
                      <tr 
                        key={item.ph}
                        onClick={() => setCurrentPh(item.ph)}
                        className={`cursor-pointer transition-colors border-b border-slate-100 ${
                          currentPh === item.ph ? 'bg-emerald-50 font-bold' : idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                        }`}
                      >
                        <td className="p-2.5 font-mono">
                          <span 
                            style={{ backgroundColor: item.hexColor }} 
                            className="px-2 py-0.5 rounded text-white font-bold"
                          >
                            {item.ph}
                          </span>
                        </td>
                        <td className="p-2.5 uppercase font-bold text-[11px]">
                          {item.environment}
                        </td>
                        <td className="p-2.5">{item.litmusColor}</td>
                        <td className="p-2.5">{item.phenolColor}</td>
                        <td className="p-2.5 text-slate-600">{item.sampleSubstances.join(' · ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: BẢNG TÍNH TAN TRONG NƯỚC (25°C) */}
          {/* ========================================================================= */}
          {activeTab === 'solubility' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Legend Badges */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs">
                <span className="font-bold text-slate-700">Kí hiệu bảng tính tan:</span>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1 font-bold text-emerald-700">
                    <span className="w-5 h-5 rounded bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center font-black text-[11px]">T</span>
                    <span>Tan</span>
                  </span>
                  <span className="flex items-center gap-1 font-bold text-rose-700">
                    <span className="w-5 h-5 rounded bg-rose-100 border border-rose-300 text-rose-800 flex items-center justify-center font-black text-[11px]">K</span>
                    <span>Không tan (Kết tủa)</span>
                  </span>
                  <span className="flex items-center gap-1 font-bold text-amber-700">
                    <span className="w-5 h-5 rounded bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center font-black text-[11px]">I</span>
                    <span>Ít tan</span>
                  </span>
                  <span className="flex items-center gap-1 font-bold text-purple-700">
                    <span className="w-5 h-5 rounded bg-purple-100 border border-purple-300 text-purple-800 flex items-center justify-center font-black text-[11px]">B</span>
                    <span>Bay hơi / Không bền</span>
                  </span>
                  <span className="flex items-center gap-1 font-bold text-slate-500">
                    <span className="w-5 h-5 rounded bg-slate-200 text-slate-700 flex items-center justify-center font-black text-[11px]">-</span>
                    <span>Không tồn tại</span>
                  </span>
                </div>
              </div>

              {/* Solubility Matrix Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                <table className="w-full text-center border-collapse text-xs font-mono">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold">
                      <th className="p-2.5 text-left font-sans text-xs">Cation \ Anion</th>
                      <th className="p-2.5">OH⁻</th>
                      <th className="p-2.5">Cl⁻</th>
                      <th className="p-2.5">NO₃⁻</th>
                      <th className="p-2.5">SO₄²⁻</th>
                      <th className="p-2.5">CO₃²⁻</th>
                      <th className="p-2.5">SO₃²⁻</th>
                      <th className="p-2.5">PO₄³⁻</th>
                      <th className="p-2.5">S²⁻</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SOLUBILITY_DATA.map((row, rIdx) => (
                      <tr key={row.cation} className={`border-b border-slate-200 ${rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                        <td className="p-2.5 text-left font-bold text-slate-900 font-sans border-r border-slate-200">
                          {row.cationLabel}
                        </td>
                        {(['OH', 'Cl', 'NO3', 'SO4', 'CO3', 'SO3', 'PO4', 'S'] as const).map(anion => {
                          const val = row.anions[anion];
                          return (
                            <td key={anion} className="p-2 font-bold">
                              <span className={`inline-block w-6 h-6 leading-6 rounded-md font-bold text-xs ${
                                val === 'T' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                                val === 'K' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                                val === 'I' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                                val === 'B' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                                'bg-slate-100 text-slate-400'
                              }`}>
                                {val}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Kết tủa thường gặp trong bài kiểm tra THCS */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                <span className="font-bold text-emerald-950 text-xs block">
                  📌 CÁC KẾT TỦA THÔNG DỤNG NHẤT TRONG ĐỀ THI 7991 & BÀI HỌC 8, 9:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 bg-white rounded-lg border border-emerald-200 text-emerald-900">
                    <strong>BaSO₄:</strong> Kết tủa trắng tinh (không tan trong acid)
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-emerald-200 text-emerald-900">
                    <strong>AgCl:</strong> Kết tủa trắng vón (không tan trong acid)
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-emerald-200 text-emerald-900">
                    <strong>Cu(OH)₂:</strong> Kết tủa màu xanh lam
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-emerald-200 text-emerald-900">
                    <strong>Fe(OH)₃:</strong> Kết tủa màu nâu đỏ
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-emerald-200 text-emerald-900">
                    <strong>Fe(OH)₂:</strong> Kết tủa trắng xanh (hóa nâu đỏ trong kk)
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-emerald-200 text-emerald-900">
                    <strong>CaCO₃:</strong> Kết tủa trắng (tan trong acid sinh CO₂)
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-emerald-200 text-emerald-900">
                    <strong>BaCO₃:</strong> Kết tủa trắng (tan trong acid)
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-emerald-200 text-emerald-900">
                    <strong>Al(OH)₃:</strong> Kết tủa keo trắng (tan trong kiềm dư)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: CÔNG THỨC HÓA HỌC THCS & MÁY TÍNH NHANH */}
          {/* ========================================================================= */}
          {activeTab === 'calc' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Formula Cheat Sheet */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <span className="font-bold text-xs text-blue-900 block">1. Số Mol & Thể tích khí (2018)</span>
                  <div className="font-mono text-xs font-bold text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                    <p>• n = m / M (mol)</p>
                    <p>• V = n × 24,79 (lít, ở 25°C, 1 bar)</p>
                    <p>• n = V / 24,79 (mol)</p>
                  </div>
                  <p className="text-[11px] text-slate-500 italic">
                    Lưu ý: GDPT 2018 dùng hệ số 24,79 L thay cho 22,4 L cũ.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <span className="font-bold text-xs text-emerald-900 block">2. Nồng độ Dung dịch (C% & CM)</span>
                  <div className="font-mono text-xs font-bold text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                    <p>• C% = (m_ct / m_dd) × 100%</p>
                    <p>• m_dd = m_ct + m_dm (nước)</p>
                    <p>• CM = n / V (mol/L hoặc M)</p>
                  </div>
                  <p className="text-[11px] text-slate-500 italic">
                    V tính bằng lít (L), m_dd tính bằng gam (g).
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <span className="font-bold text-xs text-amber-900 block">3. Tỉ khối khí & Hiệu suất</span>
                  <div className="font-mono text-xs font-bold text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                    <p>• d(A/B) = M(A) / M(B)</p>
                    <p>• d(A/kk) = M(A) / 29</p>
                    <p>• H% = (m_thực tế / m_lí thuyết) × 100%</p>
                  </div>
                  <p className="text-[11px] text-slate-500 italic">
                    M_kk = 29 g/mol là khối lượng mol trung bình không khí.
                  </p>
                </div>
              </div>

              {/* Interactive Calculator Tool */}
              <div className="p-5 bg-emerald-50/70 rounded-2xl border-2 border-emerald-300 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-emerald-950 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-emerald-600" />
                    <span>Máy Tính Nhanh Hóa Học THCS (Hỗ Trợ Ra Đề & Chấm Bài)</span>
                  </h4>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Tự động tính theo chuẩn GDPT 2018
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tool 1: Tính số mol & Thể tích khí */}
                  <div className="p-4 bg-white rounded-xl border border-emerald-200 space-y-3">
                    <span className="font-bold text-xs text-slate-900 block">
                      A. Tính số Mol (n) và Thể tích khí V (đkc 25°C, 1 bar)
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Khối lượng m (g):</label>
                        <input
                          type="number"
                          value={calcMass}
                          onChange={(e) => setCalcMass(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Khối lượng mol M (g/mol):</label>
                        <input
                          type="number"
                          value={calcMolarMass}
                          onChange={(e) => setCalcMolarMass(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                        />
                      </div>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs space-y-1">
                      <p>• Số mol n = <strong>{calculatedMol.toFixed(4).replace(/\.?0+$/, '')} mol</strong></p>
                      <p>• Thể tích khí V = <strong>{calculatedGasVolume.toFixed(4).replace(/\.?0+$/, '')} lít</strong> (ở 25°C, 1 bar)</p>
                    </div>
                  </div>

                  {/* Tool 2: Tính nồng độ phần trăm C% */}
                  <div className="p-4 bg-white rounded-xl border border-emerald-200 space-y-3">
                    <span className="font-bold text-xs text-slate-900 block">
                      B. Tính Nồng độ phần trăm (C%) của Dung dịch
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Khối lượng chất tan m_ct (g):</label>
                        <input
                          type="number"
                          value={calcSoluteMass}
                          onChange={(e) => setCalcSoluteMass(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Khối lượng dung dịch m_dd (g):</label>
                        <input
                          type="number"
                          value={calcSolutionMass}
                          onChange={(e) => setCalcSolutionMass(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                        />
                      </div>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs space-y-1">
                      <p>• Nồng độ phần trăm C% = <strong>{calculatedCPercent.toFixed(2)}%</strong></p>
                      <p>• Lượng dung môi (nước) m_dm = <strong>{(parseFloat(calcSolutionMass) - parseFloat(calcSoluteMass) || 0).toFixed(1)} g</strong></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Chemical Equations Accordion */}
              <div className="space-y-2">
                <span className="font-bold text-slate-900 text-xs block">
                  📌 CÁC PHƯƠNG TRÌNH HÓA HỌC TRỌNG TÂM CẤP THCS (GDPT 2018):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {COMMON_CHEMICAL_EQUATIONS.slice(0, 8).map(eq => (
                    <div key={eq.id} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-800 text-[11px]">{eq.topic}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600 font-mono">{eq.grade}</span>
                      </div>
                      <p className="font-mono text-xs font-black text-slate-900 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                        {eq.equation}
                      </p>
                      <p className="text-[11px] text-slate-600 italic">
                        Hiện tượng: {eq.phenomenon}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: AN TOÀN PHÒNG THÍ NGHIỆM & H₂SO₄ */}
          {/* ========================================================================= */}
          {activeTab === 'safety' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Cảnh báo đặc biệt về H₂SO₄ đặc */}
              <div className="p-5 bg-rose-50 border-2 border-rose-300 rounded-2xl space-y-3">
                <div className="flex items-center gap-2.5 text-rose-900 font-black text-sm uppercase">
                  <ShieldAlert className="w-5 h-5 text-rose-600 animate-pulse" />
                  <span>NGUYÊN TẮC BẤT DI BẤT DỊCH KHI PHA LOÃNG SULFURIC ACID (H₂SO₄) ĐẶC</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-white rounded-xl border-2 border-emerald-400 space-y-1">
                    <span className="font-black text-emerald-700 text-xs block">
                      ✓ ĐÚNG: Rót TỪ TỪ acid vào nước dọc theo đũa thủy tinh
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      Nước có nhiệt dung lớn sẽ hấp thụ lượng nhiệt tỏa ra từ acid một cách từ từ, không làm nước sôi cục bộ, đảm bảo an toàn tuyệt đối.
                    </p>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border-2 border-rose-400 space-y-1">
                    <span className="font-black text-rose-700 text-xs block">
                      ✕ SAI & NGUY HIỂM: Rót nước vào acid đặc
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      Lượng nước ít tiếp xúc acid đặc háo nước sẽ sôi bùng lên ngay tức khắc, bắn các giọt acid sôi tung tóe gây bỏng da và mù mắt!
                    </p>
                  </div>
                </div>
              </div>

              {/* 5 Quy tắc an toàn phòng lab */}
              <div className="space-y-2.5">
                <span className="font-bold text-slate-900 text-xs block">
                  CÁC NỘI QUY AN TOÀN BẮT BUỘC TRONG PHÒNG THÍ NGHIỆM HÓA HỌC THCS:
                </span>
                
                {LAB_SAFETY_RULES.map((rule, idx) => (
                  <div key={rule.id} className="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px] font-bold">
                          {idx + 1}
                        </span>
                        <span>{rule.title}</span>
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                        {rule.importance}
                      </span>
                    </div>
                    <p className="text-slate-700 text-xs leading-relaxed pl-7">
                      {rule.content}
                    </p>
                    <div className="pl-7 text-[11px] text-emerald-800 font-semibold bg-emerald-50/70 p-2 rounded-lg border border-emerald-100">
                      💡 Hướng dẫn xử lí / sơ cứu: {rule.action}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-600">
            <FlaskConical className="w-4 h-4 text-emerald-600" />
            <span>Dành riêng cho Giáo viên phân môn Hóa học THCS (Bộ sách Kết Nối Tri Thức GDPT 2018)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
            >
              Đóng tra cứu
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
